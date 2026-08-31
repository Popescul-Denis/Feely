'use client'
import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {Atma, Prompt} from 'next/font/google'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {signOut} from "next-auth/react"
import { SideBarType } from '@utils/data-types/sidebar'

const atma = Atma({ subsets: ['latin'], weight: '500' })
const prompt = Prompt({ subsets: ['latin'], weight: '400' })

type SidebarProps = {
  bar_type : SideBarType,
}

type SidebarColumnProps = {
  colTitle : string,
  colRows : string[],
}

const SidebarColumn = ({colTitle, colRows} : SidebarColumnProps) => {

  

  return (
    <div className='flex flex-col border-2 border-mauve-500 rounded-xl max-w-2xs mt-7 bg-[#f9eada]'>
      <p className='font-bold mt-1 ml-2'>{colTitle}</p>
      <div className='w-full h-0.5 bg-mauve-500 my-2'></div>
      <div className='flex flex-col mt-2 mb-3 gap-1 text-[1.1rem] px-2'>
        {colRows.map((row, index) => (
          <p key={index} className='cursor-pointer hover:bg-[#edd19c]'>{row}</p>
        ))}
      </div>
    </div>
  )
}

export const Sidebar = ({bar_type} : SidebarProps) => {

  const sidebarTitle = (bar_type === SideBarType.settings ? 'Setari' : '')

  return (
    <div className='flex flex-col w-2xs h-full p-5'>
      <h2 className='text-2xl'>{sidebarTitle}</h2>
      <SidebarColumn colTitle='Detalii cont' colRows={['Email', 'Nume', 'Parola uitata']} />
      <SidebarColumn colTitle='Configurare jurnal' colRows={['Parola jurnal']} />
      <SidebarColumn colTitle='Accesibilitate' colRows={['Tematica', 'Limba']} />
    </div>
  )
}

export const Navbar = () => {
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
            <button className="nav-link" onClick={() => {
              router.push(`profile`);
            }}>Profil</button>
            <button className="nav-link" onClick={() => signOut()}>
              Deconectare
            </button>
          </>
        ) : (
          <button className="nav-link" onClick={() => router.push('/log-in')}>
            Autentificare
          </button>
        )}
        <button className="nav-link" onClick={() => {
          router.push('settings-page');
        }}><Image src="/icons/Settings.png" alt="Setari" width={25} height={25} /></button>
      </div>
    </div>
  )
}

export const Footer = () => {
  return (
    <div className="footer_container">
      <footer className="footer">
        <p className="footer_text">
          &copy; {new Date().getFullYear()} Feely. All rights reserved.
        </p>
      </footer>
      <div className="social">
        <Link href="https://www.facebook.com/profile.php?id=100051629433086" target="_blank"><Image src="/icons/Facebook.png" width={30} height={30} alt="Facebook"/></Link>
        <Link href="https://www.instagram.com/popescu4709/" target="_blank"><Image src="/icons/instagram.png" width={30} height={30} alt='Instagram'/></Link>
        <Link href="https://www.linkedin.com/in/denis-popescu-91b363386/" target="_blank"><Image src="/icons/LinkedIN.png" width={30} height={30} alt='LinkedIn'/></Link>
      </div>
    </div>
  )
}