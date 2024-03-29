'use client'
import { useState, useRef ,useEffect} from "react";

import Link from 'next/link';
import { Icon } from '@iconify/react';
export default function Home() {


  return (
    <main className="flex min-h-screen items-center p-12 flex-col">
 
      <div className="text-3xl font-bold mb-4">Strandimization</div>
          <div className="flex">
             <div className="links">
          <a href="https://www.linkedin.com/in/ryangormican/">
            <Icon icon="mdi:linkedin" color="#0e76a8" width="60" />
          </a>
          <a href="https://github.com/RyanGormican/Strandimization">
            <Icon icon="mdi:github" color="#e8eaea" width="60" />
          </a>
          <a href="https://ryangormicanportfoliohub.vercel.app/">
            <Icon icon="teenyicons:computer-outline" color="#199c35" width="60" />
          </a>
        </div>
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