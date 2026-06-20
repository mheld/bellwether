import { useState } from 'react'
import { useWeights } from '../state/useWeights'
import { buildShareUrl } from '../state/urlState'

/** Copies a link that reproduces the current weights exactly. */
export function ShareButton() {
  const { factors, horizon, hazard } = useWeights()
  const [copied, setCopied] = useState(false)

  async function copy() {
    const url = buildShareUrl({ factors, horizon, hazard })
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Clipboard blocked — fall back to a prompt the user can copy from.
      window.prompt('Copy your shareable link:', url)
      return
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-ink-soft ring-1 ring-line-strong transition-colors hover:text-ink hover:ring-ink-faint"
    >
      {copied ? '✓ Link copied' : 'Share these weights'}
    </button>
  )
}
