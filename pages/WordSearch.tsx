import '/src/app/globals.css';
import React, { useState, useRef, useEffect } from 'react';
import {uploadPuzzle} from './Create';
import { Icon } from '@iconify/react';
import HelpModal from '../src/app/HelpModal';
interface GridContentItem {
  letter: string;
  group: number;
  position: number;
  index: number;
  found: boolean;
}

const WordSearch = ({
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

 // State for groupings
  const [groupings, setGroupings] = useState<{ group: number; letters: string; color: string; }[]>([]);

  // State for group colors
  const [groupColors, setGroupColors] = useState<string[]>([]);

  // State for currently editing index
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // State for selected group
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  // State for selected letters
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
  // State for Modal
    const [helpModal, setHelpModal] = useState(false);

  // Calculate groupings
  useEffect(() => {
    calculateGroupings();
  }, []);
 // Calculate groupings whenever grid content changes
  useEffect(() => {
    calculateGroupings();
  }, [gridContent]);
  // Submit word handler
  const submitWord = () => {
    if (selectedLetters.length === 0 || selectedGroup === null) {
      return;
    }
    const newGridContent = [...gridContent];
    selectedLetters.forEach((index) => {
      newGridContent[index].group = selectedGroup + 1;
    });

    const groupIndices = selectedLetters.map((index) => newGridContent[index]);
    groupIndices.sort((a, b) => a.position - b.position);
    groupIndices.forEach((letter, index) => {
      letter.position = index + 1;
    });

    setGridContent(newGridContent);
    setSelectedLetters([]);
    setSelectedGroup(null);
  };

  // Color change handler for groups
  const handleColorChange = (groupIndex: number, newColor: string) => {
    setGroupColors((prevColors) => {
      const updatedColors = [...prevColors];
      updatedColors[groupIndex] = newColor;
      return updatedColors;
    });
  };
  
    // Calculate groupings based on grid content
const calculateGroupings = () => {
  const sortedGridContent = [...gridContent].sort((a, b) => a.position - b.position);
  const groups: { [key: number]: string[] } = {};

  sortedGridContent.forEach(({ letter, group }) => {
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(letter);
  });

  const groupList = Object.entries(groups).map(([group, letters]) => ({
    group: parseInt(group),
    letters: letters.join(''),
  }));

  setGroupings(prevGroupings => groupList.map(group => ({ ...group, color: '' })));
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

  // Input change handler for grid cells
  const handleInputChange = (index: number, newLetter: string) => {
    if (newLetter.trim() === '') {
      return;
    }
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

  // Add group handler
  const handleAddGroup = () => {
    const maxGroup = Math.max(...groupings.map(({ group }) => group));
    const newGroup = maxGroup + 1;
    setGroupings(prevGroupings => [
      ...prevGroupings.map(group => ({ ...group, color: '' })),
      { group: newGroup, letters: '', color: '' }
    ]);
    setGroupColors(prevColors => [...prevColors, '#ADD8E6']); 
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
     <Icon icon="ph:question" width="30" onClick={() => setHelpModal(!helpModal)} />
   {helpModal &&
   <HelpModal type="WordSearchCreate" setHelpModal={setHelpModal} helpModal={helpModal}/>
   }
      <div style={{ minHeight: "50px", maxHeight: "50px" }}>
        {selectedLetters?.length > 0 && (
          <div>
            {selectedLetters?.map((index) => (
              <span key={index}>
                {gridContent[index].letter}
              </span>
            ))}
            <div>
              <button
                className="text-l font-bold mb-8 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out"
                onClick={submitWord}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex mt-4">
        <div ref={gridRef} className="grid grid-cols-6 grid-rows-8 gap-4">
          {gridContent && gridContent?.map(({ letter, group, position, index }) => (
            <div
              key={index}
              onClick={() => handleClick(index)}
              style={{ backgroundColor: groupColors[group - 1] }} // Set background color based on group
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
              <th className="py-3 px-6 text-left" style={{ border: '1px solid black' }}>Color</th>
              <th className="py-3 px-6 text-left" style={{ border: '1px solid black' }}>Word</th>
            </tr>
          </thead>
 <tbody className="text-gray-600 text-sm font-light" style={{ border: '1px solid black' }}>
  {groupings && groupings?.map(({ group, letters, color }, index) => (
    <tr
      key={group}
      className={selectedGroup === index ? 'selected-group' : 'group'}
      onClick={() => handleGroupClick(index)}
    >
      <td className={`py-3 px-6 text-left whitespace-nowrap ${selectedGroup === index ? 'selected-group' : 'group'}`}>{group}</td>
      <td className="py-3 px-6 text-left">
        <input
          type="color"
          value={groupColors[index]}
          onChange={(e) => handleColorChange(index, e.target.value)}
        />
      </td>
      <td className={`py-3 px-6 text-left ${selectedGroup === index ? 'selected-group' : 'group'}`}>{letters}</td>
    </tr>
  ))}
</tbody>




        </table>
        <button className="py-2 px-4 bg-blue-500 text-white rounded" onClick={handleAddGroup}>
          Add Group
        </button>
     <button className="py-2 px-4 bg-blue-500 text-white rounded" onClick={() => {

  const dummyGroupings = groupings.map(({ group }) => ({
    group: group.toString(),
    letters: '',
    description: '',
    startIndex: 0,
    endIndex: 0,
  }));
  uploadPuzzle(gridContent, username, createState, name, dummyGroupings);
}}>
  Upload
</button>


      </div>
    </div>
  );
};

export default WordSearch;
