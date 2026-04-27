import TreeNode from './TreeNode.jsx'

// FileTree renders the full list of root-level nodes and handles keyboard navigation
export default function FileTree({ nodes, selectedFile, onSelectFile, searchQuery }) {

  // Keyboard navigation handler
  function handleKeyDown(e) {
    // Get all currently visible rows in DOM order
    const rows = Array.from(document.querySelectorAll('[data-id]'))
    if (rows.length === 0) return

    // Find which row is currently focused
    const focused = document.activeElement
    const currentIndex = rows.indexOf(focused)

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        // Move focus to the next row, or wrap to first
        const next = rows[currentIndex + 1] ?? rows[0]
        next.focus()
        break
      }

      case 'ArrowUp': {
        e.preventDefault()
        // Move focus to the previous row, or wrap to last
        const prev = rows[currentIndex - 1] ?? rows[rows.length - 1]
        prev.focus()
        break
      }

      case 'ArrowRight': {
        e.preventDefault()
        // Expand folder: simulate a click if it is collapsed
        if (focused && focused.getAttribute('aria-expanded') === 'false') {
          focused.click()
        }
        break
      }

      case 'ArrowLeft': {
        e.preventDefault()
        // Collapse folder: simulate a click if it is expanded
        if (focused && focused.getAttribute('aria-expanded') === 'true') {
          focused.click()
        }
        break
      }

      case 'Enter': {
        e.preventDefault()
        // Select the file: simulate a click on the focused row
        if (focused) focused.click()
        break
      }

      default:
        break
    }
  }

  return (
    // onKeyDown is on the wrapper so all arrow keys bubble up here
    <div className="file-tree" onKeyDown={handleKeyDown}>
      {nodes.map(node => (
        <TreeNode
          key={node.id}
          node={node}
          selectedFile={selectedFile}
          onSelectFile={onSelectFile}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  )
}
