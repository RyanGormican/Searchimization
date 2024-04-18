import React, { useState, useEffect } from 'react';
import {uploadPuzzle} from './Create';
interface GridContentItem {
  letter: string;
  group: number | null;
  position: number;
  index: number;
  found: boolean;
}

const Crossword = ({
  name,
  gridContent,
  gridRef,
  setGridContent,
  setName,
  username,
  createState,
}: {
  name: string;
  gridContent: GridContentItem[];
  gridRef: React.RefObject<HTMLDivElement>;
  setGridContent: React.Dispatch<React.SetStateAction<GridContentItem[]>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  createState: string | null;
}) => {
  // State for currently editing index
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // State for selected group
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  // State for selected letters
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);

  // State for groupings
  const [groupings, setGroupings] = useState<{ group: string | null; letters: string }[]>([]);

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

    // Find letters in current row and column
    gridContent.forEach(({ letter, index }) => {
      if (Math.floor(index / 10) === i) {
        if (letter.trim() !== '') {
          rowLetters += letter;
        } else {
          // Check if current grouping is eligible
          if (rowLetters.length >= 1) {
            rowGroupings.push({ group: `Across ${acrossIndex}`, description: '', letters: rowLetters });
            acrossIndex++;
          }
          rowLetters = ''; // Start a new grouping
        }
      }
      if (index % 10 === i) {
        if (letter.trim() !== '') {
          colLetters += letter;
        } else {
          // Check if current grouping is eligible
          if (colLetters.length >= 1) {
            colGroupings.push({ group: `Down ${downIndex}`, description: '', letters: colLetters });
            downIndex++;
          }
          colLetters = ''; // Start a new grouping
        }
      }
    });

    // Check if last grouping is eligible
    if (rowLetters.length >= 1) {
      rowGroupings.push({ group: `Across ${acrossIndex}`, description: '', letters: rowLetters });
      acrossIndex++;
    }
    if (colLetters.length >= 1) {
      colGroupings.push({ group: `Down ${downIndex}`, description: '', letters: colLetters });
      downIndex++;
    }
  }

  // Update groupings state
  setGroupings([...rowGroupings, ...colGroupings]);
};




  // Click handler for grid cells
  const handleClick = (index: number) => {
    if (selectedGroup === null) {
      setEditingIndex(index);
    } else {
      if (!selectedLetters.includes(index)) {
        setSelectedLetters([...selectedLetters, index]);
      }
    }
  };
  // Add group handler
const handleAddGroup = () => {
  const maxGroup = Math.max(...groupings.map(({ group }) => group));
  const newGroup = maxGroup + 1;
  setGroupings((prevGroupings) => [
    ...prevGroupings,
    { group: newGroup, letters: '' }
  ]);
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

  // Group click handler
  const handleGroupClick = (index: number) => {
    if (selectedGroup === index) {
      setSelectedGroup(null);
      setSelectedLetters([]);
    } else {
      setSelectedGroup(index);
      setSelectedLetters([]);
    }
  };

  return (
    <div className="flex items-center flex-col">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex mt-4">
        <div ref={gridRef} className="grid grid-cols-10 grid-rows-10 gap-4">
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
      </div>
      <div className="ml-4">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal" style={{ border: '1px solid black' }}>
              <th className="py-3 px-6 text-left" style={{ border: '1px solid black' }}>Group</th>
              <th className="py-3 px-6 text-left" style={{ border: '1px solid black' }}>Word</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light" style={{ border: '1px solid black' }}>
            {groupings.map(({ group, letters }, index) => (
              <tr
                key={index}
                className={selectedGroup === index ? 'selected-group' : 'group'}
                onClick={() => handleGroupClick(index)}
              >
                <td className={`py-3 px-6 text-left whitespace-nowrap ${selectedGroup === index ? 'selected-group' : 'group'}`}>{group || '-'}</td>
                <td className={`py-3 px-6 text-left ${selectedGroup === index ? 'selected-group' : 'group'}`}>{letters}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex">
       <button className="py-2 px-4 bg-blue-500 text-white rounded" onClick={() => uploadPuzzle(gridContent,username,createState,name)}>
  Upload
</button>
    </div>
    </div>
  );
};

export default Crossword;
