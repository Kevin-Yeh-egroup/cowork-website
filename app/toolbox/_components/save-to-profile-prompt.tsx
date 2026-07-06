import Link from "next/link"
import { LogIn, Save } from "lucide-react"

import { Button } from "@/components/ui/button"

type SaveToProfilePromptProps = {
  toolPath: string
  title?: string
  description?: string
  buttonLabel?: string
}

export function SaveToProfilePrompt({
  toolPath,
  title = "留下這次試算結果",
  description = "登入後可保存到「我的財務與生活」，之後帶入財務月報表，也能回來修改試算數字。",
  buttonLabel = "儲存到我的財務與生活",
}: SaveToProfilePromptProps) {
  return (
    <div className="mt-4 rounded-xl border border-primary/20 bg-primary/10 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <Button asChild className="shrink-0">
          <Link href={`/login?role=member&next=${encodeURIComponent(toolPath)}`}>
            <Save className="mr-2 h-4 w-4" />
            {buttonLabel}
          </Link>
        </Button>
      </div>
      <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
        <LogIn className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <span>未登入也可以先試算；登入後才會保存到帳號，換手機或電腦也能接續查看。</span>
      </div>
    </div>
  )
}
