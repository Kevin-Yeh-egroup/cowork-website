import Link from "next/link"
import { Star, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const columns = [
  {
    id: 1,
    title: "從欠債百萬到重新開始的阿明",
    excerpt: "這是一個關於面對、接受、改變的故事。阿明曾經因為投資失利欠下百萬債務...",
    author: "多多益善",
  },
  {
    id: 2,
    title: "單親媽媽小玲的財務重建之路",
    excerpt: "獨自扶養兩個孩子的小玲，在失業後陷入了財務困境。但她沒有放棄...",
    author: "多多益善",
  },
  {
    id: 3,
    title: "退休後才發現存款不夠的老王",
    excerpt: "工作了三十年，老王以為自己準備好退休了。直到真的退休那天...",
    author: "多多益善",
  },
  {
    id: 4,
    title: "被詐騙後重新站起來的小美",
    excerpt: "那通電話改變了小美的人生。她失去了多年的積蓄，但她找到了重新站起來的力量...",
    author: "多多益善",
  },
  {
    id: 5,
    title: "從月光族到存下頭期款的小陳",
    excerpt: "每個月薪水都不夠用的小陳，從沒想過自己能買房。但三年後，他做到了...",
    author: "多多益善",
  },
]

export default function ColumnPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <Star className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">專欄</h1>
              <p className="text-muted-foreground">多多益善</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 mt-6">
            <p className="text-foreground leading-relaxed">
              每個人都有自己的故事。在這裡，我們分享真實的財務經歷——有掙扎、有轉變、有希望。
              這些故事或許能讓你知道，你並不孤單，改變永遠是可能的。
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {columns.map((column) => (
            <Link key={column.id} href={`/content/column/${column.id}`} className="block group">
              <Card className="border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 text-accent" />
                    <span className="text-sm text-muted-foreground">{column.author}</span>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{column.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{column.excerpt}</p>
                  <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    閱讀專欄 <ArrowRight className="h-4 w-4" />
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
