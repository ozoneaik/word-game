'use client'

import { useState, useEffect } from 'react';

const words = [
    { word: "แมว", image: "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg" },
    { word: "หมา", image: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg" },
    // เพิ่มคำและรูปภาพตามต้องการ
];

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    score: {
        marginBottom: '20px',
    },
    image: {
        width: '300px',
        height: '300px',
        objectFit: 'cover',
        marginBottom: '20px',
    },
    letterContainer: {
        display: 'flex',
        marginBottom: '20px',
    },
    letter: {
        width: '40px',
        height: '40px',
        border: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 5px',
        cursor: 'move',
    },
};

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
        <div style={styles.container}>
            <h1 style={styles.title}>เกมทายคำจากภาพ</h1>
            <p style={styles.score}>คะแนน: {score}</p>
            <div>
                <img src={currentWord.image} alt="Guess the word" style={styles.image} />
            </div>
            <div style={styles.letterContainer}>
                {guessedWord.map((letter, index) => (
                    <div
                        key={index}
                        style={styles.letter}
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
            <div style={styles.letterContainer}>
                {availableLetters.map((letter, index) => (
                    <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, letter)}
                        style={styles.letter}
                    >
                        {letter}
                    </div>
                ))}
            </div>
        </div>
    );
}