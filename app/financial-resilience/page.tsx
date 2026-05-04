"use client"

import { AssessmentFlow } from "@/components/assessment-flow"

const questions = [
  {
    id: 1,
    question: "如果這個月收入突然減少一半，你能維持多久的正常生活？",
    options: [
      { value: 3, label: "3個月以上" },
      { value: 2, label: "1-3個月" },
      { value: 1, label: "少於1個月" },
      { value: 0, label: "完全無法應對" },
    ],
  },
  {
    id: 2,
    question: "你有固定的儲蓄習慣嗎？",
    options: [
      { value: 3, label: "每月固定存款" },
      { value: 2, label: "偶爾存款" },
      { value: 1, label: "很少存款" },
      { value: 0, label: "沒有存款" },
    ],
  },
  {
    id: 3,
    question: "你清楚自己每月的固定支出嗎？",
    options: [
      { value: 3, label: "非常清楚，有記帳習慣" },
      { value: 2, label: "大概知道" },
      { value: 1, label: "不太清楚" },
      { value: 0, label: "完全不知道" },
    ],
  },
  {
    id: 4,
    question: "面對意外支出（如醫療費、修車費），你通常如何處理？",
    options: [
      { value: 3, label: "用緊急預備金支付" },
      { value: 2, label: "調整其他支出" },
      { value: 1, label: "借錢或刷卡分期" },
      { value: 0, label: "完全無法處理" },
    ],
  },
  {
    id: 5,
    question: "你有定期檢視自己財務狀況的習慣嗎？",
    options: [
      { value: 3, label: "每週或每月檢視" },
      { value: 2, label: "偶爾會看" },
      { value: 1, label: "很少檢視" },
      { value: 0, label: "從不檢視" },
    ],
  },
]

function getResult(score: number) {
  if (score >= 12) {
    return {
      status: "財務韌性良好",
      message: "你有不錯的財務緩衝能力，繼續保持並可以思考更長遠的規劃。",
      level: "good" as const,
    }
  } else if (score >= 7) {
    return {
      status: "財務韌性中等",
      message: "你有一定的應對能力，但可以加強緊急預備金和記帳習慣。",
      level: "medium" as const,
    }
  } else {
    return {
      status: "財務韌性需加強",
      message: "建議先從記帳開始，逐步建立緊急預備金，提升財務安全感。",
      level: "warning" as const,
    }
  }
}

export default function FinancialResiliencePage() {
  return (
    <AssessmentFlow
      title="財務韌性檢測"
      description="了解你面對財務壓力的承受能力"
      questions={questions}
      getResult={getResult}
    />
  )
}
