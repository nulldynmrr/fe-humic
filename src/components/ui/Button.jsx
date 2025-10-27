"use client";
import React from "react";

const Button = ({
  variant = "primary",
  text,
  icon,
  iconPosition = "left",
  onClick,
  fullWidth = false,
  maxWidth,
  loading = false,
  bgColor,
  textColor,
  equalSize,
}) => {
  const baseStyle =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors duration-200";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-600 ",
    secondary:
      "bg-white text-primary border border-primary-500 hover:bg-primary",
    disabled: "bg-neut-300 text-white cursor-not-allowed",
    outline: "border border-neut-300 text-neut-300 hover:bg-neut-100",
    round: "bg-primary text-white hover:bg-primary rounded-[20px] px-7 py-1",
    about:
      "bg-primary text-white hover:bg-primary rounded-l px-5 py-2 text-sm sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-5 shadow-md cursor-pointer transition-all duration-200",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const customMaxWidth = maxWidth ? `max-w-[${maxWidth}]` : "";
  const isIconOnly = icon && !text;

  const customColorStyle = {
    ...(bgColor && { backgroundColor: bgColor }),
    ...(textColor && { color: textColor }),
    ...(variant === "secondary" && bgColor && { borderColor: bgColor }),
  };

  return (
    <button
      className={`${baseStyle} ${
        variants[variant]
      } ${widthStyle} ${customMaxWidth} 
        ${isIconOnly ? "p-3 text-xl" : ""} 
        ${equalSize ? "w-10 h-10 p-0" : ""}  // 🔥 tambahkan ini
      `}
      onClick={onClick}
      disabled={variant === "disabled" || loading}
      style={{
        maxWidth,
        ...customColorStyle,
      }}
    >
      {loading && (
        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
      )}

      {!loading && icon && iconPosition === "left" && <span>{icon}</span>}

      {text && <span>{text}</span>}

      {!loading && icon && iconPosition === "right" && <span>{icon}</span>}
    </button>
  );
};

export default Button;
