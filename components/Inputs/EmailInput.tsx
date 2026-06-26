import React from 'react'

type Props = {
  handleChange : (e: React.ChangeEvent<HTMLInputElement>) => void,
  isLoading?: boolean
}

const EmailInput = ({handleChange, isLoading}: Props) => {
  return (
    <div>
      <p className='before_text'>E-mail</p>
      <input type="email" placeholder='' onChange={handleChange} className='email_input' disabled={isLoading}/>
    </div>
  )
}

export default EmailInput