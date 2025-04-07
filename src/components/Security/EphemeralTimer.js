import { useEffect, useState } from 'react';
import { FaHourglassHalf } from 'react-icons/fa';

const EphemeralTimer = ({ expiryTime }) => {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const mins = Math.floor((expiryTime - Date.now()) / 60000);
      setRemaining(`${mins}m`);
    }, 60000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  return (
    <div className="ephemeral-timer">
      <FaHourglassHalf /> {remaining}
    </div>
  );
};