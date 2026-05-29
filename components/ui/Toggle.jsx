"use client";
export default function Toggle({ on, onToggle }) {
  return (
    <div
      className={`toggle ${on ? "on" : ""}`}
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onToggle()}
    />
  );
}
