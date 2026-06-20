import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useCompare } from '../state/useCompare'

const navLink = ({ isActive }: { isActive: boolean }) =>
  [
    'px-2 py-1.5 rounded-md text-sm font-medium transition-colors sm:px-3',
    isActive
      ? 'bg-ink text-paper'
      : 'text-ink-soft hover:text-ink hover:bg-line/60',
  ].join(' ')

export function Layout() {
  const { pathname } = useLocation()
  const compareCount = useCompare((s) => s.ids.length)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-dvh flex flex-col overflow-x-hidden">
      <header className="border-b border-line bg-paper-raised/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
          <NavLink to="/" className="flex items-center gap-2 group">
            <BellwetherMark />
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              Bellwether
            </span>
          </NavLink>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navLink}>
              Rank
            </NavLink>
            <NavLink to="/compare" className={navLink}>
              Compare
              {compareCount > 0 && (
                <span className="nums ml-1.5 rounded-full bg-signal px-1.5 py-0.5 text-[10px] font-semibold text-paper-raised tabular-nums">
                  {compareCount}
                </span>
              )}
            </NavLink>
            <NavLink to="/methodology" className={navLink}>
              Methodology
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 text-xs text-ink-faint flex flex-wrap gap-x-4 gap-y-1 justify-between">
          <span>
            Bellwether — a personal climate-relocation compass. Estimates, not
            advice.
          </span>
          <NavLink to="/methodology" className="hover:text-ink underline">
            How the numbers are made →
          </NavLink>
        </div>
      </footer>
    </div>
  )
}

/** A weathervane-inspired mark: a compass needle pointing to fair weather. */
function BellwetherMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      className="text-signal"
      aria-hidden
    >
      <circle cx="11" cy="11" r="10" className="stroke-line-strong" strokeWidth="1.5" />
      <path
        d="M11 3.5L13.4 11L11 18.5L8.6 11L11 3.5Z"
        className="fill-signal"
      />
      <circle cx="11" cy="11" r="1.6" className="fill-paper-raised" />
    </svg>
  )
}
