import { SituationSection } from "@/components/free-consultation/situation-section"
import { WhatWeDoSection } from "@/components/free-consultation/what-we-do-section"
import { WhoForSection } from "@/components/free-consultation/who-for-section"
import { ProcessSection } from "@/components/free-consultation/process-section"

export default function FreeConsultationPage() {
  return (
    <div className="min-h-screen bg-background">
      <SituationSection />
      <WhatWeDoSection />
      <ProcessSection />
      <WhoForSection />
    </div>
  )
}
