"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

export default function HeroMask() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const mouseXSpring = useSpring(cursorX, springConfig);
  const mouseYSpring = useSpring(cursorY, springConfig);

  const containerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Initial position for desktop
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      cursorX.set(rect.width / 2);
      cursorY.set(rect.height / 2);
    }

    const moveCursor = (e) => {
      if (!containerRef.current || isMobile) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (e.clientX !== undefined && e.clientY !== undefined) {
        cursorX.set(e.clientX - rect.left);
        cursorY.set(e.clientY - rect.top);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [cursorX, cursorY, isMobile]);

  const maskImageTemplate = useMotionTemplate`circle(${isHovered ? 400 : 80}px at ${mouseXSpring}px ${mouseYSpring}px)`;

  return (
    <div
      ref={containerRef}
      className="min-h-[75vh] md:h-screen w-full flex items-center justify-center bg-transparent relative overflow-hidden hide-native-cursor"
    >
      {/* HUD CORNERS */}
      <div className="absolute top-6 left-4 sm:top-12 sm:left-8 md:top-24 md:left-24 z-30 w-12 h-12 sm:w-20 sm:h-20 md:w-32 md:h-32 border-t-4 border-l-4 md:border-t-8 md:border-l-8 border-[#ff0000] mix-blend-difference pointer-events-none"></div>

      <div className="absolute bottom-6 right-4 sm:bottom-12 sm:right-8 md:bottom-24 md:right-24 z-30 w-12 h-12 sm:w-20 sm:h-20 md:w-32 md:h-32 border-b-4 border-r-4 md:border-b-8 md:border-r-8 border-[#00f0ff] mix-blend-difference pointer-events-none"></div>

      {/* MASK LAYER (Desktop only cursor mask) */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 z-20 hidden md:flex items-center justify-center bg-white text-black pointer-events-none md:pointer-events-auto"
          style={{
            clipPath: maskImageTemplate
          }}
        >
          <div
            className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <h1 className="fl-display text-[clamp(2.2rem,8.5vw,8rem)] leading-none tracking-tighter text-black uppercase animate-jitter px-2 sm:px-4 max-w-full">
              <span className="text-[#ff0000]">FAULT</span>LINE
            </h1>
            <p className="text-xs sm:text-lg md:text-2xl font-display font-black uppercase tracking-wider md:tracking-widest mt-4 md:mt-8 px-3 py-2 md:p-4 bg-black text-white max-w-[90vw] text-center">
              SYSTEM COMPROMISED // ERROR CODE: 0x6767
            </p>
          </div>
        </motion.div>
      )}

      {/* BASE LAYER */}
      <div className="w-full h-full flex flex-col items-center justify-center absolute inset-0 z-10 fl-tech-grid p-4 text-center">
        <h1
          className="fl-display text-[clamp(2.2rem,8.5vw,8rem)] leading-none tracking-tighter uppercase px-2 sm:px-4 max-w-full"
          style={{ WebkitTextStroke: "2px white" }}
        >
          <span className="text-[#ff0000]" style={{ WebkitTextStroke: "0px" }}>FAULT</span>
          <span className="text-transparent">LINE</span>
        </h1>
        <p className="text-xs sm:text-lg md:text-2xl font-display font-bold uppercase tracking-wider md:tracking-widest mt-4 md:mt-8 text-white/50 border border-white/20 p-2 md:p-4 max-w-[90vw] text-center">
          SEEK TRUTH IN THE VOID
        </p>
      </div>
    </div>
  );
}
