import { useMediaQuery } from '@/shared/library/hooks'
import {
  CategoryDialogDesktop,
  CategoryDialogProps,
} from './category-dialog-desktop'
import { CategoryDialogMobile } from './category-dialog-mobile'

export function CategoryDialog({
  open,
  onOpenChange,
  onSelect,
}: CategoryDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <CategoryDialogDesktop
      open={open}
      onOpenChange={onOpenChange}
      onSelect={onSelect}
    />
  ) : (
    <CategoryDialogMobile
      open={open}
      onOpenChange={onOpenChange}
      onSelect={onSelect}
    />
  )
}
