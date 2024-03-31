import React from 'react';
import '/src/app/globals.css';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useState, useRef ,useEffect} from "react";
const Create = () => {
 const gridRef = useRef(null);
 const [gridContent, setGridContent] = useState([]);
 const [grouping, setGrouping] = useState(1);
 const handleClick = (index) => {

  };
   const initializeGridContent = () => {
    const newGridContent = [];
    for (let i = 0; i < 48; i++) {
      newGridContent.push({
        letter: 'A',
        group: 1,
        position: 1,
        index: i,
        found: false
      });
    }
    setGridContent(newGridContent);
  };
 useEffect(() => {
    initializeGridContent();
  }, []);
  return (
   <main className="flex min-h-screen items-center p-12 flex-col">
      <div className="text-3xl font-bold mb-4">Strandimization</div>
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
        <div
  ref={gridRef}
  className="grid grid-cols-6 grid-rows-8 gap-4"
>
  {gridContent &&
    gridContent.map(({ letter, group, position, index }) => (
      <div
        key={index}
        onClick={() => handleClick(index)}
      >
        <div
          
        >
          {letter}
        </div>
      </div>
    ))}
</div>

  
    </main>
  );
}

export default Create;
