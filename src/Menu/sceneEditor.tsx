import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ScenarioData {
  id: string;
  name: string;
  createdAt: string;
  [key: string]: any;
}

const SceneEditor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { scenario?: ScenarioData };

  const scenario = state?.scenario;

  React.useEffect(() => {
    if (!scenario) {
      // If no scenario passed, redirect back to creation page
      navigate('/', { replace: true });
    }
  }, [scenario, navigate]);

  if (!scenario) {
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Scene Editor</h1>
      <p className="mb-2">
        <strong>Scenario Name:</strong> {scenario.name}
      </p>
      <p className="mb-4">
        <strong>Scenario ID:</strong> {scenario.id}
      </p>
      {/* TODO: Implement scene editor UI, using scenario data as initial context */}
    </div>
  );
};

export default SceneEditor;
