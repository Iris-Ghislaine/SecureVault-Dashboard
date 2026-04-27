import { useState } from 'react'

function hasMatchingDescendant(node, query) {
  if (!query) return false
  if (node.type === 'file') return node.name.toLowerCase().includes(query.toLowerCase())
  return node.children?.some(child => hasMatchingDescendant(child, query))
}

function highlightMatch(name, query) {
  if (!query) return name
  const index = name.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) return name
  return (
    <>
      {name.slice(0, index)}
      <mark>{name.slice(index, index + query.length)}</mark>
      {name.slice(index + query.length)}
    </>
  )
}

export default function TreeNode({ node, selectedFile, onSelectFile, searchQuery, depth = 0 }) {
  const isFolder = node.type === 'folder'

  const [manualOpen, setManualOpen] = useState(false)
  const isOpen = isFolder && (manualOpen || hasMatchingDescendant(node, searchQuery))
  const nameMatches = node.name.toLowerCase().includes((searchQuery || '').toLowerCase())

  if (searchQuery && !nameMatches && !hasMatchingDescendant(node, searchQuery)) {
    return null
  }

  const isSelected = selectedFile?.id === node.id

  function handleClick() {
    if (isFolder) {
      setManualOpen(prev => !prev)  
    } else {
      onSelectFile(node)       
    }
  }

  return (
    <div className="tree-node">
      <div
        className={`tree-node-row ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${12 + depth * 16}px` }} 
        data-id={node.id}
        aria-expanded={isFolder ? isOpen : undefined}
        onClick={handleClick}
        tabIndex={-1} 
      >
        <span className={`tree-chevron ${isFolder ? (isOpen ? 'expanded' : '') : 'empty'}`}>
          ▶
        </span>
        <span className={`node-icon ${isFolder ? 'folder' : 'file'}`}>
          {isFolder ? '📁' : '📄'}
        </span>
        <span className="node-name">
          {highlightMatch(node.name, searchQuery)}
        </span>
      </div>

      {/* Render children if this folder is open */}
      {isFolder && isOpen && (
        <div className="tree-node-children">
          {node.children?.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
              searchQuery={searchQuery}
              depth={depth + 1}  // increase indent for each level
            />
          ))}
        </div>
      )}
    </div>
  )

}