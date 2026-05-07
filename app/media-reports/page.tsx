"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { CalendarDays, ExternalLink, Newspaper } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { mediaReports } from "@/lib/media-reports"

const sourceFilters = [
  { label: "全部", count: mediaReports.length },
  ...Array.from(
    mediaReports.reduce((sources, report) => {
      sources.set(report.source, (sources.get(report.source) ?? 0) + 1)
      return sources
    }, new Map<string, number>()),
  ).map(([label, count]) => ({ label, count })),
]

const colorClasses = [
  "border-l-cyan-500 bg-cyan-50/40 text-cyan-700",
  "border-l-emerald-500 bg-emerald-50/40 text-emerald-700",
  "border-l-violet-500 bg-violet-50/40 text-violet-700",
  "border-l-amber-500 bg-amber-50/40 text-amber-700",
  "border-l-rose-500 bg-rose-50/40 text-rose-700",
]

export default function MediaReportsPage() {
  const [selectedSource, setSelectedSource] = useState("全部")
  const filteredReports = useMemo(
    () =>
      selectedSource === "全部"
        ? mediaReports
        : mediaReports.filter((report) => report.source === selectedSource),
    [selectedSource],
  )

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
            <Newspaper className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">媒體報導</h1>
          <p className="text-muted-foreground">好理家在獲得全台主流媒體廣泛關注與肯定</p>
        </div>

        <Card className="border-primary/10 bg-card/80">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-wrap gap-2 mb-8">
              {sourceFilters.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => setSelectedSource(filter.label)}
                  className="rounded-full"
                  aria-pressed={selectedSource === filter.label}
                >
                  <Badge
                    variant={selectedSource === filter.label ? "default" : "outline"}
                    className={
                      selectedSource === filter.label
                        ? "rounded-full px-3 py-1 cursor-pointer"
                        : "rounded-full px-3 py-1 bg-background cursor-pointer hover:bg-accent"
                    }
                  >
                    {filter.label} ({filter.count})
                  </Badge>
                </button>
              ))}
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {selectedSource === "全部"
                ? `顯示全部 ${mediaReports.length} 篇媒體報導`
                : `顯示 ${selectedSource} ${filteredReports.length} 篇媒體報導`}
            </p>

            <div className="space-y-4">
              {filteredReports.map((report, index) => {
                const colorClass = colorClasses[index % colorClasses.length]
                return (
                  <Link key={`${report.title}-${index}`} href={report.href} className="group block">
                    <Card className={`border-l-4 transition-all hover:shadow-md ${colorClass}`}>
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background/80 text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h2 className="font-semibold text-foreground leading-relaxed group-hover:text-primary">
                              {report.title}
                            </h2>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <Badge variant="secondary" className="rounded-full">
                                {report.source}
                              </Badge>
                              <span className="inline-flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {report.date}
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
