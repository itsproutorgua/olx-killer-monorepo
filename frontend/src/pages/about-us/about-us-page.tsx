import {
  ContentSection,
  FAQSection,
  FeaturesSection,
  HeroSection,
} from '@/widgets/about/ui'

export const AboutPage = () => {
  return (
    <div className='min-h-screen'>
      <HeroSection />
      <FeaturesSection />
      <ContentSection />
      <FAQSection />
    </div>
  )
}
