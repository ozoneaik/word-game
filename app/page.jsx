'use client'
import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import './page.css'
import {initialWords} from "@/app/datasets/words";

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
    const [selectedLetter, setSelectedLetter] = useState(null);

    const correctSoundRef = useRef(null);
    const incorrectSoundRef = useRef(null);
    const bgMusicRef = useRef(null);

    useEffect(() => {
        console.log('initialWordss',initialWords);
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

    const handleLetterSelect = (letter) => {
        setSelectedLetter(letter);
    };

    const handleSlotSelect = (index) => {
        if (selectedLetter && guessedWord[index] === '') {
            const newGuessedWord = [...guessedWord];
            newGuessedWord[index] = selectedLetter;
            setGuessedWord(newGuessedWord);
            setAvailableLetters(availableLetters.filter(l => l !== selectedLetter));
            setSelectedLetter(null);
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
            <Container className="pt-5" style={containerStyleMain}>
                <Row className="justify-content-center">
                    <Col xs={12} md={8} className={''}>
                        <div className="text-center">
                            <img src="https://www.wordgames.com/images/logo.png" alt="logo" width={300}/>
                            <h1 className="mb-4" style={{fontSize: 42}}>เกมทายคำจากภาพ</h1>
                            <Button variant="primary" size="lg" onClick={handleStartGame}>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 640 512">
                                    <path fill="#ffffff"
                                          d="M192 64C86 64 0 150 0 256S86 448 192 448l256 0c106 0 192-86 192-192s-86-192-192-192L192 64zM496 168a40 40 0 1 1 0 80 40 40 0 1 1 0-80zM392 304a40 40 0 1 1 80 0 40 40 0 1 1 -80 0zM168 200c0-13.3 10.7-24 24-24s24 10.7 24 24l0 32 32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0 0 32c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-32-32 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l32 0 0-32z"/>
                                </svg>
                                เริ่มเกม
                            </Button>
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
                <Col xs={12}>
                    <Button variant={soundEnabled ? "success" : "danger"} onClick={toggleSound} className="mb-3">
                        {soundEnabled ? "ปิดเสียง" : "เปิดเสียง"}
                    </Button>
                </Col>
                <Col xs={12} md={8}>
                    <div className="text-center">
                        <img src="https://www.wordgames.com/images/logo.png" alt="logo" width={100}/>
                        <h1 className="mb-3">เกมทายคำจากภาพ</h1>
                        <div className="mb-3">เวลา: {formatTime(currentTime)} วินาที</div>
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
                                        cursor: 'pointer',
                                        fontSize: '24px',
                                        backgroundColor: 'white'
                                    }}
                                    onClick={() => handleSlotSelect(index)}
                                >
                                    {letter}
                                </div>
                            ))}
                        </div>
                        <div className="d-flex justify-content-center" style={{flexWrap: 'wrap'}}>
                            {availableLetters.map((letter, index) => (
                                <div
                                    key={index}
                                    className={`rounded-circle text-white d-flex align-items-center justify-content-center m-1 ${selectedLetter === letter ? 'border border-danger border-3' : ''}`}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        cursor: 'pointer',
                                        fontSize: '24px',
                                        backgroundColor: selectedLetter === letter ? '#ff6b6b' : '#007bff'
                                    }}
                                    onClick={() => handleLetterSelect(letter)}
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

const containerStyleMain = {
    backgroundImage: 'url("https://64.media.tumblr.com/bee1e64cc1ed55cfcb496698f75f96d0/tumblr_psa72l8zUo1upcvga_1280.gif")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    padding: '20px',
};

const containerStyle = {
    backgroundImage: 'url("https://64.media.tumblr.com/bee1e64cc1ed55cfcb496698f75f96d0/tumblr_psa72l8zUo1upcvga_1280.gif")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100dvh',
    padding: '20px',
};

export default Home;