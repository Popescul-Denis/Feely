'use client'
import React, {useState, useEffect} from 'react'
import { useSession } from 'next-auth/react'
import {useRouter} from 'next/navigation'
import { Prompt } from 'next/font/google'
import Image from 'next/image'

const prompt = Prompt({subsets: ['latin'], weight: '400'})

type NavigationCardProps = {
  title : string,
  description : string,
  link : string,
  icon? : string,
  tag: string,
}

export const NavigationCard = ({title, description, link, icon, tag} : NavigationCardProps) => {

  const router = useRouter();
  return (
    <div  className='flex flex-col items-start justify-start w-80 h-80 m-4 p-4 border rounded-lg shadow-gray-600 hover:shadow-lg transition-shadow duration-300' style={prompt.style}>
      {icon && 
      <div >
        <Image src={icon} alt='Card image' width={30} height={30}/>
      </div>}
      <h2 className='text-xl font-bold mt-2'>{title}</h2>
      <p className=' text-gray-500'>{description}</p>
      <p className='text-blue-400 self-end mt-auto cursor-pointer hover:opacity-80 hover:font-bold' onClick={() => router.push(link)}>Catre {tag} {'\u2192'}</p>
    </div>
  )
}