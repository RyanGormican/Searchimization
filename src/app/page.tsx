'use client'
import { useState, useRef } from "react";


export default function Home() {
const theme = "Nature's Beauty";
const [foundWords, setFoundWords] = useState(0);
  const gridRef = useRef(null);
    const [selectedLetters, setSelectedLetters] = useState([]);
      const [isMouseDown, setIsMouseDown] = useState(false);


  const [gridContent, setGridContent] = useState([
    { letter: 'R', group: 1, position: 1, index:0 },
    { letter: 'O', group: 1, position: 2,index:1 },
    { letter: 'S', group: 1, position: 3,index:2 },
    { letter: 'E', group: 1, position: 4,index:3 },
    { letter: 'D', group: 2, position: 1,index:4 },
    { letter: 'A', group: 2, position: 2,index:5},
    { letter: 'R', group: 3, position: 3,index:6},
    { letter: 'A', group: 3, position: 2,index:7 },
    { letter: 'M', group: 3, position: 1,index:8 },
    { letter: 'Y', group: 2, position: 5 ,index:9},
    { letter: 'I', group: 2, position: 4,index:10},
    { letter: 'S', group: 2, position: 3,index:11},
    { letter: 'I', group: 3, position: 4,index:12},
    { letter: 'G', group: 3, position: 5 ,index:13},
    { letter: 'O', group: 3, position: 6 ,index:14},
    { letter: 'L', group: 3, position: 7,index:15 },
    { letter: 'D', group: 3, position: 8 ,index:16},
    { letter: 'D', group: 4, position: 1,index:17 },
    { letter: 'F', group: 5, position: 1 ,index:18},
    { letter: 'A', group: 4, position: 6,index:19 },
    { letter: 'I', group: 4, position: 5,index:20},
    { letter: 'L', group: 4, position: 4 ,index:21},
    { letter: 'H', group: 4, position: 3,index:22},
    { letter: 'A', group: 4, position: 2 ,index:23},
    { letter: 'U', group: 5, position: 2,index:24 },
    { letter: 'C', group: 5, position: 3 ,index:25},
    { letter: 'H', group: 5, position: 4,index:26 },
    { letter: 'S', group: 5, position: 5 ,index:27},
    { letter: 'I', group: 5, position: 6,index:28},
    { letter: 'A', group: 5, position: 7,index:29},
    { letter: 'F', group: 6, position: 1,index:30},
    { letter: 'L', group: 6, position: 2,index:31},
    { letter: 'O', group: 6, position: 3 ,index:32},
    { letter: 'W', group: 6, position: 4 ,index:33},
    { letter: 'E', group: 6, position: 5 ,index:34},
    { letter: 'R', group: 6, position: 6,index:35 },
    { letter: 'P', group:7, position: 5,index:36},
    { letter: 'U', group: 7, position: 2 ,index:37},
    { letter: 'L', group: 7, position: 3 ,index:38},
    { letter: 'D', group: 8, position: 7,index:39},
    { letter: 'E', group: 8, position: 6 ,index:40},
    { letter: 'E', group: 8, position: 5,index:41 },
    { letter: 'T', group: 7, position: 1,index:42},
    { letter: 'I', group: 7, position: 4 ,index:43},
    { letter: 'C', group:8, position: 1 ,index:44},
    { letter: 'U', group:8, position: 2,index:45 },
    { letter: 'D', group:8, position: 3 ,index:46},
    { letter: 'W', group: 8, position: 4 ,index:47},
  ]);
    const maxGroup = gridContent.reduce((max, { group }) => {
    return group > max ? group : max;
  }, 0);
 const handleMouseDown = (index) => {
    setIsMouseDown(true);
    if (!selectedLetters.includes(index)) {
      setSelectedLetters([...selectedLetters, index]);
    }
  };
    const resetSelect = () => {
    setSelectedLetters([]);
  };
  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseEnter = (index) => {
    if (isMouseDown) {
      if (!selectedLetters.includes(index)) {
        setSelectedLetters([...selectedLetters, index]);
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center p-24 flex-col">
      <div className="text-3xl font-bold mb-8">Strandimization</div>
      <div className="flex flex-col mb-8">
        <div className="font-bold mb-4">Your Theme</div>
        <div>{theme}</div>
        <div>
          {foundWords} of {maxGroup} theme words found
        </div>
        <div>{selectedLetters.map((index) => gridContent[index].letter).join("")} <button  className="text-3xl font-bold mb-8"> Submit </button> <button  className="text-3xl font-bold mb-8" onClick={resetSelect} > Reset </button></div>
      </div>
      <div
        ref={gridRef}
        className="grid grid-cols-6 grid-rows-8 gap-4"
        onMouseUp={() => handleMouseUp()}
      >
        {gridContent.map(({ letter, group, position, index }) => (
          <div
            key={index}
            className={`bg-gray-200 p-4 flex flex-col justify-center items-center ${
              selectedLetters.includes(index) ? "bg-gray-500" : ""
            }`}
            onMouseDown={() => handleMouseDown(index)}
            onMouseEnter={() => handleMouseEnter(index)}
          >
            <div>{letter}</div>
          </div>
        ))}
      </div>
    </main>
  );
}