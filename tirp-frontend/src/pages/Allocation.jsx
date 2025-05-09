import { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

const Allocation = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/students");
        const students = await res.json();

        const nodes = students.map((s) => ({
          id: s.name,
          group: s.studentClass,
          academic: s.academic,
          wellbeing: s.wellbeing,
        }));

        const nodeIds = new Set(nodes.map((n) => n.id));
        const links = [];

        students.forEach((s) => {
          const from = s.name;

          if (s.friends) {
            s.friends.split(",").forEach((f) => {
              const target = f.trim();
              if (nodeIds.has(target)) {
                links.push({ source: from, target, type: "friend" });
              }
            });
          }

          if (s.disrespectful) {
            s.disrespectful.split(",").forEach((d) => {
              const target = d.trim();
              if (nodeIds.has(target)) {
                links.push({ source: from, target, type: "disrespect" });
              }
            });
          }
        });

        setGraphData({ nodes, links });
      } catch (err) {
        console.error("Failed to load graph data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-blue-800">🧠 Class Social Graph</h1>
      <div style={{ height: "600px", background: "#fff" }}>
        <ForceGraph2D
          graphData={graphData}
          nodeLabel={(node) =>
            `${node.id}\nClass: ${node.group}\nAcademic: ${node.academic}\nWellbeing: ${node.wellbeing}`
          }
          nodeAutoColorBy="group"
          linkColor={(link) => (link.type === "disrespect" ? "red" : "green")}
          linkDirectionalArrowLength={4}
          linkDirectionalArrowRelPos={1}
        />
      </div>
    </div>
  );
};

export default Allocation;
