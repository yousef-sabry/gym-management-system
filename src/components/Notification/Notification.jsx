import React, { useEffect } from "react";
import "./Notification.css";

const Notification = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500); // تختفي بعد 2.5 ثانية
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      <p>{message}</p>
    </div>
  );
};

export default Notification;
