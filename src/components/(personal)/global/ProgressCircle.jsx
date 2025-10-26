"use client";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

/**
 * Reusable circular progress bar component.
 * @param {number} value - Progress value (0–100)
 * @param {string} text - Optional text inside the circle
 * @param {string} color - Path color
 * @param {string} trailColor - Background path color
 * @param {string} textColor - Text color
 * @param {number} strokeWidth - Circle thickness
 * @param {number|string} size - Circle size (e.g. 100 or '6rem')
 */
const ProgressCircle = ({
  value = 0,
  text = `${value}%`,
  color = "#4ade80",
  trailColor = "#eee",
  textColor = "#111",
  strokeWidth = 8,
  size = "6rem",
}) => {
  return (
    <div style={{ width: size, height: size }}>
      <CircularProgressbar
        value={value}
        text={text}
        strokeWidth={strokeWidth}
        styles={buildStyles({
          pathColor: color,
          trailColor,
          textColor,
          textSize: "24px",
        })}
      />
    </div>
  );
};

export default ProgressCircle;
