import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  generateAESKey, 
  encryptWithRSA, 
  encryptWithAES, 
  decryptWithAES, 
  decryptWithRSA 
} from '../lib/crypto';
import Message from '../components/Chat/Message';
import HighSecurityToggle from '../components/Chat/HighSecurityToggle';
import EncryptionBadge from '../components/Chat/EncryptionBadge';
import io from 'socket.io-client';

const Chat = ({ recipient }) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [highSecurity, setHighSecurity] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!user || !recipient) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      auth: {
        token: user.token
      },
      query: {
        recipientId: recipient.id
      }
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      loadMessageHistory();
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current.on('newMessage', handleNewMessage);
    socketRef.current.on('messageStatus', updateMessageStatus);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user, recipient]);

  // Load message history from API
  const loadMessageHistory = async () => {
    try {
      const response = await fetch(`/api/messages/${recipient.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        const encryptedMessages = await response.json();
        const decryptedMessages = await Promise.all(
          encryptedMessages.map(async msg => ({
            ...msg,
            decryptedContent: await decryptMessage(msg)
          }))
        );
        setMessages(decryptedMessages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      addNotification({
        type: 'error',
        message: 'Failed to load message history'
      });
    }
  };

  // Handle incoming messages
  const handleNewMessage = async (encryptedMsg) => {
    try {
      const decryptedContent = await decryptMessage(encryptedMsg);
      setMessages(prev => [...prev, {
        ...encryptedMsg,
        decryptedContent,
        status: 'received'
      }]);
    } catch (error) {
      console.error('Failed to decrypt message:', error);
    }
  };

  // Update message status
  const updateMessageStatus = ({ messageId, status }) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status } : msg
    ));
  };

  // Decrypt message helper
  const decryptMessage = useCallback(async (encryptedMsg) => {
    if (!user?.privateKey) return '[Decryption error: missing key]';
    
    try {
      const aesKey = await decryptWithRSA(encryptedMsg.key, user.privateKey);
      return await decryptWithAES(encryptedMsg.content, aesKey, encryptedMsg.iv);
    } catch (error) {
      console.error('Decryption failed:', error);
      return '[Unable to decrypt message]';
    }
  }, [user?.privateKey]);

  // Send encrypted message
  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !recipient?.publicKey || isEncrypting) return;

    setIsEncrypting(true);
    try {
      const aesKey = generateAESKey();
      const { ciphertext: encryptedContent, iv } = await encryptWithAES(newMessage, aesKey);
      const encryptedKey = await encryptWithRSA(aesKey, recipient.publicKey);

      const messageData = {
        id: Date.now(),
        sender: user.id,
        recipient: recipient.id,
        content: encryptedContent,
        key: encryptedKey,
        iv,
        timestamp: new Date().toISOString(),
        status: 'sending',
        isEphemeral: highSecurity,
        securityLevel: highSecurity ? 'high' : 'standard'
      };

      // Optimistic UI update
      setMessages(prev => [...prev, {
        ...messageData,
        decryptedContent: newMessage
      }]);
      setNewMessage('');

      // Send via socket
      socketRef.current.emit('sendMessage', messageData);

      if (highSecurity) {
        addNotification({
          type: 'security',
          message: `High-security message sent to ${recipient.name}`,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Message sending failed:', error);
      addNotification({
        type: 'error',
        message: 'Failed to send message'
      });
    } finally {
      setIsEncrypting(false);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Security toggle handler
  const handleSecurityToggle = (enabled) => {
    setHighSecurity(enabled);
    addNotification({
      type: 'security',
      message: enabled ? 'High-security mode enabled' : 'High-security mode disabled',
      timestamp: new Date()
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>{recipient?.name}</h3>
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? 'Online' : 'Offline'}
          </span>
          <EncryptionBadge level={highSecurity ? 'high' : 'standard'} />
        </div>
      </div>

      <div className="messages-list">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            isUser={msg.sender === user.id}
            text={msg.decryptedContent}
            timestamp={msg.timestamp}
            status={msg.status}
            isEphemeral={msg.isEphemeral}
            securityLevel={msg.securityLevel}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <HighSecurityToggle 
          isActive={highSecurity} 
          onToggle={handleSecurityToggle} 
        />
        
        <div className="message-input-group">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            disabled={isEncrypting}
          />
          <button 
            onClick={sendMessage}
            disabled={!newMessage.trim() || isEncrypting}
            aria-busy={isEncrypting}
          >
            {isEncrypting ? 'Encrypting...' : 'Send'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #eaeaea;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8f9fa;
          border-bottom: 1px solid #eaeaea;
        }
        
        .connection-status {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .status-indicator {
          font-size: 0.875rem;
        }
        
        .status-indicator.connected {
          color: #28a745;
        }
        
        .status-indicator.disconnected {
          color: #dc3545;
        }
        
        .messages-list {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          background: #fff;
        }
        
        .chat-input-area {
          padding: 1rem;
          background: #f8f9fa;
          border-top: 1px solid #eaeaea;
        }
        
        .message-input-group {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
        }
        
        button {
          padding: 0.5rem 1rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
        
        button[aria-busy="true"] {
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default Chat;