import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-black text-white p-4 border-b border-gray-700">
      <div className="container mx-auto">
        <h1 className="text-xl font-bold">The Master Collective</h1>
        {/* Navigation links can be added here later */}
      </div>
    </header>
  );
};

export default Header;
