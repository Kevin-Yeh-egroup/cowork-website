import { Mic, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type VoiceInputDraftProps = {
  title: string
  description: string
  placeholder: string
  examples: string[]
}

export function VoiceInputDraft({ title, description, placeholder, examples }: VoiceInputDraftProps) {
  return (
    <Card className="border-border bg-card/90">
      <CardContent className="p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Mic className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary">語音輸入</p>
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>

        <textarea
          defaultValue={placeholder}
          className="min-h-28 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm leading-6 outline-none focus:border-primary"
        />

        <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            可以這樣說
          </div>
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            {examples.map((example) => (
              <li key={example}>「{example}」</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
