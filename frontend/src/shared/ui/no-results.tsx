import img from '../assets/images/no-results.jpg'

export const NoResults = () => {
  return (
    <div className='flex justify-center py-10'>
      <img
        src={img}
        alt='No results'
        className='size-36 overflow-hidden rounded-md'
      />
    </div>
  )
}
