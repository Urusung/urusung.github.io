import { readFile, writeFile, readdir, mkdir, rm } from 'node:fs/promises'
const P = JSON.parse(await readFile('source-data/public-profile.json', 'utf8'))
const filename = 'woosung-resume.txt'
const lines = [P.name, P.role, `작성 기준일 ${P.updated}`, '', P.intro, '']
for (const company of P.companies) {
  lines.push('='.repeat(40), company.name, company.period, company.role, company.summary, '')
  for (const project of P.projects.filter(project => project.company === company.id)) {
    lines.push(project.name, `${project.period} | ${project.platform}`, `역할: ${project.role}`, ...project.actions.map(action => `- ${action}`), '')
  }
  const aiExperience = P.ai.experiences.find(experience => experience.company === company.id)
  if (aiExperience) lines.push('AI 활용', aiExperience.text, '')
  if (company.id === 'plax') {
    lines.push('배포·운영', '', P.delivery.resume, '')
    for (const item of P.practice.filter(item => item.id !== 'reviews')) lines.push(item.title, item.text, '')
  }
}
lines.push('='.repeat(40), '기술', '')
for (const item of P.skills) lines.push(item.title, item.tools.join(' · '), item.experience, '')
lines.push('='.repeat(40), P.ai.title, P.ai.text, '', P.ai.loop.title)
for (const [index, step] of P.ai.loop.steps.entries()) lines.push(`${index + 1}. ${step.title}`, step.text)
lines.push('', P.ai.loop.case.title, P.ai.loop.case.text, '')
for (const practice of P.ai.practices) lines.push(practice.title, ...practice.actions.map(action => `- ${action}`), '')
lines.push(P.ai.example.name, P.ai.example.text, '')
await mkdir('public', { recursive: true })
// Remove prior generated downloads before producing the only approved public document.
for (const entry of await readdir('public', { withFileTypes: true })) {
  if (entry.isFile() && /\.(?:json|txt)$/.test(entry.name)) await rm('public/' + entry.name)
}
await writeFile('public/' + filename, lines.join('\n'))
await writeFile('public/robots.txt', 'User-agent: *\nDisallow: /\n')
console.log('Prepared public resume; raw research data is excluded.')
