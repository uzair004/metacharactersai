/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import ModelList from './components/ModelList';
import ChatApp from './components/chatApp';

function App() {
  const [currentModel, setCurrentModel] = useState(null); // Track the current model

  const handleModelClick = (modelName) => {
    setCurrentModel(modelName); // Set the current model when a model card is clicked
  };

  return (
    <div>
      {currentModel ? (
        <ChatApp modelName={currentModel} /> // Render ChatApp if there is a current model
      ) : (
        <>
          <h1 className="text-center main-heading">Characters AI chatApp</h1> {/* Main Heading */}
          <ModelList onModelClick={handleModelClick} /> {/* Render ModelList if there is no current model */}
        </>
      )}
    </div>
  );
}

export default App;
