'use client'
import React, {useState} from 'react'
import Image from 'next/image'

type Props = {
  handleChange : (e: React.ChangeEvent<HTMLInputElement>) => void,
  isLoading?: boolean
}

const PasswordInput = ({handleChange, isLoading}: Props) => {
  const [togglePassword, setTogglePassword] = useState<boolean>(false);

  return (
    <div>
      <p className='before_text'>Parola</p>
      <input className='password_input' type={togglePassword ? "text" : "password"} placeholder='' onChange={handleChange} disabled={isLoading}/>
      <Image src={togglePassword ? "/icons/eye-open.png" : "/icons/eye-close.png"} alt="Toggle Password Visibility" width={20} height={20} 
      className='password_visibility_icon'
      onClick={() => setTogglePassword(!togglePassword)} />
    </div>
  )
}

export default PasswordInput