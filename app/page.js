'use client'
import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';

const initialWords = [
    { word: "แมว", image: "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg" },
    { word: "หมา", image: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg" },
    { word: "ไก่", image: "https://image.makewebeasy.net/makeweb/m_1920x0/Q1cSYUQ7X/ContentChicken/Chicken_History.jpg?v=202012190947" },
    { word: "ยีราฟ", image: "https://khaokheow.zoothailand.org/zoo_office/fileupload/encyclopedia_file/2.JPG" },
    // เพิ่มคำและรูปภาพตามต้องการ
];

const Home = () => {
    const [currentWords, setCurrentWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [guessedWord, setGuessedWord] = useState([]);
    const [availableLetters, setAvailableLetters] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [endTime, setEndTime] = useState(null);
    const [bestTime, setBestTime] = useState(Infinity);
    const [gameStarted, setGameStarted] = useState(false);
    const [message, setMessage] = useState('');
    const [soundEnabled, setSoundEnabled] = useState(true);

    const correctSoundRef = useRef(null);
    const incorrectSoundRef = useRef(null);
    const bgMusicRef = useRef(null);

    useEffect(() => {
        correctSoundRef.current = new Audio('/sound/correct.mp3');
        incorrectSoundRef.current = new Audio('/sound/incorrect.mp3');
        bgMusicRef.current = new Audio('/sound/background-music.mp3');
        bgMusicRef.current.loop = true;

        return () => {
            bgMusicRef.current.pause();
        };
    }, []);

    useEffect(() => {
        if (gameStarted && soundEnabled) {
            bgMusicRef.current.play();
        } else {
            bgMusicRef.current.pause();
        }
    }, [gameStarted, soundEnabled]);

    useEffect(() => {
        if (gameStarted) {
            startGame();
        }
    }, [gameStarted]);

    useEffect(() => {
        let interval;
        if (startTime && !endTime) {
            interval = setInterval(() => {
                setCurrentTime(Date.now() - startTime);
            }, 10);
        }
        return () => clearInterval(interval);
    }, [startTime, endTime]);

    const startGame = () => {
        const shuffled = [...initialWords].sort(() => 0.5 - Math.random());
        setCurrentWords(shuffled);
        setCurrentWordIndex(0);
        prepareWord(shuffled[0]);
        setStartTime(Date.now());
        setCurrentTime(0);
        setEndTime(null);
        setGameOver(false);
        setMessage('');
    };

    const prepareWord = (word) => {
        const splitWord = splitThaiWord(word.word);
        setGuessedWord(Array(splitWord.length).fill(''));
        setAvailableLetters(splitWord.sort(() => Math.random() - 0.5));
    };

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

    const handleDrop = (letter, index) => {
        const newGuessedWord = [...guessedWord];
        if (newGuessedWord[index] === '') {
            newGuessedWord[index] = letter;
            setGuessedWord(newGuessedWord);
            setAvailableLetters(availableLetters.filter(l => l !== letter));
            checkWord(newGuessedWord);
        }
    };

    const handleLetterClick = (index) => {
        const letter = guessedWord[index];
        if (letter) {
            const newGuessedWord = [...guessedWord];
            newGuessedWord[index] = '';
            setGuessedWord(newGuessedWord);
            setAvailableLetters([...availableLetters, letter]);
        }
    };

    const handleDragStart = (e, letter) => {
        e.dataTransfer.setData('text/plain', letter);
    };

    const checkWord = (newGuessedWord) => {
        if (newGuessedWord.join('') === currentWords[currentWordIndex].word) {
            setMessage('เก่งมาก! ถูกต้องแล้ว');
            if (soundEnabled) correctSoundRef.current.play();
            if (currentWordIndex === currentWords.length - 1) {
                const finalTime = Date.now() - startTime;
                setEndTime(finalTime);
                if (finalTime < bestTime) {
                    setBestTime(finalTime);
                }
                setGameOver(true);
            } else {
                setTimeout(() => {
                    nextWord();
                    setMessage('');
                }, 1000);
            }
        } else if (!newGuessedWord.includes('')) {
            setMessage('ลองใหม่อีกครั้งนะ!');
            if (soundEnabled) incorrectSoundRef.current.play();
            setTimeout(() => {
                resetCurrentWord();
                setMessage('');
            }, 1000);
        }
    };

    const nextWord = () => {
        setCurrentWordIndex(currentWordIndex + 1);
        prepareWord(currentWords[currentWordIndex + 1]);
    };

    const resetCurrentWord = () => {
        const currentWord = currentWords[currentWordIndex];
        prepareWord(currentWord);
    };

    const formatTime = (time) => {
        return (time / 1000).toFixed(2);
    };

    const handleStartGame = () => {
        setGameStarted(true);
    };

    const handleRestartGame = () => {
        setGameStarted(false);
        setCurrentWords([]);
        setCurrentWordIndex(0);
        setGuessedWord([]);
        setAvailableLetters([]);
        setGameOver(false);
        setStartTime(null);
        setCurrentTime(0);
        setEndTime(null);
        setBestTime(Infinity);
        setMessage('');
    };

    const toggleSound = () => {
        setSoundEnabled(!soundEnabled);
        if (!soundEnabled) {
            bgMusicRef.current.play();
        } else {
            bgMusicRef.current.pause();
        }
    };

    if (gameOver) {
        return (
            <Container className="" style={containerStyle}>
                <Row className="justify-content-center">
                    <Col xs={12} md={8}>
                        <div className="bg-light p-4 rounded shadow-sm text-center">
                            <h1 className="mb-4">เก่งมาก! เกมจบแล้ว!</h1>
                            <p>เวลาที่ใช้: {formatTime(endTime)} วินาที</p>
                            <p>เวลาที่ดีที่สุด: {formatTime(bestTime)} วินาที</p>
                            <Button variant="success" size="lg" onClick={handleRestartGame}>เล่นอีกครั้ง</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (!gameStarted) {
        return (
            <Container className="" style={containerStyle}>
                <Row className="justify-content-center">
                    <Col xs={12} md={8}>
                        <div className="text-center">
                            <h1 className="mb-4">เกมทายคำจากภาพ</h1>
                            <Button variant="primary" size="lg" onClick={handleStartGame}>เริ่มเกม</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (currentWords.length === 0) {
        return (
            <Container className="" style={containerStyle}>
                <Row className="justify-content-center">
                    <Col xs={12} md={8}>
                        <p className="text-center">กำลังโหลด...</p>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="" style={containerStyle}>
            <Row className="justify-content-center">
                <Col xs={12} md={8}>
                    <div className="text-center">
                        <h1 className="mb-3">เกมทายคำจากภาพ</h1>
                        <div className="mb-3">เวลา: {formatTime(currentTime)} วินาที</div>
                        <Button variant={soundEnabled ? "success" : "danger"} onClick={toggleSound} className="mb-3">
                            {soundEnabled ? "ปิดเสียง" : "เปิดเสียง"}
                        </Button>
                        <Image src={currentWords[currentWordIndex].image} alt="Guess the word" className="img-fluid rounded shadow-sm mb-3" style={{maxHeight: '200px', objectFit: 'cover'}} />
                        {message && <div className={`alert ${message.includes('เก่ง') ? 'alert-success' : 'alert-warning'} mb-3`}>{message}</div>}
                        <div className="d-flex justify-content-center mb-3" style={{flexWrap: 'wrap'}}>
                            {guessedWord.map((letter, index) => (
                                <div
                                    key={index}
                                    className="rounded border border-primary d-flex align-items-center justify-content-center m-1"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        cursor: letter ? 'pointer' : 'default',
                                        fontSize: '24px',
                                        backgroundColor: 'white'
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        handleDrop(e.dataTransfer.getData('text/plain'), index);
                                    }}
                                    onClick={() => handleLetterClick(index)}
                                    draggable={!!letter}
                                    onDragStart={(e) => handleDragStart(e, letter)}
                                >
                                    {letter}
                                </div>
                            ))}
                        </div>
                        <div className="d-flex justify-content-center" style={{flexWrap: 'wrap'}}>
                            {availableLetters.map((letter, index) => (
                                <div
                                    key={index}
                                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center m-1"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        cursor: 'pointer',
                                        fontSize: '24px'
                                    }}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, letter)}
                                >
                                    {letter}
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

const containerStyle = {
    backgroundImage: 'url("/background.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    padding: '20px',
};

export default Home;