# Stages 1-3 Tuning Design

Date: 2026-04-05

Goal: tune the opening campaign curve so stage 1 starts with visible pressure that remains fair and readable, stage 2 escalates into stronger crossfire control, and stage 3 leads into a shorter, fiercer boss check.

## Scope

This design only covers:

- Stage 1 to stage 3 pacing and difficulty tuning
- Stage 3 boss pacing and lethality tuning
- Small system-level adjustments that directly support readability and pacing in the early campaign

This design does not cover:

- Rebalancing stages 4 to 10
- New enemy types, new boss attack families, or bespoke stage scripting
- UI polish, audio mixing, or progression system changes

## Target Feel

### Stage 1

Stage 1 must stop feeling like a harmless warm-up. Within the first 10 seconds, the player should already feel forced to move and read threats. The pressure should come mainly from readable aimed shots and fast enemies that carve horizontal lines through the lane, not from dense clutter.

The important constraint is fairness. The player should usually be able to identify why a lane is unsafe and where the escape lane is. Stage 1 should teach movement discipline under pressure, not random survival.

### Stage 2

Stage 2 should clearly escalate from single-lane reading to handling crossing lines of threat. Side pressure, quick enemy entries, and overlapping angles should become more common. The player should need larger, more committed repositioning than in stage 1.

This still needs to stay readable. Losses in stage 2 should mostly feel like the player misread a crossing line or drifted into a closing lane, not like the game spawned an unavoidable trap.

### Stage 3 Before Boss

Stage 3 should feel like a consolidation test. By the time the boss appears, the player should have practiced reading aimed fire, handling lateral compression, and converting safe windows into damage or close kills. Skilled play should often allow the player to enter the boss with strong Overdrive charge.

The pre-boss section should feel concentrated rather than stretched. The goal is to feed momentum into the boss instead of making the player survive a long, muddy midgame.

### Stage 3 Boss

The stage 3 boss should feel like a short, high-pressure burst exam rather than a long patience fight. It should attack more aggressively, switch pressure modes faster, and create immediate danger once it fully enters the arena.

To keep this from becoming tedious, boss durability should come down as offensive pressure goes up. The intended result is a fight that feels dangerous and sharp, but ends before it turns into a grind.

## Planned Changes

### 1. Retune Stage Wave Profiles In `config.ts`

Stage 1 wave timing should tighten earlier than it does now. The first two waves should spawn quickly enough to create immediate pressure, with slightly higher fast-enemy representation, while keeping tanks rare. Difficulty increases should remain modest so bullet speed does not spike too early.

Stage 2 should continue the same direction by increasing cross-lane threats and multi-spawn opportunities. The emphasis should be on stronger horizontal compression and more frequent moments where the player must choose a side and commit.

Stage 3 should compress its pre-boss wave pacing. The early and middle waves should build pressure more decisively and spend less time in low-information filler pressure before the boss warning.

### 2. Add Lightweight Early-Stage Readability Guardrails In `spawn.ts`

The current spawn flow compounds randomness through wave timing, enemy selection, and multi-spawn rolls. For stages 1 to 3, especially the first segment of stage 1, this can create swings where early pressure is either too soft or abruptly messy.

The design change is to keep the current generic spawn system but add a small early-campaign guardrail. In the opening part of stages 1 to 3, multi-spawn escalation should ramp in more smoothly so early pressure stays intentional and understandable. This keeps stage 1 threatening without letting the first seconds devolve into chaotic overlap.

This is intentionally small in scope. The goal is not stage scripting, only reducing early random spikes that fight against readability.

### 3. Shorten And Intensify The Stage 3 Boss In `config.ts` And `update.ts`

The stage 3 boss should become more explosive through a combined tuning pass:

- Lower boss HP so the fight resolves faster
- Increase shot cadence and reduce idle gaps
- Shorten pattern-switch timing so the player gets tested more frequently
- Preserve a small recognition window when modes change so the fight stays readable

The main logic-side adjustment is in boss attack pacing. The more aggressive pattern should come online quickly and recur often enough that the fight feels like a burst challenge. This should raise danger without requiring a new boss system.

## System Touchpoints

- `src/game/config.ts`
  - Stage 1 to stage 3 wave profile values
  - Stage 3 boss stats and timing values
- `src/game/systems/spawn.ts`
  - Early-campaign spawn pacing guardrail for readability
- `src/game/systems/update.ts`
  - Stage 3 boss attack rhythm adjustments

No structural changes are planned for campaign saves, screen flow, scoring rules, or entity definitions unless small supporting edits become necessary during implementation.

## Validation

The tuning pass is successful if these checks hold:

- Stage 1 feels pressuring almost immediately, but a clear escape lane is usually visible
- Stage 2 is noticeably more demanding than stage 1 through crossing pressure, not just raw clutter
- Stage 3 enters the boss with stronger momentum and less dead air
- The stage 3 boss feels fiercer and shorter than before
- `npm run build` still passes after the changes

If a local playable run is available, manual verification should focus on:

- First 30 seconds of stage 1
- Transition from stage 2 into stage 3 expectations
- Time-to-kill and danger density of the stage 3 boss

## Risks And Constraints

- Pure numeric tuning can accidentally make the early game feel noisy instead of fair if spawn overlap rises faster than readability support
- Boss fights can feel worse, not better, if aggression rises without reducing downtime and total durability together
- Because this project currently has no confirmed browser-based playtest evidence for the latest build in this session, final tuning quality still depends on follow-up manual runs

## Implementation Boundary

This spec is intentionally narrow. It aims to establish a stronger baseline curve for the opening campaign, not to finalize all ten stages. If the pass works, later tuning can extend the same principles to stage 5 and stage 10 boss checkpoints.
