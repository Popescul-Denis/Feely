'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {Prompt, Atma} from "next/font/google";

const prompt = Prompt({ subsets: ['latin'], weight: '400' });
const atma = Atma({ subsets: ['latin'], weight: '400' });

export default function Home() {
  const [activeBullet, setActiveBullet] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBullet((prevBullet) => (prevBullet + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home_page_section">
      <div className="home_page_resume">
        <div className="home_page_title" style={atma.style}>
          Feely - O drumetie a emotiilor
        </div>
        <div className="home_page_descriptions">
          {activeBullet === 0 && (
            <div className="home_page_description" style={prompt.style}>
              Noteaza-ti gandurile, sentimentele si experientele intr-un <span className="font-bold cursor-pointer">jurnal</span> propriu sau cu un <span className="font-bold cursor-pointer">AI</span> care te poate intelege si sustine.
            </div>
          )}
          {activeBullet === 1 && (
            <div className="home_page_description" style={prompt.style}>
              Analizeaza-ti emotiile si gandurile cu ajutorul <span className="font-bold cursor-pointer">rapoartelor</span> noastre detaliate si descopera noi perspective asupra propriei tale vieti.
            </div>
          )}
          {activeBullet === 2 && (
            <div className="home_page_description" style={prompt.style}>
              Treci printr-o aventura de emotii si sentimente noi zilnice. Urmareste-ti progresul cu ajutorul <span className="font-bold cursor-pointer">calendarului</span> si descopera cum te-ai schimbat in timp.
            </div>
          )}
          <div className="bullets_indicator">
            <button key="0" className={`bullet_indicator ${activeBullet === 0 ? 'active' : ''}`} onClick={() => setActiveBullet(0)}></button>
            <button key="1" className={`bullet_indicator ${activeBullet === 1 ? 'active' : ''}`} onClick={() => setActiveBullet(1)}></button>
            <button key="2" className={`bullet_indicator ${activeBullet === 2 ? 'active' : ''}`} onClick={() => setActiveBullet(2)}></button>
          </div>
        </div>
      </div>
      <div className="home_page_content">
        
      </div>
    </div>
  );
}
