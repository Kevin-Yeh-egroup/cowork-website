"use client"

import { AssessmentFlow } from "@/components/assessment-flow"

const questions = [
  {
    id: 1,
    question: "想到錢的事情時，你多常感到擔心或焦慮？",
    options: [
      { value: 0, label: "很少或幾乎不會" },
      { value: 1, label: "偶爾會" },
      { value: 2, label: "經常會" },
      { value: 3, label: "總是或幾乎每天" },
    ],
  },
  {
    id: 2,
    question: "因為財務問題，你多常睡不好或影響日常生活？",
    options: [
      { value: 0, label: "從不影響" },
      { value: 1, label: "偶爾影響" },
      { value: 2, label: "經常影響" },
      { value: 3, label: "嚴重影響" },
    ],
  },
  {
    id: 3,
    question: "你是否會避免查看銀行帳戶或帳單？",
    options: [
      { value: 0, label: "不會，我會定期檢查" },
      { value: 1, label: "偶爾會逃避" },
      { value: 2, label: "經常逃避" },
      { value: 3, label: "完全不想面對" },
    ],
  },
  {
    id: 4,
    question: "財務壓力是否影響你與家人或朋友的關係？",
    options: [
      { value: 0, label: "完全沒有" },
      { value: 1, label: "有一點影響" },
      { value: 2, label: "有明顯影響" },
      { value: 3, label: "造成嚴重衝突" },
    ],
  },
  {
    id: 5,
    question: "你對未來的財務狀況感到有希望嗎？",
    options: [
      { value: 0, label: "很有希望" },
      { value: 1, label: "還算樂觀" },
      { value: 2, label: "不太樂觀" },
      { value: 3, label: "感到絕望" },
    ],
  },
]

function getResult(score: number) {
  if (score <= 4) {
    return {
      status: "焦慮程度較低",
      message: "你目前的財務焦慮在可控範圍，繼續保持健康的財務心態。",
      level: "good" as const,
    }
  } else if (score <= 9) {
    return {
      status: "中度財務焦慮",
      message: "你有一些財務壓力，建議開始整理財務狀況，減輕心理負擔。",
      level: "medium" as const,
    }
  } else {
    return {
      status: "較高財務焦慮",
      message: "建議尋求專業協助，可以預約諮詢或使用我們的工具來幫助你。",
      level: "warning" as const,
    }
  }
}

export default function FinancialAnxietyPage() {
  return (
    <AssessmentFlow
      title="財務焦慮檢測"
      description="這份檢測會協助你整理財務壓力來臨時，自己比較容易出現的焦慮與反應傾向。"
      introDetails={[
        `共 ${questions.length} 題，約 2-3 分鐘完成`,
        "題目沒有標準答案，請依照最近的真實感受作答",
        "完成後會看到焦慮程度與可參考的下一步方向",
      ]}
      introNotice="結果僅供自我覺察參考，不能替代專業心理健康、財務諮詢或醫療建議。若壓力已影響生活，請優先尋求專業協助。"
      startLabel="開始檢測"
      questions={questions}
      getResult={getResult}
    />
  )
}
