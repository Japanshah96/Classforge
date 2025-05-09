import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const Priorities = () => {
  const navigate = useNavigate();

  const [weights, setWeights] = useState({
    academic_weight: 1,
    wellbeing_weight: 1,
    friends_weight: 1,
    disrespect_weight: 1,
    activities_weight: 1,
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(`${baseUrl}/priorities/latest`);
        if (res.ok) {
          const data = await res.json();
          setWeights(data);
        }
      } catch (err) {
        console.log("No saved priorities yet.");
      }
    };

    fetchLatest();
  }, []);

  const handleChange = (key, value) => {
    setWeights({ ...weights, [key]: parseFloat(value) });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${baseUrl}/priorities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(weights),
      });

      if (res.ok) {
        setStatus("✅ Priorities saved.");
      } else {
        setStatus("❌ Failed to save.");
      }
    } catch (err) {
      setStatus("❌ Error saving priorities.");
    }

    setTimeout(() => setStatus(""), 3000);
  };

  const triggerAllocation = async () => {
    setLoading(true);
    setStatus("⚙️ Running AI allocation...");

    try {
      const res = await fetch(`${baseUrl}/run-allocation-ai`, {
        method: "POST",
      });

      if (res.ok) {
        setStatus("✅ Allocation complete. Redirecting to Allocation page...");
        setTimeout(() => navigate("/allocation"), 2000);
      } else {
        setStatus("❌ Allocation failed.");
      }
    } catch (err) {
      setStatus("❌ Error running AI model.");
    }

    setLoading(false);
  };

  const chartData = Object.entries(weights).map(([key, value]) => ({
    name: key.replace("_weight", "").replace("_", " "),
    value,
  }));

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">⚙️ Prioritization Settings</h1>

      {Object.entries(weights).map(([key, value]) => (
        <div key={key} className="mb-6">
          <label className="block mb-1 font-medium capitalize text-gray-700">
            {key.replace("_weight", "").replace("_", " ")}
          </label>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full"
          />
          <p className="text-sm text-gray-500">Weight: {value}</p>
        </div>
      ))}

      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Priorities
        </button>

        <button
          onClick={triggerAllocation}
          disabled={loading}
          className={`${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          } text-white px-4 py-2 rounded`}
        >
          {loading ? "Running AI..." : "Run AI Allocation"}
        </button>
      </div>

      {status && <p className="mt-3 text-green-600 font-medium">{status}</p>}

      <h2 className="mt-8 text-lg font-bold text-gray-800">📊 Live Priority Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#3b82f6" name="Weight" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Priorities;
