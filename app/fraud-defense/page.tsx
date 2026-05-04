"use client"

import { AssessmentFlow } from "@/components/assessment-flow"

const questions = [
  {
    id: 1,
    question: "收到陌生來電說你中獎或有包裹要領取，你會怎麼做？",
    options: [
      { value: 3, label: "直接掛掉或查證" },
      { value: 2, label: "會懷疑但可能繼續聽" },
      { value: 1, label: "可能會相信並詢問細節" },
      { value: 0, label: "可能會按照指示操作" },
    ],
  },
  {
    id: 2,
    question: "你知道常見的詐騙手法有哪些嗎？",
    options: [
      { value: 3, label: "知道很多種並會警惕" },
      { value: 2, label: "知道一些" },
      { value: 1, label: "只聽過但不太了解" },
      { value: 0, label: "完全不知道" },
    ],
  },
  {
    id: 3,
    question: "有人請你幫忙代收款項或代辦銀行業務，你會怎麼處理？",
    options: [
      { value: 3, label: "絕對拒絕" },
      { value: 2, label: "會懷疑並詢問原因" },
      { value: 1, label: "如果是熟人可能會幫忙" },
      { value: 0, label: "不知道這有什麼問題" },
    ],
  },
  {
    id: 4,
    question: "你會在網路上分享個人財務資訊嗎？",
    options: [
      { value: 3, label: "絕對不會" },
      { value: 2, label: "很少，會很謹慎" },
      { value: 1, label: "偶爾會" },
      { value: 0, label: "不覺得有什麼問題" },
    ],
  },
  {
    id: 5,
    question: "投資時，有人保證「穩賺不賠」，你會怎麼看？",
    options: [
      { value: 3, label: "這一定是騙局" },
      { value: 2, label: "會非常懷疑" },
      { value: 1, label: "會想了解更多" },
      { value: 0, label: "可能會考慮投資" },
    ],
  },
]

function getResult(score: number) {
  if (score >= 12) {
    return {
      status: "防禦意識良好",
      message: "你對詐騙有很好的警覺性，繼續保持並幫助身邊的人提高警覺。",
      level: "good" as const,
    }
  } else if (score >= 7) {
    return {
      status: "需要加強警覺",
      message: "你有基本的防禦意識，但建議多了解新型詐騙手法。",
      level: "medium" as const,
    }
  } else {
    return {
      status: "風險較高",
      message: "建議立即了解常見詐騙手法，提高警覺保護自己的財務安全。",
      level: "warning" as const,
    }
  }
}

export default function FraudDefensePage() {
  return (
    <AssessmentFlow
      title="詐騙防禦檢測"
      description="檢查你對詐騙的風險意識"
      questions={questions}
      getResult={getResult}
    />
  )
}
