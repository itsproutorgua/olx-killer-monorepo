import { Shield, Users, Zap } from 'lucide-react'

export const FeaturesSection = () => {
  const features = [
    {
      icon: Users,
      title: 'Ut sint quibusdam ut',
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar cons elementum tempus hac.',
    },
    {
      icon: Shield,
      title: 'Ut sint quibusdam ut',
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar cons elementum tempus hac.',
    },
    {
      icon: Zap,
      title: 'Ut sint quibusdam ut',
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar cons elementum tempus hac.',
    },
  ]

  return (
    <div className='container pt-12 xl:pt-[150px]'>
      <div className='mx-auto'>
        {/* Section heading */}
        <div className='mb-[50px] text-center'>
          <h2 className='mb-6 text-3xl text-gray-950 xl:text-5xl'>
            Dolorem quia debitis quod fugit
          </h2>
          <p className='mx-auto max-w-[460px] leading-5 text-gray-600'>
            Error perspiciatis aut quisquam. Omnis maiores et dolor. Ea nostrum
            placeat assumenda est tempore deleniti ut sunt.
          </p>
        </div>

        {/* Features grid */}
        <div className='grid grid-cols-1 gap-[26px] xl:grid-cols-3'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='rounded-3xl border border-gray-200 p-8 text-center'
            >
              <div className='mx-auto mb-9 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
                <feature.icon className='h-8 w-8 text-gray-600' />
              </div>
              <h3 className='mb-4 text-[26px] font-semibold leading-none text-gray-950'>
                {feature.title}
              </h3>
              <p className='text-gray-500'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
