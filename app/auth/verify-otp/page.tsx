import { Suspense } from 'react';
import { OTPContent } from './otp-content';

function OTPLoading() {
  return null;
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<OTPLoading />}>
      <OTPContent />
    </Suspense>
  );
}
