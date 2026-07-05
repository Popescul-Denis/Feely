'use client'
import React, {useState, useEffect, useCallback} from 'react'
import {useSearchParams} from "next/navigation"
import { newVerification } from '@/utils/new-verification';

const VerifyEmailForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);

  const verifyEmail = useCallback(async () => {
    if(successMessage || errorMessage) return;

    if(!token){
      setErrorMessage("Token invalid");
      return;
    }

    newVerification(token).then((response) => {
      if(response.error){
        setErrorMessage(response.error);
      }else{
        setSuccessMessage(response.success);
      }
    }).catch((error) => {
      console.error('Error verifying email:', error);
      setErrorMessage("Eroare la verificarea email-ului");
    });

  }, [token, successMessage, errorMessage]);

  useEffect(() => {
    verifyEmail();
  }, []);

  return (
    <div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
    </div>
  )
}

export default VerifyEmailForm