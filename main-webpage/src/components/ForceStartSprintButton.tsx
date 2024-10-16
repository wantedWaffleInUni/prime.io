import React from "react";
import "./ForceStartSprintButton.css";

interface ForceStartSprintButtonProps {
  onStart: () => void;
  isDisabled: boolean;
}

const ForceStartSprintButton: React.FC<ForceStartSprintButtonProps> = ({ onStart, isDisabled }) => {
  return (
    <button className="force-start-button" onClick={onStart} disabled={isDisabled}>
      Force Start
    </button>
  );
};

export default ForceStartSprintButton;