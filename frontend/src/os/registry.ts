// What each app is called, which icon it wears and how big its window opens.
// Components live in ./apps.tsx so this file stays importable from anywhere.
import type { IconName } from './icons'

export type AppId =
  | 'computer'
  | 'about'
  | 'projects'
  | 'project'
  | 'skills'
  | 'experience'
  | 'browser'
  | 'recycle'
  | 'terminal'
  | 'notepad'
  | 'system'
  | 'bubbles'
  | 'sysinfo'

export interface AppMeta {
  title: string
  icon: IconName
  w: number
  h: number
  minW?: number
  minH?: number
  /** Fixed-size dialogs can't be maximised or resized */
  fixed?: boolean
}

export const APPS: Record<AppId, AppMeta> = {
  computer: { title: 'My Computer', icon: 'computer', w: 720, h: 470 },
  about: { title: 'About Baihaqi', icon: 'user', w: 560, h: 500, minW: 360 },
  projects: { title: 'Projects', icon: 'folderOpen', w: 760, h: 500 },
  project: { title: 'Project', icon: 'exe', w: 640, h: 560 },
  skills: { title: 'Skills and Components', icon: 'skills', w: 600, h: 500, minW: 380 },
  experience: { title: 'Work History', icon: 'briefcase', w: 760, h: 480 },
  browser: { title: 'Internet Explorer', icon: 'browser', w: 720, h: 540 },
  recycle: { title: 'Recycle Bin', icon: 'recycleFull', w: 560, h: 380 },
  terminal: { title: 'Command Prompt', icon: 'terminal', w: 640, h: 400, minW: 320, minH: 200 },
  notepad: { title: 'Untitled - Notepad', icon: 'notepad', w: 520, h: 400, minW: 300, minH: 220 },
  system: { title: 'System Properties', icon: 'settings', w: 440, h: 500, fixed: true },
  bubbles: { title: 'bubbles.scr', icon: 'bubbles', w: 560, h: 420 },
  sysinfo: { title: 'About this computer', icon: 'computer', w: 400, h: 400, fixed: true },
}

/** Apps with one window per argument (e.g. one per project or per note) */
export function windowId(app: AppId, arg?: string) {
  return arg ? `${app}:${arg}` : app
}
