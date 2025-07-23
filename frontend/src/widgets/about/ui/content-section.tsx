export const ContentSection = () => {
  return (
    <div className='container mt-[110px]'>
      <div className='mx-auto'>
        <div className='grid grid-cols-1 items-center gap-12 xl:grid-cols-2 xl:gap-[109px]'>
          {/* Image placeholder */}
          <div className='order-2 xl:order-1'>
            <div className='aspect-square max-h-[530px] w-full rounded-[43px] bg-gray-300'></div>
          </div>

          {/* Content */}
          <div className='order-1 xl:order-2 xl:max-w-[485px]'>
            <h2 className='mb-6 text-3xl text-gray-950 xl:text-5xl'>
              Dolorem quia debitis quod fugit
            </h2>
            <p className='mb-6 text-gray-600 xl:mb-[39px]'>
              Error perspiciatis aut quisquam. Omnis maiores et dolor. Ea
              nostrum placeat assumenda est tempore deleniti ut sunt.
            </p>

            {/* Feature list */}
            <div className='space-y-4'>
              {[1, 2, 3].map(item => (
                <div key={item} className='flex items-center gap-4'>
                  <div className='h-[41px] w-[41px] flex-shrink-0 rounded-full bg-gray-400'></div>
                  <span className='text-gray-600'>
                    Error perspiciatis aut quisquam.
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='mt-20 grid grid-cols-1 items-center gap-12 xl:mt-[110px] xl:grid-cols-2 xl:gap-16'>
          {/* Image placeholder */}
          <div className='order-2'>
            <div className='aspect-square max-h-[530px] w-full rounded-[43px] bg-gray-300'></div>
          </div>

          {/* Content */}
          <div className='order-1 xl:max-w-[485px]'>
            <h2 className='mb-6 text-3xl text-gray-950 xl:text-5xl'>
              Dolorem quia debitis quod fugit
            </h2>
            <p className='mb-6 text-gray-600 xl:mb-[39px]'>
              Error perspiciatis aut quisquam. Omnis maiores et dolor. Ea
              nostrum placeat assumenda est tempore deleniti ut sunt.
            </p>

            {/* Feature list */}
            <div className='space-y-4'>
              {[1, 2, 3].map(item => (
                <div key={item} className='flex items-center gap-4'>
                  <div className='h-[41px] w-[41px] flex-shrink-0 rounded-full bg-gray-400'></div>
                  <span className='text-gray-600'>
                    Error perspiciatis aut quisquam.
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
