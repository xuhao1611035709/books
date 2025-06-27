import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function DemoI18nPage() {
  const t = useTranslations('books');
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">i18n 国际化演示</h1>
        <LanguageSwitcher />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 图书管理翻译 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>{t('fields.title')}:</strong> 示例书名</p>
            <p><strong>{t('fields.author')}:</strong> 示例作者</p>
            <p><strong>{t('fields.category')}:</strong> 科技</p>
            <p><strong>{t('fields.status')}:</strong> {t('status.available')}</p>
            <div className="flex space-x-2 mt-4">
              <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                {t('actions.view')}
              </button>
              <button className="px-3 py-1 bg-green-500 text-white rounded text-sm">
                {t('actions.edit')}
              </button>
              <button className="px-3 py-1 bg-red-500 text-white rounded text-sm">
                {t('actions.delete')}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 认证翻译 */}
        <Card>
          <CardHeader>
            <CardTitle>{tAuth('login')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>{tAuth('email')}:</strong> user@example.com</p>
            <p><strong>{tAuth('password')}:</strong> ********</p>
            <div className="flex space-x-2 mt-4">
              <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                {tAuth('login')}
              </button>
              <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm">
                {tAuth('register')}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 通用翻译 */}
        <Card>
          <CardHeader>
            <CardTitle>通用功能</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>{tCommon('search')}:</strong> 搜索功能</p>
            <p><strong>{tCommon('filter')}:</strong> 筛选功能</p>
            <p><strong>{tCommon('sort')}:</strong> 排序功能</p>
            <p><strong>{tCommon('loading')}:</strong> {tCommon('loading')}</p>
            <p><strong>{tCommon('noData')}:</strong> {tCommon('noData')}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>🌍 点击右上角的地球图标可以切换语言</p>
            <p>🔄 语言切换后页面会自动刷新应用新语言</p>
            <p>💾 语言偏好会保存在 Cookie 中</p>
            <p>🎯 所有翻译文本都来自 messages/ 目录下的 JSON 文件</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 