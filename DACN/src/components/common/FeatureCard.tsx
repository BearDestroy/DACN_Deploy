interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className='text-center p-6 group'>
      <div className='bg-[#FF5722]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FF5722]/20 transition-colors'>
        <span className='text-[32px] text-[#FF5722] group-hover:text-[#E64A19] transition-colors'>{icon}</span>
      </div>
      <h3 className='text-[19px] font-bold text-[#1C1D1F] mb-2'>{title}</h3>
      <p className='text-[14px] text-[#6A6C70]'>{description}</p>
    </div>
  )
}
