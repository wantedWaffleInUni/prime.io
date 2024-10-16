import React, { useState } from "react";
import "./CreateTags.css";

const CreateTags: React.FC = () => {
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = (): void => {
    const tagName = prompt("Enter the name of the tag:");
    if (tagName) {
      setTags((prevTags) => [...prevTags, tagName]);
    }
  };

  return (
    <div className="tag-container">
      {/* Header for the tag list */}
      <h2>Tags</h2>
      <div className="tag-list">
        {tags.length === 0 ? (
          <p>No tags created yet.</p>
        ) : (
          tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))
        )}
      </div>
      
      <button className="add-tag-btn" onClick={handleAddTag}>
        + NewTag
      </button>

    </div>
  );
};

export default CreateTags;
