import type { BreakTemplate } from '@/lib/types'

type Props = {
  templates: BreakTemplate[]
  selectedTemplateId: string
  onSelectTemplate: (templateId: string) => void
}

export default function TemplateSelector({ templates, selectedTemplateId, onSelectTemplate }: Props) {
  return (
    <div className="w-full flex flex-wrap gap-2">
      {templates.map((t) => {
        const active = t.id === selectedTemplateId
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelectTemplate(t.id)}
            className={
              active
                ? 'px-3 py-1.5 rounded-md text-xs font-medium border border-gray-500 bg-gray-700 text-white transition-colors'
                : 'px-3 py-1.5 rounded-md text-xs font-medium border border-gray-800 bg-transparent text-gray-500 hover:border-gray-600 hover:text-gray-300 transition-colors'
            }
          >
            {t.name}
          </button>
        )
      })}
    </div>
  )
}
