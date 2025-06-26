'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  BookOpen, 
  LayoutDashboard, 
  Plus,
  Search,
  Settings,
  User,
  BarChart3
} from 'lucide-react'

const navigation = [
  {
    name: '仪表板',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: '图书管理',
    href: '/dashboard/books',
    icon: BookOpen,
  },
  {
    name: '添加图书',
    href: '/dashboard/books/new',
    icon: Plus,
  },
]

const secondaryNavigation = [
  {
    name: '个人资料',
    href: '/dashboard/profile',
    icon: User,
  },
  {
    name: '系统设置',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-lg font-semibold">图书系统</span>
        </div>
        
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/dashboard' && pathname.startsWith(item.href))
                  
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors',
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-5 w-5 shrink-0',
                            isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
            
            <li>
              <Separator className="my-4" />
              <div className="text-xs font-semibold leading-6 text-gray-400">
                其他功能
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {secondaryNavigation.map((item) => {
                  const isActive = pathname === item.href
                  
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors',
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-5 w-5 shrink-0',
                            isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>

            <li className="mt-auto">
              <Separator className="mb-4" />
              
              {/* 快速操作 */}
              <div className="space-y-2">
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  快速操作
                </div>
                <Link href="/dashboard/books?search=true">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Search className="mr-2 h-4 w-4" />
                    搜索图书
                  </Button>
                </Link>
                <Link href="/dashboard/books/new">
                  <Button size="sm" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    添加图书
                  </Button>
                </Link>
              </div>

              {/* 统计信息 */}
              <div className="mt-4 rounded-lg bg-blue-50 p-3">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-900">本月统计</p>
                    <p className="text-xs text-blue-700">新增 23 本图书</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
} 