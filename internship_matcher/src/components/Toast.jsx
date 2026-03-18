import React from 'react';

const Toast = ({message}) => {
    // If there is no message, don't show the component at all
    if (!message) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: '#729933', /* Your brand Green */
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
            fontWeight: 'bold',
            fontSize: '14px',
            animation: 'fadeIn 0.2s ease-in-out'
        }}>
            ✓ {message}
        </div>
    );
};

export default Toast;