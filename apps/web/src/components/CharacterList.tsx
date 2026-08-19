import React from "react";
import { CharacterId } from "@lit-pi/what-if-contracts";

type CharacterListProps = {
  focusCharacters: CharacterId[];
};

const CHARACTER_MAP: Record<string, { name: string; role: string; avatarImg: string }> = {
  leon: { name: "莱昂", role: "勇者", avatarImg: "/assets/char_leon.png" },
  ivette: { name: "伊薇特", role: "大魔法师", avatarImg: "/assets/char_ivette.png" },
  mira: { name: "米拉", role: "圣职者", avatarImg: "/assets/char_mira.png" },
  locke: { name: "洛克", role: "游侠盗贼", avatarImg: "/assets/char_locke.png" },
  victor: { name: "维克多", role: "魔王近卫队长", avatarImg: "/assets/char_victor.png" },
  aslan: { name: "阿斯兰", role: "卧底魔王(你)", avatarImg: "/assets/char_aslan.png" },
  narrator: { name: "旁白", role: "GM裁决", avatarImg: "/assets/char_aslan_panicked.png" },
};

export const CharacterList: React.FC<CharacterListProps> = ({ focusCharacters }) => {
  if (!focusCharacters || focusCharacters.length === 0) return null;

  return (
    <div className="character-list-row">
      {focusCharacters.map((charId) => {
        const info = CHARACTER_MAP[charId] || {
          name: charId,
          role: "角色",
          avatarImg: "/assets/char_aslan.png",
        };
        return (
          <div key={charId} className="character-card">
            <img src={info.avatarImg} className="char-avatar-img" alt={info.name} />
            <div>
              <div className="char-name">{info.name}</div>
              <div className="char-role">{info.role}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
