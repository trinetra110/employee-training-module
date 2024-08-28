import React, { useEffect, useState } from "react";

const ProgressTracker = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/progress/percentage")
      .then((response) => response.json())
      .then((data) => setProgress(data.percentage));
  }, []);

  return (
    <div>
      <h2>Progress: {progress}%</h2>
    </div>
  );
};

export default ProgressTracker;
