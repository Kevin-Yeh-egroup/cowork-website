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
    <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-6 text-center text-2xl font-semibold text-foreground text-balance sm:text-3xl">
          諮詢流程
        </h2>
        <div className="hidden md:grid md:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              {index < steps.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full h-0.5 bg-border" />
              )}
              <div className="relative z-10 mb-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                <span className="text-sm font-medium text-primary-foreground">
                  {step.number}
                </span>
              </div>
              <h3 className="mb-1 font-medium text-foreground">{step.title}</h3>
              <p className="text-sm leading-snug text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="md:hidden space-y-0">
          {steps.map((step, index) => (
            <div key={index} className="relative flex gap-4 pb-6 last:pb-0">
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
                <p className="text-sm leading-snug text-muted-foreground">
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
