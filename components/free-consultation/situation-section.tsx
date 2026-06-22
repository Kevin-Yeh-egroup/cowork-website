import { Card, CardContent } from "@/components/ui/card"

const situations = [
  {
    line1: "每個月很努力，",
    line2: "卻還是存不下來",
  },
  {
    line1: "收支越來越亂，",
    line2: "不知道從哪裡整理",
  },
  {
    line1: "債務或貸款開始影響生活",
    line2: null,
  },
  {
    line1: "家裡突然有大筆支出或變故",
    line2: null,
  },
  {
    line1: "被詐騙後，",
    line2: "不知道下一步怎麼辦",
  },
  {
    line1: "很焦慮，",
    line2: "但不知道該找誰聊",
  },
]

export function SituationSection() {
  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-5 text-center text-2xl font-semibold text-foreground text-balance sm:text-3xl">
          你現在是不是也有這些狀況？
        </h2>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {situations.map((situation, index) => (
            <Card key={index} className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-3.5">
                <p className="text-sm leading-snug text-foreground sm:text-base">
                  {situation.line1}
                  {situation.line2 && (
                    <>
                      <br />
                      {situation.line2}
                    </>
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          只要其中一項讓你有感，都可以先來聊聊。
        </p>
      </div>
    </section>
  )
}
