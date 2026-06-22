import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function WhoForSection() {
  return (
    <section className="bg-secondary/40 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 text-center">
          <h2 className="text-2xl font-semibold text-foreground text-balance sm:text-3xl">
            如果你想找人一起整理看看
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-snug text-muted-foreground sm:text-base">
            不用一次把所有事情都說清楚，先從現在最困擾的事情開始就可以。
          </p>
        </div>

        <h3 className="mb-4 text-center text-base font-medium text-foreground">
          這次是幫誰申請？
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader className="px-4 pb-1.5 pt-4">
              <CardTitle className="text-base font-medium text-foreground">
                我想為自己整理看看
              </CardTitle>
            </CardHeader>
            <CardContent className="flex h-full flex-col px-4 pb-4 pt-0">
              <p className="mb-3 text-sm leading-snug text-muted-foreground">
                適合想整理目前財務壓力、生活狀況或不知道怎麼開始的人。
              </p>
              <div className="mt-auto">
                <Button asChild size="sm" className="w-full">
                  <Link href="/online-consultation/apply">我想找人聊聊</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card shadow-sm">
            <CardHeader className="px-4 pb-1.5 pt-4">
              <CardTitle className="text-base font-medium text-foreground">
                我想協助個案或家庭申請
              </CardTitle>
            </CardHeader>
            <CardContent className="flex h-full flex-col px-4 pb-4 pt-0">
              <p className="mb-3 text-sm leading-snug text-muted-foreground">
                適合社工、助人工作者協助個案轉介與資源整理使用。
              </p>
              <div className="mt-auto">
                <Button asChild size="sm" variant="outline" className="w-full">
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
