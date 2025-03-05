import React from "react";

function Modal({ show, children, onBackDropClick, className }) {
  if (!show) {
    return <></>;
  }
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (onBackDropClick) {
          onBackDropClick();
        }
      }}
      className="fixed inset-0 flex items-center justify-center w-screen h-screen z-50 bg-black/40"
    >
      <div
        className={className}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
