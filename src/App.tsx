import { useEffect, useState, type CSSProperties } from 'react'
import { useTheme } from 'next-themes'
import { Building2, Code2, FileText, Sun, Moon, Command, BriefcaseBusiness } from 'lucide-react'
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { P, companyHref, readRoute, href } from '@/lib/data'
import { Portfolio } from '@/views/Portfolio'
export type Route = ReturnType<typeof readRoute>
const references = [['skills', '기술과 AI 활용', Code2], ['resume', '경력기술서', FileText]] as const
function Navigation({ route }: { route: Route }) {
  const { setOpenMobile } = useSidebar()
  useEffect(() => { setOpenMobile(false) }, [route.view, route.params.company, route.params.project, route.params.section, setOpenMobile])
  return <Sidebar variant="inset">
    <SidebarHeader className="p-4"><a href="#career" className="flex items-center gap-3 py-1"><span className="flex size-9 items-center justify-center bg-primary text-primary-foreground rounded-lg"><Command aria-hidden="true" className="size-5"/></span><span className="text-sm font-semibold">최우성<span className="block text-xs font-normal text-muted-foreground mt-0.5">앱 개발자</span></span></a></SidebarHeader>
    <SidebarContent onClickCapture={event => { if ((event.target as HTMLElement).closest('a[href^="#"]')) setOpenMobile(false) }}>
      <SidebarGroup><SidebarGroupContent><SidebarMenu><SidebarMenuItem><SidebarMenuButton asChild isActive={route.view === 'career'}><a href="#career" aria-current={route.view === 'career' ? 'page' : undefined}><BriefcaseBusiness aria-hidden="true"/><span>전체 경력</span></a></SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarGroupContent></SidebarGroup>
      <SidebarGroup><SidebarGroupLabel>회사별 경력</SidebarGroupLabel><SidebarGroupContent><SidebarMenu>{P.companies.map(company => <SidebarMenuItem key={company.id}><SidebarMenuButton asChild isActive={route.view === 'company' && route.params.company === company.id}><a href={companyHref(company.id)} aria-current={route.view === 'company' && route.params.company === company.id ? 'page' : undefined}><Building2 aria-hidden="true"/><span>{company.name}</span></a></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarGroupContent></SidebarGroup>
      <SidebarGroup><SidebarGroupLabel>소개·문서</SidebarGroupLabel><SidebarGroupContent><SidebarMenu>{references.map(([id, label, Icon]) => <SidebarMenuItem key={id}><SidebarMenuButton asChild isActive={route.view === id}><a href={'#' + id} aria-current={route.view === id ? 'page' : undefined}><Icon aria-hidden="true"/><span>{label}</span></a></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarGroupContent></SidebarGroup>
    </SidebarContent>
    <SidebarFooter className="gap-3 px-5 pb-5"><Separator/><p className="text-xs leading-5 text-muted-foreground">{P.role}</p></SidebarFooter>
  </Sidebar>
}
function Shell() {
  const [route, setRoute] = useState(readRoute)
  const { theme, setTheme } = useTheme()
  useEffect(() => {
    const onChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', onChange)
    window.addEventListener('popstate', onChange)
    return () => { window.removeEventListener('hashchange', onChange); window.removeEventListener('popstate', onChange) }
  }, [])
  useEffect(() => { document.querySelector('meta[name=theme-color]')?.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff') }, [theme])
  const company = route.view === 'company' ? P.companies.find(c => c.id === route.params.company) : undefined
  const project = route.params.project ? P.projects.find(p => p.id === route.params.project) : undefined
  const detail = project?.name || (route.params.section === 'practice' ? '배포·운영' : route.params.section === 'timeline' ? '월별 작업' : '')
  const title = detail || company?.name || references.find(item => item[0] === route.view)?.[1] || '전체 경력'
  useEffect(() => { history.replaceState(null, '', href(route.view, route.params)) }, [route])
  useEffect(() => {
    document.title = `${title}${detail && company ? ' · ' + company.name : ''} — 최우성`
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.querySelector<HTMLHeadingElement>('h1')?.focus({ preventScroll: true })
  }, [route.view, route.params.company, route.params.project, route.params.section])
  return <>
    <a href="#main" onClick={event => { event.preventDefault(); document.getElementById('main')?.focus() }} className="fixed top-3 left-3 -translate-y-20 focus:translate-y-0 z-50 bg-primary text-primary-foreground rounded-md p-3">본문으로 이동</a>
    <Navigation route={route}/>
    <SidebarInset className="min-w-0">
      <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4 sm:px-6 md:rounded-t-xl">
        <SidebarTrigger aria-label="탐색 메뉴 열기 또는 닫기" className="-ml-1"/><Separator orientation="vertical" className="!h-4"/>
        <Breadcrumb className="min-w-0 flex-1"><BreadcrumbList className="flex-nowrap gap-1.5 sm:gap-2.5">{route.view !== 'career' && <><BreadcrumbItem className="hidden sm:block"><BreadcrumbLink href="#career">전체 경력</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator className="hidden sm:block"/></>}{detail && company && <><BreadcrumbItem className="hidden md:block"><BreadcrumbLink href={companyHref(company.id)}>{company.name}</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator className="hidden md:block"/></>}<BreadcrumbItem className="min-w-0"><BreadcrumbPage className="truncate">{title}</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
        <Button size="icon" variant="ghost" aria-label={theme === 'dark' ? '밝은 테마로 전환' : '어두운 테마로 전환'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun aria-hidden="true"/> : <Moon aria-hidden="true"/>}</Button>
        <Button asChild size="sm"><a href="#resume"><FileText aria-hidden="true"/><span>경력기술서</span></a></Button>
      </header>
      <main id="main" tabIndex={-1} className="page-content outline-none flex-1"><div className="mx-auto max-w-6xl" key={route.view + (route.params.company || '') + (route.params.project || '')}><Portfolio route={route}/></div></main>
      <footer className="flex flex-wrap gap-2 justify-between border-t mx-4 sm:mx-7 lg:mx-9 py-5 text-xs text-muted-foreground"><span>최우성 · 앱 개발자</span><span>작성 기준일 {P.updated}</span></footer>
    </SidebarInset>
  </>
}
export default function App() { return <SidebarProvider defaultOpen style={{ '--sidebar-width': '15rem' } as CSSProperties}><Shell/></SidebarProvider> }
