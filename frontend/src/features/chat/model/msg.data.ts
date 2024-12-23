import i18n from '@/shared/config/i18next/i18next'
import msg_img from '../assets/msg-img.jpg'

export const MSG_DATA = [
  {
    id: 1,
    type: 'outgoing',
    date: `${i18n.t('date.today')} 11:52`,
    msg: 'Dolor eveniet ab repellat repellat blanditiis. Ut fugit ea suscipit. Optio saepe fugit.',
    msg_img: '',
  },
  {
    id: 2,
    type: 'income',
    date: `${i18n.t('date.today')} 11:53`,
    msg: 'Sunt eaque consequuntur omnis dignissimos temporibus provident commodi.',
    msg_img: '',
  },
  {
    id: 3,
    type: 'outgoing',
    date: `${i18n.t('date.today')} 11:54`,
    msg: 'Sunt eaque consequuntur omnis dignissimos temporibus provident commodi.',
    msg_img: msg_img,
  },
  {
    id: 4,
    type: 'income',
    date: `${i18n.t('date.today')} 11:55`,
    msg: 'Aliquam nihil voluptatem ut quidem. Dignissimos cum ratione eum aliquam. Nulla occaecati amet provident. Molestiae inventore doloribus excepturi est cumque ipsum.',
    msg_img: '',
  },
  {
    id: 5,
    type: 'outgoing',
    date: `${i18n.t('date.today')} 11:52`,
    msg: 'Aliquam nihil voluptatem ut quidem.',
    msg_img: '',
  },
] as const
