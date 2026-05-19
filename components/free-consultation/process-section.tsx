const steps = [
  {
    number: "1",
    title: "填寫申請",
    description: "簡單描述目前狀況與想討論的事情",
  },
  {
    number: "2",
    title: "初步確認",
    description: "我們會依照內容進行確認與安排",
  },
  {
    number: "3",
    title: "進行諮詢",
    description: "由專業人員陪你一起整理狀況",
  },
  {
    number: "4",
    title: "整理下一步",
    description: "討論後續方向與可使用資源",
  },
]

export function ProcessSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground text-center mb-12 text-balance">
          諮詢流程
        </h2>
        <div className="hidden md:grid md:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              {index < steps.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full h-0.5 bg-border" />
              )}
              <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center mb-4">
                <span className="text-sm font-medium text-primary-foreground">
                  {step.number}
                </span>
              </div>
              <h3 className="font-medium text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="md:hidden space-y-0">
          {steps.map((step, index) => (
            <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
              {index < steps.length - 1 && (
                <div className="absolute left-[19px] top-10 w-0.5 h-[calc(100%-24px)] bg-border" />
              )}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {step.number}
                </span>
              </div>
              <div className="pt-1.5">
                <h3 className="font-medium text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
