import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Route } from '@/App'
import { P, companyHref, monthHref, projectHref } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { RecordsTable } from '@/components/records-table'
import { NoteList } from '@/components/shared'

const D = P.delivery

export function MonthlyWork({ route }: { route: Route }) {
  const selected = P.timeline.find(item => item.month === route.params.month) || P.timeline.at(-1)!
  const index = P.timeline.indexOf(selected)
  const activity = D.monthly.find(item => item.month === selected.month.replace('-', '.'))!
  const platforms = new Set(selected.work.flatMap(item => item.platforms))
  const previousMonth = useRef(selected.month)
  useEffect(() => {
    if (previousMonth.current === selected.month) return
    previousMonth.current = selected.month
    const heading = document.getElementById('month-title')
    heading?.scrollIntoView({ block: 'start', behavior: 'instant' })
    heading?.focus({ preventScroll: true })
  }, [selected.month])

  return <>
    <div className="mb-6"><h2 className="section-title">월별 작업</h2><p className="page-description">월별 주요 작업과 PR·커밋 기록입니다.</p></div>
    <div className="grid gap-6 lg:grid-cols-[112px_minmax(0,1fr)]">
      <div>
        <div className="lg:hidden flex items-center gap-3">
          <label htmlFor="work-month" className="text-sm font-medium shrink-0">작업 월</label>
          <select id="work-month" value={selected.month} onChange={event => { location.hash = monthHref(event.target.value) }} className="h-10 rounded-md border bg-background px-3 text-sm w-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {[...P.timeline].reverse().map(item => <option value={item.month} key={item.month}>{item.month.replace('-', '.')} · 작업 {item.work.length}건</option>)}
          </select>
        </div>
        <nav aria-label="작업 월 선택" className="hidden lg:flex flex-col gap-1 sticky top-24">
          {[...P.timeline].reverse().map(item => <Button variant={selected.month === item.month ? 'secondary' : 'ghost'} asChild key={item.month} className="justify-between tabular-nums" size="sm"><a href={monthHref(item.month)} aria-current={selected.month === item.month ? 'date' : undefined}>{item.month.replace('-', '.')}<span className="text-[10px] text-muted-foreground" aria-label={`작업 ${item.work.length}건`}>{item.work.length}</span></a></Button>)}
        </nav>
      </div>
      <div className="min-w-0">
        <section aria-labelledby="month-title">
          <div className="pb-6 border-b">
            <p className="text-xs font-medium tabular-nums text-muted-foreground">{selected.month.replace('-', '.')} · 작업 {selected.work.length}건</p>
            <h3 id="month-title" tabIndex={-1} className="text-xl sm:text-2xl font-semibold mt-3 mb-3 scroll-mt-24 outline-none">{selected.title}</h3>
            <p className="copy-text text-muted-foreground">{selected.summary}</p>
            <dl className="flex flex-wrap gap-x-8 gap-y-3 mt-5">
              <div className="flex items-baseline gap-2"><dt className="text-xs text-muted-foreground">작성한 PR</dt><dd className="text-lg font-semibold tabular-nums">{activity.prs}<span className="ml-1 text-xs font-normal">건</span></dd></div>
              <div className="flex items-baseline gap-2"><dt className="text-xs text-muted-foreground">작성한 커밋</dt><dd className="text-lg font-semibold tabular-nums">{activity.commits}<span className="ml-1 text-xs font-normal">건</span></dd></div>
            </dl>
            <p className="note mt-2">병합 커밋 제외{selected.month === '2025-10' ? ' · 10월 23일부터 집계했습니다.' : selected.month === '2026-10' ? ' · 10월 26일까지 집계했습니다.' : ''}</p>
          </div>
          <div className="divide-y">{selected.work.map((item, workIndex) => <article key={item.title} className="py-6 sm:py-7">
            <div className="flex items-start gap-3 sm:gap-4">
              <span aria-hidden="true" className="w-5 shrink-0 text-xs tabular-nums text-muted-foreground pt-1">{String(workIndex + 1).padStart(2, '0')}</span>
              <div className="min-w-0 space-y-2">
                <p className="text-xs leading-5 text-muted-foreground">{item.platforms.join(' · ')}<span aria-hidden="true" className="mx-2">/</span>{item.area}</p>
                <h4 className="text-base font-semibold leading-7">{item.title}</h4>
                <p className="copy-text text-muted-foreground">{item.text}</p>
              </div>
            </div>
          </article>)}</div>
        </section>
        <nav aria-label="이전·다음 작업 월" className="flex justify-between gap-3 border-t pt-4">
          {index > 0 ? <Button asChild variant="ghost" size="sm"><a href={monthHref(P.timeline[index - 1].month)}><ArrowLeft aria-hidden="true"/>이전 달 · {P.timeline[index - 1].month.replace('-', '.')}</a></Button> : <span/>}
          {index < P.timeline.length - 1 && <Button asChild variant="ghost" size="sm"><a href={monthHref(P.timeline[index + 1].month)}>다음 달 · {P.timeline[index + 1].month.replace('-', '.')}<ArrowRight aria-hidden="true"/></a></Button>}
        </nav>
        <div className="flex flex-wrap gap-2 mt-6">
          {platforms.has('Flutter') && <Button variant="outline" size="sm" asChild><a href={projectHref('rplay-flutter')}>Flutter 앱 프로젝트</a></Button>}
          {platforms.has('React Native') && <Button variant="outline" size="sm" asChild><a href={projectHref('rn-platform')}>React Native 공통 플랫폼</a></Button>}
          <Button variant="outline" size="sm" asChild><a href={companyHref('plax', 'practice')}>배포·운영 자세히 보기<ArrowRight aria-hidden="true"/></a></Button>
        </div>
      </div>
    </div>
    <section className="subsection">
      <Accordion type="single" collapsible><AccordionItem value="development"><AccordionTrigger className="text-sm font-medium">전체 기간 개발·배포 집계 · 13개월</AccordionTrigger><AccordionContent className="space-y-5">
        <p className="note">{D.period} · 집계 기준일 {D.asOf}</p>
        <dl className="grid sm:grid-cols-2 gap-5">{D.personal.slice(0, 2).map(item => <div key={item.label}><dt className="text-xs text-muted-foreground">{item.label}</dt><dd className="mt-2"><span className="text-2xl font-semibold tabular-nums">{item.value}</span><span className="text-sm ml-1">{item.unit}</span><p className="note mt-1">{item.detail}</p></dd></div>)}</dl>
        <p className="note">PR·커밋은 작성한 기록, Expo는 배포한 기록을 집계했습니다. Shorebird·스토어는 담당 앱의 전체 운영 기록입니다. 2025년 10월은 23일부터, 2026년 10월은 26일까지입니다.</p>
        <RecordsTable label="월별 개인 개발·배포와 프로젝트 배포 기록" headers={['월', '작성한 PR', '작성한 커밋', 'Expo OTA 배포', 'Shorebird 패치(앱 전체)', '스토어 배포(앱 전체)']} rows={D.monthly.map(row => [<a className="text-link" href={monthHref(row.month.replace('.', '-'))}>{row.month}</a>, row.prs, row.commits, row.easPersonal, row.shorebird, row.store])}/>
        <p className="note">단위는 건입니다. Expo는 iOS·Android가 같은 배포 그룹에 포함되면 합쳐 1건으로 셉니다.</p>
        <NoteList items={[...D.notes.slice(0, 2), D.notes.at(-1)!]}/>
      </AccordionContent></AccordionItem></Accordion>
    </section>
  </>
}
