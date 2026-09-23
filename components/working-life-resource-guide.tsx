import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  getWorkingLifeResources,
  resourceSourceStyles,
  workingLifeResourceTopics,
} from "@/lib/working-life-resources"

export function WorkingLifeResourceGuide() {
  return (
    <>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        先選一個最接近的主題，我們會提供一個可以開始的入口；需要更多選擇時，再前往完整資源名錄。
      </p>
      <p className="mt-1 text-xs text-muted-foreground">以下為主要入口示意，正式收錄單位與服務範圍仍需確認。</p>

      <Accordion type="single" collapsible defaultValue="work-rights" className="mt-4 space-y-2">
        {workingLifeResourceTopics.map((topic) => {
          const TopicIcon = topic.icon
          const resources = getWorkingLifeResources(topic.id)
          const primaryResource = resources[0]

          return (
            <AccordionItem
              key={topic.id}
              value={topic.id}
              className="overflow-hidden rounded-lg border border-border/70 bg-background/75 px-4"
            >
              <AccordionTrigger className="py-4 hover:no-underline">
                <span className="flex min-w-0 items-start gap-3 text-left">
                  <span className="mt-0.5 rounded-md bg-primary/10 p-2 text-primary">
                    <TopicIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-foreground">{topic.title}</span>
                    <span className="mt-1 block text-sm font-normal leading-relaxed text-muted-foreground">
                      {topic.description}
                    </span>
                  </span>
                </span>
              </AccordionTrigger>

              <AccordionContent className="pb-4">
                <div className="border-t border-border/70 pt-4">
                  <p className="text-xs font-semibold text-primary">可以先從這裡開始</p>
                  <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">{primaryResource.title}</h3>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${resourceSourceStyles[primaryResource.source]}`}
                        >
                          {primaryResource.source}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{primaryResource.description}</p>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        <span className="font-medium text-foreground">提供單位：</span>
                        {primaryResource.provider}
                      </p>
                    </div>
                    <Link
                      href={primaryResource.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-primary transition-all hover:gap-2 sm:pt-0.5"
                    >
                      {primaryResource.action}
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-4 border-t border-border/60 pt-3">
                    <Link
                      href={`/resources?audience=working-life&category=${topic.id}`}
                      className="group inline-flex items-center gap-1 text-sm font-medium text-primary transition-all hover:gap-2"
                    >
                      查看此分類的所有相關單位（{resources.length}）
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      <div className="mt-4 flex justify-end">
        <Link
          href="/resources?audience=working-life"
          className="group inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all hover:gap-2"
        >
          查看完整資源名錄
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  )
}
