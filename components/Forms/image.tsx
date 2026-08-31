'use client'
import React, { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Prompt } from 'next/font/google'

const prompt = Prompt({ subsets: ['latin'], weight: '400' })
const prompt_bold = Prompt({ subsets: ['latin'], weight: '700' })

type ProfileImageFormProps = {
  u_image_text? : string,
}

export const ProfileImageForm = ({u_image_text} : ProfileImageFormProps) => {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [hovering, setHovering] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onMouseEnter = () => setHovering(true)
  const onMouseLeave = () => setHovering(false)


  const handleImageClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Te rugăm să introduci o imagine validă')
      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Imaginea trebuie să aibă maximum 5MB')
      e.target.value = ''
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/user/upload-profile-img', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error ?? 'Eroare la încărcarea imaginii')
      }

      setImageUrl(data.imageUrl)
      if (update) {
        await update()
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error('Error:', error)
      alert(error instanceof Error ? error.message : 'Eroare la încărcarea imaginii')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <div
        className='cursor-pointer relative'
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={handleImageClick}
      >
        {session?.user.image ? (
          <div className='relative w-27.5 h-27.5 rounded-full overflow-hidden transition-all duration-300'>
            <Image
              key={session.user.image}
              src={session.user.image}
              alt='profile picture'
              fill
              sizes='(max-width: 768px) 100vw, 33vw'
              className={`object-cover ${hovering ? 'blur-sm brightness-75' : ''}`}
            />
          </div>
        ) : (
          <div className='relative w-27.5 h-27.5 rounded-full overflow-hidden transition-all duration-300'>
            <Image
              src={hovering ? '/images/select-photo-img.png' : '/images/profile-image.png'}
              alt='profile picture'
              fill
              className='object-cover'
            />
          </div>
        )}
      </div>

      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept='image/*'
        className='hidden'
      />

      <h2 className='text-3xl mt-2' style={prompt_bold.style}>
        {u_image_text ? u_image_text : session?.user?.name}
      </h2>
    </div>
  )
}