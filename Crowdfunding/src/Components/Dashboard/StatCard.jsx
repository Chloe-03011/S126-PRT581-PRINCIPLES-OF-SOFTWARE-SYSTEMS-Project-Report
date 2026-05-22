import React from 'react';

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg border border-border-light shadow-sm">
        <div className={`${color} mb-4`}>
            <Icon size={24} />
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-bold text-text-primary tracking-tight">{value}</p>
    </div>
);

export default StatCard;
