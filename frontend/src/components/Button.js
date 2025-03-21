import React from "react";
import "./Button.css"; // Optional: Create a CSS file for styling

export default function Button({ children, onClick }) {
  return (
    <button className="custom-button" onClick={onClick}>
      {children}
    </button>
  );
}
