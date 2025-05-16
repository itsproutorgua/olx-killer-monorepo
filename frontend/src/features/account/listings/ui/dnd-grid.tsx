import { useEffect, useRef, useState } from 'react'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { restrictToParentElement } from '@dnd-kit/modifiers'
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { ImagePlus } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { XCircleSmall } from '@/shared/ui/icons'
import { DndSortableItem } from './dnd-sortable-item'

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
]

export const DndGrid = () => {
  const { t } = useTranslation()
  const { setValue, getValues } = useFormContext()
  const [activeFile, setActiveFile] = useState<File | null>(null)

  const [files, setFiles] = useState<File[]>([])
  const initialized = useRef(false)
  const uploadedImages = getValues('uploaded_images')

  useEffect(() => {
    if (initialized.current) return

    const formFiles = getValues('uploaded_images')

    if (formFiles && formFiles.length > 0) {
      setFiles(formFiles)
      initialized.current = true
    }
  }, [getValues, uploadedImages])

  useEffect(() => {
    if (initialized.current) {
      setValue('uploaded_images', files.length > 0 ? files : undefined)
    }
  }, [files, setValue])

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleAddFiles = (newFiles: FileList) => {
    const filesArray = Array.from(newFiles)
    const validFiles: File[] = []
    const invalidFiles: File[] = []

    filesArray.forEach(file => {
      if (ALLOWED_MIME_TYPES.includes(file.type)) {
        validFiles.push(
          new File([file], `${Date.now()}-${file.name}`, {
            type: file.type,
          }),
        )
      } else {
        invalidFiles.push(file)
      }
    })

    if (invalidFiles.length > 0) {
      toast.error(t('errors.input.invalidImageFormat'))
    }

    if (validFiles.length > 0) {
      setFiles(prevFiles => [
        ...prevFiles,
        ...validFiles.slice(0, 8 - prevFiles.length),
      ])
    }
  }

  const handleDragStart = (e: DragEndEvent) => {
    const file = files.find(file => file.name === e.active.id)
    setActiveFile(file || null)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e

    if (over && active.id !== over.id) {
      setFiles(currentFiles => {
        const oldIndex = currentFiles.findIndex(file => file.name === active.id)
        const newIndex = currentFiles.findIndex(file => file.name === over.id)
        return arrayMove(currentFiles, oldIndex, newIndex)
      })
    }
  }

  const handleRemoveFile = (fileName: string) => {
    setFiles(currentFiles =>
      currentFiles.filter(file => file.name !== fileName),
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
    >
      <div className='grid max-w-[802px] grid-cols-2 gap-x-2.5 gap-y-1.5 xl:grid-cols-4 xl:gap-1.5'>
        {files.length < 8 && (
          <label className='flex h-[104px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[15px] bg-primary-700 text-gray-50 transition-colors duration-300 hover:bg-primary-800 xl:h-[118px]'>
            <ImagePlus className='cursor-pointer' />
            <p className='text-sm/none font-medium'>
              {t('listingForm.buttons.download')}
            </p>
            <input
              type='file'
              onClick={e => {
                e.currentTarget.value = ''
                initialized.current = true
              }}
              multiple
              accept='image/jpeg, image/png, image/heic, image/heif'
              className='hidden'
              onChange={e => e.target.files && handleAddFiles(e.target.files)}
            />
          </label>
        )}

        <SortableContext
          items={files.map(file => file.name)}
          strategy={rectSortingStrategy}
        >
          {files.map(file => (
            <DndSortableItem key={file.name} id={file.name}>
              <div className='group relative h-full w-full touch-none'>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Upload ${file.name}`}
                  className='h-full w-full rounded-[15px] object-cover'
                />
                <button
                  type='button'
                  onPointerDown={e => {
                    e.stopPropagation()
                  }}
                  onClick={e => {
                    e.stopPropagation()
                    handleRemoveFile(file.name)
                  }}
                  className='absolute right-1 top-1 rounded-full p-0.5'
                >
                  <XCircleSmall className='text-error-600' />
                </button>
              </div>
            </DndSortableItem>
          ))}
        </SortableContext>

        <DragOverlay>
          {activeFile ? (
            <div className='flex h-[104px] cursor-move items-center justify-center rounded-[15px] xl:h-[118px]'>
              <img
                src={URL.createObjectURL(activeFile)}
                alt={`Dragged ${activeFile.name}`}
                className='h-full w-full rounded-[15px] object-cover'
              />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  )
}
