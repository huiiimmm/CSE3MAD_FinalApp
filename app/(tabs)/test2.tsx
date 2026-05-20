import { router } from "expo-router";
import React, { useRef, useState } from "react";

export default function Test2() {
  const [readyText, setReadyText] = useState(true);
  const [bgColor, setBgColor] = useState("#1e1e1e");
  const [reactionScreen, setReactionScreen] = useState(false);
  const [nextTestButton, setNextTestButton] = useState(false);

  // stand timer
  const [timerText, setTimerText] = useState(false);
  const [time, setTime] = useState(0);
  // rand timer
  const [randomTime, setRandomTime] = useState(0);
  const [randomNumber, setRandomNumber] = useState(0);
  // timer references
  const timerRef = useRef<number | null>(null);
  const randomTimerRef = useRef<number | null>(null);

  const randomise = () => {
    const randomNumber = Math.random() * (10 - 2 + 1) + 2; // random number between 2 and ten
    setRandomNumber(randomNumber);
  };

  const startRandomTimer = () => {
    if (randomTimerRef.current !== null) return;
    randomise();
    randomTimerRef.current = window.setInterval(() => {
      setRandomTime((prev) => {
        if (prev >= randomNumber) {
          stopRandomTimer();
          startTimer();
          setTimerText(true);
          setBgColor("green");
          setReactionScreen(true);
        }
        return prev + 1;
      });
    }, 1000);
  };

  const startTimer = () => {
    const start = performance.now(); // performance is much more accurate

    timerRef.current = window.setInterval(() => {
      setTime(Math.floor(performance.now() - start));
    }, 10);
  };

  const stopRandomTimer = () => {
    if (randomTimerRef.current !== null) {
      clearInterval(randomTimerRef.current);
      randomTimerRef.current = null;
    }
  };

  const stopTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div style={{ ...styles.container, backgroundColor: bgColor }}>
      {readyText && <h1 style={styles.title}>Test 2 - Non-Dominant Hand</h1>}
      {readyText && (
        <text style={styles.text}>Tap the screen as soon as you see green</text>
      )}
      {readyText && <h2 style={styles.title}>Are you Ready?</h2>}

      {readyText && (
        <button
          style={styles.button}
          onClick={() => {
            startRandomTimer();
            setReadyText(false);
            setBgColor("red");
          }}
        >
          Start
        </button>
      )}
      {timerText && <h2>{time}ms</h2>}
      {nextTestButton && (
        <button style={styles.button} onClick={() => router.push("./results")}>
          Results
        </button>
      )}
      {reactionScreen && (
        <div
          style={{
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
          }}
          onClick={() => {
            stopTimer();
            setNextTestButton(true);
          }}
        />
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "white",
    fontSize: "36px",
    marginBottom: "40px",
  },

  text: {
    color: "white",
    fontSize: "20px",
  },

  button: {
    width: "200px",
    padding: "15px",
    margin: "10px",
    fontSize: "18px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#4a90e2",
    color: "white",
  },
};
