import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Header from './Header'
import Footer from './Footer'
import CrisisButton from '../CrisisButton'

export default function Layout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // 页面切换淡入效果
    const el = mainRef.current?.firstElementChild as HTMLElement | null
    if (el) {
      el.classList.remove('page-enter')
      // 强制 reflow 以重新触发动画
      void el.offsetWidth
      el.classList.add('page-enter')
    }
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1 pt-16" ref={mainRef} role="main">
        <Outlet />
      </main>
      <Footer />
      <CrisisButton />
    </div>
  )
}
