/* eslint-disable no-unused-vars */
/* App.jsx */

import React, { useState } from 'react';
import ModelList from './components/ModelList';
import ChatApp from './components/chatApp';

function App() {
  const [currentModel, setCurrentModel] = useState(null);
  const [modelId, setModelId] = useState(null);

  const handleModelClick = (modelName, modelId) => {
    setCurrentModel(modelName);
    setModelId(modelId);
  };

  return (
    <div className='top-container'>
      {currentModel ? (
        <ChatApp modelName={currentModel} modelId={modelId} />
      ) : (
        <ModelList onModelClick={handleModelClick} />
      )}
    </div>
  );
}

export default App;
