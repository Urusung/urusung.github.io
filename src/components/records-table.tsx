import type { ReactNode } from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'

export function RecordsTable({ label, headers, rows }: { label: string; headers: string[]; rows: ReactNode[][] }) {
  return <div className="data-grid">
    <Table aria-label={label} tabIndex={0} className="min-w-[640px]">
      <TableHeader><TableRow>{headers.map(header => <TableHead key={header} scope="col">{header}</TableHead>)}</TableRow></TableHeader>
      <TableBody>{rows.map((row, index) => <TableRow key={index}>{row.map((cell, col) => <TableCell key={col} className={col > 0 ? 'tabular-nums' : ''}>{cell}</TableCell>)}</TableRow>)}</TableBody>
    </Table>
  </div>
}

export function RecordPeriod({ value }: { value: string }) {
  const dates = [...new Set(value.split(' — '))]
  return <span className="text-xs whitespace-nowrap">{dates.map((date, index) => <span className="block" key={date}>{index ? '— ' : ''}{date}</span>)}</span>
}
