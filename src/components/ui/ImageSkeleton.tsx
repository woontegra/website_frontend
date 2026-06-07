type ImageSkeletonProps = {
  className?: string
  rounded?: boolean
}

export function ImageSkeleton({ className = '', rounded = true }: ImageSkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-br from-slate-200/80 via-slate-100 to-slate-200/60 ${
        rounded ? 'rounded-xl' : ''
      } ${className}`}
      aria-hidden
    />
  )
}
