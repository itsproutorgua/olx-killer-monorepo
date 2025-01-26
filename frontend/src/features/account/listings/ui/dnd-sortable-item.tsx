import type { UniqueIdentifier } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Image } from 'lucide-react'

export function DndSortableItem({
  id,
  data,
}: {
  id: UniqueIdentifier
  data: number
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? '100' : 'auto',
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='flex h-[104px] cursor-move items-center justify-center rounded-[15px] bg-gray-200 text-primary-500 xl:h-[118px]'
    >
      <Image />
      <p className='hidden'>{data}</p>
    </div>
  )
}
