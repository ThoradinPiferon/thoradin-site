import React, { useState, useEffect } from 'react';
import { addGridAction, removeGridAction, PAGES, ACTION_TYPES } from '../utils/gridActionSystem';

/**
 * Demonstration of dynamic grid action management
 * This shows how easy it is to add/remove grid actions
 */
const GridActionDemo = () => {
  const [actions, setActions] = useState([]);

  // Example: Add a new action to the home page
  const addHomeAction = () => {
    const newAction = {
      type: 'custom',
      description: 'Demo home action',
      execute: () => alert('Home action executed!')
    };
    addGridAction(PAGES.HOME, 'D4', newAction);
    setActions(prev => [...prev, { page: PAGES.HOME, grid: 'D4', action: newAction }]);
  };

  // Example: Add a new action to the vault page
  const addVaultAction = () => {
    const newAction = {
      type: 'custom',
      description: 'Demo vault action',
      execute: () => alert('Vault action executed!')
    };
    addGridAction(PAGES.VAULT, 'F6', newAction);
    setActions(prev => [...prev, { page: PAGES.VAULT, grid: 'F6', action: newAction }]);
  };

  // Example: Remove an action
  const removeAction = (page, gridKey) => {
    removeGridAction(page, gridKey);
    setActions(prev => prev.filter(action => !(action.page === page && action.grid === gridKey)));
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '2px solid #00ff00',
      borderRadius: '8px',
      padding: '15px',
      color: '#00ff00',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#00ff00' }}>
        Grid Action Demo
      </h3>
      
      <div style={{ marginBottom: '15px' }}>
        <button onClick={addHomeAction} className="btn btn-primary">
          Add Home Action (D4)
        </button>
        
        <button onClick={addVaultAction} className="btn btn-secondary">
          Add Vault Action (F6)
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Active Dynamic Actions:</strong>
      </div>
      
      {actions.length === 0 ? (
        <div style={{ color: '#666', fontStyle: 'italic' }}>
          No dynamic actions added yet
        </div>
      ) : (
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {actions.map((action, index) => (
            <div key={index} style={{
              margin: '5px 0',
              padding: '8px',
              backgroundColor: 'rgba(0, 255, 0, 0.1)',
              borderRadius: '4px',
              border: '1px solid #00ff00'
            }}>
              <div style={{ fontWeight: 'bold' }}>
                {action.page}: {action.grid}
              </div>
              <div style={{ fontSize: '10px', color: '#ccc' }}>
                {action.action.description}
              </div>
              <button
                onClick={() => removeAction(action.page, action.grid)}
                style={{
                  backgroundColor: '#ff0000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '4px 8px',
                  marginTop: '5px',
                  cursor: 'pointer',
                  fontSize: '10px'
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: '10px', 
        padding: '8px', 
        backgroundColor: 'rgba(255, 170, 0, 0.1)',
        borderRadius: '4px',
        fontSize: '10px'
      }}>
        <strong>Instructions:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
          <li>Click buttons to add dynamic actions</li>
          <li>Navigate to pages to test the actions</li>
          <li>Actions persist until removed or page refresh</li>
        </ul>
      </div>
    </div>
  );
};

export default GridActionDemo; 