"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, ShieldCheck, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getAuthHomePath, getRoleHomePath, useDemoAuth, type DemoUserRole } from "@/lib/demo-auth"

function getRequestedLoginTarget() {
  if (typeof window === "undefined") return null

  const searchParams = new URLSearchParams(window.location.search)
  const requestedRole = searchParams.get("role")
  const next = searchParams.get("next")

  if (requestedRole !== "member" && requestedRole !== "social_worker") return null

  const role: DemoUserRole = requestedRole

  return {
    role,
    nextPath: next && next.startsWith("/") && !next.startsWith("//") ? next : getRoleHomePath(role),
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { authState, isReady, chooseRole } = useDemoAuth()

  useEffect(() => {
    if (!isReady) return

    const requestedTarget = getRequestedLoginTarget()
    if (requestedTarget && (!authState.isLoggedIn || authState.role !== requestedTarget.role)) {
      chooseRole(requestedTarget.role)
      router.replace(requestedTarget.nextPath)
      return
    }

    if (authState.isLoggedIn && authState.role) {
      router.replace(getAuthHomePath(authState))
    }
  }, [authState, chooseRole, isReady, router])

  const enterWorkspace = (role: DemoUserRole) => {
    chooseRole(role)
    router.push(getRoleHomePath(role))
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <section className="mb-8 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/20 p-6 text-center sm:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <p className="mb-2 text-sm font-medium text-primary">登入好理家在</p>
          <h1 className="mb-3 text-3xl font-bold text-foreground">選擇你的工作區</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            這是新版草稿的登入入口。先選擇身分，系統會帶你前往對應頁面。
          </p>
        </section>

        {!isReady ? (
          <Card className="border-border">
            <CardContent className="p-6 text-center text-muted-foreground">正在讀取登入狀態...</CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/personal-center"
              onClick={() => enterWorkspace("member")}
              className="group rounded-xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md focus-visible:border-ring focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-foreground">一般會員</h2>
              <p className="mb-5 text-muted-foreground">
                查看我的財務與生活、已保存的工具資料、財務月報表與家庭財務全貌。
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                進入我的財務與生活
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/social-worker"
              onClick={() => enterWorkspace("social_worker")}
              className="group rounded-xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md focus-visible:border-ring focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-foreground">助人工作者</h2>
              <p className="mb-5 text-muted-foreground">
                進入社工工作台，查看個案整理、轉介申請與陪伴服務相關工具。
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                進入社工工作台
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/personal-center" onClick={() => enterWorkspace("member")}>
              先看一般會員草稿
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
