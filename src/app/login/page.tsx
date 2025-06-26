import LoginForm from '@/components/auth/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* 头部标题 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            图书管理系统
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            请登录您的账户
          </p>
        </div>

        {/* 登录卡片 */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">登录</CardTitle>
            <CardDescription className="text-center">
              输入您的邮箱和密码来访问您的账户
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            
            {/* 注册链接 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                还没有账户？{' '}
                <Link 
                  href="/register" 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  立即注册
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 底部信息 */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            登录即表示您同意我们的{' '}
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