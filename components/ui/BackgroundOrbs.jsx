"use client";
export default function BackgroundOrbs() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div className="orb" style={{ width: 600, height: 600, background: "#6366f1", top: "-200px", left: "-150px" }} />
      <div className="orb" style={{ width: 500, height: 500, background: "#8b5cf6", bottom: "-150px", right: "-100px", animationDelay: "-4s" }} />
      <div className="orb" style={{ width: 300, height: 300, background: "#06b6d4", top: "40%", left: "60%", opacity: 0.08, animationDelay: "-8s" }} />
    </div>
  );
}
