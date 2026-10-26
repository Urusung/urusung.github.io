import type { ComponentProps, ReactNode } from 'react'
import { FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { resumeFile } from '@/lib/data'
export function PageHead({ title, description, children }: { title: string, description?: ReactNode, children?: ReactNode }) {
  return <div className="page-heading"><div><h1 tabIndex={-1} className="page-title outline-none">{title}</h1>{description && <p className="page-description">{description}</p>}</div>{children}</div>
}
export function Download({ children = '경력기술서 TXT', size = 'default' }: { children?: ReactNode; size?: ComponentProps<typeof Button>['size'] }) {
  return <Button variant="outline" size={size} asChild><a href={resumeFile} download><FileDown aria-hidden="true"/>{children}</a></Button>
}
export function Tags({ values }: { values: string[] }) {
  return <div className="flex flex-wrap gap-1.5">{values.map(value => <Badge variant="secondary" key={value} className="font-normal">{value}</Badge>)}</div>
}
export function NoteList({ items }: { items: string[] }) {
  return <ul className="list-disc pl-5 space-y-2 text-sm leading-7 text-muted-foreground">{items.map((item, index) => <li key={index}>{item}</li>)}</ul>
}
