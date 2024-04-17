import '/src/app/globals.css';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, firestore } from '../src/app/firebase';
import { User } from 'firebase/auth';
import { collection, addDoc, updateDoc, doc,getDoc } from 'firebase/firestore';
import Header from '../src/app/Header';
import WordSearch from './WordSearch';

const Create = () => {
  // Ref for the grid
  const gridRef = useRef(null);

 // State for grid content
  const [gridContent, setGridContent] = useState<{ letter: string; group: number; position: number; index: number; found: boolean; }[]>([]);

  // State for puzzle name
  const [name, setName] = useState('My Puzzle');
  
  // State for username
  const [username, setUsername] = useState('');

  // State of user
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const router = useRouter();

// State for puzzle type
const [createState, setCreateState] = useState<string | null>(null);




  // Effect for checking authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
        const storageData = JSON.parse(localStorage.getItem('searchimization') || '{}');
        setUsername(storageData.profile.username);
      } else {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, []);

  // Function to set createState based on puzzle type
const handlePuzzleTypeClick = (type: string | null) => {
  setCreateState(type);
};

  return (
    <main className="flex min-h-screen items-center p-12 flex-col">
      <Header currentUser={currentUser} />

      {createState === null && (
        <div className="flex">
          <button
            className="py-6 px-12 bg-blue-500 hover:bg-blue-700 text-white rounded-lg text-2xl mr-4"
            onClick={() => handlePuzzleTypeClick('wordsearch')}
          >
            WORD SEARCH
            <div className="grid grid-cols-6 grid-rows-8 mt-4">
                {Array.from({ length: 48 }).map((_, index) => (
                  <div key={index} className="flex justify-center items-center w-10 h-10 border border-gray-300">
                    A
                  </div>
                ))}
              </div>
          </button>
          <button
            className="py-6 px-12 bg-blue-500 hover:bg-blue-700 text-white rounded-lg text-2xl mr-4"
            onClick={() => handlePuzzleTypeClick('crossword')}
          >
           CROSSWORD (WIP)
          </button>
        </div>
      )}

      {createState === 'wordsearch' && (
        <WordSearch name={name} gridContent={gridContent} gridRef={gridRef} setGridContent={setGridContent} username={username} createState={createState} />
      )}

      {createState === 'crossword' && (
      <div> </div>
      )}
    </main>
  );
};


export default Create;

export const uploadPuzzle = async (gridContent,username,createState,name) => {
  try {
    // Fetch document from 'count' collection
    const countDocRef = doc(firestore, 'count', 'DocumentCount');
    const countDocSnap = await getDoc(countDocRef);

    if (!countDocSnap.exists()) {
      throw new Error('Count document does not exist.');
    }
    const countData = countDocSnap.data();

    // Extract values from count document
    let { puzzleCount, documentCount } = countData;

    // Increment values
    const updatedPuzzleCount = puzzleCount + 1;
    const updatedDocumentCount = documentCount + 1;

    // Construct the puzzle object
    const puzzleData = {
      theme: name,
      gridContent: gridContent,
      userName: username,
      user: auth.currentUser ? auth.currentUser.uid : '',
      likes: 0,
      plays: 0,
      finishes: 0,
      height:8,
      width:6,
      timecreated: new Date().toISOString(),
      lastupdated: new Date().toISOString(),
      type: createState,
      id: updatedPuzzleCount 
    };

    // Add puzzle data to 'puzzles' collection
    await addDoc(collection(firestore, 'puzzles'), puzzleData);

    // Update count document with incremented values
    await updateDoc(countDocRef, {
      puzzleCount: updatedPuzzleCount,
      documentCount: updatedDocumentCount
    });

    window.location.href = `/Puzzles`;
  } catch (error) {
    console.error('Error uploading puzzle:', error);
    // Handle error, e.g., display error message to the user
  }
};