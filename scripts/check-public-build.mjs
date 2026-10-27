import { readFile, readdir } from 'node:fs/promises'
import assert from 'node:assert/strict'
const approvedData = ['public-profile.json']
assert.deepEqual((await readdir('source-data')).sort(), approvedData, 'Only curated public data may enter the source-data directory')
const P = JSON.parse(await readFile('source-data/public-profile.json', 'utf8'))
function keys(value, expected) { assert.deepEqual(Object.keys(value).sort(), expected.split(' ').sort(), 'Public schema changed: review new fields before publication') }
keys(P, 'name role updated intro shortIntro contact strengths companies projects practice skills ai timeline featured delivery')
assert.equal(P.contact, null)
for (const c of P.companies) keys(c, 'id name period role domain summary skills')
for (const p of P.projects) {
  keys(p, 'id name period platform context role actions company skills cases summary')
  for (const c of p.cases) keys(c, 'title problem actions result')
}
for (const s of P.strengths) keys(s, 'title text tags')
for (const s of P.practice) {
  const deliveryFields = ['flutter-store', 'rn-store', 'flutter', 'expo'].includes(s.id) ? ' scope method' : ''
  keys(s, 'title tools text id role problem actions boundary' + deliveryFields)
}
for (const s of P.skills) keys(s, 'title tools experience')
keys(P.ai, 'title text loop practices experiences example'); keys(P.ai.example, 'name text tools steps')
keys(P.ai.loop, 'title steps case'); keys(P.ai.loop.case, 'title text')
for (const step of P.ai.loop.steps) keys(step, 'title text')
for (const practice of P.ai.practices) keys(practice, 'title tools actions')
for (const experience of P.ai.experiences) {
  keys(experience, 'company text')
  assert.ok(P.companies.some(company => company.id === experience.company), 'AI experience must belong to a listed company')
}
keys(P.delivery, 'asOf period personal store eas shorebird monthly notes monitoring resume')
for (const r of P.delivery.personal) keys(r, 'label value unit detail')
for (const r of P.delivery.store) {
  keys(r, 'framework app platform count period gap versions note')
  assert.ok(['Flutter', 'React Native'].includes(r.framework), 'Every store record needs a verified framework')
  assert.ok(r.count > 1 ? Number.isFinite(r.gap) : r.gap === null, 'A single store release has no average interval')
}
const storeTotals = Object.fromEntries(['Flutter', 'React Native'].map(framework => [
  framework, P.delivery.store.filter(r => r.framework === framework).reduce((n, r) => n + r.count, 0),
]))
assert.deepEqual(storeTotals, { Flutter: 40, 'React Native': 39 })
assert.equal(Object.values(storeTotals).reduce((n, count) => n + count, 0), P.delivery.monthly.reduce((n, r) => n + r.store, 0))
for (const r of P.delivery.eas) keys(r, 'app count days period gap')
assert.equal(P.delivery.eas.reduce((n, r) => n + r.count, 0), 79)
keys(P.delivery.shorebird, 'count android ios days bases period gap note')
for (const r of P.delivery.monthly) keys(r, 'month prs commits easPersonal shorebird store')
for (const r of P.delivery.monitoring) keys(r, 'title period items note')
assert.equal(P.delivery.monthly.reduce((n,r)=>n+r.prs,0),350)
assert.equal(P.delivery.monthly.reduce((n,r)=>n+r.commits,0),2619)
assert.equal(P.delivery.monthly.reduce((n,r)=>n+r.easPersonal,0),79)
assert.equal(P.delivery.monthly.reduce((n,r)=>n+r.shorebird,0),72)
assert.equal(P.delivery.monthly.reduce((n,r)=>n+r.store,0),79)

for (const entry of P.timeline) {
  keys(entry, 'month title summary work')
  assert.ok(P.delivery.monthly.some(row => row.month === entry.month.replace('-', '.')), 'Every work month needs a matching activity record')
  for (const item of entry.work) keys(item, 'title area platforms text')
}
assert.equal(P.timeline.length, 13)
assert.equal(P.timeline.reduce((count, month) => count + month.work.length, 0), 74)
async function files(dir, base = '') {
  const list = []
  for (const entry of await readdir(dir + '/' + base, { withFileTypes: true })) {
    const name = base + entry.name
    if (entry.isDirectory()) list.push(...await files(dir, name + '/'))
    else list.push(name)
  }
  return list
}
const allow = /^(?:index\.html|robots\.txt|woosung-resume\.txt|assets\/[\w-]+\.(?:js|css)|fonts\/(?:PretendardVariable\.woff2|LICENSE\.txt)|licenses\/shadcn-ui\.txt)$/
const denied = [
  /console\.firebase\.google\.com|console\.shorebird\.dev|appstoreconnect\.apple\.com|play\.google\.com\/console|mail\.google\.com/i,
  /expo\.dev\/(?:accounts|@)/i,
  /\/Users\/|\/source-data\/|reviewed_paths|authored_non_merge|siwc_bypass|source_repository_credential/,
  /월별_경력_근거|회사별_경력_근거|운영지표_코드상세_근거|Expo_운영지표_근거|업데이트_PR_커밋_빈도_근거|이전회사_경력자료_발췌/,
  /appgprj_|appgdep_|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
]
const built = await files('dist')
for (const file of built) {
  assert.ok(allow.test(file), 'Unexpected public asset: ' + file)
  if (file.endsWith('.woff2')) continue
  const text = await readFile('dist/' + file, 'utf8')
  for (const pattern of denied) assert.ok(!pattern.test(text), 'Private data pattern found in ' + file)
}
const source = JSON.stringify(P)
assert.ok(!/https?:\/\/|mailto:|[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(source), 'External URLs or contact data require a new explicit review')
for (const pattern of denied) assert.ok(!pattern.test(source), 'Private data pattern found in profile')
assert.ok(built.includes('woosung-resume.txt'))
assert.ok(!(await readFile('dist/index.html', 'utf8')).includes('sourceMappingURL'))
console.log(`Public build check passed: ${built.length} allowlisted assets, one resume download, no private evidence files or known private identifiers/links.`)
