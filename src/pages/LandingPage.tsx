import React from 'react';
import HeadPhones from '../assets/images/headphones.png'
import MusicNotes from '../assets/images/music-notes_svgrepo.com.png'

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between items-center radial-gradient">
      <header className="w-full p-6 flex justify-between items-center">
        <div className="flex items-center">
          <img src={MusicNotes} alt="MusicBox logo" className="h-8" />
          <span className="text-white font-bold text-lg ml-2">MusicBox</span>
        </div>
        <nav className="space-x-4">
          <a href="#register" className="text-white">Regístrate</a>
          <a href="#login" className="bg-transparent border border-blue text-white px-8 py-2 rounded-md hover:bg-blue hover:text-white">Inicia sesión</a>
        </nav>
      </header>

      <main className="flex items-center text-center flex-grow justify-center px-6">
        <img src={HeadPhones} alt="Headphones" className="w-64 mb-8" />
        <div className='flex flex-col items-start'>
          
          <h1 className='text-white text-4xl font-bold text-start'>
            DISFRUTA DE TU <br />
            <span className='text-blue'>MÚSICA</span>
            <br />
            DISFRUTA TU <span className='text-blue'>VIDA</span>
          </h1>
          <button className="mt-8 bg-blue text-white px-8 py-3 rounded-full text-lg hover:bg-blue">
            INGRESA
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
