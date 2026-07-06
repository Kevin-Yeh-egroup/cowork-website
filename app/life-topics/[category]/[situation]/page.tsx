import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, BookOpen, ClipboardCheck, HandCoins, Headphones, LifeBuoy, Newspaper, Wrench } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { externalLinks } from "@/lib/external-links"
import { findScenarioSituation, scenarioCategories } from "@/lib/scenarios-data"

type LifeTopicDetailPageProps = {
  params: Promise<{
    category: string
    situation: string
  }>
}

export function generateStaticParams() {
  return scenarioCategories.flatMap((category) =>
    category.situations.map((situation) => ({
      category: category.slug,
      situation: situation.slug,
    })),
  )
}

export async function generateMetadata({ params }: LifeTopicDetailPageProps): Promise<Metadata> {
  const { category, situation } = await params
  const data = findScenarioSituation(category, situation)

  if (!data) {
    return {
      title: "生活課題 - 好理家在",
    }
  }

  return {
    title: `${data.situation.title} - 生活課題 - 好理家在`,
    description: `整理${data.category.title}中「${data.situation.title}」的常見困擾、提醒與可開始的行動。`,
  }
}

function getCommonConcerns(title: string) {
  return [
    `覺得「${title}」好像不是單一問題，而是收入、支出、家庭或工作安排一起卡住。`,
    "知道需要整理，但不確定第一步要先看數字、先找資源，還是先和家人討論。",
    "擔心狀況越拖越難處理，所以需要一個比較不慌張的整理順序。",
  ]
}

function getBlindSpots(title: string) {
  return [
    `只看「${title}」當下的壓力，可能會忽略它背後長期累積的生活安排。`,
    "容易先責怪自己不會理財，卻還沒有把必要支出、風險與可用支持分開看。",
    "有些資源不是等問題很嚴重才能使用，早一點整理反而比較有選擇。",
  ]
}

const situationIntros: Record<string, string> = {
  "first-job":
    "剛開始工作時，收入變得比較穩定，生活開銷也會開始變多。你可能正在學習怎麼分配薪水、支付交通與餐食、處理家用或學貸，也可能想存第一筆緊急預備金。這個階段不一定要馬上做出完整理財計畫，先看清楚每月錢流、固定支出與壓力來源，就能慢慢建立比較穩的生活節奏。",
  "unstable-income":
    "收入不穩時，最累的常常不是單月少賺，而是不知道下個月能不能安心安排生活。你可能需要在接案、排班、業績或臨時工作之間調整，也要同時面對房租、貸款、家用與基本開銷。這時候可以先把固定支出、最低生活需求與收入波動分開看，讓自己比較知道哪些錢必須先留住。",
  "career-transition":
    "正在轉職時，收入、時間與未來方向都可能一起變動。你可能一邊準備履歷、面試或進修，一邊擔心空窗期、保險、家庭支出與原本的債務壓力。這個階段不一定要急著做出完美選擇，先把可支撐多久、需要多少緩衝、哪些支出可以暫緩整理清楚，轉換工作會比較有底氣。",
  "recently-unemployed":
    "最近失業時，生活常常會突然失去原本的節奏。除了收入中斷，也可能有勞健保、資遣費、失業給付、租金、貸款或家用要處理。這時候最重要的是先穩住短期生活，把可用現金、可申請的權益與必要支出排出順序，讓自己在找下一份工作前不需要一個人硬撐。",
  "side-income":
    "開始經營第二收入或斜槓時，收入來源變多，也可能讓時間、稅務、成本與主業界線變得複雜。你可能正在嘗試接案、銷售、創作或兼職，卻不確定哪些收入真的留下來、哪些只是先墊出去的成本。可以先把主收入、額外收入、投入成本與休息時間分開整理，避免讓斜槓變成新的壓力來源。",
  "retirement-prep":
    "開始準備退休時，真正要想的不只是存到一筆錢，而是未來生活會怎麼過。你可能在意年金、保險、醫療、住房、家人照顧或工作退場的時間點。可以先從現在每月生活費、未來可能增加的照顧支出，以及可期待的收入來源開始整理，讓退休規劃更接近自己的生活，而不是只有數字。",
  "credit-card-revolving":
    "卡債與循環利息會讓人覺得每個月都有繳，卻好像一直還不完。當最低應繳、分期、循環利息和生活開銷交疊在一起，很容易看不清楚真正的本金與利息負擔。可以先把每張卡的欠款、利率、最低應繳與付款日整理出來，再決定優先處理哪一筆，讓壓力有機會慢慢下降。",
  "personal-loan":
    "信用貸款看起來是一筆固定支出，但如果收入變動、家用增加或又有其他債務，就可能慢慢變成沉重壓力。你可能需要同時確認利率、期數、月付金與提前清償條件，也要看生活費是否被壓得太緊。先整理貸款全貌，再評估是否需要調整還款順序或尋求協助，會比單靠忍耐更穩。",
  "mortgage-car-loan":
    "房貸與車貸通常金額大、時間長，對家庭生活的影響也比較深。當收入、照顧責任或其他債務改變時，原本可以負擔的月付金也可能變得吃力。這時可以先看每月固定還款、生活必要支出與可調整項目，並提早了解協商、展延或替代交通安排，避免壓力累積到無法處理。",
  "late-payment":
    "無法準時繳款時，很多人第一個反應是先躲起來，或只處理催繳最急的那一筆。但不同款項的後果不一樣，像房租、水電、貸款、信用卡或保險，都可能影響生活穩定。可以先把繳款期限、金額、逾期後果與可聯繫窗口整理出來，再決定哪些要優先處理。",
  enforcement:
    "遇到強制執行時，壓力常常來得很快，也容易讓人不知道可以問誰。薪資、帳戶、動產或不動產都可能受到影響，生活安排也會被打亂。這時候需要先看清楚執行原因、債權人、金額與目前進度，再確認法律扶助、債務協商或生活支持資源，讓自己不要只被通知追著跑。",
  "financial-anxiety":
    "財務焦慮與入不敷出不只是帳戶餘額的問題，也會影響睡眠、關係與日常判斷。你可能每天都在算錢，卻越算越覺得沒有出口。可以先把必要支出、可暫緩支出、債務與可用支持分開，讓腦中的混亂變成可以一步一步處理的清單。",
  "investment-fraud":
    "遇到投資詐騙時，受傷的不只是錢，也可能是對自己判斷的懷疑。詐騙常會用高報酬、限時機會、名人背書或群組見證讓人降低警覺。當你開始覺得不對勁，可以先停止匯款與加碼，保留對話、帳戶與交易紀錄，再尋求警方、金融機構或可信任的人一起確認。",
  "shopping-fraud":
    "網路購物詐騙常出現在看起來很日常的交易裡，像低價商品、假客服、解除分期或貨到付款異常。金額有時不大，卻會讓人擔心個資、帳戶或後續扣款。可以先保留訂單、對話、付款紀錄與賣場資訊，並確認是否需要聯絡銀行、平台或警方。",
  "romance-fraud":
    "愛情交友詐騙讓人難受的地方，往往不只是金錢損失，也包含信任被利用的受傷感。對方可能用陪伴、關心、共同未來或急難需求一步步取得信任，再引導投資、借款或匯款。當你開始感到不安，可以先暫停金錢往來，保留對話與轉帳紀錄，找一位可信任的人一起看。",
  "job-fraud":
    "求職詐騙常包裝成高薪、免經驗、快速錄取或在家工作，讓人以為只是多一個機會。對方可能要求交出帳戶、代收款項、先繳費、買課程或提供過多個資。求職時可以先確認公司資訊、工作內容、薪資給付與是否涉及金流，遇到不合理要求就先停下來查證。",
  "warning-account":
    "人頭帳戶或警示帳戶會直接影響日常收支、薪資入帳與金融使用，也可能牽涉法律責任。很多人是在求職、借款、網路交易或朋友請託中不小心提供帳戶資料。這時候需要先釐清帳戶被使用的經過、保留所有紀錄，並盡快與銀行、警方或法律協助窗口確認下一步。",
  "personal-data-safety":
    "個資外洩與帳號安全看起來像技術問題，其實也會影響金錢安全與生活安心。當證件、帳密、手機門號或金融資料外流時，可能出現冒名申辦、盜刷、詐騙或帳戶異常。可以先更換密碼、啟用雙重驗證、檢查交易紀錄，並評估是否需要通報平台或金融機構。",
  "self-illness":
    "自己生病時，身體狀況、工作收入與醫療支出可能同時受到影響。你可能需要請假、治療、休養，也擔心收入變少後生活費和帳單怎麼辦。可以先整理醫療費用、保險、請假權益、家中支出與可協助的人，讓照顧身體和處理財務不必全部擠在腦中。",
  "family-illness":
    "家人生病時，很多安排會突然變成你的責任，包括陪診、照顧、交通、醫療費與家庭分工。你可能一邊工作一邊照顧，也擔心錢和時間都不夠用。可以先把病程需求、醫療支出、照顧人力與可申請資源整理出來，讓家庭討論比較有依據。",
  "major-illness":
    "重大傷病通常不是短期事件，治療、休養、交通、看護與收入中斷都可能一起出現。面對這種壓力時，很容易只忙著處理眼前醫療安排，卻忽略補助、保險、工作權益與長期生活計畫。可以先把醫療團隊資訊、費用、可用保障與家庭分工整理清楚。",
  "long-term-care":
    "長期照顧會影響的不只是被照顧者，也包含照顧者的工作、收入、休息與家庭關係。你可能需要在居家照顧、日照、機構、外籍看護或家人輪流照顧之間選擇。可以先看照顧需求、每月成本、可申請服務與家人能分擔的部分，讓照顧安排比較可持續。",
  "caregiving-leave":
    "照顧離職通常不是單純的工作選擇，而是家庭責任、照顧資源和財務壓力一起推到眼前。離職後收入、勞保、退休累積、再就業與照顧成本都會受到影響。可以先盤點是否有請假、彈性工時、長照資源或家庭分工的可能，再決定是否真的需要離開工作。",
  "medical-expense":
    "醫療支出增加時，壓力常常不是一次費用，而是反覆回診、藥物、檢查、交通與照顧成本逐漸累積。你可能一邊想把治療做好，一邊擔心生活費被擠壓。可以先把固定醫療支出、可報銷項目、保險與補助整理出來，再看哪些費用需要優先安排。",
  "marriage-family":
    "結婚與家庭建立會把兩個人的生活、金錢習慣和期待放在一起。你們可能需要討論房租、婚禮、家用、保險、父母支持、儲蓄目標與未來育兒安排。這些事情不一定要一次談完，但可以先從共同支出、各自責任與緊急預備金開始，慢慢建立可以一起面對的財務節奏。",
  childcare:
    "生育與育兒會讓家庭支出和時間安排明顯改變，從產檢、生產、托育、奶粉尿布到請假與工作調整，都可能影響收入與生活品質。可以先估算短期增加的費用、可申請補助、照顧人力與工作安排，讓家庭在忙碌中仍有一點財務緩衝。",
  "single-parent":
    "單親家庭常常需要一個人扛起照顧、收入、家務與孩子安排，壓力容易長期累積。你可能需要面對扶養費、托育、工作時間、租屋、教育支出與情緒支持。可以先整理每月必要支出、可申請補助、親友或社福資源，讓生活不只靠自己硬撐。",
  "relationship-change":
    "離婚與關係變化會牽動住處、孩子照顧、財產、債務、保險與未來生活安排。情緒還在震盪時，要同時處理金錢與法律文件會很辛苦。可以先把共同帳務、必要支出、孩子需求與可諮詢資源列出來，讓下一步比較有秩序。",
  "moving-renting":
    "搬家與租屋看似是生活安排，實際上會牽動押金、租金、搬運、交通、通勤、孩子學區與每月固定支出。若時間很急，也容易忽略合約、修繕、違約金或安全性。可以先確認總成本、每月負擔、合約條件與生活便利性，再決定哪個選擇比較穩。",
  "bereavement-change":
    "親人過世或重大變故發生時，人通常還來不及悲傷，就要處理費用、文件、家庭分工與未來生活。這些事情會讓人疲憊，也可能牽動保險、繼承、債務或照顧責任。可以先列出最急的行政事項、短期生活費與需要協助的人，讓自己不用一次背起所有事情。",
}

function getSituationIntro(slug: string, title: string, categoryTitle: string) {
  return (
    situationIntros[slug] ??
    `當你正在面對「${title}」時，真正需要整理的通常不只是單一金額，而是它和${categoryTitle}、生活節奏、家庭支持與下一步選擇之間的關係。可以先把目前最急的壓力、每月固定支出與可用資源放在同一張表裡，讓問題從一團混亂慢慢變成可以處理的順序。`
  )
}

const firstJobIntroItems = [
  "\u5206\u914d\u7b2c\u4e00\u4efd\u85aa\u6c34",
  "\u8655\u7406\u4ea4\u901a\u8207\u9910\u8cbb",
  "\u9762\u5c0d\u5bb6\u7528\u6216\u5b78\u8cb8",
  "\u5efa\u7acb\u7b2c\u4e00\u7b46\u9810\u5099\u91d1",
]

function getSituationIntroItems(title: string) {
  return [
    `先看清楚「${title}」正在影響哪些收支`,
    "整理目前已經知道的數字與資料",
    "確認可以先做的一個小行動",
    "需要時找諮詢或資源一起討論",
  ]
}

function getArticleOverviewHref(slug: string) {
  return `/content/articles?scenario=${slug}`
}

function getScenarioArticleLinks(title: string, slug: string) {
  const href = getArticleOverviewHref(slug)

  return {
    concerns: [
      {
        title: `「${title}」可以先從哪些數字開始整理？`,
        href,
      },
      {
        title: `遇到「${title}」時，下一步可以先做什麼？`,
        href,
      },
      {
        title: `如果不確定怎麼處理「${title}」，可以找哪些資源？`,
        href,
      },
    ],
    blindSpots: [
      {
        title: `不要只看眼前壓力，也要看「${title}」對每月生活的影響`,
        href,
      },
      {
        title: `先把資料留下來，之後討論「${title}」會比較清楚`,
        href,
      },
      {
        title: "有些資源不一定要等到很嚴重才使用",
        href,
      },
    ],
  }
}

function getContentResources(title: string, slug: string) {
  const articleOverviewHref = getArticleOverviewHref(slug)

  return [
    {
      label: "\u6587\u7ae0",
      icon: BookOpen,
      items: [
        {
          title: "\u67e5\u770b\u9019\u500b\u60c5\u5883\u7684\u6587\u7ae0\u7e3d\u89bd",
          description: "\u628a\u9019\u500b\u60c5\u5883\u76f8\u95dc\u7684\u6587\u7ae0\u653e\u5728\u4e00\u8d77\uff0c\u53ef\u4ee5\u4f9d\u76ee\u524d\u6700\u5728\u610f\u7684\u554f\u984c\u6162\u6162\u770b\u3002",
          href: articleOverviewHref,
          meta: "\u6587\u7ae0\u7e3d\u89bd",
        },
      ],
    },
    {
      label: "Podcast",
      icon: Headphones,
      items: [
        {
          title: "\u7b2c\u4e00\u6b21\u9818\u85aa\u6c34\uff0c\u600e\u9ebc\u4e0d\u8b93\u9322\u4e00\u4e0b\u5c31\u4e0d\u898b\uff1f",
          description: "\u7528\u804a\u5929\u65b9\u5f0f\u807d\u65b0\u9bae\u4eba\u5e38\u898b\u7684\u82b1\u8cbb\u8207\u7126\u616e\u3002",
          href: "/content/podcast/1",
          meta: "25 \u5206\u9418",
        },
      ],
    },
    {
      label: "\u5c08\u6b04",
      icon: Newspaper,
      items: [
        {
          title: "\u65b0\u9bae\u4eba\u7684\u7b2c\u4e00\u5e74\uff1a\u4e0d\u662f\u5b58\u5f88\u591a\uff0c\u800c\u662f\u5148\u770b\u61c2\u81ea\u5df1\u7684\u9322\u6d41",
          description: "\u7528\u6848\u4f8b\u770b\u6536\u5165\u3001\u652f\u51fa\u8207\u5bb6\u4eba\u671f\u5f85\u600e\u9ebc\u4e00\u8d77\u6574\u7406\u3002",
          href: "/content/column/1",
          meta: "\u6848\u4f8b",
        },
      ],
    },
  ]
}

export default async function LifeTopicDetailPage({ params }: LifeTopicDetailPageProps) {
  const { category, situation } = await params
  const data = findScenarioSituation(category, situation)

  if (!data) notFound()

  const { category: categoryData, situation: situationData } = data
  const siblingSituations = categoryData.situations.filter((item) => item.slug !== situationData.slug)
  const situationIntro = getSituationIntro(situationData.slug, situationData.title, categoryData.title)
  const situationIntroItems =
    situationData.slug === "first-job" ? firstJobIntroItems : getSituationIntroItems(situationData.title)
  const scenarioArticleLinks = getScenarioArticleLinks(situationData.title, situationData.slug)
  const contentResources = getContentResources(situationData.title, situationData.slug)
  const siblingSituationsTitle = "\u4f60\u53ef\u80fd\u4e5f\u6703\u95dc\u5fc3"

  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <section className="mb-8 border-b border-border/80 pb-6">
          <p className="mb-2 text-sm font-semibold text-primary">生活課題</p>
          <p className="mb-3 text-sm font-medium text-muted-foreground">{categoryData.title}</p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {situationData.title}
          </h1>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
          <main className="space-y-5">
            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {situationData.slug === "first-job" ? (
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{"\u525b\u958b\u59cb\u5de5\u4f5c\uff0c"}</p>
                      <p>{"\u6536\u5165\u958b\u59cb\u7a69\u5b9a\u4e86\uff0c"}</p>
                      <p>{"\u751f\u6d3b\u958b\u92b7\u4e5f\u6162\u6162\u589e\u52a0\u3002"}</p>
                    </div>
                  ) : (
                    <p>{situationIntro}</p>
                  )}
                  <div>
                    <p className="font-medium text-foreground">{"\u4f60\u53ef\u80fd\u6b63\u5728\u5b78\u8457\uff1a"}</p>
                    <ul className="mt-2 grid grid-cols-1 gap-1 text-sm sm:grid-cols-2 sm:text-base">
                      {situationIntroItems.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">{"\u5927\u5bb6\u6700\u5e38\u554f"}</h2>
                <div className="mt-3 space-y-2">
                  {scenarioArticleLinks.concerns.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group block rounded-xl border border-border/60 bg-background/70 px-4 py-3 transition-colors hover:border-primary/30 hover:bg-primary/10"
                    >
                      <span className="font-medium leading-relaxed text-primary underline-offset-4 group-hover:underline">
                        {item.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">{"\u5bb9\u6613\u5ffd\u7565"}</h2>
                <div className="mt-3 space-y-2">
                  {scenarioArticleLinks.blindSpots.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group block rounded-xl border border-border/60 bg-background/70 px-4 py-3 transition-colors hover:border-primary/30 hover:bg-primary/10"
                    >
                      <span className="font-medium leading-relaxed text-primary underline-offset-4 group-hover:underline">
                        {item.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">{"\u53ef\u4ee5\u8a66\u8a66"}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {"\u5982\u679c\u770b\u5230\u9019\u88e1\u89ba\u5f97\u60f3\u518d\u5f80\u524d\u4e00\u6b65\uff0c\u53ef\u4ee5\u5148\u9078\u4e00\u500b\u6700\u5bb9\u6613\u958b\u59cb\u7684\u884c\u52d5\u3002"}
                </p>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { title: "\u6aa2\u6e2c", description: "\u5148\u7528\u7c21\u55ae\u6aa2\u6e2c\u770b\u58d3\u529b\u8207\u98a8\u96aa\u8f2a\u5ed3\u3002", href: "/assessment", icon: ClipboardCheck },
                    { title: "\u5de5\u5177", description: "\u7528\u5de5\u5177\u6574\u7406\u6536\u5165\u3001\u652f\u51fa\u6216\u50b5\u52d9\u3002", href: "/toolbox", icon: Wrench },
                    { title: "\u514d\u8cbb\u8aee\u8a62", description: "\u9700\u8981\u6709\u4eba\u4e00\u8d77\u770b\u6642\uff0c\u53ef\u4ee5\u7533\u8acb\u8aee\u8a62\u3002", href: externalLinks.onlineConsultation, icon: HandCoins },
                  ].map((item) => {
                    const Icon = item.icon

                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="rounded-lg border border-border/70 bg-background/75 p-4 transition-colors hover:border-primary/35"
                      >
                        <Icon className="mb-3 h-5 w-5 text-primary" />
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">{"\u770b\u770b\u5225\u4eba\u600e\u9ebc\u6574\u7406"}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {"\u7528\u6587\u7ae0\u3001\u8072\u97f3\u6216\u6848\u4f8b\u770b\u770b\u76f8\u4f3c\u72c0\u6cc1\u7684\u4eba\u600e\u9ebc\u60f3\u3001\u600e\u9ebc\u958b\u59cb\u8655\u7406\u3002"}
                </p>
                <div className="mt-4 space-y-3">
                  {contentResources.slice(0, 1).map((group) => {
                    const Icon = group.icon

                    return (
                      <div key={group.label} className="rounded-lg border border-border/70 bg-background/75 p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <p className="font-semibold text-foreground">{group.label}</p>
                        </div>
                        <div className={group.items.length > 1 ? "grid grid-cols-1 gap-3 md:grid-cols-2" : "grid grid-cols-1 gap-3"}>
                          {group.items.map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              className="group block rounded-xl bg-card/80 p-3 transition-colors hover:bg-primary/10"
                            >
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="text-xs font-medium text-primary">{item.meta}</p>
                                  <h3 className="mt-1 font-semibold leading-snug text-primary underline-offset-4 group-hover:underline">{item.title}</h3>
                                </div>
                                <ArrowRight className="hidden h-4 w-4 shrink-0 text-primary sm:block" />
                              </div>
                              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {contentResources.slice(1).map((group) => {
                      const Icon = group.icon

                      return (
                        <div key={group.label} className="rounded-lg border border-border/70 bg-background/75 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <Icon className="h-5 w-5 text-primary" />
                            <p className="font-semibold text-foreground">{group.label}</p>
                          </div>
                          <div className="space-y-3">
                            {group.items.map((item) => (
                              <Link
                                key={item.title}
                                href={item.href}
                                className="group block rounded-xl bg-card/80 p-3 transition-colors hover:bg-primary/10"
                              >
                                <p className="text-xs font-medium text-primary">{item.meta}</p>
                                <h3 className="mt-1 font-semibold leading-snug text-primary underline-offset-4 group-hover:underline">{item.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold text-foreground">{"\u4f60\u53ef\u80fd\u7528\u5f97\u5230\u7684\u8cc7\u6e90"}</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/70 bg-background/75 p-4">
                    <LifeBuoy className="mb-3 h-5 w-5 text-primary" />
                    <p className="font-medium text-foreground">問題相關資源</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">可先保留位置，後續放官方資訊、補助、工具或合作服務。</p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-background/75 p-4">
                    <LifeBuoy className="mb-3 h-5 w-5 text-primary" />
                    <p className="font-medium text-foreground">外部單位</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">可依情境補上政府、社福、法律、金融或醫療相關單位。</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="rounded-lg border border-primary/20 bg-primary/10 px-5 py-4 text-sm leading-relaxed text-foreground">
              {"\u5982\u679c\u9084\u662f\u4e0d\u77e5\u9053\u5f9e\u54ea\u958b\u59cb\uff0c\u4e5f\u53ef\u4ee5\u627e\u6211\u5011\u4e00\u8d77\u6574\u7406\u3002"}
            </p>
          </main>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className="border-primary/20 bg-primary/10">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-foreground">{siblingSituationsTitle}</h2>
                <div className="mt-3 flex flex-col gap-2">
                  {siblingSituations.slice(0, 5).map((item) => (
                    <Link
                      key={item.slug}
                      href={`/life-topics/${categoryData.slug}/${item.slug}`}
                      className="inline-flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                    >
                      {item.title}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/90">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-foreground">回到生活課題</h2>
                <Link
                  href="/life-topics"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all hover:gap-2"
                >
                  看所有課題 <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
