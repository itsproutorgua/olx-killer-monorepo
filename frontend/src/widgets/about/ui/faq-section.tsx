import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqItems: FAQItem[] = [
    {
      question: 'Id qui sint possimus omnis quo neque.',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus faucibus ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes.',
    },
    {
      question: 'Id qui sint possimus omnis quo neque.',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus faucibus ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in.',
    },
    {
      question: 'Id qui sint possimus omnis quo neque.',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus faucibus ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in.',
    },
    {
      question: 'Id qui sint possimus omnis quo neque.',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus faucibus ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in.',
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className='lg:px-12 lg:py-24 px-6 py-16'>
      <div className='mx-auto max-w-4xl'>
        {/* Section heading */}
        <h2 className='lg:text-4xl mb-12 text-center text-3xl text-gray-900'>
          Frequently Asked Questions
        </h2>

        {/* FAQ Items */}
        <div className='space-y-4'>
          {faqItems.map((item, index) => (
            <div
              key={index}
              className='border-b border-gray-200 transition-all duration-200 hover:border-gray-300'
            >
              <button
                onClick={() => toggleFAQ(index)}
                className='flex w-full items-center justify-between py-6 text-left'
              >
                <span className='pr-4 text-lg font-semibold text-gray-900'>
                  {item.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className='h-5 w-5 flex-shrink-0 text-gray-500' />
                ) : (
                  <ChevronDown className='h-5 w-5 flex-shrink-0 text-gray-500' />
                )}
              </button>

              {openIndex === index && (
                <div className='pb-6 pt-4'>
                  <p className='leading-relaxed text-gray-600'>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
