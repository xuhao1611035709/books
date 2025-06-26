import RegisterForm from '@/components/auth/register-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* 头部标题 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            图书管理系统
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            创建您的新账户
          </p>
        </div>

        {/* 注册卡片 */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">注册</CardTitle>
            <CardDescription className="text-center">
              填写信息创建您的账户
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            
            {/* 登录链接 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                已有账户？{' '}
                <Link 
                  href="/login" 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  立即登录
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 底部信息 */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            注册即表示您同意我们的{' '}
            <Link href="/terms" className="underline hover:text-gray-700">
              服务条款
            </Link>{' '}
            和{' '}
            <Link href="/privacy" className="underline hover:text-gray-700">
              隐私政策
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 