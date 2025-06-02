'use client';

import { useSession, signIn } from "next-auth/react";
import { MailPilotSidebar } from "@/components/MailPilotSidebar";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = useCallback(async () => {
    try {
      setError(null);
      const result = await signIn('azure-ad', {
        redirect: false,
        callbackUrl: '/'
      });
      
      if (result?.error) {
        setError(result.error);
        console.error('Sign in error:', result.error);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Sign in error:', error);
    }
  }, [router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome to MailPilot AI
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in with your work or school account
            </p>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div>
            <button
              onClick={handleSignIn}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2F2F2F] hover:bg-[#1F1F1F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2F2F2F]"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5 0L23 11.5L11.5 23V0Z" fill="#F25022"/>
                <path d="M0 0H11.5V11.5H0V0Z" fill="#7FBA00"/>
                <path d="M0 11.5H11.5V23H0V11.5Z" fill="#00A4EF"/>
                <path d="M11.5 11.5H23V23H11.5V11.5Z" fill="#FFB900"/>
              </svg>
              Sign in with Microsoft
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen">
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome, {session.user?.name}</h1>
        <p className="text-gray-600">
          Your AI-powered email assistant is ready to help!
        </p>
      </div>
      <MailPilotSidebar />
    </main>
  );
}
