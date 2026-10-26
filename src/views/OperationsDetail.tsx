import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { P, companyHref, projectHref } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tags, NoteList } from '@/components/shared'

const D = P.delivery
const practice = (id: string) => P.practice.find(item => item.id === id)!

type OperationRecord = { label: string; value: string; details: string[] }
type Operation = {
  id: string
  title: string
  tools: string[]
  role: string
  problem: string
  actions: string[]
  records: OperationRecord[]
  boundary: string
}

function monitoringRecord(item: typeof D.monitoring[number], label = item.title): OperationRecord {
  return { label, value: item.items.join(' · '), details: [item.period, item.note] }
}

const operations: Operation[] = [
  {
    id: 'store', title: '스토어 출시', tools: ['Codemagic', 'App Store', 'Google Play'],
    role: '기존 스토어 제출 설정 유지보수',
    problem: '기존 Codemagic 배포 과정에서 스토어 제출 설정 오류에 대응했습니다.',
    actions: [practice('flutter').actions[0]],
    records: [
      { label: '전체 기록', value: `담당 앱의 스토어 배포 ${D.store.reduce((sum, row) => sum + row.count, 0)}건`, details: ['앱·플랫폼별로 집계했으며, 첫 출시와 후속 업데이트를 포함합니다.'] },
      ...D.store.map(row => ({ label: `${row.app} · ${row.platform}`, value: `공개 ${row.count}건 · 배포일 평균 간격 ${row.gap}일`, details: [row.period, row.note] })),
    ],
    boundary: '담당 앱의 스토어 공개 이력을 앱·플랫폼별로 집계했습니다. 심사 대기·중지·출시일 미확인 건과 테스트 배포는 제외했습니다.',
  },
  {
    ...practice('expo'),
    records: [
      { label: '배포 실적', value: `Expo OTA 업데이트 ${D.eas.reduce((sum, row) => sum + row.count, 0)}건 배포`, details: ['2026.08.06 — 2026.10.23 동안 24일에 걸쳐 업데이트를 배포했습니다.', 'iOS·Android가 같은 배포 그룹에 포함되면 합쳐 1건으로 셉니다.'] },
      ...D.eas.map(row => ({ label: row.app, value: `업데이트 ${row.count}건 배포`, details: [row.period, row.gap == null ? `배포한 날 ${row.days}일 · 하루에만 배포해 평균 간격은 계산하지 않았습니다.` : `배포한 날 ${row.days}일 · 배포일 평균 간격 ${row.gap}일`] })),
      monitoringRecord(D.monitoring[0], '업데이트 적용 상태'),
    ],
    boundary: '기간·배포일·평균 간격은 위 업데이트 기록을 기준으로 계산했습니다. ' + practice('expo').boundary,
  },
  {
    ...practice('flutter'),
    problem: 'iOS 심볼 업로드 경로와 플랫폼별 재시도 조건이 빌드 환경에 맞도록 배포 설정을 수정했습니다.',
    actions: practice('flutter').actions.slice(1),
    records: [
      { label: '전체 기록', value: `담당 앱의 패치 기록 ${D.shorebird.count}건`, details: [`알플레이 · ${D.shorebird.period}`] },
      { label: '플랫폼별 패치', value: `Android ${D.shorebird.android}건 · iOS ${D.shorebird.ios}건`, details: [D.shorebird.note] },
      { label: '배포 빈도', value: `배포한 날 ${D.shorebird.days}일 · 배포일 평균 간격 ${D.shorebird.gap}일`, details: [`패치 대상 릴리스 ${D.shorebird.bases}개`] },
    ],
  },
  {
    ...practice('observability'),
    records: D.monitoring.slice(1).map(item => monitoringRecord(item)),
  },
  {
    ...practice('remote-config'),
    records: [
      { label: '적용 설정', value: '서비스 점검 · 최소 지원 버전 · 콘텐츠 정책', details: [] },
      { label: '적용 시점', value: '앱 시작 · 앱 복귀 · 실시간 설정 변경', details: ['설정 조회·활성화와 변경 이벤트 구독을 구현했습니다.'] },
    ],
  },
  {
    ...practice('reviews'),
    records: [
      { label: '수집 대상', value: '알플레이 · 스토리엔진 · 로맨틱플레이 · 멜로', details: [] },
      { label: '실행 주기', value: '하루 3차례', details: ['GitHub Actions 정기 실행 설정 기준입니다.'] },
      { label: '실행 결과', value: '확인한 10건 모두 성공', details: [`집계 기준일 ${D.asOf}`] },
    ],
    boundary: practice('reviews').boundary,
  },
]

function OperationField({ label, children }: { label: string; children: ReactNode }) {
  return <div className="grid gap-3 md:grid-cols-[104px_minmax(0,1fr)] md:gap-6">
    <h4 className="text-xs font-medium text-muted-foreground leading-7">{label}</h4>
    <div className="min-w-0">{children}</div>
  </div>
}

function OperationRecords({ title, records }: { title: string; records: OperationRecord[] }) {
  return <dl aria-label={`${title} 운영 기록`} className="divide-y rounded-lg border overflow-hidden">
    {records.map(record => <div key={record.label} className="grid gap-1 px-4 py-4 sm:grid-cols-[156px_minmax(0,1fr)] sm:gap-5">
      <dt className="text-xs font-medium text-muted-foreground leading-6">{record.label}</dt>
      <dd className="min-w-0 space-y-1"><p className="text-sm font-medium leading-7 tabular-nums">{record.value}</p>{record.details.map((detail, index) => <p className="note tabular-nums" key={index}>{detail}</p>)}</dd>
    </div>)}
  </dl>
}

function OperationSection({ item }: { item: Operation }) {
  return <section className="py-8 sm:py-10 space-y-6" aria-labelledby={`operation-${item.id}`} data-operation={item.id}>
    <div className="space-y-3"><h3 id={`operation-${item.id}`} className="text-lg font-semibold">{item.title}</h3><Tags values={item.tools}/></div>
    <div className="space-y-6">
      <OperationField label="담당 역할"><p className="copy-text font-medium">{item.role}</p></OperationField>
      <OperationField label="구현 내용"><div className="space-y-3"><p className="copy-text">{item.problem}</p><NoteList items={item.actions}/></div></OperationField>
      <OperationField label="운영 기록"><OperationRecords title={item.title} records={item.records}/></OperationField>
      <OperationField label="기록 범위"><p className="note">{item.boundary}</p></OperationField>
    </div>
  </section>
}

export function OperationsDetail() {
  return <>
    <div className="mb-6"><h2 className="section-title">배포·운영</h2><p className="page-description">앱 업데이트를 배포하고, 오류·성능 수집 코드와 스토어 리뷰 수집 도구를 개발했습니다.</p><p className="note mt-2">집계 기준일 {D.asOf}</p></div>
    <div className="divide-y border-y">{operations.map(item => <OperationSection item={item} key={item.id}/>)}</div>
    <section className="mt-6"><Accordion type="single" collapsible><AccordionItem value="method"><AccordionTrigger className="text-sm font-medium">배포 기록 집계 기준</AccordionTrigger><AccordionContent><NoteList items={D.notes.slice(2)}/></AccordionContent></AccordionItem></Accordion></section>
    <div className="mt-6 flex flex-wrap gap-3"><Button asChild variant="outline"><a href={companyHref('plax', 'timeline')}>PR·커밋 및 월별 작업<ArrowRight aria-hidden="true"/></a></Button><Button asChild variant="ghost"><a href={projectHref('rn-platform')}>공통 플랫폼 구현 사례<ArrowRight aria-hidden="true"/></a></Button></div>
  </>
}
