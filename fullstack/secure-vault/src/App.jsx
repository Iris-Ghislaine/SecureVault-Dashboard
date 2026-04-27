import { useState, useEffect } from 'react'
import fileData from './data/data.json'
import FileTree from './components/FileTree.jsx'
import PropertiesPanel from './components/PropertiesPanel.jsx'

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [recentFiles, setRecentFiles] = useState(
    () => JSON.parse(localStorage.getItem('recentFiles') || '[]')
  )

  useEffect(() => {
    localStorage.setItem('recentFiles', JSON.stringify(recentFiles))
  }, [recentFiles])

  const [showPanel, setShowPanel] = useState(false)
  function handleSelectFile(file) {
    setSelectedFile(file)
    setShowPanel(false) 
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
        {/* Show properties button on tablet/mobile when a file is selected */}
        {selectedFile && (
          <button
            className="btn-panel-toggle"
            onClick={() => setShowPanel(prev => !prev)}
          >
            {showPanel ? '✕ Close' : ' Properties'}
          </button>
        )}

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
                  {selectedFile.size ?? 'Size unknown'}
                </div>
              </div>
            </div>
            {/* Simulated file content preview */}
            <div className="workspace-file-body">
              <span className="workspace-preview-label">PREVIEW UNAVAILABLE</span>
              <p>Binary or encrypted content cannot be rendered in the browser.</p>
              <p>Tap <strong>ℹ Properties</strong> in the header or use <strong>View Raw Headers</strong> / <strong>Audit Logs</strong> to inspect this file.</p>
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
        <div className="binary-watermark">
          01001000 01000101 01011000<br />
          10110100 11001010 00110101
        </div>
      </main>

      {/* ── RIGHT PROPERTIES PANEL ── */}
      <div className={`panel-overlay ${showPanel ? 'panel-overlay-open' : ''}`}
        onClick={() => setShowPanel(false)}
      />
      <div className={`app-panel-wrapper ${showPanel ? 'app-panel-visible' : ''}`}>
        <PropertiesPanel 
          selectedFile={selectedFile} 
          nodes={fileData} 
          onClose={() => setShowPanel(false)}
        />
      </div>

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
            {selectedFile ? selectedFile.name : 'None'}
          </span>
        </div>
        {searchQuery && (
          <>
            <div className="status-divider"></div>
            <div className="status-item">
              <span>SEARCH</span>
              <span className="status-value">{searchQuery}</span>
            </div>
          </>
        )}
      </footer>

    </div>
  )
}
