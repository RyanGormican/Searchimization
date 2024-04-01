import '/src/app/globals.css';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { auth, firestore } from '../src/app/firebase';


import { signOut  } from 'firebase/auth';
import { useRouter } from 'next/router';
import {
  collection,
  addDoc,
  setDoc,
  doc,
} from 'firebase/firestore';
const Create = () => {
  const gridRef = useRef(null);
  const [gridContent, setGridContent] = useState([]);
  const [name, setName] = useState('My Puzzle');
  const [groupings, setGroupings] = useState([]);
  const [groupColors, setGroupColors] = useState([]); 
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedLetters, setSelectedLetters] = useState([]);
   const router = useRouter();
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
   const handleLogout = () => {
    signOut(auth);
  };
  const user=auth.currentUser;
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
    if (selectedGroup === null) {
      setEditingIndex(index);
    } else {
      if (!selectedLetters.includes(index)) {
        setSelectedLetters([...selectedLetters, index]);
      }
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


    setGroupColors(prevColors => [...prevColors, '#ADD8E6']); 
  };

  const handleGroupClick = (index) => {
    if (selectedGroup === index) {
      setSelectedGroup(null);
      setSelectedLetters([]);
    } else {
      setSelectedGroup(index);
      setSelectedLetters([]);
    }
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
      } else {

        router.push('/'); 
      }
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    initializeGridContent();

  }, []);

  useEffect(() => {
    calculateGroupings();
  }, [gridContent]);

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

  const handleColorChange = (groupIndex, newColor) => {
    setGroupColors((prevColors) => {
      const updatedColors = [...prevColors];
      updatedColors[groupIndex] = newColor;
      return updatedColors;
    });
  };
  const uploadPuzzle = async () => {
    try {
     
      const puzzleListRef = await  addDoc(collection(firestore, 'puzzleList'), {
        theme: name,
        userName: '',
        user:auth.currentUser.uid, 
        likes: 0,
        plays: 0,
        finishes: 0,
        timecreated: new Date().toISOString(), 
      });

   
      await setDoc(doc(firestore, 'puzzle', puzzleListRef.id), {
        gridContent: gridContent,
      });
          router.push('/Puzzles'); 
    } catch (error) {

      console.error('Error uploading puzzle:', error);
    }

  };

  return (
    <main className="flex min-h-screen items-center p-12 flex-col">
        <Link href="/">
      <div className="text-3xl font-bold mb-4">Searchimization</div>
      </Link>
      <div className="links">
        <a href="https://www.linkedin.com/in/ryangormican/">
          <Icon icon="mdi:linkedin" color="#0e76a8" width="60" />
        </a>
        <a href="https://github.com/RyanGormican/Searchimization">
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
       
     <div className="logout">
                <Icon  onClick={handleLogout}icon="material-symbols:logout" height="60" />
            </div>
   
   
   <div>
  <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
</div>

         <div  style={{ minHeight:"50px",maxHeight: "50px" }}>
        {selectedLetters.length > 0 && (
          <div>
            {selectedLetters.map((index) => (
              <span
                key={index}
             
              >
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
  {gridContent.map(({ letter, group, position, index }) => (
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
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal" style={{border:'1px solid black'}}>
                <th className="py-3 px-6 text-left" style={{border:'1px solid black'}}>Group</th>
                <th className="py-3 px-6 text-left"  style={{border:'1px solid black'}}>Color</th>
                <th className="py-3 px-6 text-left"  style={{border:'1px solid black'}}>Word</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light" style={{border:'1px solid black'}}>
             {groupings.map(({ group, letters,color  }, index) => (
  <tr
    key={group}
    className={selectedGroup === index ? 'selected-group' : 'group'}
    onClick={() => handleGroupClick(index)}
  >
    <td className="py-3 px-6 text-left whitespace-nowrap"   className={selectedGroup === index ? 'selected-group' : 'group'}>{group}</td>
     <td className="py-3 px-6 text-left">
      <input
        type="color"
        value={groupColors[index]}
        onChange={(e) => handleColorChange(index, e.target.value)}
      />
    </td>
    <td className="py-3 px-6 text-left"   className={selectedGroup === index ? 'selected-group' : 'group'}>{letters}</td>
  </tr>
))}

            </tbody>
            
          </table>
            <button className="py-2 px-4 bg-blue-500 text-white rounded" onClick={handleAddGroup}>
        Add Group
      </button>
           <button className="py-2 px-4 bg-blue-500 text-white rounded" onClick={uploadPuzzle}>
   Upload 
      </button>
        </div>
    </main>
  );
};

export default Create;
