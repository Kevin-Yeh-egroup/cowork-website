import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    title: "先釐清狀況",
    description: "一起整理目前的收入、支出、壓力來源與最需要優先處理的事情。",
  },
  {
    title: "找到下一步方向",
    description: "不急著給標準答案，而是陪你找出現在做得到的調整方向。",
  },
  {
    title: "連結適合資源",
    description: "依照你的狀況，討論可使用的工具、資源或後續協助。",
  },
]

export function WhatWeDoSection() {
  return (
    <section className="bg-secondary/50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-5 text-center text-2xl font-semibold text-foreground text-balance sm:text-3xl">
          我們怎麼陪你整理？
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {services.map((service, index) => (
            <Card key={index} className="border border-border bg-card shadow-sm">
              <CardHeader className="px-4 pb-1.5 pt-4">
                <CardTitle className="text-base font-medium text-foreground">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <p className="text-sm leading-snug text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
