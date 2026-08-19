import React from "react";
import { StatsMap } from "@lit-pi/what-if-contracts";

type StatsDrawerProps = {
  stats: StatsMap;
};

const STAT_CONFIGS: { key: keyof StatsMap; label: string; color: string }[] = [
  { key: "exposureRisk", label: "魔王暴露危险度", color: "var(--color-danger)" },
  { key: "heroTrust", label: "勇者莱昂信任度", color: "var(--color-good)" },
  { key: "mageEvidence", label: "法师伊薇特怀疑", color: "var(--color-warning)" },
  { key: "priestRedemption", label: "牧师米拉救赎感", color: "var(--purple-magic)" },
  { key: "thiefLeverage", label: "盗贼洛克把柄", color: "var(--color-mystic)" },
  { key: "castleIntegrity", label: "魔王城结界完整", color: "var(--gold-primary)" },
  { key: "victorMisread", label: "近卫队长误读度", color: "var(--color-sidequest)" },
  { key: "partyProgress", label: "勇者队伍推关度", color: "#4cc9f0" },
];

export const StatsDrawer: React.FC<StatsDrawerProps> = ({ stats }) => {
  return (
    <div className="dev-stats-popover">
      <div className="popover-title">⚙️ 同伴态度与隐性局势监控 (0-100)</div>
      <div className="popover-grid">
        {STAT_CONFIGS.map((cfg) => {
          const val = Math.max(0, Math.min(100, stats[cfg.key] ?? 0));
          return (
            <div key={cfg.key} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-sub)" }}>{cfg.label}:</span>
                <strong style={{ color: cfg.color }}>{val}</strong>
              </div>
              <div className="stat-bar-bg">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${val}%`, backgroundColor: cfg.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
