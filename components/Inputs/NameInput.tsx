import React from 'react'

type Props = {
  handleChange : (e: React.ChangeEvent<HTMLInputElement>) => void,
  isLoading?: boolean
}

const NameInput = ({handleChange, isLoading}: Props) => {
  return (
    <div className='email_input_container'>
      <p className='before_text'>Nume</p>
      <input type="text" placeholder='' onChange={handleChange} className='email_input' disabled={isLoading}/>
    </div>
  )
}

export default NameInput