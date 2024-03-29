import React from 'react';
import Link from 'next/link';
import { gridList } from '/src/app/gridContentData'; 
import '/src/app/globals.css';
const Puzzles = () => {
  return (
    <main className="flex min-h-screen items-center p-12 flex-col">
      <div className="text-3xl font-bold mb-4">Strandimization</div>
      <div className="grid grid-cols-3 gap-4">
        {gridList.map((theme) => (
          <Link key={theme.id} href={`/Play/${theme.id}`}>
            <button className="block bg-gray-200 p-4 rounded hover:bg-gray-300">{theme.theme}</button>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default Puzzles;