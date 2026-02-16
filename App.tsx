
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProjectDetail from './components/ProjectDetail';
import Footer from './components/Footer';
import { PROJECTS } from './constants';

const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentHash(hash);
      // Only scroll to top when switching to project detail view; section anchors (#projects, #publications, etc.) use native scroll
      if (hash.startsWith('#project/')) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    if (currentHash.startsWith('#project/')) {
      const projectId = currentHash.replace('#project/', '');
      const project = PROJECTS.find(p => p.id === projectId);
      if (project) {
        return <ProjectDetail project={project} />;
      }
    }
    return <Home />;
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/20">
      <Navbar />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
