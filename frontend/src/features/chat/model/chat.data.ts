import i18n from '@/shared/config/i18next/i18next'
import avatar_img from '../assets/photo.jpg'

export const CHAT_DATA = [
  {
    id: 1,
    avatar: avatar_img,
    name: 'John Doe',
    date: `2 ${i18n.t('date.m')} ${i18n.t('date.ago')}`,
    msg: 'Maiores voluptatibus voluptatem voluptatem',
    msg_count: 10,
  },
  {
    id: 2,
    avatar: avatar_img,
    name: 'David Runolfsdottir',
    date: i18n.t('date.today'),
    msg: 'Maiores voluptatibus voluptatem voluptatem',
    msg_count: 0,
  },
  {
    id: 3,
    avatar: avatar_img,
    name: 'John Doe',
    date: i18n.t('date.yesterday'),
    msg: 'Maiores voluptatibus voluptatem voluptatem',
    msg_count: 10,
  },
  {
    id: 4,
    avatar: avatar_img,
    name: 'John Doe',
    date: `5 ${i18n.t('date.days')} ${i18n.t('date.ago')}`,
    msg: 'Maiores voluptatibus voluptatem voluptatem',
    msg_count: 10,
  },
  {
    id: 5,
    avatar: avatar_img,
    name: 'John Doe',
    date: `5 ${i18n.t('date.days')} ${i18n.t('date.ago')}`,
    msg: 'Maiores voluptatibus voluptatem voluptatem',
    msg_count: 0,
  },
  {
    id: 6,
    avatar: avatar_img,
    name: 'John Doe',
    date: `5 ${i18n.t('date.days')} ${i18n.t('date.ago')}`,
    msg: 'Maiores voluptatibus voluptatem voluptatem',
    msg_count: 0,
  },
] as const
