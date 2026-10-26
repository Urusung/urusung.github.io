import profile from '../../source-data/public-profile.json'
export const P = profile
export type Project = typeof P.projects[number]
export const resumeFile = import.meta.env.BASE_URL + 'woosung-resume.txt'
export function href(view: string, params: Record<string, string> = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value))
  return `#${view}${query.size ? '?' + query : ''}`
}
export const companyHref = (company: string, section = '') => href('company', { company, section })
export const projectHref = (project: string) => href('company', { company: P.projects.find(p => p.id === project)?.company || 'plax', project })
export const monthHref = (month: string) => href('company', { company: 'plax', section: 'timeline', month })
export function readRoute() {
  const [raw, query = ''] = location.hash.slice(1).split('?')
  const params: Record<string, string> = Object.fromEntries(new URLSearchParams(query))
  if (raw === 'skills' || raw === 'resume' || raw === 'evidence') return { view: raw === 'evidence' ? 'resume' : raw, params: {} as Record<string, string> }
  if (raw === 'project' || (raw === 'company' && params.project)) {
    const project = P.projects.find(p => p.id === params.project)
    return { view: 'company', params: { company: project?.company || params.company || 'plax', project: params.project } }
  }
  if (['practice', 'operations', 'activity', 'timeline'].includes(raw)) {
    return { view: 'company', params: { company: 'plax', section: raw === 'timeline' ? 'timeline' : 'practice', ...(raw === 'timeline' && params.month ? { month: params.month } : {}) } }
  }
  if (raw === 'company' || (raw === 'projects' && params.company)) {
    const company = params.company || 'plax'
    const section = company === 'plax' && ['practice', 'timeline'].includes(params.section) ? params.section : ''
    return { view: 'company', params: { company, ...(section ? { section } : {}), ...(section === 'timeline' && params.month ? { month: params.month } : {}) } }
  }
  return { view: 'career', params: {} as Record<string, string> }
}
