import { useState } from 'react'

// Maps file extensions to a readable type label and icon
const FILE_TYPES = {
  pdf:  { label: 'PDF Document',    icon: '📕' },
  docx: { label: 'Word Document',   icon: '📘' },
  xlsx: { label: 'Spreadsheet',     icon: '📗' },
  csv:  { label: 'CSV Data',        icon: '📊' },
  json: { label: 'JSON Config',     icon: '⚙️'  },
  log:  { label: 'Log File',        icon: '📋' },
  txt:  { label: 'Text File',       icon: '📄' },
  pem:  { label: 'Certificate',     icon: '🔐' },
  key:  { label: 'Key File',        icon: '🗝️'  },
  env:  { label: 'Env Config',      icon: '🔧' },
  sql:  { label: 'SQL Database',    icon: '🗄️'  },
  zip:  { label: 'Archive',         icon: '📦' },
}

// Returns the size string directly from JSON (e.g. "12MB", "340KB")
function formatSize(size) {
  return size || '—'
}

// Walks the tree recursively to build the FULL folder path to the file's parent
// e.g. "01_Legal_Department / Active_Cases / Doe_vs_MegaCorp_Inc / Discovery_Phase"
// Returns "Root" if the file is at the top level
function getFilePath(nodes, targetId, pathSoFar = '') {
  for (const node of nodes) {
    // Build the running path including this node's name
    const currentPath = pathSoFar ? `${pathSoFar} / ${node.name}` : node.name
    // If this node IS the target file, return the path built so far (its parent path)
    if (node.id === targetId) return pathSoFar || 'Root'
    // If this node has children, search inside them
    if (node.children) {
      const found = getFilePath(node.children, targetId, currentPath)
      if (found !== null) return found
    }
  }
  return null
}

export default function PropertiesPanel({ selectedFile, nodes, onClose }) {
  // null = closed, 'headers' or 'logs' = which modal is open
  const [modal, setModal] = useState(null)

  // Show empty state when no file is selected
  if (!selectedFile) {
    return (
      <aside className="app-panel">
        <div className="panel-header">
          <div className="panel-header-dot"></div>
          <span className="panel-header-title">Properties</span>
          {onClose && (
            <button className="panel-close-btn" onClick={onClose} aria-label="Close panel">✕ Close</button>
          )}
        </div>
        <div className="panel-empty">
          <p>Select a file to view its security properties and metadata.</p>
        </div>
      </aside>
    )
  }

  // Get file extension and look up its type info
  const ext = selectedFile.name.split('.').pop().toLowerCase()
  const fileType = FILE_TYPES[ext] ?? { label: `${ext.toUpperCase()} File`, icon: '📄' }

  // Get the full folder path by searching the tree recursively
  const folderPath = getFilePath(nodes, selectedFile.id) ?? 'Root'

  return (
    <aside className="app-panel">

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>

            <div className="modal-header">
              <span className="modal-title">
                {modal === 'headers' ? 'Raw Headers' : 'Audit Logs'}
              </span>
              <button className="modal-close" onClick={() => setModal(null)}>✕ Close</button>
            </div>

            <div className="modal-divider"></div>

            <div className="modal-body">
              {modal === 'headers' ? (
                <>
                  <div className="modal-row">
                    <span className="modal-row-key">X-File-ID</span>
                    <span className="modal-row-value">{selectedFile.id}</span>
                  </div>
                  <div className="modal-row">
                    <span className="modal-row-key">X-File-Name</span>
                    <span className="modal-row-value">{selectedFile.name}</span>
                  </div>
                  <div className="modal-row">
                    <span className="modal-row-key">X-File-Type</span>
                    <span className="modal-row-value">{selectedFile.type}</span>
                  </div>
                  <div className="modal-row">
                    <span className="modal-row-key">X-File-Size</span>
                    <span className="modal-row-value">{selectedFile.size ?? '—'}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="modal-log-entry">[READ] {selectedFile.name} accessed</div>
                  <div className="modal-log-entry">[SCAN] Integrity check passed — ID: {selectedFile.id}</div>
                  <div className="modal-log-entry">[AUTH] Session verified for {selectedFile.name}</div>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Panel title bar */}
      <div className="panel-header">
        <div className="panel-header-dot"></div>
        <span className="panel-header-title">Properties</span>
        {onClose && (
          <button className="panel-close-btn" onClick={onClose} aria-label="Close panel">✕ Close</button>
        )}
      </div>

      {/* File icon + name + type */}
      <div className="panel-file-preview">
        <div className="panel-file-icon">{fileType.icon}</div>
        <div className="panel-file-name">{selectedFile.name}</div>
        <div className="panel-file-type-label">{fileType.label}</div>
      </div>

      {/* Metadata fields */}
      <div className="panel-fields">

        <div>
          <div className="panel-field-label">Folder Path</div>
          <div className="panel-field-value">
            <span>{folderPath}</span>
            <span className="panel-field-dot"></span>
          </div>
        </div>

        <div>
          <div className="panel-field-label">File Size</div>
          <div className="panel-field-value">
            <span>{formatSize(selectedFile.size)}</span>
            <span className="panel-field-dot"></span>
          </div>
        </div>

        <div>
          <div className="panel-field-label">File ID</div>
          <div className="panel-field-value">
            <span>{selectedFile.id}</span>
            <span className="panel-field-dot"></span>
          </div>
        </div>

      </div>

      {/* Action buttons */}
      <div className="panel-actions">
        <button
          className="btn-panel btn-panel-primary"
          onClick={() => setModal('headers')}
        >
          View Raw Headers
        </button>
        <button
          className="btn-panel btn-panel-secondary"
          onClick={() => setModal('logs')}
        >
          Audit Logs
        </button>
      </div>

    </aside>
  )
}
