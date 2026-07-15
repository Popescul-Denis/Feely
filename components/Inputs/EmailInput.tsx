import React from 'react'

type Props = {
  handleChange : (e: React.ChangeEvent<HTMLInputElement>) => void,
  isLoading?: boolean
}

const EmailInput = ({handleChange, isLoading}: Props) => {
  return (
    <div className='email_input_container'>
      <p className='before_text'>E-mail</p>
      <input type="email" placeholder='' onChange={handleChange} className='email_input' disabled={isLoading}/>
    </div>
  )
}

export const ResetPasswordEmailInput = ({handleChange, isLoading}: Props) => {
  return (
    <div className='password_reset_email_input_container'>
      <p className='before_text'>E-mail</p>
      <input type="email" placeholder='' onChange={handleChange} className='reset_password_email_input' disabled={isLoading}/>
    </div>
  )
}


export default EmailInput