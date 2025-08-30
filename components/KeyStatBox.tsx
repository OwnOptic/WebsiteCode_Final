import React from 'react';
import TrendingUpIcon from './icons/TrendingUpIcon';
import '../styles/KeyStatBox.css';

interface KeyStatBoxProps {
    value: string;
    label: string;
}

const KeyStatBox: React.FC<KeyStatBoxProps> = ({ value, label }) => {
    return (
        <div className="key-stat-box">
            <div className="key-stat-value">{value}</div>
            <div className="key-stat-label">{label}</div>
            <div className="key-stat-icon-decoration">
                <TrendingUpIcon />
            </div>
        </div>
    );
};

export default KeyStatBox;