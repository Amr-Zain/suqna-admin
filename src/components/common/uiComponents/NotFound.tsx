import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import NotFoundJson from '@/assets/icons/animated/404.json'
import Lottie from 'lottie-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="min-h-[calc(100vh-150px)] main-card flex flex-col items-center justify-center space-y-10">
        <Lottie className="h-[400px] mx-auto" animationData={NotFoundJson} loop />
        <p className="text-xl text-gray-500 mt-2 font-medium">
            {t('wrong_page')}
        </p>

        <Button asChild size="lg" className="px-6">
            <Link to="/" aria-label={t('go_home')}>
            {t('go_home')}
            </Link>
        </Button>
    </div>
  )
}
