import React from 'react';
import './ToggleSwitch.css';

/**
 * A simple, reusable toggle switch component.
 * @param {boolean} checked - The current state of the toggle.
 * @param {function} onChange - The function to call when the toggle is clicked.
 * @param {string} offLabel - The label for the 'off' state.
 * @param {string} onLabel - The label for the 'on' state.
 */
const ToggleSwitch = ({checked, onChange, offLabel = 'Inactive', onLabel = 'Active'}) => {
    const handleKeyDown = (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onChange();
        }
    };

    return (
        <div
            className={`toggle-switch-container ${checked ? 'on' : 'off'}`}
            onClick={onChange}
            onKeyDown={handleKeyDown}
            role="switch"
            aria-checked={checked}
            tabIndex={0}
            aria-label={`Toggle status, current status is ${checked ? onLabel : offLabel}`}
        >
            <div className="toggle-switch-label">{offLabel}</div>
            <div className="toggle-switch-track">
                <div className="toggle-switch-handle"/>
            </div>
            <div className="toggle-switch-label">{onLabel}</div>
        </div>
    );
};

export default ToggleSwitch;
