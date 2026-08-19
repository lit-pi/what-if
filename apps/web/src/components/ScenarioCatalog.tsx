import React from "react";
import { ScenarioCatalogItem, scenariosCatalog } from "@lit-pi/what-if-scenarios";

type ScenarioCatalogProps = {
  onSelectScenario: (scenarioId: string) => void;
};

export const ScenarioCatalog: React.FC<ScenarioCatalogProps> = ({ onSelectScenario }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "20px",
        height: "100%",
        overflowY: "auto",
        zIndex: 4,
        background: "linear-gradient(180deg, rgba(14, 12, 16, 0.95) 0%, rgba(5, 4, 5, 0.98) 100%)",
      }}
    >
      <div style={{ textAlignment: "center", marginBottom: "8px" } as any}>
        <div
          style={{
            fontSize: "11px",
            color: "var(--purple-magic)",
            fontWeight: "bold",
            letterSpacing: "2px",
            marginBottom: "4px",
            textAlign: "center",
          }}
        >
          WHAT-IF SCENARIO CATALOG
        </div>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "var(--gold-primary)",
            margin: 0,
            textAlign: "center",
          }}
        >
          剧本体验大厅
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {scenariosCatalog.map((item: ScenarioCatalogItem) => (
          <div
            key={item.id}
            style={{
              background: "rgba(20, 16, 24, 0.92)",
              border: item.isAvailable
                ? "1px solid var(--gold-primary)"
                : "1px dashed rgba(255, 255, 255, 0.2)",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              boxShadow: item.isAvailable ? "0 4px 20px rgba(240, 195, 106, 0.15)" : "none",
              opacity: item.isAvailable ? 1 : 0.65,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2
                style={{
                  fontSize: "15px",
                  fontWeight: "bold",
                  color: item.isAvailable ? "var(--gold-primary)" : "#aaa",
                  margin: 0,
                }}
              >
                {item.title}
              </h2>
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--color-warning)",
                  background: "rgba(0, 0, 0, 0.4)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                {item.difficulty}
              </span>
            </div>

            <div style={{ fontSize: "12px", color: "var(--text-sub)", lineHeight: "1.4" }}>
              {item.description}
            </div>

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "10px",
                    color: "var(--purple-magic)",
                    background: "rgba(199, 125, 255, 0.12)",
                    border: "1px solid rgba(199, 125, 255, 0.3)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              焦点阵容: {item.focusCharacters.join(" | ")}
            </div>

            {item.isAvailable ? (
              <button
                style={{
                  marginTop: "6px",
                  padding: "10px",
                  background: "linear-gradient(135deg, var(--gold-primary) 0%, #b8860b 100%)",
                  borderRadius: "8px",
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: "13px",
                  textAlign: "center",
                }}
                onClick={() => onSelectScenario(item.id)}
              >
                进入剧本模拟
              </button>
            ) : (
              <button
                disabled
                style={{
                  marginTop: "6px",
                  padding: "10px",
                  background: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  color: "#888",
                  fontSize: "12px",
                  cursor: "not-allowed",
                  textAlign: "center",
                }}
              >
                敬请期待
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
