"use client";
import React from 'react';
import { auth, provider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export const Login = () => {
  const router = useRouter();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // After successful sign-in, redirect to the client page
      router.push('/clientpage'); // replace '/clientpage' with your actual client page route
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div>
      <p>Sign in with Google to start placing pixels!</p>
      <button onClick={signInWithGoogle}>Sign in</button>
    </div>
  );
};
