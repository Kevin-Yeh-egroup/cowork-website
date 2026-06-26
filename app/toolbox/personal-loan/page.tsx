import { LoanToolDraft } from "@/app/toolbox/_components/loan-tool-draft"

export default function PersonalLoanPage() {
  return (
    <LoanToolDraft
      config={{
        kind: "personal",
        eyebrow: "信貸小工具草稿",
        title: "信貸還款壓力試算",
        description:
          "輸入目前信貸餘額、利率與剩餘期數，先看懂月付金、還清時間與利息壓力。",
        sourceTitle: "貸款合約、繳款通知或銀行對帳資料",
        sourceDescription: "找「貸款餘額」、「年利率」、「剩餘期數」和「每月應繳金額」。",
        appTitle: "銀行 APP 或網路銀行",
        appDescription: "常見路徑是貸款、帳務查詢、還款明細或利率資訊。",
        appPrimaryPath: "貸款 / 帳務查詢",
        appSecondaryPath: "還款明細 / 利率資訊",
        balanceLabel: "目前信貸剩餘本金",
        rateLabel: "信貸年利率",
        monthsLabel: "剩餘還款期數（月）",
        paymentLabel: "目前每月固定還多少",
        targetLabel: "希望幾個月內還完",
        exampleBalance: "300000",
        exampleRate: "6",
        exampleMonths: "48",
        examplePayment: "7046",
        exampleTargetMonths: "36",
        firstStepLabel: "先整理信貸狀況",
        cautionText: "如果月付金已經壓縮生活費，先盤點全部債務與必要支出，再評估是否調整還款。",
        nextStepTips: [
          "只有一筆信貸：先比較照原期數還、提早還完、每月多還一點的差別。",
          "同時有信用卡或其他貸款：先把每筆債務金額、利率、月付金整理在一起。",
          "月付金已經吃緊：不要只看利率，還要看房租、餐費、照顧支出是否被壓縮。",
        ],
      }}
    />
  )
}
