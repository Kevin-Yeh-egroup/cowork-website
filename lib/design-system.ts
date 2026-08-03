/**
 * Runtime-safe visual primitives.
 *
 * This module is the only application source allowed to contain raw palette
 * values. Pages consume named roles so that palette changes remain deliberate
 * and the design-system audit can reject page-level colour drift.
 */
export const categoryTone = {
  warm: "bg-[#fff0d6] text-[#d96b27]",
  rose: "bg-[#ffe4ef] text-[#c81f72]",
  violet: "bg-[#f0e7ff] text-[#7b4bd8]",
  sky: "bg-[#e4f4ff] text-[#1f6f8f]",
  mint: "bg-[#e7f7ef] text-[#237a56]",
  emergency:
    "bg-gradient-to-br from-[#ff78ad] to-[#e6005c] text-white shadow-lg shadow-[#e6005c]/20",
} as const

export const surfaceTone = {
  illustration: "bg-[#fff8ef]",
} as const
