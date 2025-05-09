import React, { useState } from 'react';

const PriorityForm = ({ onSubmit }) => {
  const [priorities, setPriorities] = useState({
    academic: 50,
    wellbeing: 50,
    social: 50,
    behavior: 50,
  });

  const handleChange = (key, value) => {
    setPriorities(prev => ({ ...prev, [key]: Number(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(priorities);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-xl max-w-xl mx-auto mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-center">🎯 Set Allocation Priorities</h2>

      {Object.entries(priorities).map(([key, value]) => (
        <div key={key}>
          <label className="block mb-1 text-gray-700 capitalize">{key}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full"
          />
          <div className="text-sm text-right text-gray-500">Weight: {value}</div>
        </div>
      ))}

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
        Run Allocation
      </button>
    </form>
  );
};

export default PriorityForm;
