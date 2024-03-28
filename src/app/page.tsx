'use client'
import { useState, useRef ,useEffect} from "react";


export default function Home() {
const theme = "Nature's Beauty";
const [foundWords, setFoundWords] = useState(0);
  const gridRef = useRef(null);
    const [selectedLetters, setSelectedLetters] = useState([]);
      const [isMouseDown, setIsMouseDown] = useState(false);


  const [gridContent, setGridContent] = useState([
    { letter: 'R', group: 1, position: 1, index:0, found: false },
    { letter: 'O', group: 1, position: 2,index:1, found: false },
    { letter: 'S', group: 1, position: 3,index:2, found: false },
    { letter: 'E', group: 1, position: 4,index:3, found: false },
    { letter: 'D', group: 2, position: 1,index:4, found: false },
    { letter: 'A', group: 2, position: 2,index:5, found: false},
    { letter: 'R', group: 3, position: 3,index:6, found: false},
    { letter: 'A', group: 3, position: 2,index:7, found: false },
    { letter: 'M', group: 3, position: 1,index:8, found: false },
    { letter: 'Y', group: 2, position: 5 ,index:9, found: false},
    { letter: 'S', group: 2, position: 4,index:10, found: false},
    { letter: 'I', group: 2, position: 3,index:11, found: false},
    { letter: 'I', group: 3, position: 4,index:12, found: false},
    { letter: 'G', group: 3, position: 5 ,index:13, found: false},
    { letter: 'O', group: 3, position: 6 ,index:14, found: false},
    { letter: 'L', group: 3, position: 7,index:15, found: false },
    { letter: 'D', group: 3, position: 8 ,index:16, found: false},
    { letter: 'D', group: 4, position: 1,index:17, found: false },
    { letter: 'F', group: 5, position: 1 ,index:18, found: false},
    { letter: 'A', group: 4, position: 6,index:19, found: false },
    { letter: 'I', group: 4, position: 5,index:20, found: false},
    { letter: 'L', group: 4, position: 4 ,index:21, found: false},
    { letter: 'H', group: 4, position: 3,index:22, found: false},
    { letter: 'A', group: 4, position: 2 ,index:23, found: false},
    { letter: 'U', group: 5, position: 2,index:24, found: false },
    { letter: 'C', group: 5, position: 3 ,index:25, found: false},
    { letter: 'H', group: 5, position: 4,index:26, found: false },
    { letter: 'S', group: 5, position: 5 ,index:27, found: false},
    { letter: 'I', group: 5, position: 6,index:28, found: false},
    { letter: 'A', group: 5, position: 7,index:29, found: false},
    { letter: 'F', group: 6, position: 1,index:30, found: false},
    { letter: 'L', group: 6, position: 2,index:31, found: false},
    { letter: 'O', group: 6, position: 3 ,index:32, found: false},
    { letter: 'W', group: 6, position: 4 ,index:33, found: false},
    { letter: 'E', group: 6, position: 5 ,index:34, found: false},
    { letter: 'R', group: 6, position: 6,index:35, found: false },
    { letter: 'P', group:7, position: 5,index:36, found: false},
    { letter: 'U', group: 7, position: 2 ,index:37, found: false},
    { letter: 'L', group: 7, position: 3 ,index:38, found: false},
    { letter: 'D', group: 8, position: 7,index:39, found: false},
    { letter: 'E', group: 8, position: 6 ,index:40, found: false},
    { letter: 'E', group: 8, position: 5,index:41, found: false },
    { letter: 'T', group: 7, position: 1,index:42, found: false},
    { letter: 'I', group: 7, position: 4 ,index:43, found: false},
    { letter: 'C', group:8, position: 1 ,index:44, found: false},
    { letter: 'U', group:8, position: 2,index:45, found: false },
    { letter: 'D', group:8, position: 3 ,index:46, found: false},
    { letter: 'W', group: 8, position: 4 ,index:47, found: false},
  ]);
  const [forceUpdateGrid, setForceUpdateGrid] = useState(false);
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

const submitWord = () => {
  const selectedWordIndexes = [...selectedLetters];
  const selectedWordLetters = selectedWordIndexes.map(
    (index) => gridContent[index].letter
  );

  for (let i = 0; i < gridContent.length; i++) {
    const wordGroup = [];
    let j = i;
    while (j < gridContent.length && gridContent[j].group === gridContent[i].group) {
      wordGroup.push(gridContent[j]);
      j++;
    }

   
    if (selectedWordIndexes.length === wordGroup.length) {
      const isMatch = selectedWordIndexes.every((index, idx) => {
        return gridContent[index].position === wordGroup[idx].position;
      });

      if (isMatch) {
        const foundWordIndexes = wordGroup.map((item) => item.index);
        const newGridContent = gridContent.map((item) => {
          if (foundWordIndexes.includes(item.index)) {
            return { ...item, found: true };
          }
          return item;
        });

        setGridContent(newGridContent);
        setFoundWords(foundWords + 1);
        setSelectedLetters([]);

        break;
      }
    }
  }
      setSelectedLetters([]);
};



  return (
    <main className="flex min-h-screen items-center p-24 flex-col">
      <div className="text-3xl font-bold mb-8">Strandimization</div>
      <div className="flex flex-col mb-8">
        <div className="font-bold mb-4 bg-blue-400">Your Theme
        <p>
           {theme}
        </p>
        </div>
        <div>
          {foundWords} of {maxGroup} theme words found
        </div>

        {selectedLetters.length>0 && (
                <div>
 {selectedLetters.map((index) => (
  <span key={index} className={ gridContent[index].found ? "bg-blue-200" : ""}>
    {gridContent[index] && gridContent[index].letter}
  </span>
))}
<div>
        <button 
  className="text-l font-bold mb-8 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out"
  onClick={submitWord}
>
  Submit
</button>
<button 
  className="text-l font-bold mb-8 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out"
  onClick={resetSelect}
>
  Reset
</button>
</div>
        </div>

        )}
      </div>
      <div
        ref={gridRef}
        className="grid grid-cols-6 grid-rows-8 gap-4"
        onMouseUp={handleMouseUp}
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
