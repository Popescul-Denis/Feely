'use client'
import  {useState, useEffect} from 'react'
import { signIn, useSession, getProviders } from "next-auth/react";
import type {ClientSafeProvider} from "next-auth/react"
import {useRouter} from "next/navigation"
import Image from 'next/image';
import {Prompt} from 'next/font/google'

import EmailInput from '@components/Inputs/EmailInput';
import PasswordInput from '@components/Inputs/PasswordInput';
import NameInput from '@components/Inputs/NameInput';

import validator from "validator"

const prompt = Prompt({ subsets: ['latin'], weight: '400' })

const PasswordStrengthIndicator = ({password} : {password: string}) => {
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

const SignUpPage = () => {
  const router = useRouter();
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  const {data: session, status} = useSession();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [isEmailValid, setIsEmailValid] = useState<bool>(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    fetchProviders();
  }, []);

  useEffect(() => {
    setCanSubmit(name.trim() !== '' && email.trim() !== '' && password.trim() !== '');
  }, [name, email, password]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!canSubmit) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try{
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password, name}),
      });

      const data = await res.json();

      if(!res.ok){
        setErrorMessage(data.error || 'Eroare la crearea contului');
      }

      setSuccessMessage('Cont creat cu succes! Asteapta sa te autentificam...');

      // Autentificare automata dupa creare cont
      const signInRes = await signIn('credentials', {
        email: email,
        password: password,
        callbackUrl: '/',
      });

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
          Inregistrare
        </h1>

        <form action="" className="connection_form">
            <NameInput handleChange={handleNameChange} isLoading = {isLoading}/>
            <EmailInput handleChange={handleEmailChange} isLoading = {isLoading}/>
            <PasswordInput handleChange={handlePasswordChange} isLoading= {isLoading}/>
            <PasswordStrengthIndicator password={password} />

            <button className={`connection_button ${canSubmit ? '' : 'disabled'}`}
              type="submit"
              disabled={!canSubmit || isLoading}
            >Creeaza cont</button>
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
          Ai deja un cont? <span className='other_page_link' onClick={() => router.push('/log-in')}>
            Autentificare
          </span>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage