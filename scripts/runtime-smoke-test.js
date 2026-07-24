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

// ---------------------------------------------------------------------------
// Engine Phase 1 Baseline Mechanism Tests (LLM v1 Adapter, Validator, Red Lines)
// ---------------------------------------------------------------------------
await import('../src/app.js');
const engine = globalThis.__WHAT_IF_ENGINE__;

if (!engine) {
  fail('Engine helper globalThis.__WHAT_IF_ENGINE__ was not exported');
} else {
  // Test 1: validateAdjudication with valid candidate
  const validCandidate = {
    schemaVersion: 'what-if-llm-adjudication/v1',
    actionCategory: 'deceive',
    adjudication: 'costly_success',
    narration: '测视角古籍拆穿',
    stateDelta: { exposureRisk: -3, mageEvidence: 10, partyProgress: 15 },
    flagUpdates: { set: { commandVictorSuccess: false }, increment: { majorLieCount: 1 } },
    focusedCharacters: ['ivette'],
    characterResponses: [{ characterId: 'ivette', emotion: '推眼镜', content: '继续观察' }],
    suggestedNextSceneId: 'act2_dungeon',
    suggestedEndingKey: null,
  };
  const vResult1 = engine.validateAdjudication(validCandidate);
  if (!vResult1.valid) {
    fail(`Valid candidate failed validation: ${vResult1.errors.join(', ')}`);
  }

  // Test 2: Invalid schemaVersion -> fails validation
  const vResult2 = engine.validateAdjudication({ ...validCandidate, schemaVersion: 'v0.9' });
  if (vResult2.valid) {
    fail('Invalid schemaVersion should fail validation');
  }

  // Test 3: Failure adjudication -> downgraded to costly_success
  const vResult3 = engine.validateAdjudication({ ...validCandidate, adjudication: 'failure' });
  if (!vResult3.valid || vResult3.sanitized.adjudication !== 'costly_success') {
    fail(`Failure adjudication should be downgraded to costly_success, got: ${vResult3.sanitized?.adjudication}`);
  }

  // Test 4: Invalid stat keys, flag keys, scene keys & delta clamping
  const hallucinatedCandidate = {
    ...validCandidate,
    suggestedNextSceneId: 'non_existent_scene',
    suggestedEndingKey: 'non_existent_ending',
    stateDelta: { exposureRisk: 250, unknownStat: 100 },
    flagUpdates: { set: { unknownFlag: true, bribedLocke: true } },
  };
  const vResult4 = engine.validateAdjudication(hallucinatedCandidate);
  if (vResult4.valid) {
    fail('Hallucinated scene & ending keys should fail validation errors');
  }
  if ('unknownStat' in vResult4.sanitized.stateDelta) {
    fail('Hallucinated statKey should be stripped from stateDelta');
  }
  if (vResult4.sanitized.stateDelta.exposureRisk !== 50) {
    fail(`Out of bound delta should be clamped to 50, got ${vResult4.sanitized.stateDelta.exposureRisk}`);
  }
  if ('unknownFlag' in vResult4.sanitized.flagUpdates.set) {
    fail('Hallucinated flagKey should be stripped from flagUpdates.set');
  }

  // Test 5: Character Red Lines & validateEndingCandidate blocking
  const badStats = {
    exposureRisk: 20,
    heroTrust: 30, // Leon trust < 40 -> Red Line
    mageEvidence: 10,
    priestRedemption: 60,
    thiefLeverage: 10,
    castleIntegrity: 80,
    victorMisread: 10,
    partyProgress: 50,
    butterflyDeviation: 0,
  };
  const badFlags = { sacrificedInnocentsCount: 1 };
  const redLines = engine.verifyCharacterRedLines(badStats, badFlags);
  if (redLines.length < 2) {
    fail(`Expected at least 2 red line violations for badStats/badFlags, got ${redLines.length}`);
  }

  const endingCheck = engine.validateEndingCandidate('dualRuler', { stats: badStats, flags: badFlags });
  if (endingCheck.valid || endingCheck.endingKey === 'dualRuler') {
    fail('dualRuler good ending should be blocked by character red lines');
  }
  if (!endingCheck.endingKey || !['stalemate', 'exposed', 'instantArrest'].includes(endingCheck.endingKey)) {
    fail(`Blocked ending should fallback to a valid Runtime v1 key, got ${endingCheck.endingKey}`);
  }

  // Test 6: Isomorphic Adapter adjudicateFreeAction
  const adapterResult = engine.adjudicateFreeAction('在魔王城开地下城主题公园', 'gate');
  if (adapterResult.actionCategory !== 'absurd') {
    fail(`adjudicateFreeAction should classify absurd intent, got ${adapterResult.actionCategory}`);
  }
  if (adapterResult.adjudication !== 'costly_success') {
    fail(`absurd intent should output costly_success, got ${adapterResult.adjudication}`);
  }
}

if (errors.length) {
  console.error(`Runtime smoke test failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Runtime smoke test passed: ${sceneKeys.size} scenes, ${endingKeys.size} endings, ${statKeys.size} stats, engine mechanism tests passed.`);

