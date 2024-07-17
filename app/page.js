'use client'

import { useState, useEffect } from 'react';

const initialWords = [
    { word: "แมว", image: "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg" },
    { word: "หมา", image: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg" },
    { word: "ไก่", image: "https://image.makewebeasy.net/makeweb/m_1920x0/Q1cSYUQ7X/ContentChicken/Chicken_History.jpg?v=202012190947" },
    { word: "ยีราฟ", image: "https://khaokheow.zoothailand.org/zoo_office/fileupload/encyclopedia_file/2.JPG" },
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
    congratsContainer: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        fontSize: '24px',
        animation: 'fadeIn 0.5s'
    },
};

export default function Home() {
    const [words, setWords] = useState([...initialWords]);
    const [currentWord, setCurrentWord] = useState(null);
    const [guessedWord, setGuessedWord] = useState([]);
    const [score, setScore] = useState(0);
    const [availableLetters, setAvailableLetters] = useState([]);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        nextWord();
    }, []);

    const isThaiVowel = (char) => {
        const thaiVowels = ['่', '้', '๊', '๋', 'ั', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู', 'ๅ', 'ำ'];
        return thaiVowels.includes(char);
    };

    const splitThaiWord = (word) => {
        return word.split('').reduce((acc, char, index, array) => {
            if (index > 0 && isThaiVowel(char) && !isThaiVowel(array[index - 1])) {
                acc[acc.length - 1] += char;
            } else {
                acc.push(char);
            }
            return acc;
        }, []);
    };

    const nextWord = () => {
        if (words.length === 0) {
            setGameOver(true);
            return;
        }
        const randomIndex = Math.floor(Math.random() * words.length);
        const randomWord = words[randomIndex];
        setCurrentWord(randomWord);

        const splitWord = splitThaiWord(randomWord.word);
        setGuessedWord(Array(splitWord.length).fill(''));
        setAvailableLetters(splitWord.sort(() => Math.random() - 0.5));

        // Remove the used word from the list
        setWords(words.filter((_, index) => index !== randomIndex));
    };

    const handleDrop = (letter, index) => {
        const newGuessedWord = [...guessedWord];
        newGuessedWord[index] = letter;
        setGuessedWord(newGuessedWord);

        setAvailableLetters(availableLetters.filter(l => l !== letter));

        if (newGuessedWord.join('') === currentWord.word) {
            setScore(score + 100);
            setTimeout(nextWord, 1000);
        }
    };

    const handleDragStart = (e, letter) => {
        e.dataTransfer.setData('text/plain', letter);
    };

    if (gameOver) {
        return (
            <div style={styles.congratsContainer}>
                <div>
                    <h1>ยินดีด้วย!</h1>
                    <p>คุณทำคะแนนได้ทั้งหมด: {score} คะแนน</p>
                    <button onClick={() => window.location.reload()}>เล่นอีกครั้ง</button>
                </div>
            </div>
        );
    }

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