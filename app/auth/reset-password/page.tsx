import { Suspense } from 'react';
import { ResetPasswordContent } from './reset-content';

function ResetPasswordLoading() {
  return null;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
