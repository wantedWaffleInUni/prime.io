import React from "react";
import "./ForceEndSprintButton.css";

interface ForceEndSprintButtonProps {
  onEnd: () => void;
}

const ForceEndSprintButton: React.FC<ForceEndSprintButtonProps> = ({ onEnd }) => {
  return (
    <button className="force-end-button" onClick={onEnd}>
      Force End Sprint
    </button>
  );
};

export default ForceEndSprintButton;