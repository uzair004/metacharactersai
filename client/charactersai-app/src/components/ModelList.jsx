/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import defaultAvatar from '../assets/default-avatar.jpeg';

function ModelList() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      const modelsRef = firestore.collection('Models');
      const snapshot = await modelsRef.get();
      const modelsData = snapshot.docs.map(doc => {
        const model = { modelId: doc.id, ...doc.data() };
        if (!model.pic) {
          // Use default avatar image if pic is not available
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
      {models.map(model => (
        <div key={model.modelId} className="model-card">
          <img src={model.pic} alt={model.name} />
          <p>{model.name}</p>
        </div>
      ))}
    </div>
  );
}

export default ModelList;
