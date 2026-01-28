import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from 'react-i18next'
import AboutTab from './AboutTab'
import PrinciplesTab from './PrinciplesTab'
import TeamTab from './TeamTab'
import JourneyTab from './JourneyTab'
import { SmartBreadcrumbs } from '@/components/layout/SmartBreadcrumbs'

export default function AboutUs() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            <SmartBreadcrumbs entityKey="menu.about" />

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">{t('menu.about')}</h1>
            </div>

            <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="about">{t('menu.about')}</TabsTrigger>
                    <TabsTrigger value="our-principle">{t('menu.ourPrinciple')}</TabsTrigger>
                    <TabsTrigger value="team">{t('menu.team')}</TabsTrigger>
                    <TabsTrigger value="journey">{t('menu.journey')}</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="mt-0">
                    <AboutTab />
                </TabsContent>
                <TabsContent value="our-principle" className="mt-0">
                    <PrinciplesTab />
                </TabsContent>
                <TabsContent value="team" className="mt-0">
                    <TeamTab />
                </TabsContent>
                <TabsContent value="journey" className="mt-0">
                    <JourneyTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}
