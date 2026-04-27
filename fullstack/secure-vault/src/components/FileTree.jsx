import TreeNode from './TreeNode.jsx'

export default function FileTree({ nodes, selectedFile, onSelectFile, searchQuery }) {
  function handleKeyDown(e) {
    const rows = Array.from(document.querySelectorAll('[data-id]'))
    if (rows.length === 0) return
    const focused = document.activeElement
    const currentIndex = rows.indexOf(focused)
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        const next = rows[currentIndex + 1] ?? rows[0]
        next.focus()
        break
      }

      case 'ArrowUp': {
        e.preventDefault()
        const prev = rows[currentIndex - 1] ?? rows[rows.length - 1]
        prev.focus()
        break
      }

      case 'ArrowRight': {
        e.preventDefault()
        if (focused && focused.getAttribute('aria-expanded') === 'false') {
          focused.click()
        }
        break
      }

      case 'ArrowLeft': {
        e.preventDefault()
        if (focused && focused.getAttribute('aria-expanded') === 'true') {
          focused.click()
        }
        break
      }

      case 'Enter': {
        e.preventDefault()
        if (focused) focused.click()
        break
      }

      default:
        break
    }
  }

  return (
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
