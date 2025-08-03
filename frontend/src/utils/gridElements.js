import React from 'react';

/**
 * Reusable Grid Elements
 * Common UI components for grid pages
 */

// Helper function for grid cell styling
export const getGridCellStyle = (col, row, spanCols = 1, spanRows = 1) => ({
  gridColumn: `${col} / span ${spanCols}`,
  gridRow: `${row} / span ${spanRows}`,
  position: 'relative',
  zIndex: 10
});

// Common button styles
export const buttonStyles = {
  primary: {
    backgroundColor: 'rgba(0, 255, 0, 0.8)',
    border: '2px solid #00ff00',
    color: '#000',
    fontFamily: 'monospace',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  danger: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    border: '2px solid #ff0000',
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  warning: {
    backgroundColor: 'rgba(255, 170, 0, 0.8)',
    border: '2px solid #ffaa00',
    color: '#000',
    fontFamily: 'monospace',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};

// Create a back button
export const createBackButton = (onClick, style = buttonStyles.danger) => {
  return React.createElement('div', {
    onClick: onClick,
    style: {
      ...getGridCellStyle(1, 1, 1, 1),
      ...style,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      zIndex: 25
    },
    onMouseEnter: (e) => {
      e.target.style.backgroundColor = e.target.style.backgroundColor.replace('0.8', '1');
      e.target.style.transform = 'scale(1.05)';
    },
    onMouseLeave: (e) => {
      e.target.style.backgroundColor = e.target.style.backgroundColor.replace('1', '0.8');
      e.target.style.transform = 'scale(1)';
    }
  }, '← HOME');
};

// Create a title
export const createTitle = (text, col = 2, row = 1, spanCols = 3) => {
  return React.createElement('div', {
    style: {
      ...getGridCellStyle(col, row, spanCols, 1),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#00ff00',
      fontFamily: 'monospace',
      fontSize: '18px',
      fontWeight: 'bold',
      textAlign: 'center',
      zIndex: 25
    }
  }, text);
};

// Create a status indicator
export const createStatusIndicator = (status, col = 11, row = 1) => {
  const colors = {
    connected: '#00ff00',
    error: '#ffaa00',
    disconnected: '#ff0000'
  };
  
  const symbols = {
    connected: '●',
    error: '⚠',
    disconnected: '✗'
  };

  return React.createElement('div', {
    style: {
      ...getGridCellStyle(col, row, 1, 1),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors[status] || '#666',
      fontFamily: 'monospace',
      fontSize: '10px',
      fontWeight: 'bold',
      zIndex: 25
    }
  }, symbols[status] || '?');
};

// Create a window/panel
export const createWindow = (content, col, row, spanCols, spanRows, title = null) => {
  const windowContent = [];
  
  if (title) {
    windowContent.push(React.createElement('div', {
      key: 'title',
      style: {
        fontWeight: 'bold',
        marginBottom: '10px',
        borderBottom: '1px solid #00ff00',
        paddingBottom: '5px'
      }
    }, title));
  }
  
  windowContent.push(React.createElement('div', { key: 'content' }, content));

  return React.createElement('div', {
    style: {
      ...getGridCellStyle(col, row, spanCols, spanRows),
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: '2px solid #00ff00',
      borderRadius: '8px',
      padding: '15px',
      color: '#00ff00',
      fontFamily: 'monospace',
      fontSize: '14px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 20
    }
  }, windowContent);
};

// Create an input box
export const createInputBox = (inputRef, value, onChange, onSubmit, placeholder, disabled = false, col = 5, row = 7, spanCols = 3) => {
  return React.createElement('div', {
    onClick: () => inputRef?.current?.focus(),
    style: {
      ...getGridCellStyle(col, row, spanCols, 1),
      background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.1), rgba(160, 82, 45, 0.05))',
      border: '1px solid rgba(210, 180, 140, 0.4)',
      borderRadius: '8px',
      padding: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      zIndex: 30,
      cursor: 'text',
      pointerEvents: 'auto',
      boxShadow: '0 4px 16px rgba(139, 69, 19, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(3px)'
    }
  }, [
    React.createElement('form', {
      key: 'form',
      onSubmit: onSubmit,
      style: { display: 'flex', width: '100%', gap: '14px', pointerEvents: 'auto' }
    }, [
      React.createElement('input', {
        key: 'input',
        ref: inputRef,
        type: 'text',
        value: value,
        onChange: onChange,
        placeholder: placeholder,
        style: {
          flex: 1,
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '0',
          padding: '10px 0',
          color: '#F5DEB3',
          fontFamily: 'Georgia, serif',
          fontSize: '14px',
          outline: 'none',
          pointerEvents: 'auto',
          cursor: 'text',
          opacity: disabled ? 0.6 : 1,
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
        },
        disabled: disabled,
        autoFocus: true
      }),
      React.createElement('button', {
        key: 'button',
        type: 'submit',
        disabled: disabled || !value.trim(),
        style: {
          background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.2), rgba(160, 82, 45, 0.15))',
          color: '#D2B48C',
          border: '1px solid rgba(210, 180, 140, 0.5)',
          borderRadius: '6px',
          padding: '10px 18px',
          fontFamily: 'Georgia, serif',
          fontSize: '14px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: (disabled || !value.trim()) ? 0.5 : 1,
          pointerEvents: 'auto',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(139, 69, 19, 0.2)'
        },
        onMouseEnter: (e) => {
          if (!disabled && value.trim()) {
            e.target.style.background = 'linear-gradient(135deg, rgba(210, 180, 140, 0.3), rgba(160, 82, 45, 0.25))';
            e.target.style.boxShadow = '0 4px 16px rgba(139, 69, 19, 0.4)';
            e.target.style.transform = 'scale(1.05)';
          }
        },
        onMouseLeave: (e) => {
          e.target.style.background = 'linear-gradient(135deg, rgba(210, 180, 140, 0.2), rgba(160, 82, 45, 0.15))';
          e.target.style.boxShadow = '0 2px 8px rgba(139, 69, 19, 0.2)';
          e.target.style.transform = 'scale(1)';
        }
      }, 'Send')
    ])
  ]);
};

// Create a loading spinner
export const createLoadingSpinner = (text = "Processing...") => {
  return React.createElement('div', {
    style: {
      padding: '10px',
      color: '#00ff00',
      fontStyle: 'italic',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, [
    React.createElement('div', {
      key: 'spinner',
      style: {
        width: '16px',
        height: '16px',
        border: '2px solid #00ff00',
        borderTop: '2px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }
    }),
    text
  ]);
};

// Create a grid action handler
export const createGridAction = (gridIndex, handler, description = "") => {
  return (col, row, index) => {
    console.log(`Grid action triggered: ${description} at G${col}.${row}`);
    handler(col, row, index);
  };
};

// Common grid configurations
export const gridConfigs = {
  standard: {
    gridCols: 11,
    gridRows: 7
  },
  wide: {
    gridCols: 15,
    gridRows: 7
  },
  tall: {
    gridCols: 11,
    gridRows: 10
  },
  large: {
    gridCols: 15,
    gridRows: 10
  }
}; 