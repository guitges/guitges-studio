export default function GradientBackdrop({ variant = 'default' }: { variant?: 'default' | 'top' }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-brand-radial" />
      <div
        className={`absolute h-[420px] w-[420px] rounded-full bg-cyan-500/25 blur-[110px] animate-blob-slow ${
          variant === 'top' ? '-top-40 left-[10%]' : 'top-10 left-[-5%]'
        }`}
      />
      <div
        className={`absolute h-[380px] w-[380px] rounded-full bg-violet-600/25 blur-[110px] animate-blob-slow ${
          variant === 'top' ? '-top-20 right-[5%]' : 'bottom-0 right-[-5%]'
        }`}
        style={{ animationDelay: '4s' }}
      />
    </div>
  )
}
