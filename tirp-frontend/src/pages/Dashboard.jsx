import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    classes: 0,
    avgAcademic: 0,
    avgWellbeing: 0,
    lastUpdated: "",
  });
  const [chartData, setChartData] = useState([]);
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${baseUrl}/stats-summary`);
        const data = await res.json();
        console.log("Chart Data:", data.classAverages); // 👈 Add this line
        setStats(data);
        setChartData(data.classAverages || []);
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">📊 Dashboard Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-sm text-gray-500">Total Students</h2>
          <p className="text-xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-sm text-gray-500">Total Classes</h2>
          <p className="text-xl font-bold">{stats.classes}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-sm text-gray-500">Average Academic</h2>
          <p className="text-xl font-bold">{stats.avgAcademic}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-sm text-gray-500">Average Wellbeing</h2>
          <p className="text-xl font-bold">{stats.avgWellbeing}</p>
        </div>
      </div>

      <div className="bg-white shadow p-6 rounded">
        <h2 className="text-lg font-semibold mb-4 text-blue-700">Classwise Scores</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="class" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgAcademic" fill="#8884d8" name="Academic" />
            <Bar dataKey="avgWellbeing" fill="#82ca9d" name="Wellbeing" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 text-gray-500 text-sm">
        <p>Last updated: {stats.lastUpdated || "Loading..."}</p>
      </div>
    </div>
  );
};

export default Dashboard;
