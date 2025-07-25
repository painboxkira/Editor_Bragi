import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Save, Edit3, Trash2 } from 'lucide-react';

interface ScenarioData {
  id: string;
  name: string;
  createdAt: string;
  [key: string]: any;
}

interface Scene {
  id: string;
  name: string;
  type?: 'panoramic' | 'flat image';
  imageName?: string;
  [key: string]: any;
}

const SceneEditor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { scenario?: ScenarioData };
  const scenario = state?.scenario;

  const [localScenario, setLocalScenario] = useState<ScenarioData & { scenes: Scene[] }>(() => {
    if (!scenario) {
      return { id: '', name: '', createdAt: '', scenes: [] };
    }
    return { ...scenario, scenes: (scenario.scenes as Scene[]) || [] };
  });

  const [editingScene, setEditingScene] = useState<string | null>(null);
  const [tempSceneName, setTempSceneName] = useState('');
  const [activeHover, setActiveHover] = useState<string | null>(null);

  React.useEffect(() => {
    if (!scenario) {
      navigate('/', { replace: true });
    }
  }, [scenario, navigate]);

  if (!scenario) {
    return null;
  }

  const handleAddScene = () => {
    const newScene: Scene = {
      id: uuidv4(),
      name: `Scene ${localScenario.scenes.length + 1}`,
      type: 'panoramic',
      imageName: 'new_scene.jpg'
    };
    setLocalScenario({
      ...localScenario,
      scenes: [...localScenario.scenes, newScene],
    });
  };

  const handleDeleteScene = (sceneId: string) => {
    setLocalScenario({
      ...localScenario,
      scenes: localScenario.scenes.filter(scene => scene.id !== sceneId)
    });
  };

  const handleSceneUpdate = (sceneId: string, field: keyof Scene, value: any) => {
    setLocalScenario({
      ...localScenario,
      scenes: localScenario.scenes.map(scene => 
        scene.id === sceneId ? { ...scene, [field]: value } : scene
      )
    });
  };

  const startEditingScene = (sceneId: string, currentName: string) => {
    setEditingScene(sceneId);
    setTempSceneName(currentName);
  };

  const finishEditingScene = (sceneId: string) => {
    handleSceneUpdate(sceneId, 'name', tempSceneName);
    setEditingScene(null);
    setTempSceneName('');
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/savejson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localScenario),
      });
      if (!response.ok) throw new Error('Failed to save changes');
      alert('Changes saved successfully!');
    } catch (err: any) {
      alert('Error saving changes: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="editor-container">
      {/* Psychedelic Background */}
      <div className="psychedelic-background">
        <svg className="animated-grid" width="100%" height="100%">
          <defs>
            <pattern id="psychGrid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="url(#rainbow)" strokeWidth="2" opacity="0.3"/>
              <circle cx="50" cy="50" r="20" fill="none" stroke="url(#rainbow)" strokeWidth="1" opacity="0.2"/>
            </pattern>
            <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff0080">
                <animate attributeName="stop-color" values="#ff0080;#00ff80;#8000ff;#ff0080" dur="6s" repeatCount="indefinite"/>
              </stop>
              <stop offset="50%" stopColor="#00ff80">
                <animate attributeName="stop-color" values="#00ff80;#8000ff;#ff0080;#00ff80" dur="6s" repeatCount="indefinite"/>
              </stop>
              <stop offset="100%" stopColor="#8000ff">
                <animate attributeName="stop-color" values="#8000ff;#ff0080;#00ff80;#8000ff" dur="6s" repeatCount="indefinite"/>
              </stop>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#psychGrid)" />
        </svg>
        
        {/* Floating Orbs */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="floating-orb"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 25}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="main-header">
        <h1 className="title">BRAGI.FORGE.SYS</h1>
        <div className="subtitle">PSYCHEDELIC_MYTHOLOGICAL_EDITOR_v∞.∞</div>
      </header>

      {/* Main Content */}
      <main className="content-area">
        {/* Scenario Info */}
        <section className="scenario-section">
          <div className="section-header">SCENARIO.DAT</div>
          <div className="section-body">
            <div className="info-grid">
              <div className="info-item">
                <label>NAME:</label>
                <div className="value rainbow-text">{localScenario.name}</div>
              </div>
              <div className="info-item">
                <label>ID:</label>
                <div className="value mono-text">{localScenario.id}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Scenes Workshop */}
        <section className="scenes-section">
          <div className="section-header">
            <span className="glow-text">SCENES.WORKSHOP</span>
            <span className="count-badge">TOTAL: {localScenario.scenes.length}</span>
          </div>
          <div className="section-body">
            
            {/* Add New Scene */}
            <button 
              className={`add-button ${activeHover === 'add-btn' ? 'active' : ''}`}
              onClick={handleAddScene}
              onMouseEnter={() => setActiveHover('add-btn')}
              onMouseLeave={() => setActiveHover(null)}
            >
              <div className="button-bg"></div>
              <div className="button-content">
                <Plus size={24} />
                <span>NEW.SCENE</span>
              </div>
            </button>

            {/* Scene List */}
            <div className="scenes-list">
              {localScenario.scenes.length === 0 ? (
                <div className="empty-message">
                  <div className="empty-title">NO.SCENES.LOADED</div>
                  <div className="empty-subtitle">CLICK NEW.SCENE TO BEGIN</div>
                </div>
              ) : (
                localScenario.scenes.map((scene, index) => (
                  <div 
                    key={scene.id} 
                    className="scene-card"
                    onMouseEnter={() => setActiveHover(scene.id)}
                    onMouseLeave={() => setActiveHover(null)}
                  >
                    <div className={`scene-highlight ${activeHover === scene.id ? 'visible' : ''}`}></div>
                    
                    {/* Scene Header */}
                    <div className="scene-header">
                      <div className="scene-info">
                        <div className="scene-number">{String(index + 1).padStart(2, '0')}</div>
                        {editingScene === scene.id ? (
                          <input
                            type="text"
                            value={tempSceneName}
                            onChange={(e) => setTempSceneName(e.target.value)}
                            onBlur={() => finishEditingScene(scene.id)}
                            onKeyPress={(e) => e.key === 'Enter' && finishEditingScene(scene.id)}
                            className="name-input"
                            autoFocus
                          />
                        ) : (
                          <div className="name-group">
                            <span className="scene-name">{scene.name}</span>
                            <button 
                              className="edit-button"
                              onClick={() => startEditingScene(scene.id, scene.name)}
                            >
                              <Edit3 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteScene(scene.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Scene Configuration */}
                    <div className="scene-config">
                      <div className="config-grid">
                        <div className="config-item">
                          <label>TYPE:</label>
                          <select
                            value={scene.type || 'panoramic'}
                            onChange={(e) => handleSceneUpdate(scene.id, 'type', e.target.value)}
                            className="config-select"
                          >
                            <option value="panoramic">PANORAMIC</option>
                            <option value="flat image">FLAT_IMAGE</option>
                          </select>
                        </div>
                        <div className="config-item">
                          <label>IMAGE.FILE:</label>
                          <input
                            type="text"
                            value={scene.imageName || ''}
                            onChange={(e) => handleSceneUpdate(scene.id, 'imageName', e.target.value)}
                            placeholder="filename.ext"
                            className="config-input"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Status Bar */}
                    <div className="scene-status">
                      <div className="status-left">
                        <span className="status-item glow-text">STATUS: LOADED</span>
                        <span className="status-item">TYPE: {(scene.type || 'panoramic').toUpperCase()}</span>
                      </div>
                      <div className="status-right">
                        <span className="status-file">FILE: {scene.imageName || 'UNSET'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Save Button */}
            <button className="save-button" onClick={handleSaveChanges}>
              <div className="save-bg"></div>
              <div className="save-content">
                <Save size={20} />
                <span>COMMIT.TO.DISK</span>
              </div>
            </button>
          </div>
        </section>
      </main>

      <style jsx>{`
        .editor-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
          font-family: 'Courier New', monospace;
          position: relative;
          overflow-x: hidden;
        }

        .psychedelic-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .animated-grid {
          position: absolute;
          inset: 0;
          opacity: 0.4;
        }

        .floating-orb {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,0,255,0.8), rgba(0,255,255,0.4), transparent);
          filter: blur(3px);
          animation: floatAround infinite ease-in-out;
        }

        @keyframes floatAround {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.6; }
          25% { transform: translate(60px, -40px) scale(1.4) rotate(90deg); opacity: 0.9; }
          50% { transform: translate(-30px, -80px) scale(0.7) rotate(180deg); opacity: 0.4; }
          75% { transform: translate(-50px, -20px) scale(1.2) rotate(270deg); opacity: 0.8; }
        }

        .main-header {
          position: relative;
          z-index: 10;
          background: linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
          backdrop-filter: blur(10px);
          border-bottom: 4px solid #000;
          padding: 20px;
          text-align: center;
        }

        .title {
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 4px;
          background: linear-gradient(45deg, #ff0099, #00ff99, #9900ff, #ff0099);
          background-size: 400% 400%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: rainbowMove 4s ease-in-out infinite;
          text-shadow: 0 0 30px rgba(255,0,153,0.5);
          margin: 0;
        }

        .subtitle {
          font-size: 11px;
          color: #333;
          margin-top: 8px;
          font-weight: bold;
        }

        @keyframes rainbowMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .content-area {
          position: relative;
          z-index: 5;
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px;
        }

        .scenario-section, .scenes-section {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(15px);
          border: 4px solid #000;
          margin-bottom: 40px;
          transform: perspective(1000px) rotateX(2deg);
          transition: transform 0.4s ease;
        }

        .scenario-section:hover {
          transform: perspective(1000px) rotateX(0deg) rotateY(2deg);
          box-shadow: 15px 15px 0 #ff00ff;
        }

        .scenes-section:hover {
          transform: perspective(1000px) rotateX(0deg) rotateY(-2deg);
          box-shadow: 15px 15px 0 #00ffff;
        }

        .section-header {
          background: linear-gradient(90deg, #000, #444, #000);
          color: #fff;
          padding: 15px 25px;
          font-weight: bold;
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .section-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(255,0,255,0.3), rgba(0,255,255,0.3), rgba(255,255,0,0.3));
          animation: headerShimmer 5s ease-in-out infinite;
        }

        @keyframes headerShimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        .glow-text {
          position: relative;
          z-index: 1;
          animation: textGlow 3s ease-in-out infinite alternate;
        }

        @keyframes textGlow {
          0% { text-shadow: 0 0 10px rgba(255,255,255,0.8); }
          100% { text-shadow: 0 0 25px rgba(255,0,255,0.9), 0 0 35px rgba(0,255,255,0.7); }
        }

        .count-badge {
          position: relative;
          z-index: 1;
          font-size: 13px;
        }

        .section-body {
          padding: 30px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .info-item label {
          font-size: 13px;
          font-weight: bold;
          color: #666;
        }

        .value {
          font-size: 20px;
          font-weight: bold;
          border-bottom: 3px dotted #ccc;
          padding-bottom: 10px;
        }

        .rainbow-text {
          background: linear-gradient(45deg, #ff0099, #00ff99, #9900ff);
          background-size: 200% 200%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: rainbowMove 4s ease-in-out infinite;
        }

        .mono-text {
          font-family: 'Courier New', monospace;
          color: #333;
        }

        .add-button {
          width: 100%;
          height: 70px;
          border: 4px dashed #666;
          background: rgba(255,255,255,0.6);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s ease;
          margin-bottom: 30px;
        }

        .add-button:hover {
          border-color: #ff00ff;
          transform: scale(1.03);
        }

        .button-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00);
          transform: translateX(-100%);
          transition: transform 0.4s ease;
        }

        .add-button.active .button-bg {
          transform: translateX(0);
        }

        .button-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          font-weight: bold;
          height: 100%;
          color: #333;
          transition: color 0.4s ease;
        }

        .add-button:hover .button-content {
          color: #fff;
          animation: textGlow 1s ease-in-out infinite;
        }

        .scenes-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 40px;
        }

        .empty-message {
          text-align: center;
          padding: 60px;
          border: 3px solid #ccc;
          background: rgba(255,255,255,0.4);
        }

        .empty-title {
          font-weight: bold;
          color: #666;
          margin-bottom: 10px;
          font-size: 16px;
        }

        .empty-subtitle {
          font-size: 13px;
          color: #999;
        }

        .scene-card {
          position: relative;
          border: 3px solid #ccc;
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(8px);
          transition: all 0.4s ease;
        }

        .scene-card:hover {
          background: rgba(255,255,255,0.95);
          box-shadow: 0 10px 40px rgba(255,0,255,0.4);
        }

        .scene-highlight {
          position: absolute;
          left: 0;
          top: 0;
          width: 6px;
          height: 100%;
          background: linear-gradient(to bottom, #ff00ff, #00ffff, #ffff00);
          transform: scaleY(0);
          transition: transform 0.4s ease;
        }

        .scene-highlight.visible {
          transform: scaleY(1);
        }

        .scene-header {
          background: linear-gradient(90deg, rgba(255,0,255,0.3), rgba(0,255,255,0.3));
          padding: 20px;
          border-bottom: 3px solid #ddd;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .scene-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .scene-number {
          width: 36px;
          height: 36px;
          background: linear-gradient(45deg, #000, #444);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
          animation: numberPulse 4s ease-in-out infinite;
        }

        @keyframes numberPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        .name-input {
          background: rgba(255,255,255,0.95);
          border: 3px solid #000;
          padding: 10px 15px;
          font-weight: bold;
          font-size: 16px;
          outline: none;
          font-family: inherit;
        }

        .name-input:focus {
          box-shadow: 0 0 0 4px rgba(255,0,255,0.4);
          animation: inputGlow 1s ease-in-out infinite;
        }

        @keyframes inputGlow {
          0%, 100% { box-shadow: 0 0 0 4px rgba(255,0,255,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(255,0,255,0.6), 0 0 25px rgba(255,0,255,0.4); }
        }

        .name-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .scene-name {
          font-weight: bold;
          font-size: 16px;
          color: #333;
        }

        .edit-button, .delete-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 10px;
          border-radius: 6px;
          transition: all 0.3s ease;
          opacity: 0;
        }

        .scene-card:hover .edit-button,
        .scene-card:hover .delete-button {
          opacity: 1;
        }

        .edit-button:hover {
          background: rgba(0,0,0,0.1);
          color: #333;
        }

        .delete-button:hover {
          background: rgba(255,0,0,0.15);
          color: #ff0000;
        }

        .scene-config {
          padding: 25px;
        }

        .config-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .config-item {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .config-item label {
          font-size: 13px;
          font-weight: bold;
          color: #666;
        }

        .config-select, .config-input {
          height: 45px;
          border: 3px solid #ccc;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          padding: 0 15px;
          font-family: inherit;
          font-size: 15px;
          outline: none;
          transition: all 0.3s ease;
        }

        .config-select:focus, .config-input:focus {
          border-color: #ff00ff;
          box-shadow: 0 0 0 4px rgba(255,0,255,0.3);
          animation: inputGlow 1s ease-in-out infinite;
        }

        .scene-status {
          background: linear-gradient(90deg, #000, #444, #000);
          color: #fff;
          padding: 15px 25px;
          font-size: 13px;
          font-family: 'Courier New', monospace;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .scene-status::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(0,255,255,0.2), rgba(255,0,255,0.2));
          animation: statusShimmer 4s ease-in-out infinite;
        }

        @keyframes statusShimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        .status-left, .status-right {
          position: relative;
          z-index: 1;
          display: flex;
          gap: 20px;
        }

        .status-item {
          color: #ccc;
        }

        .status-file {
          color: #ff00ff;
        }

        .save-button {
          width: 100%;
          height: 60px;
          background: linear-gradient(45deg, #000, #444, #000);
          color: #fff;
          border: none;
          font-weight: bold;
          font-size: 18px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
        }

        .save-button:hover {
          transform: scale(1.03);
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        }

        .save-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, #00ffff, #ff00ff, #ffff00);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .save-button:hover .save-bg {
          transform: translateX(0);
        }

        .save-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          height: 100%;
          transition: color 0.4s ease;
        }

        .save-button:hover .save-content {
          color: #000;
          animation: textGlow 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SceneEditor;