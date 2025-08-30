import React from 'react';

interface KeyStatBlockProps {
    value: string;
    title: string;
    description: string;
}

const KeyStatBlock: React.FC<KeyStatBlockProps> = ({ value, title, description }) => (
    <div className="key-stat-block">
        <div className="key-stat-block-content">
            <p className="key-stat-block-value">{value}</p>
            <p className="key-stat-block-title">{title}</p>
            <p className="key-stat-block-description">{description}</p>
        </div>
    </div>
);

export default KeyStatBlock;