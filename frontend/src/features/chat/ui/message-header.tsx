import { useState } from 'react'
import { profileDefault } from '@/shared/assets'
import { useTranslation } from 'react-i18next'

import { useChatContext } from '@/features/chat/chat-context/chat-context.tsx'
import { useChatList } from '@/features/chat/library/hooks/use-chat-list.tsx'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/shadcn-ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn-ui/dropdown-menu.tsx'
import { DeleteWarningDialog } from '@/shared/ui'
import {
  ArrowDownSmall,
  DeleteIcon,
  DotsMenu,
  SpinnerIcon,
} from '@/shared/ui/icons'

export const MessageHeader = () => {
  const { t } = useTranslation()
  const { selectedSellerProfile, setMobileView, currentRoomId } =
    useChatContext()
  const { isLoading, deleteChat, isDeleting } = useChatList()
  const [isDeleteWarningOpen, setIsDeleteWarningOpen] = useState(false)

  const handleDelete = () => {
    setIsDeleteWarningOpen(true)
  }

  const handleDeleteClick = (roomId?: string) => {
    if (roomId) deleteChat(roomId)
  }

  const [deleteMenu, setDeleteMenu] = useState(false)

  return (
    <div className='flex items-center justify-between p-[18px] pr-3 md:p-6 md:pr-[14px] [@media(max-width:1024px)_and_(orientation:landscape)]:p-[10px]'>
      {isLoading || !selectedSellerProfile ? (
        <SpinnerIcon className='h-10 w-10 animate-spin text-primary-900' />
      ) : (
        <div className='flex items-start gap-3'>
          <button
            onClick={() => setMobileView('list')}
            className='my-auto mr-2 block xl:hidden'
          >
            <ArrowDownSmall className='rotate-90' />
          </button>

          <Avatar className='h-[52px] w-[52px]'>
            <AvatarImage
              src={selectedSellerProfile?.picture || profileDefault}
              className='object-cover'
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='space-y-1'>
            <p className='text-sm/[21px] font-semibold text-gray-950'>
              {selectedSellerProfile?.username || 'N/A'}
            </p>
            <p className='flex items-center gap-1.5 text-xs/[14.52px] text-gray-950'>
              <span className='flex size-[18px] items-center justify-center'>
                <span className='flex size-2 rounded-full bg-green' />
              </span>
              <span>{t('chat.status')}</span>
            </p>
          </div>
          <DeleteWarningDialog
            open={isDeleteWarningOpen}
            onOpenChange={setIsDeleteWarningOpen}
            onClickDelete={() => handleDeleteClick(currentRoomId ?? undefined)}
            isDeleting={isDeleting}
            title='title.deleteChatWarning'
            message='chat.deleteChatMessage'
          />
        </div>
      )}
      {/*TODO: uncomment when phone icon will be added*/}
      {/*<button className='flex size-[52px] items-center justify-center rounded-full border border-border text-primary-900'>*/}
      {/*  <PhoneIcon />*/}
      {/*</button>*/}
      <DropdownMenu open={deleteMenu} onOpenChange={setDeleteMenu}>
        <DropdownMenuTrigger asChild>
          <button>
            <DotsMenu className='h-6 w-6' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side='bottom'
          align='end'
          className='z-50 bg-gray-50 p-0'
        >
          <DropdownMenuItem
            className='text-destructive flex cursor-pointer items-center justify-start gap-[6px] px-[20px] py-[14px]'
            onClick={() => {
              if (currentRoomId) {
                setDeleteMenu(false)
                handleDelete()
              }
            }}
          >
            {isLoading ? (
              <SpinnerIcon className='h-2 w-2 animate-spin text-primary-900' />
            ) : (
              <DeleteIcon />
            )}
            {t('buttons.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
