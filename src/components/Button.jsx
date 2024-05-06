import React from "react";

const CustomButton = ({
  border = "none",
  color = " #FF2E63",
  children,
  height = "50px",
  onClick,
  width = "100px",
  textColor = "white",
  borderRadius = "10px",
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: color,
        border: border,
        height: height,
        width: width,
        color: textColor,
        borderRadius: borderRadius,
        fontSize: "1.2rem",
      }}
    >
      {children}
    </button>
  );
};

export default CustomButton;
