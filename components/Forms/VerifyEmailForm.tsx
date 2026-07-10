'use client'
import React, {useState, useEffect, useCallback} from 'react'
import {useSearchParams} from "next/navigation"

const VerifyEmailForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const verifyEmail = useCallback(async () => {
    if (successMessage || errorMessage) return;

    if (!token) {
      setErrorMessage("Token invalid");
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);
    setSuccessMessage(undefined);

    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Eroare la verificarea email-ului');
      } else {
        setSuccessMessage(data.success);
      }
    } catch (error: unknown) {
      console.error('Error verifying email:', error);
      setErrorMessage('Eroare la verificarea email-ului');
    } finally {
      setIsLoading(false);
    }

  }, [token, successMessage, errorMessage]);

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  return (
    <div>
      {isLoading && <p>Se verifică e-mail-ul...</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
    </div>
  )
}

export default VerifyEmailForm