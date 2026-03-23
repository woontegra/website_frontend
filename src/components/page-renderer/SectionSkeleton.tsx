export function SectionSkeleton() {
  return (
    <div className="py-16 md:py-20 animate-pulse bg-slate-50 border-y border-gray-100">
      <div className="container mx-auto px-4 max-w-[1200px] space-y-4">
        <div className="h-8 bg-slate-200 rounded-lg w-1/2 mx-auto" />
        <div className="h-4 bg-slate-100 rounded w-2/3 mx-auto" />
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="h-40 bg-slate-100 rounded-2xl" />
          <div className="h-40 bg-slate-100 rounded-2xl" />
          <div className="h-40 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
