'use client'
import React, {useState, useEffect} from 'react'
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

export const ResetPasswordInput = ({handleChange, isLoading} : Props) => {
  const [togglePassword, setTogglePassword] = useState<boolean>(false);

  return (
    <div className='password_input_container'>
      <p className='before_text'>Parola noua</p>
      <div className='password_input_wrapper'>
        <input className='password_input' type={togglePassword ? "text" : "password"} placeholder='' onChange={handleChange} disabled={isLoading}/>
        <Image src={togglePassword ? "/icons/Eye-opened.png" : "/icons/Eye-closed.png"} alt="Toggle Password Visibility" width={20} height={20} 
        className='password_visibility_icon cursor-pointer'
        onClick={() => setTogglePassword(!togglePassword)} />
      </div>
    </div>
  )
}

export const PasswordStrengthIndicator = ({password} : {password: string}) => {
  const [strength, setStrength] = useState<number>(0);

  useEffect(() => {
    let tempStrength = 0;
    if(password.length >= 8) tempStrength += 1;
    if(/[A-Z]/.test(password)) tempStrength += 1;
    if(/[0-9]/.test(password)) tempStrength += 1;
    setStrength(tempStrength);
  }, [password]);

  return (
    <>
      <div className="password_indicator">
        <div className={`strength_bar ${strength >= 1 ? 'filled' : ''}`}></div>
        <div className={`strength_bar ${strength >= 2 ? 'filled' : ''}`}></div>
        <div className={`strength_bar ${strength >= 3 ? 'filled' : ''}`}></div>
      </div>
      <p className={`strength_text ${
        strength === 0 ? 'text-red-500' :
        strength === 1 ? 'text-orange-500' :
        strength === 2 ? 'text-yellow-500' :
        'text-green-500'
      }`}>
        {password.length === 0 && ''}
        {strength === 0 && password && 'Parola este foarte slaba'}
        {strength === 1 && 'Parola este slaba'}
        {strength === 2 && 'Parola este medie'}
        {strength === 3 && 'Parola este puternica'}
      </p>
    </>
  )
} 

export default PasswordInput