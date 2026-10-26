import { ArrowRight, ArrowLeft, Printer, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHead, Tags, NoteList, Download } from '@/components/shared'
import { P, type Project, companyHref, projectHref } from '@/lib/data'
import type { Route } from '@/App'
import { OperationsDetail } from '@/views/OperationsDetail'
import { MonthlyWork } from '@/views/MonthlyWork'

function ProjectCard({ project }: { project: Project }) {
  const company = P.companies.find(c => c.id === project.company)!
  return <Card className="company-card h-full py-0"><CardContent className="p-5 sm:p-6 flex flex-col h-full gap-4">
    <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground"><span>{company.name}</span><span className="tabular-nums">{project.period}</span></div>
    <div><h3 className="text-lg font-semibold tracking-tight"><a href={projectHref(project.id)} className="hover:underline underline-offset-4">{project.name}</a></h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{project.summary}</p></div>
    <p className="text-xs leading-5"><span className="text-muted-foreground">역할 · </span>{project.role}</p>
    <div className="mt-auto space-y-4"><Tags values={[project.platform]}/><a className="action-link inline-flex items-center gap-2 text-sm font-medium" href={projectHref(project.id)}>작업 자세히 보기<span className="sr-only"> · {project.name}</span><ArrowRight className="size-4" aria-hidden="true"/></a></div>
  </CardContent></Card>
}
function CareerOverview() {
  return <>
    <PageHead title={P.name} description={P.role}><Button variant="outline" asChild><a href="#resume">경력기술서 보기<ArrowRight aria-hidden="true"/></a></Button></PageHead>
    <p className="copy-text text-muted-foreground -mt-3 mb-9">{P.intro}</p>
    <h2 className="section-title mb-4">회사별 경력</h2>
    <div className="space-y-6">{P.companies.map(company => <Card className="py-0 gap-0 overflow-hidden" key={company.id}>
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-xl font-semibold tracking-tight"><a href={companyHref(company.id)} className="hover:underline underline-offset-4">{company.name}</a></h3><p className="text-xs text-muted-foreground mt-2">{company.role} · {company.domain}</p></div><span className="text-sm text-muted-foreground tabular-nums">{company.period}</span></div>
        <p className="copy-text mt-4 mb-4">{company.summary}</p><Tags values={company.skills}/>
      </CardContent>
      <div className="border-t px-5 sm:px-6"><div className="divide-y">{P.projects.filter(p => p.company === company.id).map(project => <a key={project.id} href={projectHref(project.id)} className="group block py-4 hover:bg-muted/40 rounded-sm"><div className="flex items-start gap-3"><div className="min-w-0 flex-1"><div className="flex flex-wrap justify-between gap-x-4 gap-y-1"><h4 className="text-sm font-semibold group-hover:underline underline-offset-4">{project.name}</h4><span className="text-xs text-muted-foreground">{project.platform}</span></div><p className="text-sm leading-6 text-muted-foreground mt-1.5">{project.summary}</p></div><ChevronRight className="size-4 mt-0.5 text-muted-foreground" aria-hidden="true"/></div></a>)}</div></div>
      <div className="border-t px-5 sm:px-6 py-3 flex flex-wrap gap-x-5 gap-y-3 bg-muted/25"><a href={companyHref(company.id)} className="action-link text-xs font-medium inline-flex items-center gap-1.5">회사 경력 보기<span className="sr-only"> · {company.name}</span><ArrowRight className="size-3.5" aria-hidden="true"/></a>{company.id === 'plax' && <><a className="action-link text-xs" href={companyHref(company.id, 'practice')}>배포·운영</a><a className="action-link text-xs" href={companyHref(company.id, 'timeline')}>월별 작업</a></>}</div>
    </Card>)}</div>
    <div className="mt-8 grid grid-cols-1 gap-3 sm:inline-grid sm:grid-cols-2"><Button variant="outline" asChild><a href="#skills">기술과 AI 활용<ArrowRight aria-hidden="true"/></a></Button><Download/></div>
  </>
}
function ProjectDetail({ id }: { id: string }) {
  const project = P.projects.find(p => p.id === id)
  if (!project) return <NotFound/>
  const company = P.companies.find(c => c.id === project.company)!
  return <>
    <Button asChild variant="ghost" size="sm" className="mb-5 -ml-3"><a href={companyHref(company.id)}><ArrowLeft aria-hidden="true"/>{company.name} 프로젝트</a></Button>
    <PageHead title={project.name} description={project.context}/>
    <dl className="grid gap-5 sm:grid-cols-2 border-y py-6 meta-list"><div><dt>회사·기간</dt><dd><a className="hover:underline underline-offset-4" href={companyHref(company.id)}>{company.name}</a><br/>{project.period}</dd></div><div><dt>담당 역할</dt><dd>{project.role}</dd></div><div className="sm:col-span-2"><dt>사용 기술</dt><dd><Tags values={project.skills}/></dd></div></dl>
    <section className="subsection"><h2 className="section-title">담당 업무</h2><NoteList items={project.actions}/></section>
    {project.cases.length > 0 && <section className="subsection"><h2 className="section-title">구현 사례</h2><div className="space-y-5">{project.cases.map(item => <Card className="py-0" key={item.title}><CardContent className="p-5 sm:p-6 space-y-5"><h3 className="text-base font-semibold">{item.title}</h3><div><h4 className="text-xs font-medium text-muted-foreground mb-2">상황</h4><p className="copy-text">{item.problem}</p></div><div><h4 className="text-xs font-medium text-muted-foreground mb-2">구현</h4><NoteList items={item.actions}/></div><div className="border-t pt-4"><h4 className="text-xs font-medium text-muted-foreground mb-2">구현 결과</h4><p className="copy-text">{item.result}</p></div></CardContent></Card>)}</div></section>}
    <div className="mt-9 border-t pt-5"><Button variant="outline" asChild><a href={companyHref(company.id)}>{company.name} 경력 보기<ArrowRight aria-hidden="true"/></a></Button></div>
  </>
}
function CompanyAI({ id, resume = false }: { id: string; resume?: boolean }) {
  const experience = P.ai.experiences.find(item => item.company === id)
  if (!experience) return null
  const Heading = resume ? 'h3' : 'h2'
  return <section className="mt-7 mb-5 space-y-3 border-t pt-5">
    <Heading className="section-title">AI 활용</Heading>
    <p className="copy-text text-muted-foreground">{experience.text}</p>
    {!resume && id === 'plax' && <a href="#skills" className="action-link inline-flex items-center gap-2 text-sm font-medium">AI 개발·검수 사례 보기<ArrowRight className="size-4" aria-hidden="true"/></a>}
  </section>
}
function CompanyCareer({ route }: { route: Route }) {
  const company = P.companies.find(c => c.id === route.params.company)
  if (!company) return <NotFound/>
  if (route.params.project) return <ProjectDetail id={route.params.project}/>
  const section = route.params.section || 'projects'
  return <>
    <Button asChild variant="ghost" size="sm" className="mb-5 -ml-3"><a href="#career"><ArrowLeft aria-hidden="true"/>전체 경력</a></Button>
    <PageHead title={company.name} description={company.summary}/>
    <dl className="grid gap-5 sm:grid-cols-3 meta-list border-y py-6"><div><dt>재직 기간</dt><dd>{company.period}</dd></div><div><dt>역할</dt><dd>{company.role}</dd></div><div><dt>서비스 분야</dt><dd>{company.domain}</dd></div></dl>
    <div className="mt-5"><Tags values={company.skills}/></div>
    {company.id === 'plax' && <nav aria-label="플랙스뉴럴랩스 경력 보기" className="flex flex-wrap gap-2 mt-7 pb-4 border-b">{[['projects', '프로젝트'], ['practice', '배포·운영'], ['timeline', '월별 작업']].map(([id, label]) => <Button key={id} size="sm" variant={section === id ? 'secondary' : 'ghost'} asChild><a href={companyHref(company.id, id === 'projects' ? '' : id)} aria-current={section === id ? 'page' : undefined}>{label}</a></Button>)}</nav>}
    <div className="mt-7">{section === 'practice' ? <OperationsDetail/> : section === 'timeline' ? <MonthlyWork route={route}/> : <section className="space-y-4"><h2 className="section-title">프로젝트</h2><div className="grid gap-4 lg:grid-cols-2">{P.projects.filter(p => p.company === company.id).map(project => <ProjectCard key={project.id} project={project}/>)}</div></section>}</div>
    {section === 'projects' && <CompanyAI id={company.id}/>}
  </>
}
function AIDevelopment({ resume = false }: { resume?: boolean }) {
  return <section className={resume ? 'subsection border-t pt-7' : 'space-y-7'} aria-labelledby="ai-development-title">
    <div className="space-y-3">
      <h2 id="ai-development-title" className="text-xl font-semibold">{P.ai.title}</h2>
      <p className="copy-text text-muted-foreground">{P.ai.text}</p>
    </div>
    <div className="space-y-5 rounded-xl bg-muted/50 p-5 sm:p-6">
      <h3 className="section-title">{P.ai.loop.title}</h3>
      <ol className="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
        {P.ai.loop.steps.map((step, index) => <li key={step.title} className="space-y-2">
          <h4 className="text-sm font-semibold"><span className="text-primary tabular-nums mr-2">{index + 1}.</span>{step.title}</h4>
          <p className="text-sm leading-6 text-muted-foreground">{step.text}</p>
        </li>)}
      </ol>
      <div className="space-y-2 border-t pt-5">
        <h4 className="text-sm font-semibold">{P.ai.loop.case.title}</h4>
        <p className="copy-text text-muted-foreground">{P.ai.loop.case.text}</p>
      </div>
    </div>
    <div className="divide-y">
      {P.ai.practices.map(practice => <article key={practice.title} className="py-6 first:pt-0 last:pb-0 grid gap-4 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="space-y-3"><h3 className="section-title">{practice.title}</h3>{!resume && <Tags values={practice.tools}/>}</div>
        <NoteList items={practice.actions}/>
      </article>)}
    </div>
  </section>
}
function Skills() {
  return <>
    <PageHead title="기술과 AI 활용" description="Flutter·React Native 앱 개발과 함께, AI 도구를 활용한 코드 품질 검수와 반복 작업 자동화를 진행했습니다."/>
    <AIDevelopment/>
    <section className="subsection border-t pt-8">
      <h2 className="text-xl font-semibold">사용 기술</h2>
      <div className="grid gap-4 lg:grid-cols-2">{P.skills.map(skill => <Card className="py-0" key={skill.title}><CardContent className="p-5 sm:p-6 space-y-4"><h3 className="section-title">{skill.title}</h3><Tags values={skill.tools}/><p className="text-sm leading-7 text-muted-foreground">{skill.experience}</p></CardContent></Card>)}</div>
    </section>
    <section className="subsection border-t pt-8">
      <h2 className="text-xl font-semibold">동료와의 공유·개인 프로젝트</h2>
      <div className="grid gap-4 lg:grid-cols-2">{P.ai.experiences.map(experience => {
        const company = P.companies.find(item => item.id === experience.company)!
        return <Card className="py-0" key={company.id}><CardContent className="p-5 sm:p-6 space-y-3">
          <h3 className="section-title"><a href={companyHref(company.id)} className="hover:underline underline-offset-4">{company.name}</a></h3>
          <p className="copy-text text-muted-foreground">{experience.text}</p>
        </CardContent></Card>
      })}</div>
      <Card className="py-0"><CardContent className="p-5 sm:p-6 space-y-4">
        <h3 className="section-title">{P.ai.example.name}</h3>
        <p className="copy-text text-muted-foreground">{P.ai.example.text}</p>
        <Tags values={P.ai.example.tools}/><NoteList items={P.ai.example.steps}/>
      </CardContent></Card>
    </section>
  </>
}
function Resume() {
  return <div className="resume-document"><PageHead title="경력기술서" description="회사별 담당 업무와 주요 프로젝트를 정리했습니다."><div className="no-print flex flex-wrap gap-2"><Button size="sm" onClick={() => window.print()}><Printer aria-hidden="true"/>인쇄·PDF 저장</Button><Download size="sm"/></div></PageHead><div className="border-b pb-7"><h2 className="text-2xl font-semibold">{P.name}</h2><p className="text-sm font-medium mt-2">{P.role}</p><p className="copy-text text-muted-foreground mt-4">{P.intro}</p><p className="note mt-3">작성 기준일 {P.updated}</p></div>
    {P.companies.map(company => <section className="subsection resume-company" key={company.id}><div className="border-b pb-4"><div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-xl font-semibold">{company.name}</h2><p className="text-sm text-muted-foreground">{company.period}</p></div><p className="text-sm text-muted-foreground mt-2">{company.role}</p><p className="copy-text mt-3">{company.summary}</p></div>{P.projects.filter(project => project.company === company.id).map(project => <article key={project.id} className="pt-3 pb-4 space-y-3"><h3 className="text-base font-semibold">{project.name}</h3><p className="text-xs text-muted-foreground">{project.period} · {project.platform}</p><p className="text-sm font-medium">{project.role}</p><NoteList items={project.actions}/></article>)}<CompanyAI id={company.id} resume/>{company.id === 'plax' && <section className="space-y-4 border-t pt-5"><h3 className="section-title">배포·운영</h3><p className="copy-text text-muted-foreground">{P.delivery.resume}</p>{P.practice.filter(item => item.id !== 'reviews').map(item => <article key={item.title} className="space-y-2 pb-3"><h4 className="text-sm font-medium">{item.title}</h4><p className="copy-text text-muted-foreground">{item.text}</p></article>)}</section>}</section>)}

    <section className="subsection border-t pt-7"><h2 className="section-title">기술</h2>{P.skills.map(skill => <div key={skill.title} className="text-sm leading-7"><strong className="font-medium">{skill.title}</strong><p className="text-muted-foreground">{skill.tools.join(' · ')}</p></div>)}</section>
    <AIDevelopment resume/>
    <section className="subsection border-t pt-7"><h2 className="section-title">{P.ai.example.name}</h2><p className="copy-text text-muted-foreground">{P.ai.example.text}</p></section>
  </div>
}
function NotFound() { return <><PageHead title="페이지를 찾을 수 없습니다" description="전체 경력에서 회사나 프로젝트를 선택해 주세요."/><Button asChild><a href="#career">전체 경력</a></Button></> }
export function Portfolio({ route }: { route: Route }) {
  if (route.view === 'company') return <CompanyCareer route={route}/>
  if (route.view === 'skills') return <Skills/>
  if (route.view === 'resume') return <Resume/>
  return <CareerOverview/>
}
