import { LoanToolDraft } from "@/app/toolbox/_components/loan-tool-draft"

export default function CarLoanPage() {
  return (
    <LoanToolDraft
      config={{
        kind: "car",
        eyebrow: "車貸小工具草稿",
        title: "車貸月付壓力試算",
        description:
          "輸入目前車貸餘額、利率與剩餘期數，評估月付金、還清時間與是否影響生活預算。",
        sourceTitle: "車貸合約、繳款通知或融資公司資料",
        sourceDescription: "找「貸款餘額」、「每月應繳」、「剩餘期數」和「利率或總費用年百分率」。",
        appTitle: "銀行、車貸或融資 APP",
        appDescription: "常見路徑是車貸、繳款紀錄、貸款明細或提前清償試算。",
        appPrimaryPath: "車貸 / 繳款紀錄",
        appSecondaryPath: "貸款明細 / 提前清償",
        balanceLabel: "目前車貸剩餘本金",
        rateLabel: "車貸年利率",
        monthsLabel: "剩餘還款期數（月）",
        paymentLabel: "目前每月車貸月付金",
        targetLabel: "希望幾個月內還完",
        exampleBalance: "450000",
        exampleRate: "4.5",
        exampleMonths: "60",
        examplePayment: "8390",
        exampleTargetMonths: "48",
        firstStepLabel: "先整理車貸狀況",
        cautionText: "如果車貸加上油錢、保險、保養後已經吃緊，要一起看整體交通成本。",
        nextStepTips: [
          "還需要用車工作或照顧家人：先確認月付金是否仍能支撐必要生活。",
          "想提早還清：先問清楚提前清償手續費、違約金與實際可省利息。",
          "車貸已經壓縮生活費：把油錢、保險、保養與其他債務一起整理，再決定下一步。",
        ],
      }}
    />
  )
}
