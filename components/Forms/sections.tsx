'use client'
import React, {useState, useEffect} from 'react'
import { useSession } from 'next-auth/react'
import {useRouter} from 'next/navigation'
import { Prompt } from 'next/font/google'
import { ProfileImageForm } from './image'

const prompt = Prompt({subsets: ['latin'], weight: '400'})
const prompt_bold = Prompt({subsets: ['latin'], weight: '700'});

export const ProfilePage = () => {

  const {data : session, status} = useSession();
  const router = useRouter();

  const [loading, setloading] = useState<boolean>(false);

  useEffect(() => {
    if(status === "unauthenticated"){
      router.push('/log-in')
    }
  }, [router, status])

  return (
    <div className='flex flex-col items-center mt-6' style={prompt.style}>
      <ProfileImageForm />
    </div>
  )
}
