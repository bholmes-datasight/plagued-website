import { capitalize, getStatusColor } from '../lib/formatters'

export default function StatusBadge({ status }) {
  const colorClass = getStatusColor(status)

  return (
    <span
      className={`inline-flex px-3 py-1 text-xs font-display uppercase tracking-wider bg-${colorClass}/20 text-${colorClass} border border-${colorClass}/50`}
    >
      {capitalize(status)}
    </span>
  )
}
