import React from "react";

const Loading = () => {
  return (
    <div>
      <div className="absolute right-1/2 bottom-1/2  transform translate-x-1/2 translate-y-1/2 ">
        <div className="border-t-transparent border-solid animate-spin  rounded-full border-pink border-8 md:h-64 md:w-64 w-28 h-28"></div>
      </div>
    </div>
  );
};

export default Loading;
