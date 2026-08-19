import React from "react";

type StartScreenProps = {
  onStartGame: () => void;
  onOpenCatalog: () => void;
};

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  onOpenCatalog,
}) => {
  return (
    <div className="full-screen-app start-screen">
      <div
        className="bg-canvas"
        style={{ backgroundImage: "url('/assets/start_poster_v.png')" }}
      />
      <div className="bg-vignette-overlay" />

      <div className="screen-content">
        <header className="title-header">
          <span className="game-tag-pill">What-If Life Simulator · 暗黑奇幻高概念剧本</span>
          <h1 className="glow-title">假如我是爽文小说中的反派...</h1>
          <p className="tagline">
            “本来只想混个卧底摸鱼，谁知道一不小心混成了勇者队的战力天花板……”
          </p>
        </header>

        <div style={{ flex: 1 }} />

        <section className="poster-brief-card" style={{ marginBottom: "16px" }}>
          <strong>阿斯兰 · 卧底魔王潜伏契约</strong>
          <p>
            眼看勇者小队一路横推、直接骑到了自家魔王城头上！既要当好带头大哥带队攻城，又要背地里帮呆萌部下打掩护。不被当场抓包、保全魔王城并撑到王座大殿，即算终极通关！
          </p>
        </section>

        <footer style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button className="glow-primary-btn pulse" onClick={onStartGame}>
            <span>步步惊心 · 悬疑对战</span>
          </button>
          <button className="glow-secondary-btn" onClick={onOpenCatalog}>
            <span>进入剧本大厅</span>
          </button>
        </footer>
      </div>
    </div>
  );
};
