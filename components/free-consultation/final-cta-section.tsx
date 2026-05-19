import Link from "next/link"
import { Button } from "@/components/ui/button"

export function FinalCtaSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-secondary/40">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4 text-balance">
          如果你想找人一起整理看看
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          不用一次把所有事情都說清楚，先從現在最困擾的事情開始就可以。
        </p>
        <Button asChild size="lg" className="px-8">
          <Link href="/online-consultation/apply">我要預約諮詢</Link>
        </Button>
      </div>
    </section>
  )
}
