export default function Loader({ size = 'md', text = 'Loading…', fullScreen = false }) {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-9 h-9 border-3', lg: 'w-14 h-14 border-4' }

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} rounded-full border-navy-200 border-t-navy-700 animate-spin`} />
      {text && <p className="text-sm text-slate-500 font-body">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    )
  }

  return <div className="flex items-center justify-center py-16">{spinner}</div>
}
