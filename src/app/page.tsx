'use client'
import { useEffect } from 'react';

export default function Home() {

  useEffect(() => {
  window.location.href = '/Home';
  }, []); 

  return (
    <main className="flex min-h-screen items-center p-12 flex-col">

    </main>
  );
}
