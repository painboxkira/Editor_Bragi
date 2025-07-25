import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Sparkles, Plus, Check, AlertCircle } from 'lucide-react';

const bgImage = './bgfont2.jpg';
const logoImage = './logo.jpg';

interface ScenarioData {
  id: string;
  name: string;
  createdAt: string;
  [key: string]: any;
}

const Scenario = () => {
  const [scenarName, setScenarName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const [savedScenarios, setSavedScenarios] = React.useState<ScenarioData[]>([]);

  React.useEffect(() => {
    // Load existing scenarios from server
    fetch('http://localhost:3000/api/scenarios')
      .then((res) => res.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data)) {
          setSavedScenarios(result.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setError(null);
    setSuccess(false);

    if (scenarName.trim() === "") {
      setError("Scenario name cannot be empty.");
      return;
    }

    try {
      const scenarioData = {
        id: uuidv4(),
        name: scenarName,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch('http://localhost:3000/api/savejson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scenarioData),
      });

      if (!response.ok) {
        let message = "An error occurred while saving.";
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            message = errorData.error;
          }
        } catch {}
        throw new Error(message);
      }
      const result = await response.json();
      setSuccess(true);
      setScenarName("");
      navigate('/sceneEditor', { state: { scenario: result.data } });
    } catch (err: any) {
      setError(err.message || "An error occurred.");
  }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScenarName(e.target.value);
    setSuccess(false);
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: '100vw 100vh',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        minWidth: '100vw',
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-600 via-yellow-400 to-pink-600 rounded-2xl mb-4 shadow-lg overflow-hidden">
            <img src={logoImage} alt="Logo" className="object-cover w-20 h-20" />
          </div>
          <h1
            className="text-4xl font-extrabold mb-2
              bg-gradient-to-r from-yellow-200 via-pink-400 via-50% to-blue-400 bg-[length:300%_300%]
              animate-gradient-psy bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(14,0,80,0.25)]"
          >
            Project Bragi
          </h1>
          <p
            className="font-semibold text-lg bg-gradient-to-r from-orange-200 via-yellow-400 to-fuchsia-400 bg-clip-text text-transparent animate-gradient-psy uppercase tracking-wide drop-shadow-[0_1px_7px_rgba(14,0,80,0.18)]"
          >
            Bring your stories to life
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse drop-shadow-glow" />
              <h2
                className="text-2xl font-bold bg-gradient-to-r from-fuchsia-300 via-yellow-300 to-purple-200 bg-clip-text text-transparent animate-gradient-psy drop-shadow-[0_2px_5px_rgba(255,224,150,0.30)]"
              >
                Create New Scenario
              </h2>
            </div>
            <div className="space-y-6">
              <div>
                <label
                  className="block text-sm font-bold mb-2
                    bg-gradient-to-r from-yellow-100 via-pink-200 to-blue-200 bg-clip-text text-transparent animate-gradient-psy tracking-wide uppercase"
                >
                  Scenario Name
                </label>
                <input
                  type="text"
                  value={scenarName}
                  onChange={handleNameChange}
                  placeholder="Enter an epic name..."
                  className="w-full px-4 py-3 bg-white/20 border border-white/20 rounded-xl text-white font-bold placeholder:font-semibold placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/30 border border-red-500/40 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-yellow-200 flex-shrink-0" />
                  <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent animate-gradient-psy font-semibold text-sm">
                    {error}
                  </span>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-400/20 border border-green-200/50 rounded-xl">
                  <Check className="w-5 h-5 text-yellow-100 flex-shrink-0" />
                  <span className="bg-gradient-to-r from-yellow-100 to-green-200 bg-clip-text text-transparent animate-gradient-psy font-semibold text-sm">
                    Scenario created successfully!
                  </span>
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={!scenarName.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3
                  bg-gradient-to-r from-yellow-300 via-fuchsia-500 to-pink-500
                  text-purple-900 font-extrabold rounded-xl hover:from-pink-400 hover:to-yellow-400
                  focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2 transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transform hover:scale-105 animate-gradient-psy uppercase tracking-wider backdrop-blur-sm"
              >
                <Plus className="w-5 h-5 font-bold" />
                Create Scenario
              </button>
            </div>
          </div>
          <div className="h-2 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 animate-gradient-psy"></div>
        </div>
        <div className="text-center mt-8">
          <p className="text-lg font-extrabold tracking-wide
            bg-gradient-to-r from-pink-100 via-yellow-200 to-blue-300 bg-clip-text text-transparent animate-gradient-psy drop-shadow-[0_1px_7px_rgba(14,0,80,0.10)] uppercase">
            Ready to craft your next masterpiece?
          </p>
        </div>
        {/* Existing scenarios loader */}
        <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-4">
          <h2 className="text-2xl font-bold mb-3 text-center">Load Existing Scenario</h2>
          {savedScenarios.length === 0 ? (
            <p className="text-center text-sm">No scenarios found.</p>
          ) : (
            <ul className="space-y-2">
              {savedScenarios.map((sc) => (
                <li key={sc.id} className="flex justify-between items-center p-2 bg-white/10 rounded">
                  <span>{sc.name}</span>
                  <button
                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                    onClick={() => navigate('/sceneEditor', { state: { scenario: sc } })}
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <style>
        {`
        @keyframes gradient-psy {
          0%, 100% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
        }

        .animate-gradient-psy {
          background-size: 200% 200%;
          animation: gradient-psy 7s ease-in-out infinite;
        }
        .drop-shadow-glow {
          filter: drop-shadow(0 0 6px rgba(255,230,150,0.65)) drop-shadow(0 2px 8px rgba(240,200,255,0.13));
        }
        `}
      </style>
    </div>
  );
};

export default Scenario;
