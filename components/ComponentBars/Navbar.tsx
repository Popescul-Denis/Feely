'use client'
import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import {Atma, Prompt} from 'next/font/google'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {signOut} from "next-auth/react"

const atma = Atma({ subsets: ['latin'], weight: '500' })
const prompt = Prompt({ subsets: ['latin'], weight: '400' })

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

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
      <div className="nav-links" style={prompt.style}>
        <button className="nav-link" onClick={() => router.push('/')}>
          Acasă
        </button>
        <button className="nav-link">Despre</button>
        <button className="nav-link">Contact</button>
        {session ? (
          <>
            <button className="nav-link">Profil</button>
            <button className="nav-link" onClick={() => signOut()}>
              Deconectare
            </button>
          </>
        ) : (
          <button className="nav-link" onClick={() => router.push('/log-in')}>
            Autentificare
          </button>
        )}
        <button className="nav-link"><Image src="/icons/Settings.png" alt="Setari" width={25} height={25} /></button>
      </div>
    </div>
  )
}

export default Navbar