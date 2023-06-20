/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* ModelList.jsx */

import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import defaultAvatar from '../assets/default-avatar.jpeg';

function ModelList({ onModelClick }) {
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      const modelsRef = firestore.collection('Models');
      const snapshot = await modelsRef.get();
      const modelsData = snapshot.docs.map((doc) => {
        const model = { modelId: doc.id, ...doc.data() };
        if (!model.pic) {
          model.pic = defaultAvatar;
        }
        return model;
      });
      setModels(modelsData);
    };

    fetchModels();
  }, []);

  return (
    <div className="model-list">
      <h1 className='main-heading'>Characters AI ChatApp</h1>
      {models.map((model) => (
        <div
          key={model.modelId}
          className="model-card"
          onClick={() => onModelClick(model.name, model.modelId)} // Pass both modelName and modelId as arguments
        >
          <img src={model.pic} alt={model.name} />
          <p>{model.name}</p>
        </div>
      ))}
    </div>
  );
}

export default ModelList;
