import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

import { gridList } from '/src/app/gridContentData'; 
import '/src/app/globals.css';
const Puzzles = () => {
  return (
    <main className="flex min-h-screen items-center p-12 flex-col">
      <div className="text-3xl font-bold mb-4">Strandimization</div>
      
<div className="flex">
<div>
          <Link href="/Puzzles">
            <button className="py-2 px-4 bg-blue-500 text-white rounded">PUZZLES</button>
          </Link>
        </div>
        <div>
          <Link href="/Create">
            <button className="py-2 px-4 bg-blue-500 text-white rounded">CREATE</button>
          </Link>
        </div>
        </div>
      <div className="grid grid-cols-3 gap-4">
        {gridList.map((theme) => (
          <Link key={theme.id} href={`/Play/${theme.id}`}>
            <div className="block bg-gray-200 p-4 rounded hover:bg-gray-300">
            <button >{theme.theme}</button>
            <div className="flex">   <Icon icon="mdi:play"  width="20" /> {theme.plays}   <Icon icon="mdi:heart" width="20" /> {theme.likes}  <Icon icon="material-symbols:flag"  width="20" /> {theme.finishes}  </div>
            <div  className="flex">  <Icon icon="mdi:user" width="20" /> {theme.user} </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default Puzzles;