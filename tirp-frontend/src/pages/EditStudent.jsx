import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`${baseUrl}/students/${id}`);
        if (!res.ok) throw new Error("Failed to fetch student");
        const data = await res.json();
        setFormData(data);
      } catch (err) {
        alert("Error fetching student data");
        console.error(err);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      academic: parseInt(formData.academic),
      wellbeing: parseInt(formData.wellbeing),
    };

    try {
      const res = await fetch(`http://localhost:8000/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ Student updated!");
        navigate("/students");
      } else {
        alert("❌ Failed to update student.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error.");
    }
  };

  if (!formData) return <p className="p-4">Loading student data...</p>;

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">✏️ Edit Student</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        {[
          { label: "Name", key: "name" },
          { label: "Class", key: "studentClass" },
          { label: "Academic Score", key: "academic", type: "number", min: 0, max: 100 },
          { label: "Wellbeing Score", key: "wellbeing", type: "number", min: 0, max: 100 },
          { label: "Friends (comma separated)", key: "friends" },
          { label: "Disrespectful Students", key: "disrespectful" },
          { label: "Activities", key: "activities" },
        ].map(({ label, key, type = "text", min, max }) => (
          <div key={key}>
            <label className="block text-sm font-semibold mb-1">{label}</label>
            <input
              type={type}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
              min={min}
              max={max}
              className="w-full px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditStudent;
