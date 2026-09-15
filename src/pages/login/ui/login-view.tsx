import { LoginForm } from '@/features/auth';

export function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <LoginForm />
    </div>
  );
}
