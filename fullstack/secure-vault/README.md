## SecureVault Dashboard

Dark-mode enterprise file explorer for SecureVault Inc. — built for law firms and banks to navigate encrypted documents securely.

Live Demo: `https://secure-vault-dashboard.netlify.app/`
Design File: `https://www.figma.com/design/mWVI86O8Ug0DXPepCcr0Mt/Secure-Vault-Prototype-Design?node-id=0-1&p=f&t=EIhXXRmuJN4pBIPR-0`

### Setup
Requires Node.js 18+ and npm

```bash 
git clone https://github.com/Iris-Ghislaine/SecureVault-Dashboard.git

```cd fullstack/secure-vault
npm install
npm run dev
```
App runs at `http://localhost:5174`

### Tech Stack

React 18 + Vite
Plain CSS — no Bootstrap, no MUI, no component libraries
localStorage — persists recent files across sessions


### Project Structure
fullstack/secure-vault/
├── src/
│   ├── components/
│   │   ├── FileTree.jsx          # Keyboard navigation + tree wrapper
│   │   ├── TreeNode.jsx          # Recursive file/folder row
│   │   └── PropertiesPanel.jsx   # Right panel — file metadata
│   ├── data/
│   │   └── data.json             # Data source
│   ├── styles/
│   │   └── main.css              # Design system
│   ├── App.jsx                   # Layout + shared state
│   └── main.jsx                  # Entry point

### Features

Recursive File TreeWorks at any depth — 2 levels or 20 levelsExpand / CollapseClick any folder to toggle open or closedFile SelectionClick a file to highlight it and view its metadataProperties PanelShows name, type, size, folder path, file IDKeyboard Navigation↑ ↓ move focus · → expand · ← collapse · Enter selectSearch & FilterFilters tree in real time, auto-expands matching foldersStyled ModalsRaw Headers + Audit Logs open in dark-theme modal cards

### Wildcard Feature — Recently Accessed

A Recently Accessed section at the bottom of the sidebar tracks the last 5 files opened.
Why: In law firms and banks, users return to the same files constantly. Quick access removes the need to re-navigate the full folder tree every session. Persists via localStorage so it survives page refreshes.

### Recursive Strategy

TreeNode.jsx renders one row (file or folder)
If the row is a folder, it maps over its children and renders more TreeNode components inside itself
Each level passes depth + 1 down — this controls the left padding and creates the visual indentation
For search: a helper function checks if a node or any of its children match the query — matching folders auto-expand
