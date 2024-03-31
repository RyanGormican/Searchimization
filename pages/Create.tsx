import React, { useState, useRef, useEffect } from 'react';
import '/src/app/globals.css';
import Link from 'next/link';
import { Icon } from '@iconify/react';

const Create = () => {
  const gridRef = useRef(null);
  const [gridContent, setGridContent] = useState([]);
  const [groupings, setGroupings] = useState([]);
const [editingIndex, setEditingIndex] = useState(null);
const [selectedGroup, setSelectedGroup] = useState(null);

  const initializeGridContent = () => {
   const newGridContent = Array.from({ length: 48 }, (_, index) => ({
      letter: 'A',
      group: 1, 
      position: 1,
      index,
      found: false
    }));
    setGridContent(newGridContent);
  };

 const calculateGroupings = () => {
  const sortedGridContent = [...gridContent].sort((a, b) => a.position - b.position);
  const groups = {};

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

  setGroupings(groupList);
};

const handleClick = (index) => {
console.log(selectedGroup);
  if (selectedGroup === null) {
  setEditingIndex(index);
  }
};
const handleInputChange = (index, newLetter) => {

if (newLetter.trim() === '') {
    return;
  }
  setGridContent((prevGridContent) => {
    const newGridContent = [...prevGridContent];
    newGridContent[index].letter = newLetter.toUpperCase();
    return newGridContent;
  });
};

const handleInputBlur = (index) => {
  setEditingIndex(null);
};

const handleAddGroup = () => {
  const maxGroup = Math.max(...groupings.map(({ group }) => group));
  const newGroup = maxGroup + 1;
  setGroupings(prevGroupings => [
    ...prevGroupings,
    { group: newGroup, letters: '' }
  ]);
};
const handleGroupClick = (index) => {
  if (selectedGroup === index) {
    setSelectedGroup(null);
  } else {
    setSelectedGroup(index);
  }
};

  useEffect(() => {
    initializeGridContent();
  }, []);
  useEffect(() => {
  calculateGroupings();
}, [gridContent]);
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
      <div className="flex mt-4">
        <div ref={gridRef} className="grid grid-cols-6 grid-rows-8 gap-4">
      {gridContent.map(({ letter, group, position, index }) => (
  <div key={index} onClick={() => handleClick(index)}>
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
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal" style={{border:'1px solid black'}}>
                <th className="py-3 px-6 text-left" style={{border:'1px solid black'}}>Group</th>
                <th className="py-3 px-6 text-left">Word</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light" style={{border:'1px solid black'}}>
             {groupings.map(({ group, letters }, index) => (
  <tr
    key={group}
    className={selectedGroup === index ? 'selected-group' : 'group'}
    onClick={() => handleGroupClick(index)}
  >
    <td className="py-3 px-6 text-left whitespace-nowrap"   className={selectedGroup === index ? 'selected-group' : 'group'}>{group}</td>
    <td className="py-3 px-6 text-left"   className={selectedGroup === index ? 'selected-group' : 'group'}>{letters}</td>
  </tr>
))}

            </tbody>
            
          </table>
            <button className="py-2 px-4 bg-blue-500 text-white rounded" onClick={handleAddGroup}>
        Add Group
      </button>
        </div>
    </main>
  );
};

export default Create;
