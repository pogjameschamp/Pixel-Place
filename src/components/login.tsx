"use client";

import React from 'react';
import { auth, provider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { createUser } from '@/actions/actions'; // Import the function to create a user
import { useAuthState } from "react-firebase-hooks/auth";

export const Login = () => {
  const router = useRouter();
  const [user1] = useAuthState(auth);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user || !user.email) {
        throw new Error("User or email not found after sign-in");
      }

      // Create user in your database after sign-in
      await createUser({
        id: user.uid,
        name: user.displayName ?? "Anonymous",
        email: user.email,
      });

      // Redirect to the client page after successful sign-in
      router.push('/clientpage');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-200 via-blue-300 to-gray-200 text-gray-800">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to PixelPlace!</h1>
        <p className="text-lg mb-8">
          Sign in with Google and start placing pixels to create amazing pixel art with the community!
        </p>
        
        <button 
          onClick={signInWithGoogle} 
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      </div>
      
      <div className="absolute bottom-5 text-center text-gray-600 text-sm opacity-70">
        <p>Join the fun, create your art!</p>
      </div>
    </div>
  );
};
