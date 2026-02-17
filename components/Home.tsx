
import React, { useState } from 'react';
import { PUBLICATIONS, UPDATES } from '../constants';
import headshot from '../assets/headshot.jpg';
import funDance from '../assets/fun_dance.jpg';
import climbing from '../assets/climbing.jpg';
import funTravel from '../assets/fun_travel_icon.jpg';
import reading from '../assets/reading.png';

const INITIAL_UPDATES_SHOWN = 5;
const INITIAL_PUBS_SHOWN = 5;

const Home: React.FC = () => {
  const [updatesExpanded, setUpdatesExpanded] = useState(false);
  const [pubsExpanded, setPubsExpanded] = useState(false);
  return (
    <div className="min-h-screen">
      {/* Hero Section - Organic Background */}
      <section className="organic-bg py-16 md:py-32" id="top">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 order-2 md:order-1">
              <div className="space-y-6">
                <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter font-serif text-[#1A1A1A]">
                  Maithili <span className="text-[#2D4A6B] italic font-normal">Patel</span>
                </h1>
                <p className="text-xl md:text-2xl font-medium text-gray-600">
                  Robotics PhD Student | <span className="text-[#1A1A1A] font-bold">Georgia Tech</span>
                </p>
                <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
                  Developing proactive robots for human  environments. Bridging robot learning and human-centered autonomy.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a href="https://scholar.google.com/citations?user=dvqkwFYAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFF2EB] border border-[#FFE4D6] text-sm font-bold text-[#1A1A1A] hover:bg-white hover:border-[#2D4A6B]/20 transition-all shadow-sm w-fit" aria-label="Google Scholar">
                    <span className="size-8 flex items-center justify-center shrink-0">
                      <svg className="size-5 fill-current" viewBox="0 0 24 24"><path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z"/></svg>
                    </span>
                    <span>Google Scholar</span>
                  </a>
                  <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#FFF2EB] border border-[#FFE4D6] shadow-sm">
                    <span className="text-sm font-black text-[#1A1A1A] shrink-0">Let&apos;s Connect</span>
                    <div className="flex items-center gap-2">
                      <a href="https://www.linkedin.com/in/maithili" target="_blank" rel="noopener noreferrer" className="size-9 flex items-center justify-center rounded-lg bg-white/50 text-[#1A1A1A] hover:bg-white hover:text-[#2D4A6B] transition-all" aria-label="LinkedIn">
                        <svg className="size-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      </a>
                      <a href="mailto:maithili@gatech.edu" className="size-9 flex items-center justify-center rounded-lg bg-white/50 text-[#1A1A1A] hover:bg-white hover:text-[#2D4A6B] transition-all" aria-label="Email">
                        <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      </a>
                      <a href="https://x.com/MaithiliPatel31" target="_blank" rel="noopener noreferrer" className="size-9 flex items-center justify-center rounded-lg bg-white/50 text-[#1A1A1A] hover:bg-white hover:text-[#2D4A6B] transition-all" aria-label="X (Twitter)">
                        <svg className="size-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </a>
                      <a href="https://instagram.com/_maithili31" target="_blank" rel="noopener noreferrer" className="size-9 flex items-center justify-center rounded-lg bg-white/50 text-[#1A1A1A] hover:bg-white hover:text-[#2D4A6B] transition-all" aria-label="Instagram">
                        <svg className="size-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="relative">
                <div className="w-72 h-72 md:w-[450px] md:h-[450px] bg-white rounded-[40px] p-4 shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-500">
                  <div className="w-full h-full rounded-[30px] overflow-hidden">
                    <img 
                      className="w-full h-full object-cover" 
                      alt="Maithili Patel"
                      src={headshot}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section - WHITE Background */}
      <section className="bg-white py-32 border-y border-gray-100" id="about">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-8">
              <h2 className="text-3xl font-black flex items-center gap-4 font-serif text-[#1A1A1A]">
                <span className="size-3 bg-[#5BA4A4] rounded-full"></span> Bio
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-gray-600 font-medium">
                <p> I am a final year Robotics Ph.D. student advised by Professor Sonia Chernova, at GeorgiaTech. My research focuses on developing service robots that seamlessly integrate into users' daily lives, functioning as <span className="text-[#1A1A1A] font-bold">effective and proactive assistants</span> over extended interactions. This involves anticipating assistive opportunities, and generalizing user preferences regarding mode of robot assistance and manner of task execution. I leverage unobtrusive observations of user behavior and limited interaction with the user to address proactivity and personalization. Ultimately, my goal is to build a robot system that can autonomously predict when and how to perform various helpful assistive actions, alleviating not only the users’ physical effort of performing tasks, but also their cognitive burden of managing tasks and ensuring that things get done.</p>
                <p>I was selected to participate in RCAIS Doctoral Consortium, in 2024, HRI Pioneers workshop in 2023 and RPL Summer School, at KTH, Sweden in 2022. I also helped organize CoRL, 2023 and co-organized a workshop at HRI 2023. Through my PhD, I worked with Akshara Rai at Meta in 2024, and with Chandra Bhagavatula at Allen Institute of AI (AI2) in 2023. Prior to starting my PhD, I worked with Toyota Research Institute and Zenuity on mapping and localization for autonomous vehicles, and obtained my master’s degree at the University of Michigan in Ann Arbor, with Prof. Chad Jenkins.</p>
              </div>
          </div>
        </div>
      </section>

      {/* TODO: Unarchive Projects section - Projects tab archived for now */}
      {/* Projects - Organic Background
      <section className="organic-bg py-32" id="projects">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tight font-serif text-[#1A1A1A]">Projects</h2>
              <p className="text-gray-500 max-w-md text-lg">Highlighting main research projects.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {PROJECTS.map((project) => (
              <div key={project.id} className="group bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={project.title}
                    src={project.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D4A6B]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                    <a href={`#project/${project.id}`} className="bg-white text-[#1A1A1A] px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                      <span className="material-symbols-outlined text-lg">visibility</span>
                      View Project
                    </a>
                  </div>
                </div>
                <div className="p-8 space-y-5 flex-grow flex flex-col">
                  <div className="flex flex-wrap gap-2">
                    {project.category.map(cat => (
                      <span key={cat} className="px-3 py-1 rounded-full bg-[#2D4A6B]/5 text-[10px] font-black text-[#2D4A6B] uppercase tracking-widest">{cat}</span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-black group-hover:text-[#2D4A6B] transition-colors font-serif text-[#1A1A1A] leading-tight">{project.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{project.description}</p>
                  <div className="pt-4 mt-auto">
                    <a 
                      href={`#project/${project.id}`} 
                      className="text-sm font-black flex items-center gap-2 group/btn text-[#1A1A1A] hover:text-[#2D4A6B] transition-colors"
                    >
                      Read Case Study
                      <span className="material-symbols-outlined text-xl group-hover/btn:translate-x-2 transition-transform duration-300">east</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Latest Updates - WHITE Background */}
      <section className="bg-white border-y border-gray-100 py-32" id="updates">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-8 mb-16">
            <h2 className="text-4xl font-black font-serif text-[#1A1A1A]">Latest Updates</h2>
            <div className="h-0.5 flex-1 bg-gray-50"></div>
          </div>
          <div className="space-y-3">
            {(updatesExpanded ? UPDATES : UPDATES.slice(0, INITIAL_UPDATES_SHOWN)).map((update, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl hover:bg-[#FFF9F5] transition-all border border-transparent hover:border-[#FFE4D6]/30 group">
                <div className="shrink-0 w-28">
                  <span className="text-xs font-black text-[#2D4A6B] uppercase tracking-widest px-3 py-1.5 bg-[#2D4A6B]/5 rounded-full block text-center">{update.date}</span>
                </div>
                <div>
                  {update.title ? <h3 className="font-black text-lg text-[#1A1A1A] group-hover:text-[#2D4A6B] transition-colors">{update.title}</h3> : null}
                  <p className="text-gray-500 text-base leading-relaxed [&_a]:text-[#2D4A6B] [&_a]:underline [&_a]:hover:opacity-80" dangerouslySetInnerHTML={{ __html: update.description }} />
                </div>
              </div>
            ))}
          </div>
          {UPDATES.length > INITIAL_UPDATES_SHOWN && (
            <button
              onClick={() => setUpdatesExpanded(!updatesExpanded)}
              className="mt-6 text-sm font-bold text-[#2D4A6B] hover:opacity-80 transition-opacity flex items-center gap-2"
            >
              {updatesExpanded ? 'Show less' : `Show more (${UPDATES.length - INITIAL_UPDATES_SHOWN} more)`}
              <span className="material-symbols-outlined text-lg transition-transform duration-200" style={{ transform: updatesExpanded ? 'rotate(180deg)' : undefined }}>expand_more</span>
            </button>
          )}
        </div>
      </section>

      {/* Selected Publications - Organic Background */}
      <section className="organic-bg py-32 relative" id="publications">
        <div className="max-w-4xl mx-auto px-6">
          <div className="absolute -right-32 top-10 hidden xl:block opacity-[0.03] rotate-12 pointer-events-none">
            <span className="material-symbols-outlined text-[20rem] font-thin text-[#2D4A6B]">menu_book</span>
          </div>
          <div className="flex items-end justify-between mb-20 border-b-2 border-[#1A1A1A] pb-6">
            <h2 className="text-4xl font-black font-serif italic text-[#1A1A1A]">Publications</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-black mb-1">Archive</span>
          </div>
          <div className="space-y-12 font-serif">
            {(pubsExpanded ? PUBLICATIONS : PUBLICATIONS.slice(0, INITIAL_PUBS_SHOWN)).map((pub) => (
              <div key={pub.id} className="group relative pl-10 border-l-2 border-gray-100 hover:border-[#2D4A6B] transition-all duration-500">
                <div className="absolute -left-[7px] top-2 size-3 rounded-full bg-white border-2 border-gray-200 group-hover:border-[#2D4A6B] group-hover:scale-125 transition-all"></div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] leading-tight mb-4 group-hover:text-[#2D4A6B] transition-colors">
                  {pub.title}
                </h3>
                <p className="text-sm text-gray-500 font-sans font-medium mb-4 flex flex-wrap gap-x-2">
                  {pub.authors.split(', ').map((author, i) => (
                    <React.Fragment key={i}>
                      {(author === 'M. Patel' || author === 'Maithili Patel' || author.startsWith('Maithili Patel')) ? (
                        <span className="text-[#1A1A1A] font-black underline decoration-[#5BA4A4]/30 decoration-4">{author}</span>
                      ) : author}
                      {i < pub.authors.split(', ').length - 1 ? <span className="text-gray-300">•</span> : ''}
                    </React.Fragment>
                  ))}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#2D4A6B] font-sans">
                  <span className="px-3 py-1 bg-[#2D4A6B]/5 rounded-lg border border-[#2D4A6B]/10">{pub.venue}</span>
                  <span className="text-gray-300">—</span>
                  <span className="text-gray-400">{pub.year}</span>
                  {pub.pdf && (
                    <>
                      <span className="text-gray-300">—</span>
                      <a href={pub.pdf} target="_blank" rel="noopener noreferrer" className="text-[#2D4A6B] hover:opacity-80">PDF</a>
                    </>
                  )}
                  {pub.vid && (
                    <>
                      <span className="text-gray-300">—</span>
                      <a href={pub.vid} target="_blank" rel="noopener noreferrer" className="text-[#2D4A6B] hover:opacity-80">Video</a>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {PUBLICATIONS.length > INITIAL_PUBS_SHOWN && (
            <button
              onClick={() => setPubsExpanded(!pubsExpanded)}
              className="mt-8 text-sm font-bold text-[#2D4A6B] hover:opacity-80 transition-opacity flex items-center gap-2"
            >
              {pubsExpanded ? 'Show less' : `Show more (${PUBLICATIONS.length - INITIAL_PUBS_SHOWN} more)`}
              <span className="material-symbols-outlined text-lg transition-transform duration-200" style={{ transform: pubsExpanded ? 'rotate(180deg)' : undefined }}>expand_more</span>
            </button>
          )}
        </div>
      </section>

      {/* Hobbies Section - WHITE Background */}
      <section className="bg-white py-32 border-t border-gray-100" id="hobbies">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tight font-serif text-[#1A1A1A]">Hobbies</h2>
              <p className="text-gray-500 max-w-md text-lg">There's more to life beyond robotics...</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
              <img src={climbing} alt="Rock Climbing" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end group-hover:overflow-y-auto group-hover:from-black/90 transition-colors duration-300">
                <div className="group-hover:bg-black/40 group-hover:rounded-lg group-hover:px-3 group-hover:py-2  transition-colors duration-300">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:[text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">Rock Climbing</h3>
                  <p className="text-white/70 text-xs line-clamp-3 group-hover:line-clamp-none group-hover:[text-shadow:0_1px_2px_rgba(0,0,0,0.7)]">What started as a social hobby has become something I truly love. I went from casually bouldering on plastic jugs to climbing outdoors and enjoying indoor sport routes. Problem-solving meets physical skill meets proprioception...almost like dancing on a wall.</p>
                </div>
              </div>
            </div>
            
            <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
              <img src={funDance} alt="Dance" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end group-hover:overflow-y-auto group-hover:from-black/90 transition-colors duration-300">
                <div className="group-hover:bg-black/40 group-hover:rounded-lg group-hover:px-3 group-hover:py-2  transition-colors duration-300">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:[text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">Dance</h3>
                  <p className="text-white/70 text-xs line-clamp-3 group-hover:line-clamp-none group-hover:[text-shadow:0_1px_2px_rgba(0,0,0,0.7)]">I&apos;ve been dancing Brazilian Zouk since 2019, and honestly, nothing else makes me grin quite like moving in perfect sync with someone to a sweet little tune. It&apos;s my happy place...my meditation on the dance floor!</p>
                </div>
              </div>
            </div>
            
            <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
              <img src={funTravel} alt="Travel" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end group-hover:overflow-y-auto group-hover:from-black/90 transition-colors duration-300">
                <div className="group-hover:bg-black/40 group-hover:rounded-lg group-hover:px-3 group-hover:py-2  transition-colors duration-300">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:[text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">Travel</h3>
                  <p className="text-white/70 text-xs line-clamp-3 group-hover:line-clamp-none group-hover:[text-shadow:0_1px_2px_rgba(0,0,0,0.7)]">Who doesn&apos;t love exploring a place quite different than any they&apos;ve known, and meet people very unlike them. What excites me is the thrill of being on a unique adventure as the place, the company, the strangers and sheer coincidences all come together to build wonderful memories of a lifetime.</p>
                </div>
              </div>
            </div>
            
            <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
              <img src={reading} alt="Reading" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end group-hover:overflow-y-auto group-hover:from-black/90 transition-colors duration-300">
                <div className="group-hover:bg-black/40 group-hover:rounded-lg group-hover:px-3 group-hover:py-2  transition-colors duration-300">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:[text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">Reading</h3>
                  <p className="text-white/70 text-xs line-clamp-3 group-hover:line-clamp-none group-hover:[text-shadow:0_1px_2px_rgba(0,0,0,0.7)] [&_a]:text-white [&_a]:underline [&_a]:hover:opacity-90">I grew up a voracious reader and still find comfort in turning pages before sleep. As a child, I read to escape into other worlds; more recently, I’ve explored beyond that and found some truly remarkable works. I log my reading <a href="https://www.goodreads.com/user/show/97468799-maithili" target="_blank" rel="noopener noreferrer">here</a>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
