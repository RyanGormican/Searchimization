import React, { useState, useEffect } from "react";

interface GridItem {
  letter: string;
  group: number;
  position: number;
  index: number;
  found: boolean;
}

// Define Props interface
interface Props {
  gridContent: GridItem[];
  foundWords: number;
  setFoundWords: React.Dispatch<React.SetStateAction<number>>;
  maxGroup: number;
  gridRef: React.RefObject<HTMLDivElement>;
  groupings: { group: string | null; letters: string; description: string; startIndex: number; endIndex: number }[];
}

const CrosswordPlay: React.FC<Props> = ({ gridContent, foundWords, setFoundWords, maxGroup, gridRef,  groupings }) => {
  // Define state for editing index and guessGrid
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
const [guessGrid, setGuessGrid] = useState<GridItem[]>(() =>
  gridContent.map((_, index) => ({
    letter: "", // Initialize letter as empty
    group: -1,
    position: -1,
    index,
    found: false
  }))
);

const calculateGroupings = () => {
  // Initialize counters for across and down groupings
  let acrossIndex = 1;
  let downIndex = 1;
  let found = 0;
  // Iterate over each row and column
  for (let i = 0; i < 10; i++) {
    let rowLetters = '';
    let colLetters = '';
    let rowStartIndex = -1;
    let colStartIndex = -1;
    let guessRowLetters = ''; 
    let guessColLetters = '';

    // Find letters in current row and column
    for (let j = 0; j < 10; j++) {
      const rowIndex = i * 10 + j;
      const colIndex = j * 10 + i;
      const rowLetter = gridContent[rowIndex].letter;
      const colLetter = gridContent[colIndex].letter;
      const guessRowLetter = guessGrid[rowIndex].letter;
      const guessColLetter = guessGrid[colIndex].letter;

      // Process row letters
      if (rowLetter.trim() !== '') {
        rowLetters += rowLetter;
        guessRowLetters+= guessRowLetter;
        if (rowStartIndex === -1) {
          rowStartIndex = rowIndex;
        }
      } else {
        // Check if current grouping is eligible
        if (rowLetters.length >= 1 && rowLetters === guessRowLetter) {
        found++;
        }
        rowLetters = ''; // Start a new grouping
        guessRowLetters='';
        rowStartIndex = -1;
      }

      // Process column letters
      if (colLetter.trim() !== '') {
        colLetters += colLetter;
        guessColLetters+= guessColLetter;
        if (colStartIndex === -1) {
          colStartIndex = colIndex;
        }
      } else {
        // Check if current grouping is eligible
        if (colLetters.length >= 1 && colLetters === guessColLetter) {
         found++;
        }
        colLetters = ''; // Start a new grouping
        guessColLetters='';
        colStartIndex = -1;
      }
    }

    // Check if last grouping is eligible
    if (rowLetters.length >= 1 && rowLetters === guessRowLetters) {
          found++;
    }
    if (colLetters.length >= 1 && colLetters === guessColLetters) {
       found++;
    }
  }

  setFoundWords(found);
};


  // Input change handler for grid cells
  const handleInputChange = (index: number, newLetter: string) => {
    setGuessGrid(prevGuessGrid => {
      const newGuessGrid = [...prevGuessGrid];
      newGuessGrid[index].letter = newLetter.toUpperCase();
      return newGuessGrid;
    });
  };

  // Blur handler for grid cells
  const handleInputBlur = () => {
    setEditingIndex(null);
  };

  // Click handler for grid cells
  const handleClick = (index: number) => {
    setEditingIndex(index);
  };

   useEffect(() => {
   calculateGroupings();
  }, [guessGrid]);
  return (
    <div>
      <div>
        <h2>
          <p className="items-center" style={{textAlign:'center'}}>
            {foundWords} of {maxGroup} theme words found
          </p>
        </h2>
      </div>
      <div className="flex mt-4">
        <div className="ml-4 flex-grow">
          {/* Table for Across groupings */}
          <h2>Across Groupings</h2>
          <table className="min-w-max w-full table-auto" style={{ marginBottom: "20px" }}>
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal" style={{ border: "1px solid black" }}>
                <th className="py-3 px-6 text-left" style={{ border: "1px solid black" }}>
                  Group
                </th>
                <th className="py-3 px-6 text-left" style={{ border: "1px solid black" }}>
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light" style={{ border: "1px solid black" }}>
            {groupings && groupings?.length > 0 && (
              <div>
              {groupings?.map(({ group, description }, index) => {
                if (group && group.startsWith("Across")) {
                  return (
                    <tr key={index}>
                      <td className="py-3 px-6 text-left whitespace-nowrap" style={{ border: "1px solid black" }}>
                        {group}
                      </td>
                      <td className="py-3 px-6 text-left" style={{ border: "1px solid black" }}>
                        {description}
                      </td>
                    </tr>
                  );
                }
                return null;
              })}
              </div>
              )}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-10 grid-rows-10 gap-4">
            {guessGrid && guessGrid?.length > 0 && (
            <div>
          {guessGrid?.map((gridItem, index) => (
            <div
      key={index}
      onClick={() => handleClick(index)}
      className={`${
        gridContent[index]?.letter === gridItem.letter ? "bg-blue-200" : ""
      }`}
      style={{
        border: "1px solid black",
        textAlign: "center",
        minWidth: "20px"
      }}
    >
              {editingIndex === index ? (
                <input
                  type="text"
                  value={gridItem.letter}
                  maxLength={1}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onBlur={handleInputBlur}
                  style={{ textTransform: "uppercase", width: "100%", height: "100%", border: "none", textAlign: "center" }} 
                  pattern="[A-Z]"
                  onKeyPress={(e) => {
                    const charCode = e.charCode;
                    if (charCode < 65 || charCode > 90) {
                      e.preventDefault();
                    }
                  }}
                />
              ) : (
                <div>{gridItem.letter}</div>
              )}
            </div>
          ))}
          </div>
          )}
        </div>
        <div className="ml-4 flex-grow">
          {/* Table for Down groupings */}
          <h2>Down Groupings</h2>
          <table className="min-w-max w-full table-auto" style={{ marginBottom: "20px" }}>
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal" style={{ border: "1px solid black" }}>
                <th className="py-3 px-6 text-left" style={{ border: "1px solid black" }}>
                  Group
                </th>
                <th className="py-3 px-6 text-left" style={{ border: "1px solid black" }}>
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light" style={{ border: "1px solid black" }}>
                {groupings && groupings?.length > 0 && (
                <div>
              {groupings?.map(({ group, description }, index) => {
                if (group && group.startsWith("Down")) {
                  return (
                    <tr key={index}>
                      <td className="py-3 px-6 text-left whitespace-nowrap" style={{ border: "1px solid black" }}>
                        {group}
                      </td>
                      <td className="py-3 px-6 text-left" style={{ border: "1px solid black" }}>
                        {description}
                      </td>
                    </tr>
                  );
                }
                return null;
              })}
              </div>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CrosswordPlay;
