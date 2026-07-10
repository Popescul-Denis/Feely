import React, { Suspense } from 'react'
import VerifyEmailForm from '@/components/Forms/VerifyEmailForm';

const VerifyEmailPage = () => {
  return (
    <div>
      <Suspense fallback={<p>Se încarcă verificarea...</p>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  )
}

export default VerifyEmailPage