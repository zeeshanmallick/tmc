import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white p-4 border-t border-gray-700">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; {new Date().getFullYear()} The Master Collective. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-sm text-gray-400 hover:text-white">Terms</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">Privacy</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
