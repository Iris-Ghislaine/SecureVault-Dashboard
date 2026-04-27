import { useState } from 'react'
import fileData from './data/data.json'
import FileTree from './components/FileTree.jsx'
import PropertiesPanel from './components/PropertiesPanel.jsx'

export default function App() {
  // The currently selected file object (or null if none selected)
  const [selectedFile, setSelectedFile] = useState(null)

  // The search query typed in the sidebar search bar
  const [searchQuery, setSearchQuery] = useState('')

  // Last 5 recently accessed files (most recent first)
  const [recentFiles, setRecentFiles] = useState([])

  // Called when user clicks a file in the tree or recent list
  function handleSelectFile(file) {
    setSelectedFile(file)

    // Add to recent files, avoid duplicates, keep only last 5
    setRecentFiles(prev => {
      const filtered = prev.filter(f => f.id !== file.id)
      return [file, ...filtered].slice(0, 5)
    })
  }

  return (
    <div className="app-layout">

      {/* ── TOP HEADER ── */}
      <header className="app-header">
        <div className="header-brand">
          <div className="header-logo">⬡</div>
          <span className="header-title">SecureVault</span>
          <span className="header-subtitle">Enterprise File Explorer</span>
        </div>
        <div className="header-actions">
          <span className="header-badge">CLASSIFIED</span>
          <span className="header-badge">TLP:RED</span>
        </div>
      </header>

      {/* ── LEFT SIDEBAR ── */}
      <aside className="app-sidebar">

        {/* Search bar */}
        <div className="sidebar-search">
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* File tree label */}
        <div className="sidebar-section-label">FILE SYSTEM</div>

        {/* Recursive file tree */}
        <FileTree
          nodes={fileData}
          selectedFile={selectedFile}
          onSelectFile={handleSelectFile}
          searchQuery={searchQuery}
        />

        {/* ── RECENTLY ACCESSED FILES (wildcard feature) ── */}
        {recentFiles.length > 0 && (
          <div className="recent-section">
            <div className="sidebar-section-label">RECENTLY ACCESSED</div>
            {recentFiles.map(file => (
              <div
                key={file.id}
                className={`recent-item ${selectedFile?.id === file.id ? 'selected' : ''}`}
                onClick={() => handleSelectFile(file)}
              >
                <span className="node-icon file">📄</span>
                <span className="node-name">{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* ── MAIN WORKSPACE (centre panel) ── */}
      <main className="app-main">
        {selectedFile ? (
          /* ── FILE SELECTED STATE ── */
          <div className="workspace-file-view">
            <div className="workspace-file-header">
              <span className="workspace-file-icon">📄</span>
              <div>
                <div className="workspace-file-title">{selectedFile.name}</div>
                <div className="workspace-file-meta">
                  {selectedFile.type?.toUpperCase() ?? 'FILE'} &nbsp;·&nbsp;
                  {selectedFile.size ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Size unknown'}
                </div>
              </div>
            </div>
            {/* Simulated file content preview */}
            <div className="workspace-file-body">
              <span className="workspace-preview-label">PREVIEW UNAVAILABLE</span>
              <p>Binary or encrypted content cannot be rendered in the browser.</p>
              <p>Use <strong>View Raw Headers</strong> or <strong>Audit Logs</strong> in the Properties panel for more details.</p>
            </div>
          </div>
        ) : (
          /* ── EMPTY STATE ── */
          <div className="workspace-inactive">
            <div className="workspace-icon">🔒</div>
            <h2>No File Selected</h2>
            <p>Select a file from the explorer to view its metadata and security properties.</p>
            <div className="workspace-badges">
              <span className="badge">AES-256</span>
              <span className="badge">Zero Trust</span>
              <span className="badge">E2E Encrypted</span>
            </div>
          </div>
        )}
        {/* Decorative binary watermark */}
        <div className="binary-watermark">
          01001000 01000101 01011000<br />
          10110100 11001010 00110101
        </div>
      </main>

      {/* ── RIGHT PROPERTIES PANEL ── */}
      <PropertiesPanel selectedFile={selectedFile} nodes={fileData} />

      {/* ── BOTTOM STATUS BAR ── */}
      <footer className="app-statusbar">
        <div className="status-item">
          <span className="status-dot"></span>
          <span>VAULT STATUS</span>
          <span className="status-value">ONLINE</span>
        </div>
        <div className="status-divider"></div>
        <div className="status-item">
          <span>SELECTED</span>
          <span className="status-value">
            {selectedFile ? selectedFile.name : '—'}
          </span>
        </div>
        <div className="status-divider"></div>
        <div className="status-item">
          <span>QUERY</span>
          <span className="status-value">
            {searchQuery || '—'}
          </span>
        </div>
        <div className="status-right">
          <span className="status-link">v1.0.0</span>
          <span className="status-link">SECURE CHANNEL</span>
        </div>
      </footer>

    </div>
  )
}
