'use client'

import { useState, useEffect } from 'react';

const words = [
    { word: "แมว", image: "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg" },
    { word: "หมา", image: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg" },
    // เพิ่มคำและรูปภาพตามต้องการ
];

export default function Home() {
    const [currentWord, setCurrentWord] = useState(null);
    const [guessedWord, setGuessedWord] = useState([]);
    const [score, setScore] = useState(0);
    const [availableLetters, setAvailableLetters] = useState([]);

    useEffect(() => {
        nextWord();
    }, []);

    const nextWord = () => {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setCurrentWord(randomWord);
        setGuessedWord(Array(randomWord.word.length).fill(''));
        setAvailableLetters(randomWord.word.split('').sort(() => Math.random() - 0.5));
    };

    const handleDrop = (letter, index) => {
        const newGuessedWord = [...guessedWord];
        newGuessedWord[index] = letter;
        setGuessedWord(newGuessedWord);

        if (newGuessedWord.join('') === currentWord.word) {
            setScore(score + 100);
            setTimeout(nextWord, 1000);
        }
    };

    const handleDragStart = (e, letter) => {
        e.dataTransfer.setData('text/plain', letter);
    };

    if (!currentWord) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">เกมทายคำจากภาพ</h1>
            <p className="mb-4">คะแนน: {score}</p>
            <div className="mb-4">
                <img src={currentWord.image} alt="Guess the word" width={300} height={300} />
            </div>
            <div className="flex mb-4">
                {guessedWord.map((letter, index) => (
                    <div
                        key={index}
                        className="w-10 h-10 border border-gray-300 flex items-center justify-center m-1"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            handleDrop(e.dataTransfer.getData('text/plain'), index);
                        }}
                    >
                        {letter}
                    </div>
                ))}
            </div>
            <div className="flex">
                {availableLetters.map((letter, index) => (
                    <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, letter)}
                        className="w-10 h-10 border border-gray-300 flex items-center justify-center m-1 cursor-move"
                    >
                        {letter}
                    </div>
                ))}
            </div>
        </div>
    );
}