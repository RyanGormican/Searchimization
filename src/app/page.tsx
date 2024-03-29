'use client'
import { useState, useRef ,useEffect} from "react";

import Link from 'next/link';

export default function Home() {


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
   
    </main>
  );
  }