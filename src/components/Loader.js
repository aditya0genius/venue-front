import React, { useState, CSSProperties } from "react";
import DotLoader from "react-spinners/DotLoader";

function Loader() {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#000000");
  

  return (
    <div>
      <div className="sweet-loading">
        <DotLoader
          color={color}
          loading={loading}
    
          size={200}
        />
      </div>
    </div>
  );
}

export default Loader;
