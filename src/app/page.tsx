'use client'
import { useState } from "react";

export default function Home() {
const theme = "Nature's Beauty";
const [foundWords, setFoundWords] = useState(0);
  const [gridContent, setGridContent] = useState([
    { letter: 'R', group: 1, position: 1 },
    { letter: 'O', group: 1, position: 2 },
    { letter: 'S', group: 1, position: 3 },
    { letter: 'E', group: 1, position: 4 },
    { letter: 'D', group: 2, position: 1 },
    { letter: 'A', group: 2, position: 2 },
    { letter: 'R', group: 3, position: 3 },
    { letter: 'A', group: 3, position: 2 },
    { letter: 'M', group: 3, position: 1 },
    { letter: 'Y', group: 2, position: 5 },
    { letter: 'I', group: 2, position: 4 },
    { letter: 'S', group: 2, position: 3 },
    { letter: 'I', group: 3, position: 4 },
    { letter: 'G', group: 3, position: 5 },
    { letter: 'O', group: 3, position: 6 },
    { letter: 'L', group: 3, position: 7 },
    { letter: 'D', group: 3, position: 8 },
    { letter: 'D', group: 4, position: 1 },
    { letter: 'F', group: 5, position: 1 },
    { letter: 'A', group: 4, position: 6 },
    { letter: 'I', group: 4, position: 5 },
    { letter: 'L', group: 4, position: 4 },
    { letter: 'H', group: 4, position: 3 },
    { letter: 'A', group: 4, position: 2 },
    { letter: 'U', group: 5, position: 2 },
    { letter: 'C', group: 5, position: 3 },
    { letter: 'H', group: 5, position: 4 },
    { letter: 'S', group: 5, position: 5 },
    { letter: 'I', group: 5, position: 6 },
    { letter: 'A', group: 5, position: 7 },
    { letter: 'F', group: 6, position: 1 },
    { letter: 'L', group: 6, position: 2 },
    { letter: 'O', group: 6, position: 3 },
    { letter: 'W', group: 6, position: 4 },
    { letter: 'E', group: 6, position: 5 },
    { letter: 'R', group: 6, position: 6 },
    { letter: 'P', group:7, position: 5},
    { letter: 'U', group: 7, position: 2 },
    { letter: 'L', group: 7, position: 3 },
    { letter: 'D', group: 8, position: 7 },
    { letter: 'E', group: 8, position: 6 },
    { letter: 'E', group: 8, position: 5 },
    { letter: 'T', group: 7, position: 1 },
    { letter: 'I', group: 7, position: 4 },
    { letter: 'C', group:8, position: 1 },
    { letter: 'U', group:8, position: 2 },
    { letter: 'D', group:8, position: 3 },
    { letter: 'W', group: 8, position: 4 },
  ]);
    const maxGroup = gridContent.reduce((max, { group }) => {
    return group > max ? group : max;
  }, 0);

  return (
    <main className="flex min-h-screen items-center p-24 flex-col">
      <div className="text-3xl font-bold mb-8">
        Strandimization
      </div>
      <div className="flex flex-col mb-8">
        <div className="font-bold mb-4">Your Theme</div>
        <div>{theme}</div>
        <div>{foundWords} of {maxGroup}   theme words found  </div>
      </div>
      <div className="grid grid-cols-6 grid-rows-8 gap-4">
        {gridContent.map(({ letter, group, position }, index) => (
          <div key={index} className="bg-gray-200 p-4 flex flex-col justify-center items-center">
            <div>{letter}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
