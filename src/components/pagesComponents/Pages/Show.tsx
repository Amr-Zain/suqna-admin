import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card'
import { StaticPage } from '@/types/api/staticPage'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Edit, FileText, Globe } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { formatDate } from '@/util/helpers'
import { Badge } from '@/components/ui/badge'

export default function StaticPageShow({ page }: { page: StaticPage }) {
    const { t } = useTranslation()

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{t('menu.pages')}</h1>
                <Link
                    to={`/pages/$type`}
                    params={{ type: page?.type }}
                >
                    <Button>
                        <Edit className="w-4 h-4 me-2" />
                        {t('actions.edit')}
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Main Info Card */}
                <Card className="border-t-4 border-primary">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 text-primary rounded-full">
                                    <FileText className="size-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl uppercase">{t(`staticPage.types.${page.type}`)}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{formatDate(page.created_at)}</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="uppercase">{page.type}</Badge>
                        </div>
                    </CardHeader>
                </Card>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Arabic Content */}
                    <Card>
                        <CardHeader className="border-b bg-muted/30">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Globe className="size-4" />
                                {t('Form.labels.titleAr')} / {t('Form.labels.contentAr')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div>
                                <h3 className="font-bold text-lg mb-2">{page.translations?.ar?.title}</h3>
                                <div
                                    className="prose prose-sm max-w-none dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: page.translations?.ar?.content || '' }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* English Content */}
                    <Card>
                        <CardHeader className="border-b bg-muted/30">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Globe className="size-4" />
                                {t('Form.labels.titleEn')} / {t('Form.labels.contentEn')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div>
                                <h3 className="font-bold text-lg mb-2">{page.translations?.en?.title}</h3>
                                <div
                                    className="prose prose-sm max-w-none dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: page.translations?.en?.content || '' }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
