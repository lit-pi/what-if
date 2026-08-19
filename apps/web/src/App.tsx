import React, { useState, useMemo } from "react";
import { undercoverDemonKingScenario, PresetActionConfig } from "@lit-pi/what-if-scenarios";
import {
  SessionState,
  TurnResult,
  EndingResult,
  CharacterId,
  EndingKey,
} from "@lit-pi/what-if-contracts";
import { createSession, submitTurn } from "./api/client";
import { StartScreen } from "./components/StartScreen";
import { ScenarioCatalog } from "./components/ScenarioCatalog";
import { Header } from "./components/Header";
import { StatsDrawer } from "./components/StatsDrawer";
import { SceneStage } from "./components/SceneStage";
import { CharacterList } from "./components/CharacterList";
import { ActionBoard } from "./components/ActionBoard";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { EndingModal } from "./components/EndingModal";

const SCENE_BG_MAP: Record<string, string> = {
  gate: "/assets/demon_castle_gate_v.png",
  act2_ruins: "/assets/collapsed_ruins.png",
  act2_dungeon: "/assets/demon_dungeon_v.png",
  act3_library: "/assets/forbidden_library_v.png",
  act3_treasury: "/assets/demon_treasury_v.png",
  act4_corridor: "/assets/vanguard_corridor_v.png",
  act5_throne: "/assets/empty_throne_v.png",
};

const CHARACTER_PORTRAIT_MAP: Record<string, string> = {
  leon: "/assets/char_leon.png",
  ivette: "/assets/char_ivette.png",
  mira: "/assets/char_mira.png",
  locke: "/assets/char_locke.png",
  victor: "/assets/char_victor.png",
  aslan: "/assets/char_aslan.png",
};

export const App: React.FC = () => {
  const [view, setView] = useState<"start" | "catalog" | "play">("start");
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [turnHistory, setTurnHistory] = useState<TurnResult[]>([]);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("正在生成卧底会话...");
  const [error, setError] = useState<string | null>(null);

  // Start Session from Scenario Catalog or Start Screen
  const handleStartScenario = async (scenarioId = "undercover-demon-king") => {
    try {
      setIsLoading(true);
      setLoadingText("正在初始化剧本会话...");
      setError(null);
      setTurnHistory([]);
      const res = await createSession(scenarioId);
      setSessionState(res.sessionState);
      setView("play");
    } catch (err: any) {
      setError(err.message || "创建会话失败，请检查后端服务是否启动。");
    } finally {
      setIsLoading(false);
    }
  };

  const currentSceneId = sessionState?.currentSceneId || "gate";
  const currentSceneConfig = undercoverDemonKingScenario.scenes[currentSceneId];
  const latestTurn = turnHistory.length > 0 ? turnHistory[turnHistory.length - 1] : null;

  // Background Image
  const bgImage = SCENE_BG_MAP[currentSceneId] || "/assets/demon_castle_gate_v.png";

  // Speaker Portrait & Panicked Status
  const speakerId = latestTurn?.characterResponses?.[0]?.characterId || currentSceneConfig?.focusCharacters?.[0] || "aslan";
  const isPanicked = (sessionState?.stats.exposureRisk ?? 0) > 40 || speakerId === "aslan";
  const speakerPortrait = isPanicked && speakerId === "aslan"
    ? "/assets/char_aslan_panicked.png"
    : CHARACTER_PORTRAIT_MAP[speakerId] || "/assets/char_aslan.png";

  // Preset Actions for current scene
  const availablePresetActions = useMemo(() => {
    return Object.values(undercoverDemonKingScenario.presetActions).filter(
      (act): act is PresetActionConfig => act.sceneId === currentSceneId
    );
  }, [currentSceneId]);

  // Ending Determination
  const activeEnding: EndingResult | null = useMemo(() => {
    if (latestTurn?.ending) return latestTurn.ending;
    if (sessionState?.status === "ended" && sessionState.endingKey) {
      const endingDef = (undercoverDemonKingScenario.endings as Record<string, any>)[
        sessionState.endingKey
      ];
      if (endingDef) {
        return {
          key: endingDef.key as EndingKey,
          title: endingDef.title,
          tone: endingDef.tone,
          summary: endingDef.summary,
          causeTemplate: endingDef.causeTemplate,
          shareCopy: endingDef.shareCopy,
        };
      }
    }
    return null;
  }, [latestTurn, sessionState]);

  // Turn Actions
  const handlePresetSelect = async (presetActionId: string) => {
    if (!sessionState) return;
    try {
      setIsLoading(true);
      setLoadingText("裁决推理中...");
      setError(null);
      const clientTurnId = `ct-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const res = await submitTurn(sessionState.sessionId, {
        clientTurnId,
        actionType: "preset",
        presetActionId,
      });
      setSessionState(res.sessionState);
      setTurnHistory((prev) => [...prev, res.turnResult]);
    } catch (err: any) {
      setError(err.message || "行动提交失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFreeTextSubmit = async (freeText: string) => {
    if (!sessionState) return;
    try {
      setIsLoading(true);
      setLoadingText("GM 正在思考解释玩家行动...");
      setError(null);
      const clientTurnId = `ct-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const res = await submitTurn(sessionState.sessionId, {
        clientTurnId,
        actionType: "free_text",
        freeText,
      });
      setSessionState(res.sessionState);
      setTurnHistory((prev) => [...prev, res.turnResult]);
    } catch (err: any) {
      setError(err.message || "行动提交失败");
    } finally {
      setIsLoading(false);
    }
  };

  if (view === "start") {
    return (
      <StartScreen
        onStartGame={() => handleStartScenario("undercover-demon-king")}
        onOpenCatalog={() => setView("catalog")}
      />
    );
  }

  return (
    <div className="full-screen-app play-screen">
      <div className="bg-canvas" style={{ backgroundImage: `url('${bgImage}')` }} />
      <div className="bg-vignette-overlay" />

      {/* Full-screen Character Stage */}
      <div className="huge-character-stage">
        {speakerPortrait && (
          <img
            src={speakerPortrait}
            className={`huge-character-portrait-img cutout-transparent ${isPanicked ? "panicked-portrait-img" : ""}`}
            alt={speakerId}
          />
        )}
      </div>

      {isLoading && <LoadingOverlay message={loadingText} />}

      {view === "catalog" ? (
        <ScenarioCatalog onSelectScenario={(id) => handleStartScenario(id)} />
      ) : (
        <div className="screen-content play-content">
          <Header
            scenarioTitle={undercoverDemonKingScenario.title}
            actNumber={currentSceneConfig?.act || 1}
            locationName={currentSceneConfig?.title || "魔王城大门"}
            turnCount={turnHistory.length}
            isStatsOpen={isStatsOpen}
            onToggleStats={() => setIsStatsOpen((prev) => !prev)}
            onReturnCatalog={() => setView("catalog")}
          />

          {isStatsOpen && sessionState && <StatsDrawer stats={sessionState.stats} />}

          {error && (
            <div
              style={{
                background: "rgba(239, 71, 111, 0.9)",
                padding: "10px",
                borderRadius: "8px",
                fontSize: "12px",
                textAlign: "center",
                marginTop: "8px",
              }}
            >
              {error}
            </div>
          )}

          <SceneStage
            mishapDescription={currentSceneConfig?.mishap || null}
            latestTurn={latestTurn || null}
            initialNarration={currentSceneConfig?.title || null}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", zIndex: 10 }}>
            <CharacterList
              focusCharacters={(currentSceneConfig?.focusCharacters as CharacterId[]) || []}
            />

            <ActionBoard
              presetActions={availablePresetActions}
              disabled={isLoading || sessionState?.status === "ended"}
              onSelectPreset={handlePresetSelect}
              onSubmitFreeText={handleFreeTextSubmit}
            />
          </div>
        </div>
      )}

      {activeEnding && (
        <EndingModal
          ending={activeEnding}
          onRestart={() => handleStartScenario("undercover-demon-king")}
          onReturnCatalog={() => setView("catalog")}
        />
      )}
    </div>
  );
};
