import React from 'react'

interface RatingProps {
  rating: number // A number from 0 to 5 (average rating)
  reviews: number // Total number of reviews
}

export const Rating: React.FC<RatingProps> = ({ rating, reviews }) => {
  // Convert the rating into an array of star statuses (full, half, or empty)
  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(
          <svg
            key={i}
            xmlns='http://www.w3.org/2000/svg'
            fill='#ffd600'
            viewBox='0 0 24 24'
            width='20'
            height='20'
          >
            <path d='M12 17.75L6.76 20.5L7.91 14.14L3.4 9.75L9.88 9L12 2.75L14.12 9L20.6 9.75L16.09 14.14L17.24 20.5L12 17.75Z' />
          </svg>,
        )
      } else {
        stars.push(
          <svg
            key={i}
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            stroke='#ffd600'
            viewBox='0 0 24 24'
            width='20'
            height='20'
          >
            <path d='M12 17.75L6.76 20.5L7.91 14.14L3.4 9.75L9.88 9L12 2.75L14.12 9L20.6 9.75L16.09 14.14L17.24 20.5L12 17.75Z' />
          </svg>,
        )
      }
    }
    return stars
  }

  return (
    <div className='flex items-center'>
      {/* Render stars */}
      <div className='flex'>{renderStars()}</div>
      {/* Display number of reviews */}
      <span className='text-primary-gray border-primary-gray ml-[10px] mt-[1px] border-l-2 pl-[10px] text-xs'>
        {reviews} reviews
      </span>
    </div>
  )
}
