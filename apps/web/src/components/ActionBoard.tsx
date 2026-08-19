import React, { useState } from "react";
import { PresetActionConfig } from "@lit-pi/what-if-scenarios";

type ActionBoardProps = {
  presetActions: PresetActionConfig[];
  disabled: boolean;
  onSelectPreset: (actionId: string) => void;
  onSubmitFreeText: (freeText: string) => void;
};

export const ActionBoard: React.FC<ActionBoardProps> = ({
  presetActions,
  disabled,
  onSelectPreset,
  onSubmitFreeText,
}) => {
  const [freeText, setFreeText] = useState("");

  const handleFreeTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!freeText.trim() || disabled) return;
    onSubmitFreeText(freeText.trim());
    setFreeText("");
  };

  return (
    <div className="action-board">
      <div className="preset-actions-grid">
        {presetActions.map((act) => (
          <button
            key={act.id}
            className="preset-action-btn"
            disabled={disabled}
            onClick={() => onSelectPreset(act.id)}
          >
            <div className="preset-label">{act.label}</div>
            <div className="preset-desc">{act.description}</div>
          </button>
        ))}
      </div>

      <form className="free-text-area" onSubmit={handleFreeTextSubmit}>
        <input
          type="text"
          className="free-text-input"
          placeholder="自由输入卧底表述或应对举动..."
          value={freeText}
          disabled={disabled}
          onChange={(e) => setFreeText(e.target.value)}
        />
        <button
          type="submit"
          className="free-text-submit-btn"
          disabled={disabled || !freeText.trim()}
        >
          提交
        </button>
      </form>
    </div>
  );
};
