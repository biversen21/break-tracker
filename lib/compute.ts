import type { BreakTemplate } from './types'

export function getTemplateTeamCount(template: BreakTemplate): number {
  return template.teams.length
}
