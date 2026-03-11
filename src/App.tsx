/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  motion, 
  useScroll, 
  useTransform, 
  useInView, 
  useReducedMotion, 
  AnimatePresence, 
  LazyMotion, 
  domAnimation,
  useSpring,
  useMotionValue
} from "motion/react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { LucideIcon, Instagram, Twitter, Linkedin, Mail, ArrowRight, Menu, X, Github } from "lucide-react";

const CustomCursor = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  
  const ringX = useSpring(mouseX, { damping: 35, stiffness: 100 });
  const ringY = useSpring(mouseY, { damping: 35, stiffness: 100 });

  useEffect(() => {
    if (isTouchDevice) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000]">
      <motion.div
        className="w-2 h-2 bg-white rounded-full fixed top-0 left-0"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="w-8 h-8 border border-crimson rounded-full fixed top-0 left-0"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      />
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ["Works", "About", "Contact"];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-[100] border-b border-crimson/20 px-6 py-4 flex justify-between items-center transition-colors duration-300 ${isOpen ? 'bg-obsidian border-transparent' : 'backdrop-blur-sm bg-transparent'}`}
      >
        <div className="text-2xl font-serif font-bold tracking-tighter text-cream z-[110]">
          VM<span className="text-crimson">.</span>
        </div>
        
        <div className="hidden md:flex gap-8 font-mono text-xs uppercase tracking-widest text-cream/70 z-[110]">
          {navLinks.map((link) => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`}
              className="relative group hover:text-cream transition-colors"
            >
              {link}
              <motion.div 
                className="absolute -bottom-1 left-0 w-0 h-[1px] bg-crimson group-hover:w-full transition-all duration-300"
                layoutId="underline"
              />
            </a>
          ))}
        </div>

        <button className="md:hidden text-cream z-[110] relative" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed inset-0 bg-obsidian z-[90] flex flex-col justify-between p-12 pt-32 h-[100dvh] w-[100vw]"
          >
            <div className="flex flex-col gap-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-crimson mb-4">Navigation</p>
              {navLinks.map((link, i) => (
                <motion.a 
                  key={link} 
                  href={`#${link.toLowerCase()}`} 
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="font-serif text-5xl italic text-cream hover:text-crimson transition-colors"
                >
                  {link}
                </motion.a>
              ))}
            </div>

            <div className="flex flex-col gap-8">
              <div className="h-[1px] w-full bg-white/10" />
              <div className="flex flex-col gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-cream/30">Connect</p>
                <div className="flex gap-6">
                  <a href="https://github.com/vaibhavcoreai" target="_blank" className="text-cream/60 hover:text-crimson transition-colors"><Github size={20} /></a>
                  <a href="https://www.linkedin.com/in/vaibhav-manaji-40a9ab290/" target="_blank" className="text-cream/60 hover:text-crimson transition-colors"><Linkedin size={20} /></a>
                  <a href="mailto:vaibhavcoreai@gmail.com" className="text-cream/60 hover:text-crimson transition-colors"><Mail size={20} /></a>
                </div>
              </div>
              <p className="font-mono text-[10px] text-cream/20">EST. 2026 / VAIBHAV MANAJI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Image Sequence Configuration
const FRAME_COUNT = 60; // Adjust based on your uploaded frames
const getFramePath = (index: number) => `/frames/frame_${index.toString().padStart(4, "0")}.webp`;

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Preload Images
  useEffect(() => {
    const preloadImages = () => {
      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        img.onload = () => {
          setImagesLoaded(prev => prev + 1);
        };
        images.current[i] = img;
      }
    };
    preloadImages();
  }, []);

  // Canvas Rendering Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame: number;

    const render = () => {
      const progress = scrollYProgress.get();
      const frameIndex = Math.max(1, Math.min(FRAME_COUNT, Math.floor(progress * FRAME_COUNT)));
      const img = images.current[frameIndex];

      if (img && img.complete) {
        // Handle aspect ratio scaling
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgWidth = img.width;
        const imgHeight = img.height;
        
        const isMobile = canvasWidth < 768;
        const coverRatio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
        const containRatio = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
        
        // Use cover for desktop. For mobile, zoom out by blending contain and cover 
        // to prevent extreme cropping on the sides while keeping vertical height occupied.
        const ratio = isMobile 
          ? containRatio + (coverRatio - containRatio) * 0.45 
          : coverRatio;

        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;
        const x = (canvasWidth - newWidth) / 2;
        const y = (canvasHeight - newHeight) / 2;

        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.drawImage(img, x, y, newWidth, newHeight);
      }
      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [scrollYProgress]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll animations for the 5 lines
  const op1 = useTransform(scrollYProgress, [0, 0.15, 0.22], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.15, 0.22], [0, 0, -30]);

  const op2 = useTransform(scrollYProgress, [0.18, 0.25, 0.35, 0.42], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.18, 0.25, 0.35, 0.42], [30, 0, 0, -30]);

  const op3 = useTransform(scrollYProgress, [0.38, 0.45, 0.55, 0.62], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.38, 0.45, 0.55, 0.62], [30, 0, 0, -30]);

  const op4 = useTransform(scrollYProgress, [0.58, 0.65, 0.75, 0.82], [0, 1, 1, 0]);
  const y4 = useTransform(scrollYProgress, [0.58, 0.65, 0.75, 0.82], [30, 0, 0, -30]);

  const op5 = useTransform(scrollYProgress, [0.78, 0.85, 0.95, 1], [0, 1, 1, 0]);
  const y5 = useTransform(scrollYProgress, [0.78, 0.85, 0.95, 1], [30, 0, 0, -30]);

  return (
    <section ref={containerRef} className="relative h-[400vh] w-full bg-obsidian">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
        />
        
        {/* Loading Overlay */}
        {imagesLoaded < FRAME_COUNT && (
          <div className="absolute inset-0 flex items-center justify-center bg-obsidian z-50">
            <div className="text-white/50 font-mono text-xs uppercase tracking-widest">
              Loading Experience {Math.round((imagesLoaded / FRAME_COUNT) * 100)}%
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Mobile Top Info */}
        <motion.div 
          style={{ opacity: op1 }}
          className="absolute top-28 left-0 w-full flex justify-center md:hidden pointer-events-none z-10"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-cream/40">
            EST. 2026 &nbsp;&middot;&nbsp; v2.0
          </p>
        </motion.div>
        
        {/* Sequence 1 */}
        <motion.div 
          style={{ opacity: op1, y: y1 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
          <motion.h1 
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="font-serif text-xl md:text-3xl tracking-[0.3em] text-cream uppercase mb-2 md:mb-4"
          >
            Hi, I'm
          </motion.h1>
          <motion.h1 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.15 }}
            className="font-serif text-[15vw] md:text-[10vw] font-black italic text-transparent bg-clip-text bg-gradient-to-r from-crimson to-crimson/60 leading-none"
          >
            Vaibhav.
          </motion.h1>
        </motion.div>

        {/* Sequence 2 */}
        <motion.div 
          style={{ opacity: op2, y: y2 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
          <h2 className="font-serif text-3xl md:text-5xl italic text-cream font-light max-w-4xl leading-tight">
            Not arrived. Just moving.
          </h2>
        </motion.div>

        {/* Sequence 3 */}
        <motion.div 
          style={{ opacity: op3, y: y3 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
          <h2 className="font-serif text-3xl md:text-5xl italic text-cream font-light max-w-4xl leading-tight">
            Growing in silence.
          </h2>
        </motion.div>

        {/* Sequence 4 */}
        <motion.div 
          style={{ opacity: op4, y: y4 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
          <h2 className="font-serif text-3xl md:text-5xl italic text-cream font-light max-w-4xl leading-tight">
            Building a life, not just a career.
          </h2>
        </motion.div>

        {/* Sequence 5 */}
        <motion.div 
          style={{ opacity: op5, y: y5 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
          <h2 className="font-serif text-3xl md:text-5xl italic text-cream font-light max-w-4xl leading-tight">
            I'm not there yet — and that's the point.
          </h2>
        </motion.div>

        <div className="absolute bottom-12 left-12 hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-l-2 border-crimson pl-4"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-cream/60">Role</p>
            <p className="font-mono text-sm text-cream">Data Science & AI Student</p>
          </motion.div>
        </div>

        <div className="absolute bottom-12 right-12">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] rotate-90 origin-right whitespace-nowrap text-cream/40">
              Scroll to explore
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

interface ProjectItemProps {
  title: string;
  statusIcon: string;
  statusText: string;
  description: string;
  index: number;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ title, statusIcon, statusText, description, index }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className="group relative py-8 border-b border-white/10 last:border-none flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex-1">
        <h3 className="font-serif text-2xl md:text-4xl italic text-cream group-hover:text-crimson transition-colors duration-300">
          [ {title} ]
        </h3>
        <p className="font-mono text-sm text-cream/40 mt-2">"{description}"</p>
      </div>
      <div className="font-mono text-xs uppercase tracking-widest text-cream/60 flex items-center gap-2">
        <span>Status:</span>
        <span className="text-sm">{statusIcon}</span>
        <span>{statusText}</span>
      </div>
    </motion.div>
  );
};

const Works = () => {
  const projects = [
    { 
      title: "Student Life OS", 
      statusIcon: "🟡", 
      statusText: "In Progress", 
      description: "SaaS academic app for schools & colleges" 
    },
    { 
      title: "Writer Platform", 
      statusIcon: "🟡", 
      statusText: "Building", 
      description: "Story writing & reading platform with smooth UI" 
    },
    { 
      title: "Data Analysis", 
      statusIcon: "🟢", 
      statusText: "Ongoing", 
      description: "Real datasets, clean insights" 
    }
  ];

  return (
    <section id="works" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.5em] text-crimson mb-4">01 / Selected Works</p>
          <h2 className="font-serif text-5xl md:text-7xl font-light text-cream">The Archive</h2>
        </div>
        <p className="font-mono text-xs text-cream/40 max-w-xs text-right">
          Building real-world apps and systems to learn by doing.
        </p>
      </div>

      <div className="flex flex-col">
        {projects.map((project, i) => (
          <ProjectItem key={project.title} {...project} index={i} />
        ))}
      </div>
    </section>
  );
};

const About = () => {
  const quote = "I don’t want to just know things. I want to understand, build, and apply them.";
  const words = quote.split(" ");

  return (
    <section id="about" className="relative py-32 px-6 overflow-hidden">
      {/* Animated Background Blob */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-crimson/10 blur-[120px] rounded-full -z-10"
      />

      <div className="max-w-4xl mx-auto text-center">
        <p className="font-mono text-xs uppercase tracking-[0.5em] text-crimson mb-12">02 / Philosophy</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-5xl italic text-cream"
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const text = "LET'S WORK.";
  
  return (
    <section id="contact" className="py-32 px-6 max-w-7xl mx-auto text-center">
      <p className="font-mono text-xs uppercase tracking-[0.5em] text-crimson mb-12">03 / Contact</p>
      
      <div className="mb-24">
        <div className="flex flex-col items-center">
          <div className="overflow-hidden">
            <motion.h2 
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[15vw] md:text-[12vw] leading-none text-cream"
            >
              LET'S
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2 
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="font-serif text-[15vw] md:text-[12vw] leading-none text-crimson italic"
            >
              WORK.
            </motion.h2>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-12">
        <motion.a
          href="mailto:vaibhavcoreai@gmail.com"
          whileHover={{ scale: 1.05 }}
          className="group relative font-serif text-2xl md:text-4xl text-cream flex items-center gap-4"
        >
          vaibhavcoreai@gmail.com
          <ArrowRight className="text-crimson group-hover:translate-x-2 transition-transform" />
          <motion.div className="absolute -bottom-2 left-0 w-full h-[1px] bg-white/20" />
        </motion.a>

        <div className="flex gap-8">
          <motion.a
            href="https://www.linkedin.com/in/vaibhav-manaji-40a9ab290/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, color: "#FF1A1A" }}
            className="text-cream/60 transition-colors"
          >
            <Linkedin size={24} />
          </motion.a>
          <motion.a
            href="https://github.com/vaibhavcoreai"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, color: "#FF1A1A" }}
            className="text-cream/60 transition-colors"
          >
            <Github size={24} />
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const reducedMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <div className="noise-overlay min-h-screen bg-obsidian selection:bg-crimson selection:text-white">
        <CustomCursor />
        <Navbar />
        
        <main>
          <Hero />
          <Works />
          <About />
          <Contact />
        </main>

        <footer className="py-12 px-6 border-t border-white/5 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/20">
            © 2026 Vaibhav Manaji. All rights reserved.
          </p>
        </footer>

        {/* Scroll Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-crimson origin-left z-[60]"
          style={{ scaleX: useScroll().scrollYProgress }}
        />
      </div>
    </LazyMotion>
  );
}
