import React, { useState } from 'react';
import Draggable from 'react-draggable';
import ReferralAPI from '../../services/ReferralAPI';

/**
 * Composant de test pour le système de parrainage
 * À utiliser uniquement en développement
 * VERSION AMÉLIORÉE: Draggable + Minimizable pour éviter les blocages d'interface
 */
export const ReferralTest: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const addResult = (test: string, status: 'success' | 'error', data: any) => {
    setResults(prev => [...prev, { test, status, data, time: new Date().toLocaleTimeString() }]);
  };

  const runTests = async () => {
    setTesting(true);
    setResults([]);

    try {
      // Test 1: Health Check
      addResult('Health Check', 'success', { message: 'Testing backend health...' });
      const healthResponse = await fetch('http://localhost:3001/health');
      const healthData = await healthResponse.json();
      addResult('Health Check', healthData.success ? 'success' : 'error', healthData);

      // Test 2: Leaderboard (public endpoint)
      addResult('Get Leaderboard', 'success', { message: 'Fetching leaderboard...' });
      const leaderboardData = await ReferralAPI.getLeaderboard(5);
      addResult('Get Leaderboard', leaderboardData.success ? 'success' : 'error', leaderboardData);

      // Test 3: Validate Code (mock)
      addResult('Validate Code', 'success', { message: 'Validating mock code...' });
      const validateData = await ReferralAPI.validateCode('MOCK123');
      addResult('Validate Code', validateData.success ? 'success' : 'error', validateData);

    } catch (error: any) {
      addResult('Test Suite', 'error', { message: error.message });
    } finally {
      setTesting(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };

  // Minimized view
  if (isMinimized) {
    return (
      <Draggable
        handle=".drag-handle"
        position={position}
        onDrag={handleDrag}
        bounds="parent"
      >
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setIsMinimized(false)}
            className="drag-handle bg-purple-600/90 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-2xl border-2 border-purple-400/30 cursor-move transition"
          >
            🧪 Referral Tests
          </button>
        </div>
      </Draggable>
    );
  }

  return (
    <Draggable
      handle=".drag-handle"
      position={position}
      onDrag={handleDrag}
      bounds="parent"
    >
      <div className="fixed bottom-4 right-4 bg-black/90 backdrop-blur-lg rounded-xl p-4 max-w-md border-2 border-purple-400/30 shadow-2xl z-40">
        <div className="flex items-center justify-between mb-3 drag-handle cursor-move">
          <h3 className="text-white font-bold flex items-center gap-2">
            🧪 Referral System Tests
            <span className="text-xs text-purple-400">(Draggable)</span>
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="text-white/70 hover:text-white text-sm px-2 py-1 hover:bg-white/10 rounded transition"
              title="Minimiser"
            >
              ➖
            </button>
            <button
              onClick={clearResults}
              className="text-white/70 hover:text-white text-sm px-2 py-1 hover:bg-white/10 rounded transition"
              title="Effacer les résultats"
            >
              Clear
            </button>
          </div>
        </div>

        <button
          onClick={runTests}
          disabled={testing}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed mb-3 transition"
        >
          {testing ? '⏳ Testing...' : '▶️ Run Tests'}
        </button>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-white/50 text-sm text-center py-4">No tests run yet</p>
          ) : (
            results.map((result, index) => (
              <div
                key={index}
                className={`rounded-lg p-3 border ${
                  result.status === 'success'
                    ? 'bg-green-500/10 border-green-400/30'
                    : 'bg-red-500/10 border-red-400/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-semibold text-sm ${
                    result.status === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {result.status === 'success' ? '✓' : '✗'} {result.test}
                  </p>
                  <span className="text-white/50 text-xs">{result.time}</span>
                </div>
                <pre className="text-white/70 text-xs overflow-x-auto">
                  {JSON.stringify(result.data, null, 2).substring(0, 200)}
                  {JSON.stringify(result.data, null, 2).length > 200 && '...'}
                </pre>
              </div>
            ))
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-white/50 text-xs">
            Backend: <span className="text-green-400 font-mono">localhost:3001</span>
          </p>
          <p className="text-white/50 text-xs">
            Frontend: <span className="text-blue-400 font-mono">localhost:5173</span>
          </p>
          <p className="text-purple-400 text-xs mt-1">
            💡 Glissez-déposez pour déplacer
          </p>
        </div>
      </div>
    </Draggable>
  );
};

export default ReferralTest;
