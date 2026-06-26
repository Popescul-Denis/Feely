'use client'
import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import {Atma} from 'next/font/google'

const atma = Atma({ subsets: ['latin'], weight: '500' })

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo-container">
        <Image
          src="/icons/feely_logo.png"
          alt="Feely Logo"
          width={50}
          height={50}
        />
        <div className="logo_title" style={atma.style}>
          Feely 
        </div>
      </div>
      <div className="nav-links" style={atma.style}>
        <button className="nav-link">Acasă</button>
        <button className="nav-link">Despre</button>
        <button className="nav-link">Contact</button>
        <button className="nav-link">Autentificare</button>
        <button className="nav-link"><Image src="/icons/Settings.png" alt="Setari" width={25} height={25} /></button>
      </div>
    </div>
  )
}

export default Navbar