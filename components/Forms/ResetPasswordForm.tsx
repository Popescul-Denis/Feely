'use client'

import React, { useState, useEffect } from 'react';
import CodeInput from '@components/Inputs/CodeInput';
import ResetPasswordEmailInput from '@components/Inputs/EmailInput';
import { ResetPasswordInput, PasswordStrengthIndicator } from '@components/Inputs/PasswordInput';
import { Prompt } from 'next/font/google';

const prompt = Prompt({ subsets: ['latin'], weight: '400' });

const ResetPasswordForm = () => {
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [isPassword, setisPassword] = useState<boolean>(false);

  const [generatedCode, setGeneratedCode] = useState<string[]>(Array(6).fill(''));
  const [userCode, setUserCode] = useState<string[]>(Array(6).fill(''));

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [passMessage, setPassMessage] = useState<string>('');
  const [passError, setPassError] = useState<string>('');

  const [canReset, setCanReset] = useState<boolean>(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);

    const val = e.target.value;

    if(val.length>=8 &&
      /[A-Z]/.test(val) &&
      /[0-9]/.test(val)
    ){
      setisPassword(true);
    }
  }

  useEffect(() => {
    const generateCode = () => {
      const code = Math.floor(100000 + Math.random() * 900000);
      const codeString = code.toString().padStart(6, '0');
      setGeneratedCode(codeString.split(''));
    };

    generateCode();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && !(e.target instanceof HTMLInputElement)) {
        console.log('Codul generat pentru verificare:', generatedCode.join(''));
        alert(`Codul de resetare este: ${generatedCode.join('')}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generatedCode]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/send-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codeString: generatedCode.join('') }),
      });

      if (response.ok) {
        setMessage("Codul de resetare a fost creat si trimis prin email")
      }
      else{
        setMessage("Codul de resetare nu s-a putut crea");
      }
    } catch (error : unknown) {
      if(error instanceof Error){
        setMessage(error.message);
      }
      else{
        setMessage("Eroare necunoscuta");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit2 = async (e:React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try{
      const res = await fetch('/api/check-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userCode: userCode.join('')})
      })

      const data= await res.json();

      if(!res.ok){
        setErrorMessage(data.error || "Eroare la validarea codului");
      }else{
        setSuccessMessage(data.success);
        setCanReset(true);
      }
    }catch (error : unknown) {
      if(error instanceof Error){ setErrorMessage(error.message) }
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit3 = async (e:React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try{
      const res = await fetch('/api/reset-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({password: newPassword, codeString: generatedCode.join('')})
        
      })

      const data= await res.json();

      if(!res.ok){
        setPassError(data.error || "Eroare la resetarea parolei");
      }else{
        setPassMessage(data.success);
      }
    }catch (error : unknown) {
      if(error instanceof Error){ setPassError(error.message) }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='reset-password-form-container' style={prompt.style}>
      {message && <p className='text-gray-500'>{message}</p>}
      <form onSubmit={handleSubmit} className='submit_form'>
        <h2 className='text-xl font-bold mb-4'>Introdu adresa de email a contului tau</h2>
        <ResetPasswordEmailInput handleChange={handleEmailChange} isLoading={isLoading} />
        <button 
          type="submit"
          className='reset_password_button'
          disabled={isLoading}
        >
          {isLoading ? 'Se trimite...' : 'Trimite codul de resetare'}
        </button>
      </form>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <form onSubmit={handleSubmit2} className='submit_form'>
        <h2 className='text-xl font-bold mb-4 mt-8'>Introdu codul de resetare a parolei</h2>
        <CodeInput setUserCode={setUserCode}/>
        <button 
          type="submit"
          className={`reset_password_button ${userCode.join('').length<6 ? 'disabled' : ''}`}
          disabled={isLoading || userCode.join('').length<6}
        >
          {isLoading ? 'Se verifica...' :'Verifica'}
        </button>
      </form>

      {/* Afișează codul doar în development (opțional) */}
      {process.env.NODE_ENV === 'development' && (
        <div>
          <p className='text-sm text-gray-500 mt-4'>
            Cod generat: {generatedCode.join('')} (apasă K pentru a-l afișa)
          </p>
          <p className='text-sm text-gray-500 mt-4'>
            Cod user: {userCode.join('')} 
          </p>
        </div>
      )}

      {passError && <p className="text-red-500">{passError}</p>}
      {passMessage && <p className="text-green-500">{passMessage}</p>}

      {canReset && 
        <form className='submit_form' onSubmit={handleSubmit3}>
          <h2 className='text-xl font-bold mb-4 mt-8'>Introdu o parola noua</h2>
          <ResetPasswordInput handleChange={handlePasswordChange} isLoading={isLoading}/>
          <PasswordStrengthIndicator password={newPassword}/>
          <button
            className={`reset_password_button ${isPassword ? '' : 'disabled'}`}
            type='submit'
            disabled={isLoading || !isPassword}
          >
            {isLoading ? 'Se reseteaza ...' : 'Resetare parola'}
          </button>
        </form>
      }
    </div>
  );
}

export default ResetPasswordForm;