import React, { useState } from "react";

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
  foundIndexes: number;
  setFoundWords: React.Dispatch<React.SetStateAction<number>>;
  setFoundIndexes: React.Dispatch<React.SetStateAction<number>>;
  maxGroup: number;
  gridRef: React.RefObject<HTMLDivElement>;
  groupings: { group: string | null; letters: string; description: string; startIndex: number; endIndex: number }[];
}

const CrosswordPlay: React.FC<Props> = ({ gridContent, foundWords, setFoundWords, maxGroup, gridRef, foundIndexes, setFoundIndexes, groupings }) => {
  // Define state for editing index and guessGrid
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [guessGrid, setGuessGrid] = useState<GridItem[]>(() =>
    Array.from({ length: 100 }, (_, index) => ({
      letter: "", // Initialize letter as empty
      group: -1,
      position: -1,
      index,
      found: false
    }))
  );

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

  return (
    <div>
      <div>
        <h2>
          <p>
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
              {groupings.map(({ group, description }, index) => {
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
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-10 grid-rows-10 gap-4">
          {guessGrid.map((gridItem, index) => (
            <div
              key={index}
              onClick={() => handleClick(index)}
              style={{ border: "1px solid black", textAlign: "center", minWidth: "20px" }} 
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
              {groupings.map(({ group, description }, index) => {
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CrosswordPlay;
