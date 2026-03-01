export function KidsBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 大一点的星星 */}
      <div className="absolute left-[10%] top-[18%] text-2xl opacity-70">✨</div>
      <div className="absolute right-[12%] top-[14%] text-3xl opacity-70">⭐️</div>
      <div className="absolute right-[8%] bottom-[18%] text-2xl opacity-60">📚</div>
      <div className="absolute left-[6%] top-[46%] text-xl opacity-60">🌟</div>
      <div className="absolute right-[6%] top-[45%] text-xl opacity-50">✨</div>

      {/* 柔和的“贴纸”圆点 */}
      <div className="absolute -left-16 top-32 h-40 w-40 rounded-full bg-kid-pink-500/10 blur-2xl" />
      <div className="absolute -right-20 top-44 h-48 w-48 rounded-full bg-kid-blue-500/12 blur-2xl" />
      <div className="absolute left-1/3 -bottom-24 h-56 w-56 rounded-full bg-kid-yellow-500/10 blur-2xl" />
    </div>
  );
}
