// Baihaqi.exe's icon set: small glossy SVGs on a 32×32 grid, in the spirit of early-2000s system icons.
import { useId, type ReactNode } from 'react'

export type IconName =
  | 'computer'
  | 'user'
  | 'folder'
  | 'folderOpen'
  | 'skills'
  | 'guestbook'
  | 'browser'
  | 'recycle'
  | 'recycleFull'
  | 'terminal'
  | 'notepad'
  | 'settings'
  | 'briefcase'
  | 'exe'
  | 'txt'
  | 'zip'
  | 'img'
  | 'url'
  | 'pdf'
  | 'mail'
  | 'github'
  | 'linkedin'
  | 'chat'
  | 'info'
  | 'warning'
  | 'help'
  | 'power'
  | 'logoff'
  | 'sound'
  | 'mute'
  | 'network'
  | 'back'
  | 'forward'
  | 'up'
  | 'search'
  | 'views'
  | 'bubbles'
  | 'desktop'
  | 'cloud'
  | 'gear'
  | 'lang'
  | 'frame'
  | 'server'
  | 'tool'
  | 'drive'
  | 'shield'

interface Props {
  name: IconName
  size?: number
  className?: string
}

export function Icon({ name, size = 32, className }: Props) {
  const uid = useId().replace(/:/g, '')
  const g = (k: string) => `${uid}${k}`
  const url = (k: string) => `url(#${g(k)})`
  const body = draw(name, g, url)
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      {body}
    </svg>
  )
}

const lin = (id: string, stops: [number, string][], x2 = 0, y2 = 1) => (
  <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
    {stops.map(([o, c]) => (
      <stop key={o} offset={o} stopColor={c} />
    ))}
  </linearGradient>
)

const shine = (d: string) => <path d={d} fill="#fff" opacity="0.45" />

function page(g: (k: string) => string, url: (k: string) => string, accent: ReactNode) {
  return (
    <>
      <defs>{lin(g('p'), [[0, '#ffffff'], [1, '#dfe6ef']], 1, 1)}</defs>
      <path d="M7 3h13l6 6v20H7z" fill={url('p')} stroke="#7d8ba0" />
      <path d="M20 3v6h6" fill="#c9d3e0" stroke="#7d8ba0" strokeLinejoin="round" />
      {accent}
    </>
  )
}

function draw(name: IconName, g: (k: string) => string, url: (k: string) => string): ReactNode {
  switch (name) {
    case 'computer':
      return (
        <>
          <defs>
            {lin(g('a'), [[0, '#f4f2ea'], [1, '#c9c4b2']])}
            {lin(g('s'), [[0, '#6fc1ff'], [0.55, '#2a7fd8'], [1, '#2b9a4a']])}
          </defs>
          <rect x="3" y="3" width="26" height="19" rx="2" fill={url('a')} stroke="#8a8572" />
          <rect x="6" y="6" width="20" height="13" fill={url('s')} stroke="#4c5d73" />
          {shine('M6 6h20v5c-7 1-13 0-20 2z')}
          <path d="M12 22h8l1 4H11z" fill="#bdb7a3" stroke="#8a8572" />
          <rect x="7" y="26" width="18" height="3" rx="1" fill={url('a')} stroke="#8a8572" />
        </>
      )
    case 'desktop':
      return (
        <>
          <defs>{lin(g('s'), [[0, '#9fd8ff'], [1, '#2a74cf']])}</defs>
          <rect x="3" y="5" width="26" height="20" rx="1.5" fill={url('s')} stroke="#2a4d7c" />
          <ellipse cx="11" cy="13" rx="5" ry="2.4" fill="#fff" opacity="0.9" />
          <ellipse cx="21" cy="10" rx="4" ry="1.8" fill="#fff" opacity="0.7" />
          <rect x="3" y="22" width="26" height="3" fill="#245edb" />
          <rect x="4" y="22.6" width="5" height="1.8" rx="0.9" fill="#3c9a3c" />
        </>
      )
    case 'drive':
      return (
        <>
          <defs>{lin(g('a'), [[0, '#f3f3f3'], [1, '#a9aeb6']])}</defs>
          <path d="M4 13l3-6h18l3 6v9H4z" fill={url('a')} stroke="#6b717b" strokeLinejoin="round" />
          <path d="M4 13h24" stroke="#6b717b" />
          <rect x="7" y="16" width="10" height="2" fill="#7f8792" />
          <circle cx="24" cy="17" r="1.4" fill="#4fd14f" stroke="#2b7a2b" strokeWidth="0.5" />
        </>
      )
    case 'user':
      return (
        <>
          <defs>
            {lin(g('b'), [[0, '#8fd0ff'], [1, '#1f6fd1']])}
            {lin(g('f'), [[0, '#ffe3c2'], [1, '#e8b48a']])}
          </defs>
          <rect x="3" y="3" width="26" height="26" rx="4" fill={url('b')} stroke="#1b4f97" />
          <circle cx="16" cy="13" r="5.5" fill={url('f')} stroke="#a0704b" strokeWidth="0.8" />
          <path d="M6.5 28c1.5-6 5-8.5 9.5-8.5s8 2.5 9.5 8.5z" fill="#f6f6f6" stroke="#6b7b91" strokeWidth="0.8" />
          {shine('M4 7c0-2 1-3 3-3h18c2 0 3 1 3 3v3C20 8 12 8 4 12z')}
        </>
      )
    case 'folder':
    case 'folderOpen':
      return (
        <>
          <defs>
            {lin(g('b'), [[0, '#fde59b'], [1, '#e9b53e']])}
            {lin(g('f'), [[0, '#ffefb8'], [1, '#f1c14f']])}
          </defs>
          <path d="M3 8a1 1 0 0 1 1-1h8l2 2h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" fill={url('b')} stroke="#b9871f" />
          {name === 'folderOpen' ? (
            <path d="M5 14h25l-3 13H3z" fill={url('f')} stroke="#b9871f" strokeLinejoin="round" />
          ) : (
            <path d="M3 12h26v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" fill={url('f')} stroke="#b9871f" />
          )}
          {shine('M4 13h24v3C20 14 11 15 4 17z')}
        </>
      )
    case 'skills':
      return (
        <>
          <defs>
            {lin(g('r'), [[0, '#ff9a7a'], [1, '#e2402a']])}
            {lin(g('gr'), [[0, '#9be27a'], [1, '#2f9e2f']])}
            {lin(g('b'), [[0, '#8fd0ff'], [1, '#1f6fd1']])}
            {lin(g('y'), [[0, '#ffe58a'], [1, '#f0aa12']])}
          </defs>
          <rect x="3" y="3" width="12" height="12" rx="3" fill={url('r')} stroke="#a52b17" />
          <rect x="17" y="3" width="12" height="12" rx="3" fill={url('gr')} stroke="#22702a" />
          <rect x="3" y="17" width="12" height="12" rx="3" fill={url('b')} stroke="#1b4f97" />
          <rect x="17" y="17" width="12" height="12" rx="3" fill={url('y')} stroke="#a8740a" />
          <path d="M6 9l3 2.5L13 6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M20 23h6M23 20v6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 23h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="23" cy="9" r="3" fill="none" stroke="#fff" strokeWidth="2" />
        </>
      )
    case 'guestbook':
      return (
        <>
          <defs>
            {lin(g('c'), [[0, '#a8e06e'], [1, '#4e9a2b']])}
            {lin(g('p'), [[0, '#ffffff'], [1, '#e9eef4']])}
          </defs>
          <rect x="5" y="3" width="22" height="26" rx="2" fill={url('c')} stroke="#3b7420" />
          <rect x="9" y="5" width="16" height="22" fill={url('p')} stroke="#9aa9b9" strokeWidth="0.6" />
          <path d="M12 10h10M12 14h10M12 18h7" stroke="#8aa0b8" strokeWidth="1.2" />
          {[8, 13, 18, 23].map((y) => (
            <rect key={y} x="3.5" y={y} width="4" height="1.8" rx="0.9" fill="#d7dde4" stroke="#7d8794" strokeWidth="0.5" />
          ))}
          <path d="M22 20l4-8 2 1-4 8-2.6.8z" fill="#f5c84c" stroke="#9b7414" strokeWidth="0.7" />
        </>
      )
    case 'browser':
      return (
        <>
          <defs>
            <radialGradient id={g('o')} cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#c8f0ff" />
              <stop offset="0.5" stopColor="#3aa0f0" />
              <stop offset="1" stopColor="#0d4fb0" />
            </radialGradient>
          </defs>
          <circle cx="16" cy="16" r="11" fill={url('o')} stroke="#0c3f8c" />
          <path d="M9 13c3-1 4 1 6 0s2-4 5-3 3 3 2 5-4 1-5 4 1 5-2 6c-2-2-1-4-3-5s-4-3-3-7z" fill="#6cc04a" opacity="0.85" />
          <ellipse cx="16" cy="16" rx="14.5" ry="5" fill="none" stroke="#f6c443" strokeWidth="2" transform="rotate(-25 16 16)" />
          {shine('M8 11c2-4 6-6 10-5-4 1-7 3-9 7z')}
        </>
      )
    case 'recycle':
    case 'recycleFull':
      return (
        <>
          <defs>
            {lin(g('b'), [[0, '#e6f4ff'], [1, '#9cc7e6']], 1, 0)}
          </defs>
          <path d="M7 9h18l-2 19H9z" fill={url('b')} stroke="#5f87a8" opacity="0.95" />
          <rect x="5.5" y="6.5" width="21" height="3" rx="1" fill="#dbeefc" stroke="#5f87a8" />
          <path d="M12 12l.7 13M16 12v13M20 12l-.7 13" stroke="#8fb3cf" strokeWidth="1.2" />
          {name === 'recycleFull' && (
            <>
              <path d="M10 6l3-4 4 3-2 2z" fill="#fff" stroke="#8a9bb0" strokeWidth="0.7" />
              <path d="M17 6.5l4-3 3 3z" fill="#ffe8a0" stroke="#b89a3a" strokeWidth="0.7" />
            </>
          )}
          {shine('M8 10h4l-1 17H9.5z')}
        </>
      )
    case 'terminal':
      return (
        <>
          <rect x="3" y="5" width="26" height="22" rx="1.5" fill="#1a1a1a" stroke="#7a7a7a" />
          <rect x="3" y="5" width="26" height="4" fill="#2a63d8" />
          <path d="M7 14l4 3-4 3" stroke="#d8d8d8" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 21h7" stroke="#d8d8d8" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )
    case 'notepad':
      return (
        <>
          <defs>{lin(g('p'), [[0, '#ffffff'], [1, '#dfe9f3']])}</defs>
          <rect x="6" y="5" width="20" height="24" fill={url('p')} stroke="#6d84a0" />
          <rect x="6" y="3" width="20" height="4" fill="#5fa8e8" stroke="#3a6ea8" />
          <path d="M9 12h14M9 16h14M9 20h14M9 24h9" stroke="#9fb6cf" />
        </>
      )
    case 'settings':
      return (
        <>
          <defs>{lin(g('s'), [[0, '#9fd8ff'], [1, '#2a74cf']])}</defs>
          <rect x="2" y="4" width="22" height="17" rx="1.5" fill={url('s')} stroke="#2a4d7c" />
          <ellipse cx="10" cy="11" rx="4" ry="2" fill="#fff" opacity="0.85" />
          <path d="M9 21h8v3H9z" fill="#b7b7b7" stroke="#777" />
          <path d="M18 30l3-9 4-6c1-1.5 3.5 0 2.5 1.5l-4 6z" fill="#f2c04b" stroke="#8c6a12" strokeWidth="0.8" />
          <path d="M18 30l2.5-4 2 1.2z" fill="#e05252" />
        </>
      )
    case 'gear':
      return (
        <>
          <defs>{lin(g('m'), [[0, '#f2f2f2'], [1, '#9aa1ab']])}</defs>
          <path
            d="M14 3h4l.7 3.3 2.4 1 2.8-1.9 2.8 2.8-1.9 2.8 1 2.4L29 14v4l-3.3.7-1 2.4 1.9 2.8-2.8 2.8-2.8-1.9-2.4 1L18 29h-4l-.7-3.3-2.4-1-2.8 1.9-2.8-2.8 1.9-2.8-1-2.4L3 18v-4l3.3-.7 1-2.4-1.9-2.8 2.8-2.8 2.8 1.9 2.4-1z"
            fill={url('m')}
            stroke="#5e6670"
          />
          <circle cx="16" cy="16" r="4.5" fill="#dfe6ee" stroke="#5e6670" />
        </>
      )
    case 'briefcase':
      return (
        <>
          <defs>{lin(g('b'), [[0, '#c98d52'], [1, '#7c4d22']])}</defs>
          <path d="M12 9V6.5a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 20 6.5V9" fill="none" stroke="#5a3715" strokeWidth="2" />
          <rect x="3" y="9" width="26" height="18" rx="2.5" fill={url('b')} stroke="#5a3715" />
          <path d="M3 16h26" stroke="#5a3715" />
          <rect x="14" y="14" width="4" height="4" rx="0.8" fill="#f1d27a" stroke="#8c6a12" strokeWidth="0.7" />
          {shine('M4 11c0-1 1-1.5 2-1.5h20c1 0 2 .5 2 1.5v2C20 12 12 12 4 14z')}
        </>
      )
    case 'exe':
      return (
        <>
          <defs>{lin(g('w'), [[0, '#ffffff'], [1, '#d7dde6']])}</defs>
          <rect x="3" y="5" width="26" height="22" rx="1.5" fill={url('w')} stroke="#5f6f86" />
          <rect x="3" y="5" width="26" height="5" rx="1.5" fill="#2a63d8" />
          <rect x="6" y="13" width="9" height="10" fill="#a9d6ff" stroke="#5f86b5" strokeWidth="0.7" />
          <path d="M18 14h8M18 17h8M18 20h5" stroke="#9aa6b6" />
        </>
      )
    case 'txt':
      return page(g, url, <path d="M10 13h12M10 17h12M10 21h12M10 25h7" stroke="#8a99ad" />)
    case 'pdf':
      return page(
        g,
        url,
        <>
          <rect x="5" y="17" width="16" height="8" rx="1" fill="#d23a2f" />
          <text x="13" y="23.2" textAnchor="middle" fontSize="6" fontFamily="Tahoma, Verdana, sans-serif" fontWeight="700" fill="#fff">
            PDF
          </text>
        </>,
      )
    case 'zip':
      return (
        <>
          <defs>{lin(g('b'), [[0, '#fde59b'], [1, '#e9b53e']])}</defs>
          <path d="M3 8a1 1 0 0 1 1-1h8l2 2h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" fill={url('b')} stroke="#b9871f" />
          <path d="M15 9v18" stroke="#555" strokeWidth="2.6" strokeDasharray="1.5 1.5" />
          <rect x="13" y="17" width="4" height="5" rx="0.8" fill="#bbb" stroke="#555" />
        </>
      )
    case 'img':
      return (
        <>
          <rect x="3" y="5" width="26" height="22" rx="1" fill="#fff" stroke="#6d7c90" />
          <defs>{lin(g('s'), [[0, '#8fd0ff'], [1, '#e8f6ff']])}</defs>
          <rect x="5.5" y="7.5" width="21" height="17" fill={url('s')} />
          <path d="M5.5 24.5l7-7 4 4 3-3 7 6z" fill="#6cb85a" />
          <circle cx="21" cy="12" r="2.4" fill="#ffd34d" />
        </>
      )
    case 'url':
      return page(
        g,
        url,
        <>
          <circle cx="15" cy="20" r="6" fill="#3aa0f0" stroke="#0c3f8c" />
          <ellipse cx="15" cy="20" rx="8" ry="2.6" fill="none" stroke="#f6c443" strokeWidth="1.4" transform="rotate(-25 15 20)" />
        </>,
      )
    case 'mail':
      return (
        <>
          <defs>{lin(g('e'), [[0, '#ffffff'], [1, '#dfe6ef']])}</defs>
          <rect x="3" y="7" width="26" height="18" rx="1.5" fill={url('e')} stroke="#6d7c90" />
          <path d="M3.5 8l12.5 9 12.5-9" fill="none" stroke="#6d7c90" />
          <circle cx="24" cy="21" r="3" fill="#e2402a" />
        </>
      )
    case 'github':
      return (
        <>
          <circle cx="16" cy="16" r="13" fill="#24292f" />
          <path
            d="M16 7a9 9 0 0 0-2.85 17.54c.45.08.62-.2.62-.43v-1.6c-2.5.54-3.03-1.06-3.03-1.06-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.07 1.38.93 1.38.93.8 1.38 2.11.98 2.62.75.08-.58.32-.98.57-1.2-2-.23-4.1-1-4.1-4.44 0-.98.35-1.79.93-2.42-.1-.23-.4-1.14.08-2.38 0 0 .76-.24 2.48.92a8.5 8.5 0 0 1 4.5 0c1.72-1.16 2.48-.92 2.48-.92.49 1.24.18 2.15.09 2.38.58.63.92 1.44.92 2.42 0 3.45-2.1 4.21-4.1 4.43.32.28.61.82.61 1.66v2.46c0 .24.16.52.62.43A9 9 0 0 0 16 7z"
            fill="#fff"
          />
        </>
      )
    case 'linkedin':
      return (
        <>
          <rect x="3" y="3" width="26" height="26" rx="4" fill="#0a66c2" />
          <circle cx="10" cy="10" r="2" fill="#fff" />
          <rect x="8.2" y="13" width="3.6" height="11" fill="#fff" />
          <path d="M14.5 13h3.4v1.6c.6-1 1.8-1.9 3.6-1.9 3 0 3.7 2 3.7 4.6V24h-3.6v-6c0-1.4-.3-2.4-1.7-2.4s-1.8 1-1.8 2.4v6h-3.6z" fill="#fff" />
        </>
      )
    case 'chat':
      return (
        <>
          <defs>{lin(g('b'), [[0, '#b9e6ff'], [1, '#3e8fdc']])}</defs>
          <path d="M4 6h20a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H12l-6 5v-5H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill={url('b')} stroke="#22579a" />
          <circle cx="9" cy="13.5" r="1.6" fill="#fff" />
          <circle cx="14" cy="13.5" r="1.6" fill="#fff" />
          <circle cx="19" cy="13.5" r="1.6" fill="#fff" />
          <path d="M22 18l6-1 1 9-4-2z" fill="#a8e06e" stroke="#3b7420" strokeWidth="0.7" opacity="0.9" />
        </>
      )
    case 'shield':
      return (
        <>
          <defs>{lin(g('b'), [[0, '#9be27a'], [1, '#2f8e2f']])}</defs>
          <path d="M16 3l11 4v8c0 7-5 12-11 14C10 27 5 22 5 15V7z" fill={url('b')} stroke="#22702a" />
          <path d="M11 16l3.5 3.5L21 12" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {shine('M6 8l10-4v10C12 12 9 12 6 14z')}
        </>
      )
    case 'info':
      return (
        <>
          <defs>{lin(g('b'), [[0, '#8fd0ff'], [1, '#1f5fc4']])}</defs>
          <circle cx="16" cy="16" r="13" fill={url('b')} stroke="#173f84" />
          <circle cx="16" cy="9.5" r="2" fill="#fff" />
          <rect x="14.2" y="13" width="3.6" height="11" rx="1" fill="#fff" />
        </>
      )
    case 'warning':
      return (
        <>
          <defs>{lin(g('y'), [[0, '#ffe78a'], [1, '#f0a812']])}</defs>
          <path d="M16 3l14 25H2z" fill={url('y')} stroke="#9a6b08" strokeLinejoin="round" />
          <rect x="14.5" y="11" width="3" height="9" rx="1" fill="#2b2b2b" />
          <circle cx="16" cy="23.5" r="1.7" fill="#2b2b2b" />
        </>
      )
    case 'help':
      return (
        <>
          <defs>{lin(g('b'), [[0, '#8fd0ff'], [1, '#1f5fc4']])}</defs>
          <circle cx="16" cy="16" r="13" fill={url('b')} stroke="#173f84" />
          <path d="M12 12.5a4 4 0 1 1 5.5 3.7c-1 .5-1.5 1.1-1.5 2.3v.5" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <circle cx="16" cy="23.5" r="1.8" fill="#fff" />
        </>
      )
    case 'power':
      return (
        <>
          <defs>{lin(g('r'), [[0, '#ff9a7a'], [1, '#d33a20']])}</defs>
          <rect x="3" y="3" width="26" height="26" rx="5" fill={url('r')} stroke="#922413" />
          <path d="M11 10.5a8 8 0 1 0 10 0" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M16 7v9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </>
      )
    case 'logoff':
      return (
        <>
          <defs>{lin(g('y'), [[0, '#ffe58a'], [1, '#e9a110']])}</defs>
          <rect x="3" y="3" width="26" height="26" rx="5" fill={url('y')} stroke="#9a6b08" />
          <path d="M14 9H9v14h5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinejoin="round" />
          <path d="M14 16h10M20 12l4 4-4 4" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )
    case 'sound':
    case 'mute':
      return (
        <>
          <path d="M5 12h5l7-6v20l-7-6H5z" fill="#e8e8e8" stroke="#555" strokeLinejoin="round" />
          {name === 'sound' ? (
            <path d="M21 11c2 2.5 2 7.5 0 10M24.5 8c4 4 4 12 0 16" stroke="#555" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M21 12l7 8M28 12l-7 8" stroke="#d33a20" strokeWidth="2.4" strokeLinecap="round" />
          )}
        </>
      )
    case 'network':
      return (
        <>
          <rect x="3" y="6" width="14" height="11" rx="1" fill="#bfe3ff" stroke="#3a5d85" />
          <rect x="15" y="13" width="14" height="11" rx="1" fill="#bfe3ff" stroke="#3a5d85" />
          <path d="M10 17v7h5" stroke="#3a5d85" fill="none" />
        </>
      )
    case 'back':
    case 'forward':
      return (
        <>
          <defs>{lin(g('gr'), [[0, '#a8ea8a'], [1, '#2f9e2f']])}</defs>
          <circle cx="16" cy="16" r="13" fill={url('gr')} stroke="#22702a" />
          <path
            d={name === 'back' ? 'M18.5 9l-7 7 7 7' : 'M13.5 9l7 7-7 7'}
            stroke="#fff"
            strokeWidth="3.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )
    case 'up':
      return (
        <>
          <defs>{lin(g('b'), [[0, '#fde59b'], [1, '#e9b53e']])}</defs>
          <path d="M3 9a1 1 0 0 1 1-1h8l2 2h14a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" fill={url('b')} stroke="#b9871f" />
          <path d="M16 24V14M11.5 18.5L16 14l4.5 4.5" stroke="#2a8a2a" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )
    case 'search':
      return (
        <>
          <circle cx="13" cy="13" r="8" fill="#d7eeff" stroke="#3a5d85" strokeWidth="2.4" />
          <path d="M19 19l8 8" stroke="#7a5a2a" strokeWidth="3.4" strokeLinecap="round" />
        </>
      )
    case 'views':
      return (
        <>
          {[4, 12, 20].map((y) => (
            <g key={y}>
              <rect x="4" y={y} width="7" height="6" fill="#ffd56a" stroke="#b9871f" />
              <rect x="14" y={y + 2} width="14" height="2" fill="#5a6b80" />
            </g>
          ))}
        </>
      )
    case 'bubbles':
      return (
        <>
          <defs>
            <radialGradient id={g('o')} cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.6" stopColor="#bfe8ff" stopOpacity="0.7" />
              <stop offset="1" stopColor="#5fb4f0" stopOpacity="0.9" />
            </radialGradient>
          </defs>
          <circle cx="12" cy="18" r="9" fill={url('o')} stroke="#3e8fdc" />
          <circle cx="23" cy="10" r="6" fill={url('o')} stroke="#3e8fdc" />
          <circle cx="24" cy="24" r="4" fill={url('o')} stroke="#3e8fdc" />
        </>
      )
    case 'cloud':
      return (
        <>
          <defs>{lin(g('c'), [[0, '#ffffff'], [1, '#cfe6f7']])}</defs>
          <path d="M9 24a6 6 0 0 1-.6-12A8 8 0 0 1 24 11a6.5 6.5 0 0 1 0 13z" fill={url('c')} stroke="#5f87a8" />
        </>
      )
    case 'lang':
      return page(
        g,
        url,
        <path d="M12 15l-3 4 3 4M20 15l3 4-3 4M17.5 13.5l-3 11" stroke="#2a63d8" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
      )
    case 'frame':
      return (
        <>
          <defs>{lin(g('b'), [[0, '#c7b6ff'], [1, '#6a4fd1']])}</defs>
          <path d="M16 3l12 7v12l-12 7-12-7V10z" fill={url('b')} stroke="#3f2c94" />
          <path d="M4 10l12 7 12-7M16 17v12" stroke="#fff" opacity="0.7" fill="none" />
        </>
      )
    case 'server':
      return (
        <>
          <defs>{lin(g('m'), [[0, '#eef1f5'], [1, '#9aa3b0']])}</defs>
          {[4, 13, 22].map((y) => (
            <g key={y}>
              <rect x="5" y={y} width="22" height="7" rx="1.2" fill={url('m')} stroke="#5e6670" />
              <circle cx="9" cy={y + 3.5} r="1.2" fill="#4fd14f" />
              <path d={`M13 ${y + 3.5}h10`} stroke="#6f7883" />
            </g>
          ))}
        </>
      )
    case 'tool':
      return (
        <>
          <path d="M20 4a6 6 0 0 0-5.6 8.2L4.5 22.1a2.4 2.4 0 0 0 3.4 3.4l9.9-9.9A6 6 0 0 0 26 10l-3.6 3.6-3.4-1-1-3.4L21.6 5.6A6 6 0 0 0 20 4z" fill="#c9ced6" stroke="#5e6670" strokeLinejoin="round" />
          <path d="M5.5 26.5l7-7" stroke="#e05252" strokeWidth="3" strokeLinecap="round" />
        </>
      )
  }
}
