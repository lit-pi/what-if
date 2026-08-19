import React from "react";

type HeaderProps = {
  scenarioTitle: string;
  actNumber: number;
  locationName: string;
  turnCount: number;
  isStatsOpen: boolean;
  onToggleStats: () => void;
  onReturnCatalog?: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  actNumber,
  locationName,
  isStatsOpen,
  onToggleStats,
  onReturnCatalog,
}) => {
  return (
    <header className="minimal-top-bar">
      {onReturnCatalog && (
        <button
          style={{
            fontSize: "11px",
            color: "var(--gold-primary)",
            padding: "2px 6px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "6px",
            border: "1px solid rgba(240, 195, 106, 0.3)",
          }}
          onClick={onReturnCatalog}
        >
          ← 大厅
        </button>
      )}
      <div className="scene-title-group">
        <span className="act-badge">Act {actNumber}/5</span>
        <span className="location-title">{locationName}</span>
      </div>
      <button
        id="dev-stats-toggle"
        className="dev-icon-btn"
        title="查看局势与设置"
        onClick={onToggleStats}
      >
        ⚙️ {isStatsOpen ? "收起" : "局势"}
      </button>
    </header>
  );
};
