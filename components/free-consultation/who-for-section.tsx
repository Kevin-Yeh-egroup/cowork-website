import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function WhoForSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground text-center mb-10 text-balance">
          這次是幫誰申請？
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-foreground">
                我想為自己整理看看
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col h-full">
              <p className="text-muted-foreground leading-relaxed mb-6">
                適合想整理目前財務壓力、生活狀況或不知道怎麼開始的人。
              </p>
              <div className="mt-auto">
                <Button asChild className="w-full">
                  <Link href="/online-consultation/apply">個人申請諮詢</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-foreground">
                我想協助個案或家庭申請
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col h-full">
              <p className="text-muted-foreground leading-relaxed mb-6">
                適合社工、助人工作者協助個案轉介與資源整理使用。
              </p>
              <div className="mt-auto">
                <Button asChild className="w-full">
                  <Link href="/online-consultation/referral">個案轉介申請</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
