# Contributing

DDANWM is an open-source project, and we welcome contributions of all kinds: new features, bug fixes, documentation improvements, and more. It does not matter if you are not a developer, you can still help out by fixing typos, suggesting new features, and more.

For requesting new features, Discords API & Ws must support it, i.e new endpoints, new events, etc.

For bug reports (mainly with responses) confirm its not an issue with the actual Discord API, if it is please report it to [Discord API Docs](https://github.com/discord/discord-api-docs/issues) first!

## Getting Started

DDANWM is written in TypeScript, so you will need to have [Node.js](https://nodejs.org/en/) installed. We suggest the latest LTS version.
- Install a code editor, we suggest [Visual Studio Code](https://code.visualstudio.com/).
  - Install the suggested extensions. (If you are using VsCode there should be a pop up, else look for the ones in the `.vscode/extensions.json` file for your editor.)
- Fork the repo and clone it to your computer.
- Enable corepack by running `corepack enable` in the root directory of the project.
- Install [git](https://git-scm.com/downloads) if you haven't already.

## Cloning

- Make sure you have a [GitHub account](https://github.com/signup).
- Fork [this repository](https://github.com/Darker-Ink/DDANWM/fork) to your own GitHub account.

Clone your fork of the repository and navigate to the directory:

```bash
git clone https://github.com/<your-username>/DDANWM.git
cd DDANWM
```

Add the base repository as a remote:

```bash
git remote add upstream https://github/Darker-Ink/DDANWM.git
```

## Making Changes

- Create a new branch for your changes:
  - `git checkout -b <branch-name>`
  - A good branch name would be (for example) `<your-username>/new-feature` or `<your-username>/fixing-bug`.
  - If you are fixing an issue, use the issue number, for example, `<your-username>/fixing-bug-#1`.
- Make your changes to the codebase.
- Commit your changes:
  - `git add .`
  - `git commit -m "<commit-message>"`
  - A good commit message would be (for example) `feat: add new feature` or `fix: fixed 500 error message`.
  - If you are fixing an issue, use the issue number, for example, `fix: fix bug #1`.
- Push your changes to your fork:
  - `git push origin <branch-name>`
  - If you are pushing to a branch for the first time, use `git push -u origin <branch-name>`.
- Create a pull request:
  - Go to your fork on GitHub.
  - Click the "Compare & pull request" button next to your branch.
  - Fill out the pull request template.
  - Click the "Create pull request" button.

## Updating Your Fork

Often times when you are working on a new feature or fixing a bug, the base repository will be updated. To keep your fork up to date with the base repository, you will need to update your fork.

- Fetch the latest changes from the base repository:
  - `git fetch upstream`
  - If you are fetching from the base repository for the first time, use `git fetch upstream --no-tags --prune`.
- Merge the latest changes from the base repository into your `main` branch:
  - `git checkout main`
  - `git merge upstream/main`
  - If you have any merge conflicts, you will need to resolve them.
- Push the latest changes to your fork:
  - `git push origin main`



If you have any questions, feel free to join the [Discord Server](https://discord.gg/PmBS6q5gfm) and ask!