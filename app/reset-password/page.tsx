import React, {Suspense} from 'react';
import ResetPasswordForm from '@components/Forms/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <div>
      <Suspense fallback={<p>Se încarcă resetarea parolei...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

export default ResetPasswordPage;