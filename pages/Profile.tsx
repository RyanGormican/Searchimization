import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../src/app/Header';
import { auth } from '../src/app/firebase';
import '/src/app/globals.css';
const Profile: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        // Redirect to login page if user is not authenticated
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div>
      <Header currentUser={auth.currentUser} />
      <main className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold my-4">User Profile</h1>

      </main>
    </div>
  );
};

export default Profile;
