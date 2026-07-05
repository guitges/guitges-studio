const stack = [
  'React',
  'TypeScript',
  'Node.js',
  'Tailwind CSS',
  'Vite',
  'Framer Motion',
  'Vercel',
  'Figma',
]

export default function TechMarquee() {
  const items = [...stack, ...stack]
  return (
    <div className="border-y border-white/5 bg-white/[0.02] py-6">
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
        Built with a modern, reliable stack
      </p>
      <div className="relative overflow-hidden">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-12">
          {items.map((tech, i) => (
            <span
              key={i}
              className="whitespace-nowrap font-display text-lg font-medium text-slate-500 transition-colors hover:text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
