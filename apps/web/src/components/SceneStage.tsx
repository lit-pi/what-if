import React from "react";
import { TurnResult } from "@lit-pi/what-if-contracts";

export type SceneStageProps = {
  mishapDescription?: string | null;
  latestTurn?: TurnResult | null;
  initialNarration?: string | null;
};

const CHARACTER_NAME_MAP: Record<string, string> = {
  leon: "勇者 莱昂",
  ivette: "魔法师 伊薇特",
  mira: "圣职者 米拉",
  locke: "游侠 洛克",
  victor: "近卫队长 维克多",
  aslan: "卧底魔王 阿斯兰",
  narrator: "GM 旁白",
};

const ADJUDICATION_MAP: Record<string, { label: string; className: string }> = {
  success: { label: "✨ 思考裁决: 表达说服同伴", className: "adj-success" },
  costly_success: { label: "⚡ 思考裁决: 付出代价化解", className: "adj-costly_success" },
  disaster_failure: { label: "🔥 思考裁决: 严重破绽 · 身份败露", className: "adj-disaster_failure" },
};

export const SceneStage: React.FC<SceneStageProps> = ({
  mishapDescription,
  latestTurn,
  initialNarration,
}) => {
  const narration = latestTurn ? latestTurn.narration : (initialNarration || "");
  const dialogues = latestTurn?.characterResponses || [];
  const adjInfo = latestTurn ? ADJUDICATION_MAP[latestTurn.adjudication] : null;

  return (
    <div className="img2797-bottom-stage">
      {adjInfo && (
        <div className={`adjudication-pill ${adjInfo.className}`}>
          {adjInfo.label}
        </div>
      )}

      {mishapDescription && (
        <div className="mishap-card">
          <div className="mishap-tag">当前突发危机</div>
          <div className="mishap-title">{mishapDescription}</div>
        </div>
      )}

      <div className="narration-box">
        <div>{narration}</div>

        {dialogues.map((dlg, idx) => (
          <div key={idx} className="dialogue-item">
            <div className="dialogue-speaker">
              {CHARACTER_NAME_MAP[dlg.characterId] || dlg.speakerName || dlg.characterId}:
            </div>
            <div className="dialogue-text">{dlg.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
