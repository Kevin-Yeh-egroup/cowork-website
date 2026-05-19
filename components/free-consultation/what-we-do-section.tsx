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
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-secondary/50">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground text-center mb-10 text-balance">
          我們怎麼陪你整理？
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="border border-border bg-card shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium text-foreground">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed">
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
