import { FiStar } from 'react-icons/fi'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'

export default function StarRating({ rating = 0, size = 'sm', showValue = true, count = 0 }) {
  const stars = []
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5
  const sizeClass = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) stars.push(<FaStar key={i} className="text-amber-400" />)
    else if (i === fullStars + 1 && halfStar) stars.push(<FaStarHalfAlt key={i} className="text-amber-400" />)
    else stars.push(<FiStar key={i} className="text-gray-300" />)
  }

  return (
    <div className={`flex items-center gap-1 ${sizeClass}`}>
      <div className="flex">{stars}</div>
      {showValue && <span className="font-semibold text-gray-700 dark:text-gray-300">{rating?.toFixed(1)}</span>}
      {count > 0 && <span className="text-gray-400">({count})</span>}
    </div>
  )
}
