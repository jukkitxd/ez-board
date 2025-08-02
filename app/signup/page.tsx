import { AuthForm } from "@/components/auth-form"

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] p-4">
      <AuthForm type="signup" />
    </div>
  )
}
