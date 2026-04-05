# GitHub And Vercel Auto-Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the local Vite game project into a public GitHub repository wired to Vercel so future pushes trigger deployments automatically.

**Architecture:** Treat the current folder as the source of truth, add minimal repo hygiene with a `.gitignore`, initialize Git locally, create the public GitHub repository `plane-war-mini-game`, and then connect that remote repository to Vercel's Git integration. Use an empty follow-up commit after linking to verify that push-based deployments are actually firing.

**Tech Stack:** Git, GitHub CLI, Vercel CLI, PowerShell, Vite

---

### Task 1: Add Repo Hygiene And Initialize The Local Git Repository

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Create a `.gitignore` that keeps build output and deployment metadata out of version control**

Create `.gitignore` in the project root with exactly this content:

```gitignore
node_modules/
dist/
.vercel/
.env
.env.*
```

- [ ] **Step 2: Initialize the repository on the `main` branch**

Run:

```powershell
git init -b main
```

Expected: Git reports that an empty repository has been initialized in the current project directory.

- [ ] **Step 3: Confirm the repository is active and `.gitignore` is protecting the large generated folders**

Run:

```powershell
git status --short
```

Expected: `node_modules/`, `dist/`, and `.vercel/` do not appear in the output. The output should include `.gitignore` and the real project files instead.

- [ ] **Step 4: Stage the baseline project files**

Run:

```powershell
git add .
```

Expected: Git stages the source files, docs, and project config without staging ignored directories.

### Task 2: Install GitHub CLI, Authenticate The Personal GitHub Account, And Create The First Commit

**Files:**
- No file changes expected

- [ ] **Step 1: Install GitHub CLI because it is not currently available in this environment**

Run:

```powershell
winget install --id GitHub.cli -e --source winget
```

Expected: `winget` installs GitHub CLI successfully.

- [ ] **Step 2: Verify the installation**

Run:

```powershell
gh --version
```

Expected: The command prints the GitHub CLI version instead of `gh` not found.

- [ ] **Step 3: Authenticate the personal GitHub account in the browser**

Run:

```powershell
gh auth login --hostname github.com --git-protocol https --web
```

Expected: GitHub CLI opens a browser-based login/authorization flow. Complete the authorization in the browser and return to the terminal.

- [ ] **Step 4: Verify that GitHub CLI is authenticated**

Run:

```powershell
gh auth status
```

Expected: The command reports that GitHub CLI is logged into `github.com` for the personal account.

- [ ] **Step 5: Verify the account identity that will own the new public repository**

Run:

```powershell
gh api user -q .login
gh api user -q .html_url
```

Expected: The first command prints the personal GitHub login. The second prints that account's GitHub profile URL.

- [ ] **Step 6: Install a local Git commit identity from the authenticated GitHub account**

Run this PowerShell snippet in the repo root:

```powershell
$login = gh api user -q .login
$id = gh api user -q .id
git config user.name $login
git config user.email "$id+$login@users.noreply.github.com"
```

Then verify it:

```powershell
git config user.name
git config user.email
```

Expected: `git config user.name` prints the GitHub username and `git config user.email` prints a GitHub noreply address in the form `<id>+<login>@users.noreply.github.com`.

- [ ] **Step 7: Create the initial repository commit**

Run:

```powershell
git commit -m "chore: initialize project repository"
```

Expected: Git creates the first commit on `main`.

### Task 3: Create The Public GitHub Repository And Push `main`

**Files:**
- No file changes expected

- [ ] **Step 1: Confirm there is no pre-existing remote configured in this local repository**

Run:

```powershell
git remote -v
```

Expected: No remotes are listed.

- [ ] **Step 2: Create the public repository and push the current `main` branch in one command**

Run:

```powershell
gh repo create plane-war-mini-game --public --source . --remote origin --push
```

Expected: GitHub CLI creates the public repository under the authenticated personal account, adds `origin`, and pushes `main`.

- [ ] **Step 3: Verify the remote URL**

Run:

```powershell
git remote get-url origin
```

Expected: The output is an HTTPS GitHub URL ending in `/plane-war-mini-game.git`.

- [ ] **Step 4: Verify that `main` is tracking the GitHub remote**

Run:

```powershell
git branch -vv
```

Expected: The `main` branch shows an upstream like `origin/main`.

- [ ] **Step 5: Verify the repository exists publicly on GitHub**

Run:

```powershell
gh repo view --web
```

Expected: GitHub opens the newly created public repository page in the browser.

### Task 4: Authenticate Vercel And Connect The GitHub Repository To A Vercel Project

**Files:**
- May create: `.vercel/repo.json`
- May create: `.vercel/project.json`

- [ ] **Step 1: Start Vercel authentication in the browser if the CLI is not already logged in**

Run:

```powershell
vercel login
```

Expected: Vercel CLI opens or prompts for a browser-based login flow. Complete the authorization in the browser and return to the terminal.

- [ ] **Step 2: Verify the Vercel identity**

Run:

```powershell
vercel whoami
```

Expected: The command prints the logged-in Vercel username instead of hanging for login.

- [ ] **Step 3: Inspect the available Vercel scopes before linking**

Run:

```powershell
vercel teams list --format json
```

Expected: JSON output listing the personal account and any teams. If the personal account is not the default scope, store its exact slug in `$scope` before continuing.

- [ ] **Step 4: Link the current GitHub repository to a Vercel project using repo-based linking**

If the personal account is the default scope, run:

```powershell
vercel link --repo -y
```

If Vercel requires an explicit personal scope, run:

```powershell
$scope = Read-Host 'Enter the personal Vercel scope slug from Step 3'
vercel link --repo --scope $scope -y
```

Expected: Vercel creates or connects a project for this repository and writes `.vercel/repo.json` or `.vercel/project.json` locally.

- [ ] **Step 5: Verify that the local directory is now linked to a Vercel project**

Run:

```powershell
if (Test-Path '.vercel/project.json') { Get-Content -Raw '.vercel/project.json' } elseif (Test-Path '.vercel/repo.json') { Get-Content -Raw '.vercel/repo.json' }
```

Expected: One of the Vercel metadata files exists and contains project linkage data.

### Task 5: Trigger And Verify Automatic Deployment From Git Pushes

**Files:**
- No source file changes required

- [ ] **Step 1: Create an empty verification commit so the repository can prove that Git-driven deploys are active**

Run:

```powershell
git commit --allow-empty -m "chore: verify vercel auto deploy"
```

Expected: Git creates a new empty commit on `main` without modifying tracked files.

- [ ] **Step 2: Push the verification commit to GitHub**

Run:

```powershell
git push
```

Expected: Git pushes the new commit to `origin/main`.

- [ ] **Step 3: Wait briefly, then list recent Vercel deployments**

Run:

```powershell
Start-Sleep -Seconds 5
vercel ls --format json
```

If a personal scope was stored in `$scope` during Task 4, run:

```powershell
Start-Sleep -Seconds 5
vercel ls --format json --scope $scope
```

Expected: The JSON output includes a fresh deployment created after the verification push.

- [ ] **Step 4: Inspect the newest deployment and capture the stable Vercel project URL**

Use this PowerShell snippet to inspect the latest deployment when the personal account is the default scope:

```powershell
$deployments = (vercel ls --format json | ConvertFrom-Json).deployments
$latest = $deployments | Select-Object -First 1
vercel inspect $latest.url
```

If `$scope` was required in Task 4, use:

```powershell
$deployments = (vercel ls --format json --scope $scope | ConvertFrom-Json).deployments
$latest = $deployments | Select-Object -First 1
vercel inspect $latest.url --scope $scope
```

Expected: `vercel inspect` shows the deployment details, including the deployment URL and any project alias or stable `.vercel.app` domain attached to the project.

- [ ] **Step 5: Verify the repository remains clean after the setup**

Run:

```powershell
git status --short
```

Expected: No unexpected tracked changes remain. A clean output is ideal; if `.vercel/` exists locally it should remain ignored by `.gitignore`.

- [ ] **Step 6: Record the final working workflow for the user**

Use this exact summary when closing the task:

```text
Automatic deployment is now wired up.

Future release flow:
1. Edit locally
2. git add .
3. git commit -m "describe your change"
4. git push
5. Vercel deploys automatically from GitHub
```

