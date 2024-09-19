// Sidebar.jsx
import React from 'react';

const Sidebar = () => {
  return (
    <div className="flex flex-col h-screen w-64 bg-gray-800 text-white">
      <div className="flex items-center justify-center h-16">
        <h1 className="text-lg font-bold">Mi Sidebar</h1>
      </div>
      <nav className="h-full flex flex-col items-center justify-between w-full">
        <ul className="space-y-2 p-4 w-full">
          <li className='border-b border-t border-gray-700'>
            <a href="#" className="text-center block p-2 rounded hover:bg-gray-700">
              Inicio
            </a>
          </li>
          <li className='border-b border-t border-gray-700'>
            <a href="#" className="text-center block p-2 rounded hover:bg-gray-700">
              Perfil
            </a>
          </li>
        </ul>

        <ul className="space-y-2 p-4 w-full">
          <li className='border-b border-t border-red-500  text-red-500'>
            <a href="#" className="mx-2 w-full text-center block p-2 rounded hover:bg-gray-700 text-red-500">
              Cerrar sesión
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
