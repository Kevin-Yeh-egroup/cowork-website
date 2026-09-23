import type { Metadata } from "next"
import { WorkingLifeResourceDirectory } from "@/components/working-life-resource-directory"

export const metadata: Metadata = {
  title: "資源名錄 - 好理家在",
  description: "整理勞工可能用得到的政府、非營利組織與民間服務入口。",
}

type ResourceDirectoryPageProps = {
  searchParams: Promise<{
    category?: string | string[]
  }>
}

export default async function ResourceDirectoryPage({ searchParams }: ResourceDirectoryPageProps) {
  const params = await searchParams
  const category = typeof params.category === "string" ? params.category : undefined

  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <main className="mx-auto max-w-6xl">
        <header className="border-b border-border/80 pb-6">
          <p className="text-sm font-semibold text-primary">勞工資源</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl">完整資源名錄</h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            依照目前遇到的情況查看可以聯絡的服務單位，也可以切換分類瀏覽其他協助資源。
          </p>
          <p className="mt-2 text-xs text-muted-foreground">目前為版型與入口示意，正式收錄前仍需確認服務內容與聯絡方式。</p>
        </header>

        <section className="py-7">
          <WorkingLifeResourceDirectory initialCategory={category} />
        </section>
      </main>
    </div>
  )
}
