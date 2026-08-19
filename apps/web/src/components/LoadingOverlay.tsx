import React from "react";

type LoadingOverlayProps = {
  message?: string;
};

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = "GM 裁决推演中...",
}) => {
  return (
    <div className="loading-overlay">
      <div className="spinner" />
      <div className="loading-text">{message}</div>
    </div>
  );
};
