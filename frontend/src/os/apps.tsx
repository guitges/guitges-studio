import type { ComponentType } from 'react'
import type { AppId } from './registry'
import { About } from './apps/About'
import { Browser } from './apps/Browser'
import { Bubbles } from './apps/Bubbles'
import { Experience } from './apps/Experience'
import { Explorer } from './apps/Explorer'
import { Notepad } from './apps/Notepad'
import { ProjectDetails } from './apps/ProjectDetails'
import { Projects } from './apps/Projects'
import { RecycleBin } from './apps/RecycleBin'
import { Skills } from './apps/Skills'
import { SysInfo } from './apps/SysInfo'
import { SystemProperties } from './apps/SystemProperties'
import { Terminal } from './apps/Terminal'

export const APP_COMPONENTS: Record<AppId, ComponentType> = {
  computer: Explorer,
  about: About,
  projects: Projects,
  project: ProjectDetails,
  skills: Skills,
  experience: Experience,
  browser: Browser,
  recycle: RecycleBin,
  terminal: Terminal,
  notepad: Notepad,
  system: SystemProperties,
  bubbles: Bubbles,
  sysinfo: SysInfo,
}
