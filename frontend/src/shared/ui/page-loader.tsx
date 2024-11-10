import { SpinnerIcon } from './icons'

export const PageLoader = () => {
  return (
    <div className='relative h-screen'>
      <div className='absolute left-0 top-1/4 flex w-full justify-center'>
        <SpinnerIcon className='h-12 w-12 animate-spin text-primary-900' />
      </div>
    </div>
  )
}
