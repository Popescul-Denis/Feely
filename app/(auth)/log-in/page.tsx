'use client'
import  {useState, useEffect} from 'react'
import { signIn, useSession, getProviders } from "next-auth/react";
import type {ClientSafeProvider} from "next-auth/react"
import {useRouter} from "next/navigation"
import Image from 'next/image';
import {Prompt} from 'next/font/google'

import EmailInput from '@components/Inputs/EmailInput';
import PasswordInput from '@components/Inputs/PasswordInput';

const prompt = Prompt({ subsets: ['latin'], weight: '400' })

const LogInPage = () => {
  const router = useRouter();
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  const {data: session, status} = useSession();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    setCanSubmit(email.trim() !== '' && password.trim() !== '');
  }, [email, password]);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    fetchProviders();
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  }

  const handleSubmit = async (e : React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if(!canSubmit) return ;

    setIsLoading(true);
    setErrorMessage('');

    try {
      await signIn('credentials', {
        email: email,
        password: password,
        callbackUrl: '/',
      })

      setSuccessMessage('Autentificare reusita! Redirectionare...');
    }catch(error : unknown){
      const message = error instanceof Error ? error.message : 'Eroare necunoscuta';
      setErrorMessage(message);
    }finally{
      setIsLoading(false);
    }
  }

  if(status === "loading") {
    return (<div className="loading_container">
      <div className="loading_text">Se incarca...</div>
      <div className="loading_spinner"></div>
    </div>)
  }

  return (
    <div className='log_in_section'>
      <div className='log_in_container'>
        <h1 className='log_in_title' style={prompt.style}>
          Autentificare
        </h1>

        {errorMessage && <p className='error_message'>{errorMessage}</p>}
        {successMessage && <p className='success_message'>{successMessage}</p>}

        <form action="" className="connection_form">
            <EmailInput handleChange={handleEmailChange} isLoading = {isLoading}/>

            <PasswordInput handleChange={handlePasswordChange} isLoading= {isLoading}/>

            <div className='connection_button_container'>
              <p className='forgot_password_text'>Ai uitat parola?</p>
              <button 
              type='submit' 
              className={`connection_button ${canSubmit ? '' : 'disabled'}`}
              disabled={!canSubmit || isLoading}
              onClick={handleSubmit}>
                Conectare
              </button>
            </div>
          </form>

        <p className='or_tag' style={prompt.style}>
          SAU
        </p>
        {providers?.google && (
            <button className="google_button"
            onClick={() => signIn('google', { callbackUrl: '/' })}>
              <Image src="/icons/google-logo.png" alt="Google Logo" width={20} height={20} />
              <span className='google_text'>Logheaza-te cu Google</span>
            </button>
          )}
        <div className='other_page_text' style={prompt.style}>
          Nu ai un cont? <span className='other_page_link' onClick={() => router.push('/sign-up')}>
            Inregistreaza-te
          </span>
        </div>
      </div>
    </div>
  )
}

export default LogInPage