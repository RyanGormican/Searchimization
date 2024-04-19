import '/src/app/globals.css';
import { useState, useRef, useEffect } from "react";
interface GridItem {
  letter: string;
  group: number;
  position: number;
  index: number;
  found: boolean;
}
interface Props {
  gridContent: GridItem[];
  foundWords: number;
  foundIndexes: { index: number }[];
  setFoundWords: React.Dispatch<React.SetStateAction<number>>;
 setFoundIndexes: React.Dispatch<React.SetStateAction<{ index: number }[]>>;
  maxGroup: number;
  gridRef: React.RefObject<HTMLDivElement>;
}

const WordSearchPlay: React.FC<Props> = ({ gridContent, foundWords, setFoundWords, maxGroup, gridRef ,foundIndexes,setFoundIndexes}) => {
const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
 const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
 // Event handler for clicking grid cells
  const handleClick = (index: number) => {
    if (!selectedLetters.includes(index)) {
      setSelectedLetters([...selectedLetters, index]);
    }
  };
    // Event handler for mouse up
  const handleMouseUp = () => {
    setIsMouseDown(false);
  };
  // Function to submit a word
  const submitWord = () => {
    const selectedWordIndexes = [...selectedLetters];

    // Iterate through each grid item to find the selected word
    for (let i = 0; i < gridContent.length; i++) {
      const wordGroup: GridItem[] = [];
      let j = i;
      while (j < gridContent.length && gridContent[j].group === gridContent[i].group) {
        wordGroup.push(gridContent[j]);
        j++;
      }

      // Group indexes for each group
      const groupIndexes: { [key: number]: number[] } = {};
      gridContent.forEach(({ group, index, position }) => {
        if (!groupIndexes[group]) {
          groupIndexes[group] = [];
        }
        groupIndexes[group].push(index);
      });

      // Sort group indexes by position
      for (const group in groupIndexes) {
        groupIndexes[group].sort((a, b) => {
          const posA = gridContent.find(item => item.index === a)?.position ?? 0;
          const posB = gridContent.find(item => item.index === b)?.position ?? 0;
          return posA - posB;
        });
      }

      // Check if the selected word matches any group
      for (const group in groupIndexes) {
        const groupIndex = groupIndexes[group];

        if (
          selectedWordIndexes.length === groupIndex.length &&
          JSON.stringify(selectedWordIndexes) === JSON.stringify(groupIndex) &&
          !wordGroup.some((item) => item.found) &&
          !selectedWordIndexes.some((index) => foundIndexes.includes(index))
        ) {
          const foundWordIndexes = selectedWordIndexes.map((index) => gridContent[index].index);
          setFoundIndexes([...foundIndexes, ...foundWordIndexes]);
          setFoundWords(foundWords + 1);
          setSelectedLetters([]);
          return;
        }
      }
    }
    setSelectedLetters([]);
  };

  // Function to reset selected letters
  const resetSelect = () => {
    setSelectedLetters([]);
  };

return (
    <div>
        <div>
          <h2>
            <p>{foundWords} of {maxGroup} theme words found</p>
          </h2>
          <div style={{ minHeight: "75px", maxHeight: "75px" }}>
            {selectedLetters.length > 0 && (
              <div>
                {selectedLetters.map((index) => (
                  <span key={index} className={foundIndexes.includes(index) ? "bg-blue-200" : ""}>
                    {gridContent[index].letter}
                  </span>
                ))}
                <div>
                  <button className="text-l font-bold mb-8 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out" onClick={submitWord}>
                    Submit
                  </button>
                  <button className="text-l font-bold mb-8 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out" onClick={resetSelect}>
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
         <div ref={gridRef} className="grid grid-cols-6 grid-rows-8 gap-4" onMouseUp={handleMouseUp}>
        {gridContent.map(({ letter, group, position, index }) => (
          <div
            key={index}
            className={` ${selectedLetters.includes(index) ? "bg-gray-500" : ""}`}
            onClick={() => handleClick(index)}
          >
            <div className={foundIndexes.includes(index) ? "bg-blue-200" : ""}>
              {letter}
            </div>
          </div>
        ))}
      </div>
      </div>
      );
};
export default WordSearchPlay;
