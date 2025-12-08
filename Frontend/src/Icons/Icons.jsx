import React, { useState } from "react";

const Icons = ({ icon: Icon, label }) => {
  const [showMsg, setShowMsg] = useState(false);

  const handleClick = () => {
    setShowMsg(true);

    // Auto hide after 1.5 sec
    setTimeout(() => setShowMsg(false), 1500);
  };

  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer">

      {/* ICON BOX */}
      <div
        onMouseEnter={() => setShowMsg(true)}
        onMouseLeave={() => setShowMsg(false)}
        onClick={handleClick}
        className="
          w-20 h-20 relative flex items-center justify-center
          rounded-xl text-blue-300
          bg-[#0a1122]/40
          border border-blue-400/40
          glow-border 
          hover:scale-110 transition duration-300
          overflow-hidden
        "
      >
        {/* The Icon itself */}
        <Icon
          size={34}
          className={`${showMsg ? "opacity-20" : "opacity-100"} transition`}
        />

        {/* THEME-MATCHED LOGIN MESSAGE */}
        {showMsg && (
          <div
            className="
              absolute inset-0 flex items-center justify-center
              bg-[#0a1122]/80 
              text-blue-300 text-[10px]
              rounded-xl text-center px-2
              z-50
              backdrop-blur-sm
              animate-fadeIn
            "
          >
            Login to view<br />the details
          </div>
        )}
      </div>

      <p className="text-white/80 text-sm">{label}</p>
    </div>
  );
};

export default Icons;
