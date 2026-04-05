# GitHub And Vercel Auto-Deploy Design

Date: 2026-04-05

Goal: turn the current local-only Vite game project into a GitHub-backed project with Vercel Git integration so future pushes automatically trigger deployments.

## Current State

The project currently lives only in the local workspace at `E:\飞机大战\飞机大战小游戏`.

Confirmed project state at the time of this spec:

- The directory is not a Git repository yet
- There is no GitHub remote configured
- There is no `.vercel/` project link in the workspace
- A temporary preview deployment exists from the fallback deployment flow, but it is not a stable auto-deploy setup
- The user wants the GitHub repository to be public
- The repository should live under the user's personal GitHub account
- The repository name should be `plane-war-mini-game`
- The user already has a Vercel account
- The user has not yet authenticated GitHub CLI in this environment

## Scope

This design covers:

- Initializing the project as a Git repository
- Creating the public GitHub repository `plane-war-mini-game`
- Pushing the current codebase to `main`
- Connecting the GitHub repository to Vercel
- Establishing a stable future workflow where pushes trigger deployments automatically

This design does not cover:

- Implementing new gameplay changes
- Rebalancing stages or changing game code behavior
- Custom domain setup
- CI workflows beyond the Vercel Git integration path

## Recommended Approach

The recommended approach is direct GitHub to Vercel integration.

This means the project becomes a normal GitHub repository first, then Vercel imports that repository and watches it for changes. After setup, pushes to the configured production branch deploy automatically. This is the simplest long-term workflow and avoids maintaining manual deployment scripts or GitHub Actions-based deployment secrets.

## Repository Model

The local workspace should be turned into a standard Git repository with a `main` branch.

The first remote should be a newly created public GitHub repository named `plane-war-mini-game` under the user's personal account. The initial local project state should be committed as the baseline so future gameplay and UI work can build on a clean remote history.

Because the workspace currently has no Git history, the first commit will also establish the branch and remote structure that Vercel relies on.

## Authentication Model

### GitHub

GitHub CLI should be used for repository creation and authentication, because it gives a clean way to authenticate once and then create the repository directly from the terminal.

If `gh` is not installed, it should be installed first. Then the user should complete the browser-based `gh auth login` flow. After that, repository creation, remote setup, and push can proceed non-interactively.

### Vercel

The stable setup should use Vercel's normal Git-connected flow rather than the fallback claim-based deployment script.

If Vercel CLI authentication is needed during setup, the user should complete that login once. After the GitHub repository is connected in Vercel, future deployments should come from Git activity rather than manual CLI deploys.

## Deployment Model

The deployment model should be intentionally simple:

- `main` acts as the production branch
- The GitHub repository is imported into Vercel
- Vercel watches the repository and builds on push
- The resulting site gets a stable Vercel project URL

This keeps the mental model straightforward. Local edits do nothing by themselves. A deployment happens when code is committed and pushed to GitHub, and Vercel reacts to that push.

If preview branches are needed later, they can be added naturally by creating branches and pushing them, but that is not required for this setup.

## Local Workflow After Setup

After the setup is complete, the intended workflow becomes:

1. Edit code locally
2. Run local verification as needed
3. Commit the changes
4. Push to GitHub
5. Wait for Vercel to build and publish the new version

That replaces the current one-off deployment flow where each release requires a manual ad hoc deploy.

## Files And System Touchpoints

Expected local changes during implementation:

- Add Git metadata by initializing `.git`
- Potentially add a `.gitignore` if the repository needs one for clean history
- Add `.vercel/` metadata only if the CLI-based linking flow creates it during setup

External systems that will be touched:

- GitHub personal account
- A new public GitHub repository named `plane-war-mini-game`
- The user's existing Vercel account

## Validation

The setup is successful if all of these are true:

- `git status` works in the project directory
- The project has a `main` branch
- A GitHub repository named `plane-war-mini-game` exists under the user's personal account
- `git push` succeeds to the GitHub remote
- Vercel has imported the repository and assigned it a stable project URL
- A follow-up push triggers a new deployment automatically

## Risks And Constraints

- The setup depends on successful interactive authentication for GitHub and possibly Vercel
- Since the project currently has no Git history, the first commit establishes the baseline and should be reviewed before pushing
- If the local workspace contains files that should not be versioned, they need to be ignored before the first push
- The earlier fallback preview URL should not be treated as the long-term production URL for this project

## Implementation Boundary

This spec is only about creating the deployment foundation. Once it is complete, gameplay tuning, UI polish, and future releases can happen on top of a normal GitHub plus Vercel workflow.
