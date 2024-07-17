'use client'

import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

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
        flexWrap: 'wrap',
        marginBottom: '20px',
    },
    letter: {
        width: '40px',
        height: '40px',
        border: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '5px',
        cursor: 'move',
    },
};

const DraggableLetter = ({ letter, onDrop }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'letter',
        item: { letter },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            style={{
                ...styles.letter,
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            {letter}
        </div>
    );
};

const DropZone = ({ index, letter, onDrop }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'letter',
        drop: (item) => onDrop(item.letter, index),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <div
            ref={drop}
            style={{
                ...styles.letter,
                backgroundColor: isOver ? '#f0f0f0' : 'white',
            }}
        >
            {letter}
        </div>
    );
};

function Game() {
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
                    <DropZone key={index} index={index} letter={letter} onDrop={handleDrop} />
                ))}
            </div>
            <div style={styles.letterContainer}>
                {availableLetters.map((letter, index) => (
                    <DraggableLetter key={index} letter={letter} />
                ))}
            </div>
        </div>
    );
}

export default function Home() {
    const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;
    const Backend = isTouchDevice ? TouchBackend : HTML5Backend;

    return (
        <DndProvider backend={Backend}>
            <Game />
        </DndProvider>
    );
}