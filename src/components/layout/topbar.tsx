import { PersonIcon, PlusIcon } from '@radix-ui/react-icons';
import React from 'react';
import { BiUser } from 'react-icons/bi';
// import { User, Plus } from '@radix-ui/react-icons';

const TopBar = () => {
  return (
    <div className="flex items-center justify-between h-16 bg-gray-800 text-white px-4">
      <div className="flex items-center space-x-2">
        <PersonIcon className="w-6 h-6" />
        <span>Bienvenido User</span>
      </div>
      <div>
        <button className="p-2 rounded hover:bg-gray-700">
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
