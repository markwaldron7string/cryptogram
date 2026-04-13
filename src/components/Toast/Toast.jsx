import React, { useEffect } from "react";
import "./Toast.css";

const Toast = ({ message, show, setShow }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [show, setShow]);

  return (
    <div className={`toast ${show ? "show" : ""}`}>
      {message}
    </div>
  );
};

export default Toast;