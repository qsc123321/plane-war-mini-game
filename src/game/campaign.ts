import { CAMPAIGN_STAGES, STAGE_COUNT } from './config';
import type { CampaignProgress, Rank, StageConfig, StageRecord } from './types';

const CAMPAIGN_PROGRESS_KEY = 'plane-war-campaign-progress';
const RANK_ORDER: Rank[] = ['D', 'C', 'B', 'A', 'S'];

function createEmptyRecord(): StageRecord {
  return {
    bestScore: 0,
    cleared: false,
    bestRank: null,
  };
}

function sanitizeRecord(raw: unknown): StageRecord {
  if (!raw || typeof raw !== 'object') {
    return createEmptyRecord();
  }

  const record = raw as Partial<StageRecord>;
  return {
    bestScore: Number.isFinite(record.bestScore) ? Math.max(0, Number(record.bestScore)) : 0,
    cleared: Boolean(record.cleared),
    bestRank: record.bestRank && RANK_ORDER.includes(record.bestRank) ? record.bestRank : null,
  };
}

function rankValue(rank: Rank | null): number {
  if (!rank) {
    return -1;
  }

  return RANK_ORDER.indexOf(rank);
}

export function getStageById(stageId: number): StageConfig {
  return CAMPAIGN_STAGES[Math.max(1, Math.min(STAGE_COUNT, stageId)) - 1];
}

export function loadCampaignProgress(): CampaignProgress {
  const empty: CampaignProgress = { unlockedStageId: 1, stages: {} };
  const rawValue = window.localStorage.getItem(CAMPAIGN_PROGRESS_KEY);
  if (!rawValue) {
    return empty;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<CampaignProgress>;
    const unlockedStageId = Number.isFinite(parsed.unlockedStageId)
      ? Math.max(1, Math.min(STAGE_COUNT, Number(parsed.unlockedStageId)))
      : 1;

    const stages: Record<number, StageRecord> = {};
    for (const stage of CAMPAIGN_STAGES) {
      stages[stage.id] = sanitizeRecord(parsed.stages?.[stage.id]);
    }

    return {
      unlockedStageId,
      stages,
    };
  } catch {
    return empty;
  }
}

export function saveCampaignProgress(progress: CampaignProgress): void {
  window.localStorage.setItem(CAMPAIGN_PROGRESS_KEY, JSON.stringify(progress));
}

export function getStageRecord(progress: CampaignProgress, stageId: number): StageRecord {
  return progress.stages[stageId] ?? createEmptyRecord();
}

export function getStageRank(stage: StageConfig, score: number): Rank {
  if (score >= stage.rankThresholds.S) return 'S';
  if (score >= stage.rankThresholds.A) return 'A';
  if (score >= stage.rankThresholds.B) return 'B';
  if (score >= stage.rankThresholds.C) return 'C';
  return 'D';
}

export function applyStageResult(
  progress: CampaignProgress,
  stage: StageConfig,
  score: number,
  cleared: boolean,
): {
  progress: CampaignProgress;
  rank: Rank;
  unlockedStageId: number | null;
  isNewRecord: boolean;
} {
  const nextProgress: CampaignProgress = {
    unlockedStageId: progress.unlockedStageId,
    stages: { ...progress.stages },
  };

  const current = getStageRecord(nextProgress, stage.id);
  const rank = getStageRank(stage, score);
  const isNewRecord = score > current.bestScore;

  nextProgress.stages[stage.id] = {
    bestScore: Math.max(current.bestScore, score),
    cleared: current.cleared || cleared,
    bestRank:
      rankValue(rank) > rankValue(current.bestRank) || (current.bestRank === null && cleared)
        ? rank
        : current.bestRank,
  };

  let unlockedStageId: number | null = null;
  if (cleared && stage.id < STAGE_COUNT && nextProgress.unlockedStageId < stage.id + 1) {
    nextProgress.unlockedStageId = stage.id + 1;
    unlockedStageId = stage.id + 1;
  }

  return {
    progress: nextProgress,
    rank,
    unlockedStageId,
    isNewRecord,
  };
}
