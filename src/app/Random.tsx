import { useState, useEffect } from "react";
import { auth, firestore } from './firebase';
import { getDocs, collection, query, where, limit, doc, getDoc } from 'firebase/firestore';


export const playRandom = async () => {
  try {
    // Fetch the count document
    const countDocRef = doc(firestore, 'count', 'DocumentCount');
    const countDocSnap = await getDoc(countDocRef);
    const countData = countDocSnap.data();

    // Extract the documentCount
    const documentCount = countData?.documentCount;

    if (!documentCount) {
      throw new Error('Document count not available.');
    }

    // Generate a random number between 1 and documentCount
    const randomNum = Math.floor(Math.random() * documentCount) + 1;

    // Query to fetch the puzzle document with the generated random ID
    const puzzleQuery = query(collection(firestore, 'puzzles'), where('id', '==', randomNum), limit(1));
    const puzzleQuerySnapshot = await getDocs(puzzleQuery);

    if (puzzleQuerySnapshot.empty) {
      throw new Error(`Puzzle document with ID ${randomNum} not found.`);
    }

    // Extract the document ID from the fetched puzzle document
    const puzzleDocSnapshot = puzzleQuerySnapshot.docs[0];
    const puzzleId = puzzleDocSnapshot.id;

    // Redirect user to the "/Play/documentid" route
    window.location.href = `/Play/${puzzleId}`;
  } catch (error) {
    console.error('Error playing random puzzle:', error);
    // Handle error, e.g., display error message to the user
  }
};
