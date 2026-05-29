function SkeletonBlock({ className = '' }) {
  return (
    <div className={`glass rounded-xl shimmer ${className}`} />
  )
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-fade-up">
      <SkeletonBlock className="h-28 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <SkeletonBlock className="h-20" />
        <SkeletonBlock className="h-20" />
      </div>
      <SkeletonBlock className="h-24 rounded-2xl" />
      <div className="flex items-center justify-center py-4 gap-2">
        <div className="w-2 h-2 rounded-full bg-rain/60 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-rain/60 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-rain/60 animate-bounce" style={{ animationDelay: '300ms' }} />
        <span className="text-xs font-display text-ice-400/40 ml-2 uppercase tracking-widest">
          Running inference
        </span>
      </div>
    </div>
  )
}
