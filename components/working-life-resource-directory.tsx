"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
import {
  resourceSourceStyles,
  workingLifeResources,
  workingLifeResourceTopics,
} from "@/lib/working-life-resources"

type WorkingLifeResourceDirectoryProps = {
  initialCategory?: string
}

export function WorkingLifeResourceDirectory({ initialCategory }: WorkingLifeResourceDirectoryProps) {
  const router = useRouter()
  const validInitialCategory = workingLifeResourceTopics.some((topic) => topic.id === initialCategory)
    ? initialCategory
    : "all"
  const [selectedCategory, setSelectedCategory] = useState(validInitialCategory ?? "all")

  const visibleResources =
    selectedCategory === "all"
      ? workingLifeResources
      : workingLifeResources.filter((resource) => resource.topicId === selectedCategory)

  const selectedTopic = workingLifeResourceTopics.find((topic) => topic.id === selectedCategory)

  function selectCategory(categoryId: string) {
    setSelectedCategory(categoryId)
    const searchParams = new URLSearchParams()
    searchParams.set("audience", "working-life")
    if (categoryId !== "all") searchParams.set("category", categoryId)
    router.replace(`/resources?${searchParams.toString()}`, { scroll: false })
  }

  return (
    <div>
      <Link
        href="/life-stages/working-life"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        回到勞工頁面
      </Link>

      <div className="mt-5 lg:hidden">
        <label htmlFor="resource-category" className="mb-2 block text-sm font-medium text-foreground">
          資源分類
        </label>
        <select
          id="resource-category"
          value={selectedCategory}
          onChange={(event) => selectCategory(event.target.value)}
          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="all">全部資源（{workingLifeResources.length}）</option>
          {workingLifeResourceTopics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.title}（{workingLifeResources.filter((resource) => resource.topicId === topic.id).length}）
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-7 lg:grid-cols-[230px_minmax(0,1fr)] lg:items-start">
        <nav aria-label="資源分類" className="hidden border-r border-border/80 pr-5 lg:block">
          <p className="mb-3 text-sm font-semibold text-foreground">資源分類</p>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => selectCategory("all")}
              aria-pressed={selectedCategory === "all"}
              className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                selectedCategory === "all"
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <span>全部資源</span>
              <span>{workingLifeResources.length}</span>
            </button>
            {workingLifeResourceTopics.map((topic) => {
              const count = workingLifeResources.filter((resource) => resource.topicId === topic.id).length

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => selectCategory(topic.id)}
                  aria-pressed={selectedCategory === topic.id}
                  className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                    selectedCategory === topic.id
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span>{topic.title}</span>
                  <span>{count}</span>
                </button>
              )
            })}
          </div>
        </nav>

        <section aria-live="polite" className="min-w-0">
          <div className="flex flex-col gap-2 border-b border-border/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">目前顯示</p>
              <h2 className="mt-1 text-xl font-semibold text-foreground">
                {selectedTopic?.title ?? "全部資源"}
              </h2>
              {selectedTopic ? (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{selectedTopic.description}</p>
              ) : null}
            </div>
            <p className="shrink-0 text-sm text-muted-foreground">共 {visibleResources.length} 筆</p>
          </div>

          <div className="mt-4 hidden overflow-hidden rounded-md border border-border/80 md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-secondary/75 text-foreground">
                <tr>
                  <th className="w-[23%] px-4 py-3 font-semibold">分類</th>
                  <th className="w-[30%] px-4 py-3 font-semibold">資源與提供單位</th>
                  <th className="px-4 py-3 font-semibold">可以協助什麼</th>
                  <th className="w-[130px] px-4 py-3 font-semibold">服務入口</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 bg-card/70">
                {visibleResources.map((resource) => (
                  <tr key={`${resource.topicId}-${resource.title}`} className="align-top">
                    <td className="px-4 py-4 text-muted-foreground">{resource.category}</td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-foreground">{resource.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{resource.provider}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${resourceSourceStyles[resource.source]}`}
                        >
                          {resource.source}
                        </span>
                        <span className="text-xs text-muted-foreground">{resource.scope}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="leading-relaxed text-muted-foreground">{resource.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {resource.tags.map((tag) => (
                          <span key={tag} className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={resource.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-1 font-medium text-primary transition-all hover:gap-2"
                      >
                        {resource.action}
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-3 md:hidden">
            {visibleResources.map((resource) => (
              <article key={`${resource.topicId}-${resource.title}`} className="rounded-md border border-border/80 bg-card/70 p-4">
                <p className="text-xs font-medium text-primary">{resource.category}</p>
                <h3 className="mt-1 font-semibold text-foreground">{resource.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{resource.provider}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${resourceSourceStyles[resource.source]}`}
                  >
                    {resource.source}
                  </span>
                  <span className="text-xs text-muted-foreground">{resource.scope}</span>
                </div>
                <Link
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary"
                >
                  {resource.action}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
