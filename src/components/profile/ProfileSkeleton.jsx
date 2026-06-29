

export default function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="rounded-3xl border border-gray-100 bg-white/80 backdrop-blur-lg p-6 shadow">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-20 w-20 rounded-full bg-slate-200" />
          <div className="h-9 w-32 rounded-xl bg-slate-200" />
        </div>
        <div className="flex flex-col gap-4 max-w-md">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
              <div className="h-10 w-full bg-slate-100 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
