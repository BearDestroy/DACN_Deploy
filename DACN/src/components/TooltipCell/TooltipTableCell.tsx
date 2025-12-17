import { useRef, useEffect, useState } from 'react'
import { TableCell } from '../ui/table'

interface TooltipTableCellProps {
  text: string
  index?: number
  className?: string
}

const TooltipTableCell = ({ text, index = 0, className = '' }: TooltipTableCellProps) => {
  const spanRef = useRef<HTMLSpanElement | null>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    if (spanRef.current) {
      setIsTruncated(spanRef.current.scrollWidth > spanRef.current.clientWidth)
    }
  }, [text])

  return (
    <TableCell className={`relative group border-r border-gray-200 border-b ${className}`}>
      <span ref={spanRef} className='block w-full max-w-40 truncate' data-truncated={isTruncated.toString()}>
        {text}
      </span>

      {isTruncated && (
        <div
          className={`absolute hidden group-hover:block
            bg-gray-50 text-gray-900 text-sm px-3 py-2 rounded-md shadow-lg border border-orange-500
            whitespace-normal wrap-break-word w-max max-w-xs
            ${index < 2 ? 'top-full left-0 mt-1' : 'bottom-full left-0 mb-1'}
            z-50 pointer-events-none
            ${
              index < 2
                ? 'before:content-[""] before:absolute before:bottom-full before:left-4 before:border-[6px] before:border-transparent before:border-b-orange-500'
                : 'before:content-[""] before:absolute before:top-full before:left-4 before:border-[6px] before:border-transparent before:border-t-orange-500'
            }`}
        >
          {text}
        </div>
      )}
    </TableCell>
  )
}

export default TooltipTableCell
