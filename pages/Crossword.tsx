import React, { useState, useEffect } from 'react';
import { uploadPuzzle } from './Create';

interface GridContentItem {
  letter: string;
  group: number;
  position: number;
  index: number;
  found: boolean;
}

interface Props {
  name: string;
  gridContent: GridContentItem[];
  gridRef: React.RefObject<HTMLDivElement>;
  setGridContent: React.Dispatch<React.SetStateAction<GridContentItem[]>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  createState: string | null;
}

const Crossword: React.FC<Props> = ({
  name,
  gridContent,
  gridRef,
  setGridContent,
  setName,
  username,
  createState,
}: Props) => {
  // State for currently editing index
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // State for groupings
  const [groupings, setGroupings] = useState<{ group: string | null; letters: string; description: string; startIndex: number; endIndex: number }[]>([]);

  // Calculate groupings based on grid content
  useEffect(() => {
    calculateGroupings();
  }, [gridContent]);

const calculateGroupings = () => {
  const rowGroupings = [];
  const colGroupings = [];

  // Initialize counters for across and down groupings
  let acrossIndex = 1;
  let downIndex = 1;

  // Iterate over each row and column
  for (let i = 0; i < 10; i++) {
    let rowLetters = '';
    let colLetters = '';
    let rowStartIndex = -1;
    let colStartIndex = -1;

    // Find letters in current row and column
    for (let j = 0; j < 10; j++) {
      const rowIndex = i * 10 + j;
      const colIndex = j * 10 + i;
      const rowLetter = gridContent[rowIndex].letter;
      const colLetter = gridContent[colIndex].letter;

      // Process row letters
      if (rowLetter.trim() !== '') {
        rowLetters += rowLetter;
        if (rowStartIndex === -1) {
          rowStartIndex = rowIndex;
        }
      } else {
        // Check if current grouping is eligible
        if (rowLetters.length >= 1) {
          rowGroupings.push({
            group: `Across ${acrossIndex}`,
            description: '',
            letters: rowLetters,
            startIndex: rowStartIndex,
            endIndex: rowIndex - 1,
          });
          acrossIndex++;
        }
        rowLetters = ''; // Start a new grouping
        rowStartIndex = -1;
      }

      // Process column letters
      if (colLetter.trim() !== '') {
        colLetters += colLetter;
        if (colStartIndex === -1) {
          colStartIndex = colIndex;
        }
      } else {
        // Check if current grouping is eligible
        if (colLetters.length >= 1) {
          colGroupings.push({
            group: `Down ${downIndex}`,
            description: '',
            letters: colLetters,
            startIndex: colStartIndex,
            endIndex: colIndex - 10,
          });
          downIndex++;
        }
        colLetters = ''; // Start a new grouping
        colStartIndex = -1;
      }
    }

    // Check if last grouping is eligible
    if (rowLetters.length >= 1) {
      const lastRowIndex = (i + 1) * 10 - 1;
      rowGroupings.push({
        group: `Across ${acrossIndex}`,
        description: '',
        letters: rowLetters,
        startIndex: rowStartIndex,
        endIndex: lastRowIndex,
      });
      acrossIndex++;
    }
    if (colLetters.length >= 1) {
      const lastColIndex = 90 + i;
      colGroupings.push({
        group: `Down ${downIndex}`,
        description: '',
        letters: colLetters,
        startIndex: colStartIndex,
        endIndex: lastColIndex,
      });
      downIndex++;
    }
  }

  // Update groupings state
  setGroupings([...rowGroupings, ...colGroupings]);
};




  const handleDescriptionChange = (index: number, newDescription: string) => {
    const updatedGroupings = [...groupings];
    updatedGroupings[index].description = newDescription;
    setGroupings(updatedGroupings);
  };

  // Input change handler for grid cells
  const handleInputChange = (index: number, newLetter: string) => {
    setGridContent((prevGridContent) => {
      const newGridContent = [...prevGridContent];
      newGridContent[index].letter = newLetter.toUpperCase();
      return newGridContent;
    });
  };

  // Blur handler for grid cells
  const handleInputBlur = (index: number) => {
    setEditingIndex(null);
  };

  // Click handler for grid cells
  const handleClick = (index: number) => {
    setEditingIndex(index);
  };

  return (
    <div className="flex items-center flex-col">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex mt-4">
        <div className="ml-4 flex-grow">
          {/* Table for Across groupings */}
          <h2>Across Groupings</h2>
          <table className="min-w-max w-full table-auto" style={{ marginBottom: '20px' }}>
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal" style={{ border: '1px solid black' }}>
                <th className="py-3 px-6 text-left" style={{ border: '1px solid black' }}>Group</th>
                <th className="py-3 px-6 text-left" style={{ border: '1px solid black' }}>Word</th>
                <th className="py-3 px-6 text-left" style={{ border: '1px solid black' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light" style={{ border: '1px solid black' }}>
              {groupings.map(({ group, letters, description }, index) => {
                if (group && group.startsWith('Across')) {
                  return (
                    <tr key={index}>
                      <td className="py-3 px-6 text-left whitespace-nowrap" style={{ border: '1px solid black' }}>{group}</td>
                      <td className="py-3 px-6 text-left" style={{ border: '1px solid black' }}>{letters}</td>
                      <td className="py-3 px-6 text-left" style={{ border: '1px solid black' }}>
                        <input
                          type="text"
                          value={description}
                          onChange={(e) => handleDescriptionChange(index, e.target.value)}
                        />
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
          {gridContent && gridContent.map(({ letter, group, position, index }) => (
            <div
              key={index}
              onClick={() => handleClick(index)}
            >
              {editingIndex === index ? (
                <input
                  type="text"
                  value={letter}
                  maxLength={1}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onBlur={() => handleInputBlur(index)}
                  style={{ textTransform: 'uppercase' }}
                  pattern="[A-Z]"
                  onKeyPress={(e) => {
                    const charCode = e.charCode;
                    if (charCode < 65 || charCode > 90) {
                      e.preventDefault();
                    }
                  }}
                />
              ) : (
                <div>{letter}</div>
              )}
            </div>
          ))}
        </div>
        <div className="ml-4 flex-grow">
          {/* Table for Down groupings */}
          <h2>Down Groupings</h2>
          <table className="min-w-max w-full table-auto" style={{ marginBottom: '20px' }}>
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal" style={{ border: '1px solid black' }}>
                <th className="py-3 px-6 text-left" style={{ border: '1px solid black' }}>Group</th>
                <th className="py-3 px-6 text-left" style={{ border: '1px solid black' }}>Word</th>
                <th className="py-3 px-6 text-left" style={{ border: '1px solid black' }}>Description</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light" style={{ border: '1px solid black' }}>
              {groupings.map(({ group, letters, description }, index) => {
                if (group && group.startsWith('Down')) {
                  return (
                    <tr key={index}>
                      <td className="py-3 px-6 text-left whitespace-nowrap" style={{ border: '1px solid black' }}>{group}</td>
                      <td className="py-3 px-6 text-left" style={{ border: '1px solid black' }}>{letters}</td>
                      <td className="py-3 px-6 text-left" style={{ border: '1px solid black' }}>
                        <input
                          type="text"
                          value={description}
                          onChange={(e) => handleDescriptionChange(index, e.target.value)}
                        />
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
      <div className="flex">
        <button className="py-2 px-4 bg-blue-500 text-white rounded" onClick={() => uploadPuzzle(gridContent, username, createState, name,groupings)}>
          Upload
        </button>
      </div>
    </div>
  );
};

export default Crossword;
