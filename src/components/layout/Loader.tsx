import Lottie from 'lottie-react'
import LoadingJson from '@/assets/icons/animated/loading.json'

function LoaderPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Lottie
        className="size-80"
        animationData={LoadingJson}
        loop={true}
      />
    </div>
  )
}

export default LoaderPage
