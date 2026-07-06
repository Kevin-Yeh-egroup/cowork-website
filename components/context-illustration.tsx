import Image from "next/image"

import { cn } from "@/lib/utils"

type IllustrationProps = {
  className?: string
}

const audienceImages: Record<string, { alt: string; src: string }> = {
  "working-life": {
    alt: "勞工整理工作文件的插圖",
    src: "/audiences/working-life.webp",
  },
  "health-challenge": {
    alt: "身障者與家庭互相陪伴的插圖",
    src: "/audiences/health-challenge.webp",
  },
  "independent-life": {
    alt: "自立青少年整理生活物品的插圖",
    src: "/audiences/independent-life.webp",
  },
  "family-caregiver": {
    alt: "照顧者陪伴長輩的插圖",
    src: "/audiences/family-caregiver.webp",
  },
  "single-parent-family": {
    alt: "單親家庭一起讀寫的插圖",
    src: "/audiences/single-parent-family.webp",
  },
  "retirement-aging": {
    alt: "中高齡者一起整理資料的插圖",
    src: "/audiences/retirement-aging.webp",
  },
}

export function HomeSituationIllustration({ className }: IllustrationProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative h-72 overflow-hidden rounded-lg border border-border/70 bg-[#fff8ef] shadow-sm", className)}
    >
      <Image
        src="/home-family-companion.png"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 440px, 100vw"
        className="object-cover"
      />
    </div>
  )
}

type AudienceMiniSceneProps = {
  slug: string
  emoji: string
  className?: string
}

export function AudienceMiniScene({ slug, className }: AudienceMiniSceneProps) {
  const image = audienceImages[slug] ?? audienceImages["working-life"]

  return (
    <div
      className={cn(
        "relative aspect-[5/3] w-full overflow-hidden rounded-lg border border-border/70 bg-[#fff8ef] shadow-sm",
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 1280px) 340px, (min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/50" />
    </div>
  )
}
