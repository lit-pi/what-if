import React, { useRef, useState } from "react";
import { EndingResult } from "@lit-pi/what-if-contracts";

type EndingModalProps = {
  ending: EndingResult;
  onRestart: () => void;
  onReturnCatalog?: () => void;
};

export const EndingModal: React.FC<EndingModalProps> = ({
  ending,
  onRestart,
  onReturnCatalog,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const generatePoster = () => {
    setIsGenerating(true);
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 900;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 900);
    bgGrad.addColorStop(0, "#19141e");
    bgGrad.addColorStop(0.5, "#0e0c10");
    bgGrad.addColorStop(1, "#050405");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 600, 900);

    // Golden Borders
    ctx.strokeStyle = "#f0c36a";
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 560, 860);
    ctx.strokeStyle = "rgba(240, 195, 106, 0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(26, 26, 548, 848);

    // Header Badge
    ctx.fillStyle = "#c77dff";
    ctx.font = "bold 14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("WHAT-IF LIFE SIMULATOR • 结局结算卡", 300, 70);

    // Scenario Title
    ctx.fillStyle = "#d0c4b4";
    ctx.font = "16px Inter, sans-serif";
    ctx.fillText("《假如我是勇者队伍里的卧底魔王》", 300, 105);

    // Divider Line
    ctx.strokeStyle = "rgba(240, 195, 106, 0.3)";
    ctx.beginPath();
    ctx.moveTo(80, 125);
    ctx.lineTo(520, 125);
    ctx.stroke();

    // Ending Title
    ctx.fillStyle = "#f0c36a";
    ctx.font = "bold 32px Inter, serif";
    ctx.fillText(ending.title, 300, 190);

    // Ending Key Badge
    ctx.fillStyle = "rgba(199, 125, 255, 0.2)";
    ctx.fillRect(200, 215, 200, 28);
    ctx.strokeStyle = "#c77dff";
    ctx.strokeRect(200, 215, 200, 28);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.fillText(`KEY: ${ending.key}`, 300, 233);

    // Helper for Text Wrapping
    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split("");
      let line = "";
      let currentY = y;

      for (let i = 0; i < words.length; i++) {
        const char = words[i] ?? "";
        const testLine = line + char;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, x, currentY);
          line = char;
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, currentY);
      return currentY;
    };

    // Summary Card
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(50, 270, 500, 160);
    ctx.strokeStyle = "rgba(240, 195, 106, 0.25)";
    ctx.strokeRect(50, 270, 500, 160);

    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Inter, sans-serif";
    ctx.textAlign = "center";
    wrapText(ending.summary || "", 300, 310, 460, 26);

    // Cause Template Card
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(50, 450, 500, 160);
    ctx.strokeStyle = "rgba(199, 125, 255, 0.25)";
    ctx.strokeRect(50, 450, 500, 160);

    ctx.fillStyle = "#f0c36a";
    ctx.font = "bold 14px Inter, sans-serif";
    ctx.fillText("【因果推演追溯】", 300, 480);

    ctx.fillStyle = "#d0c4b4";
    ctx.font = "14px Inter, sans-serif";
    wrapText(ending.causeTemplate || "", 300, 515, 460, 24);

    // Share Copy Card
    ctx.fillStyle = "rgba(240, 195, 106, 0.08)";
    ctx.fillRect(50, 630, 500, 120);
    ctx.strokeStyle = "rgba(240, 195, 106, 0.3)";
    ctx.strokeRect(50, 630, 500, 120);

    ctx.fillStyle = "#ffffff";
    ctx.font = "italic 15px Inter, sans-serif";
    wrapText(`“${ending.shareCopy || ""}”`, 300, 675, 460, 24);

    // Footer Watermark
    ctx.fillStyle = "#777777";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText("What-If Life Simulator • AI 原生剧情推演模拟器", 300, 850);

    // Download Data URL
    setTimeout(() => {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `what-if-ending-${ending.key}.png`;
      link.href = dataUrl;
      link.click();
      setIsGenerating(false);
    }, 200);
  };

  return (
    <div className="ending-modal-backdrop">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="ending-card">
        <div className="ending-badge">WHAT-IF ENDING 结局达成</div>
        <h2 className="ending-title">{ending.title}</h2>
        <div className="ending-summary">{ending.summary}</div>
        <div className="ending-cause">因果推演：{ending.causeTemplate}</div>

        <button
          className="restart-btn"
          style={{ background: "linear-gradient(135deg, #c77dff 0%, #7b2cbf 100%)", color: "#fff" }}
          disabled={isGenerating}
          onClick={generatePoster}
        >
          {isGenerating ? "海报生成中..." : "📸 生成并保存结局海报卡"}
        </button>

        <div style={{ display: "flex", gap: "10px", width: "100%" }}>
          <button className="restart-btn" style={{ flex: 1 }} onClick={onRestart}>
            重新开始
          </button>
          {onReturnCatalog && (
            <button
              className="restart-btn"
              style={{
                flex: 1,
                background: "rgba(255, 255, 255, 0.12)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
              onClick={onReturnCatalog}
            >
              返回剧本大厅
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
