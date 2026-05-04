import Link from "next/link"
import { Headphones, ArrowRight, Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const episodes = [
  {
    id: 1,
    title: "為什麼有收入還是存不到錢？",
    description: "探討收支管理的盲點，以及如何找出金錢的流向",
    duration: "25 分鐘",
  },
  {
    id: 2,
    title: "面對負債，我該怎麼開始？",
    description: "債務不是人生的終點，聽聽專家怎麼說",
    duration: "30 分鐘",
  },
  {
    id: 3,
    title: "緊急預備金真的有那麼重要嗎？",
    description: "從真實案例看緊急預備金如何改變人生",
    duration: "22 分鐘",
  },
  {
    id: 4,
    title: "詐騙電話差點讓我損失一切",
    description: "受害者的親身經歷，提醒我們保持警覺",
    duration: "28 分鐘",
  },
  {
    id: 5,
    title: "如何跟家人開口談錢？",
    description: "金錢是家庭中最難開口的話題之一",
    duration: "26 分鐘",
  },
  {
    id: 6,
    title: "從月光族到存下第一桶金",
    description: "真實轉變的故事，任何人都可以開始改變",
    duration: "32 分鐘",
  },
]

export default function PodcastPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center">
              <Headphones className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Podcast</h1>
              <p className="text-muted-foreground">用聽的方式學習財務觀念</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {episodes.map((episode) => (
            <Link key={episode.id} href={`/content/podcast/${episode.id}`} className="block group">
              <Card className="border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Play className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-foreground mb-1">{episode.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{episode.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm text-muted-foreground block mb-1">{episode.duration}</span>
                    <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      去聽這集 <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
