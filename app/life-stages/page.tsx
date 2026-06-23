import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { AudienceMiniScene } from "@/components/context-illustration"
import { Card, CardContent } from "@/components/ui/card"
import { serviceAudiences } from "@/lib/life-stages-data"

export const metadata: Metadata = {
  title: "服務對象 - 好理家在",
  description: "不同單位陪伴著不同處境中的人。好理家在希望把財務檢測、工具、諮詢與資源整理成更容易使用的入口。",
}

export default function LifeStagesPage() {
  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <p className="mb-3 text-sm font-medium text-primary">服務對象</p>
          <div className="max-w-3xl">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl text-balance">
                我們一起陪伴的族群
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                不同單位陪伴著不同處境中的人。好理家在希望把財務檢測、工具、諮詢與資源整理成更容易使用的入口，讓服務對象與第一線工作者都能找到適合的支持。
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {serviceAudiences.map((stage) => (
            <Link key={stage.slug} href={`/life-stages/${stage.slug}`} className="group">
              <Card className="h-full border-border/80 bg-card/85 transition-all hover:border-primary/35 hover:bg-card">
                <CardContent className="px-4 py-3.5">
                  <AudienceMiniScene slug={stage.slug} emoji={stage.emoji} className="mb-3" />
                  <p className="mb-1.5 text-sm font-medium text-primary">{stage.title}</p>
                  <h2 className="text-xl font-semibold text-foreground">{stage.audience}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stage.summary}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                    我想了解 <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
