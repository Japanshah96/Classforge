import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);

  const [filters, setFilters] = useState({
    class: "",
    academicMin: 0,
    academicMax: 100,
    wellbeingMin: 0,
    wellbeingMax: 100,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost:8000/students");
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data);
        setFiltered(data);

        // Extract unique class names for dropdown
        const classSet = new Set(data.map((s) => s.studentClass));
        setClasses([...classSet]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const result = students.filter((s) => {
      return (
        (!filters.class || s.studentClass === filters.class) &&
        s.academic >= filters.academicMin &&
        s.academic <= filters.academicMax &&
        s.wellbeing >= filters.wellbeingMin &&
        s.wellbeing <= filters.wellbeingMax
      );
    });
    setFiltered(result);
  }, [filters, students]);

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`http://localhost:8000/students/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert("Failed to delete student.");
      }
    } catch (err) {
      alert("Error deleting student.");
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">📋 Student List</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-end bg-white p-4 rounded shadow">
        <div>
          <label className="text-sm font-medium">Class</label>
          <select
            value={filters.class}
            onChange={(e) => setFilters({ ...filters, class: e.target.value })}
            className="block w-40 mt-1 px-2 py-1 border rounded"
          >
            <option value="">All</option>
            {classes.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Academic Score</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={0}
              max={100}
              value={filters.academicMin}
              onChange={(e) => setFilters({ ...filters, academicMin: +e.target.value })}
              className="w-16 border px-2 py-1 rounded"
            />
            <span>to</span>
            <input
              type="number"
              min={0}
              max={100}
              value={filters.academicMax}
              onChange={(e) => setFilters({ ...filters, academicMax: +e.target.value })}
              className="w-16 border px-2 py-1 rounded"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Wellbeing Score</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={0}
              max={100}
              value={filters.wellbeingMin}
              onChange={(e) => setFilters({ ...filters, wellbeingMin: +e.target.value })}
              className="w-16 border px-2 py-1 rounded"
            />
            <span>to</span>
            <input
              type="number"
              min={0}
              max={100}
              value={filters.wellbeingMax}
              onChange={(e) => setFilters({ ...filters, wellbeingMax: +e.target.value })}
              className="w-16 border px-2 py-1 rounded"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading students...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-600">No students match the filters.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-blue-100 text-left text-sm font-semibold">
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Class</th>
                <th className="py-2 px-4 border-b">Academic</th>
                <th className="py-2 px-4 border-b">Wellbeing</th>
                <th className="py-2 px-4 border-b">Friends</th>
                <th className="py-2 px-4 border-b">Disrespectful</th>
                <th className="py-2 px-4 border-b">Activities</th>
                <th className="py-2 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 text-sm">
                  <td className="py-2 px-4 border-b">{student.name}</td>
                  <td className="py-2 px-4 border-b">{student.studentClass}</td>
                  <td className="py-2 px-4 border-b">{student.academic}</td>
                  <td className="py-2 px-4 border-b">{student.wellbeing}</td>
                  <td className="py-2 px-4 border-b">{student.friends}</td>
                  <td className="py-2 px-4 border-b">{student.disrespectful}</td>
                  <td className="py-2 px-4 border-b">{student.activities}</td>
                  <td className="py-2 px-4 border-b text-center space-x-2">
                    <button
                      onClick={() => navigate(`/edit-student/${student.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteStudent(student.id)}
                      className="text-red-600 hover:underline"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Students;
