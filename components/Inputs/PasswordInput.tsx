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
    <div className='password_input_container'>
      <p className='before_text'>Parola</p>
      <div className='password_input_wrapper'>
        <input className='password_input' type={togglePassword ? "text" : "password"} placeholder='' onChange={handleChange} disabled={isLoading}/>
        <Image src={togglePassword ? "/icons/Eye-opened.png" : "/icons/Eye-closed.png"} alt="Toggle Password Visibility" width={20} height={20} 
        className='password_visibility_icon cursor-pointer'
        onClick={() => setTogglePassword(!togglePassword)} />
      </div>
    </div>
  )
}

export default PasswordInput