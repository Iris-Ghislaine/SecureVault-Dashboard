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

// Walks the tree recursively to build the folder path for a given file id
// e.g. returns "vault-root / finance / reports"
function getFilePath(nodes, targetId, pathSoFar = '') {
  for (const node of nodes) {
    const currentPath = pathSoFar ? `${pathSoFar} / ${node.name}` : node.name
    if (node.id === targetId) return pathSoFar || '/'
    if (node.children) {
      const found = getFilePath(node.children, targetId, currentPath)
      if (found !== null) return found
    }
  }
  return null
}

export default function PropertiesPanel({ selectedFile, nodes }) {

  // Show empty state when no file is selected
  if (!selectedFile) {
    return (
      <aside className="app-panel">
        <div className="panel-header">
          <div className="panel-header-dot"></div>
          <span className="panel-header-title">Properties</span>
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

  // Get the folder path breadcrumb
  const folderPath = getFilePath(nodes, selectedFile.id) ?? '/'

  // Use the file's timestamp if available, otherwise use current time
  const timestamp = selectedFile.modified
    ? new Date(selectedFile.modified).toLocaleString()
    : new Date().toLocaleString()

  return (
    <aside className="app-panel">

      {/* Panel title bar */}
      <div className="panel-header">
        <div className="panel-header-dot"></div>
        <span className="panel-header-title">Properties</span>
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
          <div className="panel-field-label">Last Modified</div>
          <div className="panel-field-value">
            <span>{timestamp}</span>
            <span className="panel-field-dot warning"></span>
          </div>
        </div>

        <div>
          <div className="panel-field-label">File ID</div>
          <div className="panel-field-value">
            <span>{selectedFile.id}</span>
            <span className="panel-field-dot"></span>
          </div>
        </div>

        <div>
          <div className="panel-field-label">Access Level</div>
          <div className="panel-access-tags">
            <span className="access-tag">Encrypted</span>
            <span className="access-tag">Read-Only</span>
            <span className="access-tag">Audited</span>
          </div>
        </div>

      </div>



    </aside>
  )
}
