const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">SecureChat</h3>
            <p className="text-gray-400">End-to-end encrypted messaging</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-400">Privacy</a>
            <a href="#" className="hover:text-indigo-400">Terms</a>
            <a href="#" className="hover:text-indigo-400">Contact</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;