export const FetchError = () => {
  return (
    <div className='h-fit'>
      {/* Main content */}
      <div className='flex flex-grow items-center justify-center rounded-2xl bg-gray-100 p-5'>
        <div className='text-center'>
          <h1 className='mb-4 text-4xl font-bold text-gray-800'>
            Something went wrong
          </h1>
          <p className='text-lg text-gray-600'>
            Please try refreshing the page or contact support if the issue
            persists.
          </p>
        </div>
      </div>
    </div>
  )
}
