import React, { useState, useEffect } from 'react';

const SoulKeyInsights = ({ sessionId }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    if (!sessionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/grid/soulkey/${sessionId}`);
      
      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights);
      } else {
        throw new Error('Failed to fetch insights');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchInsights();
    }
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="soulkey-insights">
        <h3>🎭 SoulKey Insights</h3>
        <p>No session ID available</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="soulkey-insights">
        <h3>🎭 SoulKey Insights</h3>
        <p>Loading journey data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="soulkey-insights">
        <h3>🎭 SoulKey Insights</h3>
        <p>Error: {error}</p>
        <button onClick={fetchInsights}>Retry</button>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="soulkey-insights">
        <h3>🎭 SoulKey Insights</h3>
        <p>No journey data available</p>
      </div>
    );
  }

  return (
    <div className="soulkey-insights" style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      width: '300px',
      maxHeight: '400px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: '#00ff00',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      overflowY: 'auto',
      zIndex: 1000,
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>🎭 SoulKey Insights</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Session:</strong> {insights.sessionId.slice(-8)}...
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Total Interactions:</strong> {insights.totalInteractions}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Scenes Visited:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
          {insights.scenesVisited.map((scene, index) => (
            <li key={index}>{scene}</li>
          ))}
        </ul>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Zoom Actions:</strong> {insights.zoomActions}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Scene Transitions:</strong> {insights.sceneTransitions}
      </div>
      
      <div>
        <strong>Recent Journey:</strong>
        <div style={{ maxHeight: '150px', overflowY: 'auto', marginTop: '5px' }}>
          {insights.journeyPattern.slice(-5).map((step, index) => (
            <div key={index} style={{ 
              marginBottom: '5px', 
              padding: '3px', 
              backgroundColor: 'rgba(0, 255, 0, 0.1)',
              borderRadius: '3px'
            }}>
              <div><strong>{step.tile}</strong> → {step.scene}</div>
              {step.zoomTarget && <div>🔍 Zoom: {step.zoomTarget}</div>}
              {step.nextScene && <div>➡️ Next: {step.nextScene.sceneId}.{step.nextScene.subsceneId}</div>}
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={fetchInsights}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          backgroundColor: '#00ff00',
          color: '#000',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
          fontSize: '11px'
        }}
      >
        Refresh
      </button>
    </div>
  );
};

export default SoulKeyInsights; 