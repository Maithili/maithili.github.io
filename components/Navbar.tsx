import React from 'react';
import cvPdf from '../assets/CV.pdf';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FFF9F5]/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group cursor-pointer">
          <div className="size-8 rounded-lg flex items-center justify-center text-white bg-[#2D4A6B]">
            <span className="material-symbols-outlined text-xl">precision_manufacturing</span>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-[#1A1A1A]">Maithili Patel</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a href="#top" className="text-sm font-bold text-[#1A1A1A] hover:text-[#2D4A6B] transition-colors">Home</a>
          {/* TODO: Unarchive Projects - <a href="#projects">Projects</a> */}
          <a href="#updates" className="text-sm font-bold text-gray-400 hover:text-[#2D4A6B] transition-colors">Updates</a>
          <a href="#publications" className="text-sm font-bold text-gray-400 hover:text-[#2D4A6B] transition-colors">Publications</a>
          <a href="#hobbies" className="text-sm font-bold text-gray-400 hover:text-[#2D4A6B] transition-colors">Hobbies</a>
          <div className="h-6 w-px bg-gray-200"></div>
          <a href={cvPdf} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#2D4A6B] hover:opacity-80 transition-opacity">CV / Resume</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
