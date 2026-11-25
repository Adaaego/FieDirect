import { useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current

    if (!el) return

    // Ensure content remains visible in unsupported browsers
    if (typeof IntersectionObserver === 'undefined') {
      el.setAttribute('data-shown', '')
      return
    }

    // Reveal content when it enters the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-shown', '')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)

    // Clean up observer when the component unmounts
    return () => observer.disconnect()
  }, [Tag])

  return (
    <Tag
      ref={ref}
      className={cn('reveal', className)}
      style={{ '--delay': `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}