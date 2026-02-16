
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="size-6 bg-primary/20 rounded-full flex items-center justify-center">
              <div className="size-2 bg-primary rounded-full"></div>
            </div>
            <p className="text-sm font-bold text-gray-500">© 2024 Maithili Patel — PhD Research</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1 text-sm font-bold">
              <span className="material-symbols-outlined text-xl">mail</span>
              Email
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1 text-sm font-bold">
              <span className="material-symbols-outlined text-xl">link</span>
              LinkedIn
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1 text-sm font-bold">
              <span className="material-symbols-outlined text-xl">terminal</span>
              GitHub
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1 text-sm font-bold">
              <span className="material-symbols-outlined text-xl">school</span>
              Scholar
            </a>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>Georgia Tech</span>
            <span className="size-1 bg-gray-300 rounded-full"></span>
            <span>RIM Center</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4 opacity-5 pb-8">
        <span className="material-symbols-outlined text-4xl">precision_manufacturing</span>
      </div>
    </footer>
  );
};

export default Footer;
