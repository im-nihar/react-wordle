import React, { useEffect, useState } from "react";
import "./wordle.css";

const API_URL = "https://api.frontendexpert.io/api/fe/wordle-words";
const WORD_LENGTH = 5;

const Wordle = () => {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    console.log("isGameOver", isGameOver, guesses);
    const handleType = (event) => {
      if (isGameOver) {
        return;
      }
      if (event.key === "Enter") {
        if (currentGuess.length !== 5) {
          return;
        }
        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess("");
        const isCorrect = solution === currentGuess;
        if (isCorrect) {
          setIsGameOver(true);
        }
      }
      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }
      if (currentGuess.length >= 5) {
        return;
      }
      setCurrentGuess((prevState) => prevState + event.key);
    };
    window.addEventListener("keydown", handleType);
    return () => window.removeEventListener("keydown", handleType);
  }, [currentGuess, isGameOver, solution, guesses]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(API_URL);
      const words = await response.json();
      const calculation = Math.floor(Math.random() * words.length);
      const randomWord = words[calculation];
      setSolution(randomWord.toLowerCase());
    };
    fetchData();
  }, []);

  function Line({ guess, isFinal }) {
    const tiles = [];
    for (let i = 0; i < WORD_LENGTH; i++) {
      const char = guess[i];
      let className = "tile";
      if (isFinal) {
        if (char === solution[i]) {
          className += " correct";
        } else if (solution.includes(char)) {
          className += " close";
        } else {
          className += " incorrect";
        }
      }
      tiles.push(
        <div key={i} className={className}>
          {char}
        </div>
      );
    }
    return <div className="line">{tiles}</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Wordle</h1>
      <div className="board">
        {guesses.map((guess, index) => {
          const isCurrentGuess =
            index === guesses.findIndex((val) => val == null);
          return (
            <div>
              <Line
                key={index}
                guess={isCurrentGuess ? currentGuess : guess ?? ""}
                isFinal={!isCurrentGuess && guess != null}
              />
            </div>
          );
        })}
      </div>
      {!guesses.includes(null) && <h1>Answer is {solution.toUpperCase()}</h1>}
    </div>
  );
};

export default Wordle;
