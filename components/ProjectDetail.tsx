
import React from 'react';
import { Project } from '../types';

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  return (
    <div className="bg-background-light min-h-screen">
      {/* Back button */}
      <div className="max-w-5xl mx-auto px-6 pt-12">
        <nav className="flex text-sm text-gray-500 mb-4 font-medium">
          <a href="#" className="hover:text-primary">Projects</a>
          <span className="mx-2">/</span>
          <span className="text-primary font-semibold">{project.title}</span>
        </nav>
      </div>

      {/* Project Hero */}
      <section className="px-6 md:px-20 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-primary">{project.title}</h1>
            <p className="text-gray-500 font-medium uppercase tracking-widest text-sm">Robotics PhD Research • 2023 - Present</p>
          </div>
          <div className="relative group overflow-hidden rounded-3xl shadow-2xl aspect-[21/9] border-b-4 border-primary">
            <img 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src={project.image}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
              <p className="text-white/90 text-sm italic">Fig 1.1: Prototype during dynamic trials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Motivation Section */}
      {project.motivation && (
        <section className="px-6 md:px-20 py-12 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-sage">lightbulb</span>
                <span className="text-sm font-bold text-sage uppercase tracking-widest">Motivation</span>
              </div>
              <h2 className="text-4xl font-serif font-bold text-primary leading-tight mb-6">
                Bridging the Gap
              </h2>
              <div className="w-16 h-1 bg-sage mb-8"></div>
              {project.motivationQuote && (
                <blockquote className="text-xl italic text-gray-700 font-serif leading-relaxed mb-8 border-l-4 border-accent-peach pl-6">
                  "{project.motivationQuote}"
                </blockquote>
              )}
            </div>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>{project.motivation}</p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-6 bg-cream rounded-2xl border border-gray-200 shadow-sm">
                  <h4 className="text-primary font-bold text-lg mb-1">Old Paradigm</h4>
                  <p className="text-sm text-gray-500">Rigid Kinematics, Pre-defined paths</p>
                </div>
                <div className="p-6 bg-cream rounded-2xl border border-gray-200 shadow-sm">
                  <h4 className="text-sage font-bold text-lg mb-1">New Paradigm</h4>
                  <p className="text-sm text-gray-500">Continuum Models, Adaptive Compliance</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Overview & Stats */}
      <section className="px-6 md:px-20 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-sage">description</span>
                Project Overview
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-gray-600">
                {project.fullOverview ? (
                  <p>{project.fullOverview}</p>
                ) : (
                  <p>Comprehensive research into {project.title.toLowerCase()} focusing on integrated hardware and software solutions for the next generation of robotic systems.</p>
                )}
              </div>
            </div>

            {/* Performance Benchmarks */}
            {project.benchmarks && (
              <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined text-sage">analytics</span>
                    Performance Benchmarks
                  </h3>
                  <span className="text-xs font-bold text-sage bg-sage/10 px-2 py-1 rounded uppercase border border-sage/20">Validation Set N=500</span>
                </div>
                <div className="space-y-6">
                  {project.benchmarks.map((benchmark, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm font-bold mb-2">
                        <span className={benchmark.improvement ? "text-primary" : "text-gray-500"}>{benchmark.label}</span>
                        <span className={benchmark.improvement ? "text-sage" : "text-gray-400"}>{benchmark.value}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`${benchmark.improvement ? "bg-sage" : "bg-gray-300"} h-3 rounded-full relative transition-all duration-1000`} 
                          style={{ width: `${benchmark.value * 100}%` }}
                        >
                          {benchmark.improvement && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30"></div>}
                        </div>
                      </div>
                      {benchmark.improvement && (
                        <p className="text-right text-xs text-sage font-bold mt-1">{benchmark.improvement}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Contributions */}
            {project.contributions && (
              <div className="bg-cream rounded-2xl p-8 border border-primary/5 shadow-sm mt-8">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-sage">military_tech</span>
                  Key Contributions
                </h2>
                <ul className="space-y-6">
                  {project.contributions.map((contribution, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-sm">{contribution.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-primary">{contribution.title}</h3>
                        <p className="text-gray-500">{contribution.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-square relative border-2 border-primary/10">
              <img 
                className="w-full h-full object-cover grayscale" 
                alt="Detail" 
                src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=400"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-primary shadow-sm">Process Detail</div>
            </div>

            {/* Citations */}
            {project.citations && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-sage">format_quote</span>
                  BibTeX Citations
                </h2>
                {project.citations.map((cite, i) => (
                  <div key={i}>
                    <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">{cite.label}</p>
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 font-mono text-xs text-primary overflow-x-auto custom-scrollbar">
                      <pre>{cite.bibtex}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
