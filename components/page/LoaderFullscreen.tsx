import React from "react";

const LoaderFullscreen = () => {
  return (
    <>
      <div
        className="fixed flex items-center justify-center w-full h-full overflow-y-hidden bg-white"
        style={{ zIndex: "99999999" }}
      >
        <div className=" loader"></div>
      </div>
    </>
  );
};
export default LoaderFullscreen;
