import Link from "next/link"
import { Wrench, BookOpen, MessageCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NextStepsProps {
  title?: string
  showAll?: boolean
}

const steps = [
  { href: "/toolbox", label: "使用工具", icon: Wrench },
  { href: "/content/articles", label: "看看文章", icon: BookOpen },
  { href: "/ask-ai", label: "問問AI", icon: MessageCircle },
  { href: "/toolbox/consultation", label: "找人聊聊", icon: Users },
]

export function NextSteps({ title = "下一步你可以這樣做：", showAll = true }: NextStepsProps) {
  const displaySteps = showAll ? steps : steps.slice(0, 2)
  
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <p className="text-lg font-medium text-foreground mb-4">{title}</p>
      <div className="flex flex-wrap gap-3">
        {displaySteps.map((step) => {
          const Icon = step.icon
          return (
            <Button
              key={step.href}
              asChild
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Link href={step.href}>
                <Icon className="h-4 w-4" />
                {step.label}
              </Link>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
