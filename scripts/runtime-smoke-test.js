import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const appPath = path.join(root, 'src/app.js');
const source = fs.readFileSync(appPath, 'utf8');

function extractConstObject(name) {
  const marker = `const ${name} = `;
  const start = source.indexOf(marker);
  if (start === -1) throw new Error(`Missing const ${name}`);

  const objectStart = source.indexOf('{', start);
  if (objectStart === -1) throw new Error(`Missing object literal for ${name}`);

  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = objectStart; i < source.length; i += 1) {
    const char = source[i];
    const prev = source[i - 1];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote && prev !== '\\') {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (depth === 0) {
      return source.slice(objectStart, i + 1);
    }
  }

  throw new Error(`Unclosed object literal for ${name}`);
}

function parseConstObject(name) {
  const literal = extractConstObject(name);
  return Function(`"use strict"; return (${literal});`)();
}

const initialStats = parseConstObject('INITIAL_STATS');
const initialFlags = parseConstObject('INITIAL_FLAGS');
const characters = parseConstObject('CHARACTERS');
const scenes = parseConstObject('SCENE_TREE');
const endings = parseConstObject('ENDINGS');

const errors = [];
const statKeys = new Set(Object.keys(initialStats));
const flagKeys = new Set(Object.keys(initialFlags));
const characterKeys = new Set(Object.keys(characters));
const sceneKeys = new Set(Object.keys(scenes));
const endingKeys = new Set(Object.keys(endings));

const expectedRuntimeV1 = {
  stats: [
    'exposureRisk',
    'heroTrust',
    'mageEvidence',
    'priestRedemption',
    'thiefLeverage',
    'castleIntegrity',
    'victorMisread',
    'partyProgress',
    'butterflyDeviation',
  ],
  flags: [
    'savedDemonSoldier',
    'betrayedVictor',
    'bribedLocke',
    'acceptedPurification',
    'confessedIdentity',
    'proposedPeace',
    'peacePivoted',
    'commandVictorSuccess',
    'raidedArmory',
    'foundForbiddenScroll',
    'subduedBloodArray',
    'freedDungeonCaptive',
    'protectedInnocentsCount',
    'sacrificedInnocentsCount',
    'contradictionCount',
    'majorLieCount',
    'resolvedMajorCrisisCount',
    'miraBufferedCrisis',
  ],
  scenes: [
    'gate',
    'act2_ruins',
    'act2_dungeon',
    'act3_library',
    'act3_treasury',
    'act4_corridor',
    'act5_throne',
  ],
  endings: [
    'gate_exposure_ending',
    'instantExecution',
    'instantArrest',
    'ruins_arrest_ending',
    'dungeon_rupture_ending',
    'library_seal_ending',
    'treasury_confess_ending',
    'corridor_betrayal_ending',
    'exposed',
    'castleLost',
    'dualRuler',
    'redeemed',
    'perfectSpy',
    'victorBlamed',
    'actorKing',
    'absurdAscension',
    'stalemate',
  ],
};

function fail(message) {
  errors.push(message);
}

function checkAsset(assetPath, owner) {
  if (!assetPath || !assetPath.startsWith('./assets/')) return;
  const absolute = path.join(root, assetPath.replace('./', ''));
  if (!fs.existsSync(absolute)) fail(`${owner} references missing asset: ${assetPath}`);
}

if (!sceneKeys.has('gate')) fail('SCENE_TREE must include gate entry scene');

for (const key of expectedRuntimeV1.stats) {
  if (!statKeys.has(key)) fail(`Runtime v1 missing expected stat ${key}`);
}
for (const key of expectedRuntimeV1.flags) {
  if (!flagKeys.has(key)) fail(`Runtime v1 missing expected flag ${key}`);
}
for (const key of expectedRuntimeV1.scenes) {
  if (!sceneKeys.has(key)) fail(`Runtime v1 missing expected scene ${key}`);
}
for (const key of expectedRuntimeV1.endings) {
  if (!endingKeys.has(key)) fail(`Runtime v1 missing expected ending ${key}`);
}

for (const [sceneKey, scene] of Object.entries(scenes)) {
  if (scene.id !== sceneKey) fail(`Scene ${sceneKey} id does not match key ${scene.id}`);
  checkAsset(scene.bgImage, `Scene ${sceneKey}`);

  for (const dialogue of scene.initialDialogues || []) {
    if (!characterKeys.has(dialogue.characterId)) {
      fail(`Scene ${sceneKey} initial dialogue references unknown character ${dialogue.characterId}`);
    }
  }

  for (const choice of scene.choices || []) {
    const choiceName = `${sceneKey}.${choice.id}`;
    if (choice.nextSceneId && !sceneKeys.has(choice.nextSceneId)) {
      fail(`${choiceName} points to missing nextSceneId ${choice.nextSceneId}`);
    }
    if (choice.endingKey && !endingKeys.has(choice.endingKey)) {
      fail(`${choiceName} points to missing endingKey ${choice.endingKey}`);
    }
    for (const key of Object.keys(choice.delta || {})) {
      if (!statKeys.has(key)) fail(`${choiceName} delta references unknown stat ${key}`);
    }
    for (const key of Object.keys(choice.flagUpdates?.set || {})) {
      if (!flagKeys.has(key)) fail(`${choiceName} sets unknown flag ${key}`);
    }
    for (const key of Object.keys(choice.flagUpdates?.increment || {})) {
      if (!flagKeys.has(key)) fail(`${choiceName} increments unknown flag ${key}`);
    }
    for (const dialogue of choice.dialogues || []) {
      if (!characterKeys.has(dialogue.characterId)) {
        fail(`${choiceName} dialogue references unknown character ${dialogue.characterId}`);
      }
    }
  }
}

for (const [endingKey, ending] of Object.entries(endings)) {
  if (ending.id !== endingKey) fail(`Ending ${endingKey} id does not match key ${ending.id}`);
  checkAsset(ending.bgImage, `Ending ${endingKey}`);
  checkAsset(ending.heroPortrait, `Ending ${endingKey}`);
}

const endingRefs = [...source.matchAll(/\bENDINGS\.([A-Za-z0-9_]+)/g)].map((match) => match[1]);
for (const ref of endingRefs) {
  if (!endingKeys.has(ref)) fail(`Source references missing ENDINGS.${ref}`);
}

for (const [characterKey, character] of Object.entries(characters)) {
  checkAsset(character.image, `Character ${characterKey}`);
  checkAsset(character.panickedImage, `Character ${characterKey}`);
  checkAsset(character.knightImage, `Character ${characterKey}`);
}

if (errors.length) {
  console.error(`Runtime smoke test failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Runtime smoke test passed: ${sceneKeys.size} scenes, ${endingKeys.size} endings, ${statKeys.size} stats.`);
