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

      // Call the server action using a dedicated approach for server functions
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
    <div>
      <p>Sign in with Google to start placing pixels!</p>
      <button onClick={signInWithGoogle}>Sign in</button>
    </div>
  );
};
