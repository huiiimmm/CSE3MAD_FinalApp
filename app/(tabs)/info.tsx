import { router } from "expo-router";
import React from "react";

export default function InfoScreen() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Info Guide</h1>
      <text style={styles.text}>This is a reaction testing app.</text>
      <text style={styles.text}>
        For the first test, tap the screen with your dominant hand as soon as
        the screen goes green.
      </text>
      <text style={styles.text}>
        The second test is the same as the first, but with your non-dominant
        hand.
      </text>
      <text style={styles.text}>
        For the last test, you must trace a moving object with your finger
        pressed on the screen.
      </text>
      <button style={styles.button} onClick={() => router.push("./test1")}>
        Start Test
      </button>
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
    backgroundColor: "#1e1e1e",
  },

  title: {
    color: "white",
    fontSize: "36px",
    marginBottom: "40px",
  },

  text: {
    color: "white",
    fontSize: "18px",
    marginLeft: "80px",
    marginRight: "80px",
    marginBottom: "40px",
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
