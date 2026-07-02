"use client"

import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import ConsultationPage from "@/app/toolbox/consultation/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useDemoAuth } from "@/lib/demo-auth"

export default function ReferralPage() {
  const { authState, isReady } = useDemoAuth()
  const canRefer = authState.isLoggedIn && authState.role === "social_worker"

  if (!isReady) {
    return (
      <div className="min-h-screen px-4 py-12">
        <Card className="mx-auto max-w-xl border-border">
          <CardContent className="p-6 text-center text-muted-foreground">正在確認登入狀態...</CardContent>
        </Card>
      </div>
    )
  }

  if (!canRefer) {
    return (
      <div className="min-h-screen px-4 py-12">
        <Card className="mx-auto max-w-2xl border-border">
          <CardContent className="p-6 text-center sm:p-8">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <p className="mb-2 text-sm font-medium text-primary">社工工作台功能</p>
            <h1 className="text-2xl font-bold text-foreground">請先登入社工工作台</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              個案或家庭轉介申請會放在社工登入後的工作區，方便社工接續個案紀錄、風險快篩與後續追蹤。
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/login?role=social_worker&next=/online-consultation/referral">登入社工工作台</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/online-consultation">回到免費諮詢</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <ConsultationPage />
}
