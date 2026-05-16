import React from "react";

export default function InfoScreen() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Test 1</h1>
      <h2 style={styles.title}>Are you Ready?</h2>
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
