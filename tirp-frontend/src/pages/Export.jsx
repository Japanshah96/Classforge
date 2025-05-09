import React from "react";

const Export = () => {
  const baseUrl = process.env.REACT_APP_API_URL;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `${baseUrl}/export/csv`;
    link.download = "students.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">📤 Export Students Data</h1>
      <p className="mb-6 text-gray-700">
        Click the button below to download all student records from the database in CSV format.
      </p>
      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        ⬇️ Download CSV
      </button>
    </div>
  );
};

export default Export;
