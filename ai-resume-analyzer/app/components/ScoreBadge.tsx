import React from 'react'

interface ScoreBadgeProps {
    score: number;
}

const ScoreBadge = ({ score }: ScoreBadgeProps) => {
    let badgeClass = "";
    let textClass = "";
    let label = "";

    if (score > 70) {
        badgeClass = "bg-badge-green";
        textClass = "text-green-600";
        label = "Strong";
    } else if (score > 49) {
        badgeClass = "bg-badge-yellow";
        textClass = "text-yellow-600";
        label = "Good work";
    } else {
        badgeClass = "bg-badge-red";
        textClass = "text-red-600";
        label = "Needs work";
    }

    return (
        <div className={`inline-flex items-center rounded-full px-3 py-1 ${badgeClass}`}>
            <p className={`text-sm font-medium ${textClass}`}>
                {label}
            </p>
        </div>
    );
};

export default ScoreBadge;

