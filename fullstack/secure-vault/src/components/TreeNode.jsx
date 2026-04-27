import { useState, useEffect } from 'react'

// Returns true if any descendant file name matches the search query
function hasMatchingDescendant(node, query) {
  if (!query) return false
  if (node.type === 'file') return node.name.toLowerCase().includes(query.toLowerCase())
  return node.children?.some(child => hasMatchingDescendant(child, query))
}

// Wraps the matching part of a name in a <mark> tag for highlight
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

  // Folders start collapsed unless search forces them open
  const [isOpen, setIsOpen] = useState(false)

  // Auto-expand folder if a child matches the search query
  useEffect(() => {
    if (isFolder && hasMatchingDescendant(node, searchQuery)) {
      setIsOpen(true)
    }
    // Collapse back when search is cleared
    if (!searchQuery) setIsOpen(false)
  }, [searchQuery])

  // Hide this node entirely if it doesn't match and has no matching descendants
  const nameMatches = node.name.toLowerCase().includes((searchQuery || '').toLowerCase())
  if (searchQuery && !nameMatches && !hasMatchingDescendant(node, searchQuery)) {
    return null
  }

  const isSelected = selectedFile?.id === node.id

  function handleClick() {
    if (isFolder) {
      setIsOpen(prev => !prev)  // toggle expand/collapse
    } else {
      onSelectFile(node)         // select the file
    }
  }

  return (
    <div className="tree-node">
      {/* The clickable row for this node */}
      <div
        className={`tree-node-row ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}  // indent by depth level
        data-id={node.id}
        aria-expanded={isFolder ? isOpen : undefined}
        onClick={handleClick}
        tabIndex={-1}  // focusable by keyboard nav in FileTree, not by Tab
      >
        {/* Chevron arrow — only visible on folders */}
        <span className={`tree-chevron ${isFolder ? (isOpen ? 'expanded' : '') : 'empty'}`}>
          ▶
        </span>

        {/* File or folder icon */}
        <span className={`node-icon ${isFolder ? 'folder' : 'file'}`}>
          {isFolder ? '📁' : '📄'}
        </span>

        {/* File/folder name with search highlight */}
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