import { useState } from 'react'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { Image, ImagePlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { DndSortableItem } from './dnd-sortable-item'

export const DndGrid = () => {
  const { t } = useTranslation()
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (e: DragEndEvent) => {
    setActiveId(e.active.id)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = e

    if (over && active.id !== over.id) {
      setItems(items => {
        const oldIndex = items.indexOf(active.id as number)
        const newIndex = items.indexOf(over.id as number)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className='grid grid-cols-2 gap-x-2.5 gap-y-1.5 xl:grid-cols-4 xl:gap-1.5'>
        <div className='flex h-[104px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[15px] bg-primary-700 text-gray-50 transition-colors duration-300 hover:bg-primary-800 xl:h-[118px]'>
          <ImagePlus />
          <p className='text-sm/none font-medium'>
            {t('listingForm.buttons.download')}
          </p>
        </div>
        <SortableContext items={items} strategy={rectSortingStrategy}>
          {items.map(id => (
            <DndSortableItem key={id} id={id} data={items[id - 1]} />
          ))}
          <DragOverlay>
            {activeId ? (
              <div className='flex h-[104px] cursor-move items-center justify-center rounded-[15px] border-2 border-gray-400 bg-gray-300 text-primary-500 xl:h-[118px]'>
                <Image />
              </div>
            ) : null}
          </DragOverlay>
        </SortableContext>
      </div>
    </DndContext>
  )
}
