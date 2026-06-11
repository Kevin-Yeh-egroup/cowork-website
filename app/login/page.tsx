"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ShieldCheck, User, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getAuthHomePath, getRoleHomePath, useDemoAuth, type DemoUserRole } from "@/lib/demo-auth"

const roleOptions: {
  role: DemoUserRole
  title: string
  description: string
  icon: LucideIcon
}[] = [
  {
    role: "member",
    title: "一般民眾",
    description: "管理自己的檢測紀錄、財務工具使用進度與學習任務。",
    icon: User,
  },
  {
    role: "social_worker",
    title: "社工與助人工作者",
    description: "進入社工工作台，查看最近工作、個案歷程追蹤與現場工具。",
    icon: Users,
  },
]

export default function LoginPage() {
  const router = useRouter()
  const { authState, isReady, login, chooseRole } = useDemoAuth()
  const [hasStartedLogin, setHasStartedLogin] = useState(false)

  useEffect(() => {
    if (isReady && authState.isLoggedIn && authState.role) {
      router.replace(getAuthHomePath(authState))
    }
  }, [authState, isReady, router])

  const startLogin = () => {
    login()
    setHasStartedLogin(true)
  }

  const selectRole = (role: DemoUserRole) => {
    chooseRole(role)
    router.push(getRoleHomePath(role))
  }

  const shouldShowRoleSelection = authState.isLoggedIn && !authState.role

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <section className="mb-8 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/20 p-6 text-center sm:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <p className="mb-2 text-sm font-medium text-primary">登入好理家在</p>
          <h1 className="mb-3 text-3xl font-bold text-foreground">先登入，再進入適合你的工作區</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            這是前端展示用登入流程。登入後第一次選擇角色，系統會記住你的選擇，之後直接帶你前往對應頁面。
          </p>
        </section>

        {!isReady && (
          <Card className="border-border">
            <CardContent className="p-6 text-center text-muted-foreground">正在讀取登入狀態...</CardContent>
          </Card>
        )}

        {isReady && !authState.isLoggedIn && !hasStartedLogin && (
          <Card className="border-border">
            <CardContent className="p-6 sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[1fr_240px] lg:items-center">
                <div>
                  <h2 className="mb-2 text-2xl font-semibold text-foreground">開始登入</h2>
                  <p className="text-muted-foreground">
                    目前不串接正式帳號系統，先用原型流程模擬登入與角色導向，方便檢視資訊架構。
                  </p>
                </div>
                <Button size="lg" onClick={startLogin}>
                  繼續登入
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isReady && shouldShowRoleSelection && (
          <div>
            <div className="mb-5 text-center">
              <h2 className="mb-2 text-2xl font-semibold text-foreground">選擇你的角色</h2>
              <p className="text-muted-foreground">第一次登入需要選擇身份，之後會記住並直接進入對應入口。</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {roleOptions.map((option) => {
                const Icon = option.icon

                return (
                  <button
                    key={option.role}
                    type="button"
                    onClick={() => selectRole(option.role)}
                    className="group rounded-xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md focus-visible:border-ring focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">{option.title}</h3>
                    <p className="mb-5 text-muted-foreground">{option.description}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                      進入{option.role === "member" ? "個人中心" : "社工工作台"}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
