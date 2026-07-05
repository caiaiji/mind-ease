import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import ScrollToTop from './components/ScrollToTop'

// Eager: 首屏必需
import Home from './pages/Home'

// Lazy: 按需加载
const Articles = lazy(() => import('./pages/Articles'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'))
const Assessment = lazy(() => import('./pages/Assessment'))
const Relax = lazy(() => import('./pages/Relax'))
const About = lazy(() => import('./pages/About'))
const Games = lazy(() => import('./pages/Games'))
const MoodDiary = lazy(() => import('./pages/MoodDiary'))
const TreeHole = lazy(() => import('./pages/TreeHole'))
const Profile = lazy(() => import('./pages/Profile'))
const Admin = lazy(() => import('./pages/Admin'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const AssessmentGuide = lazy(() => import('./pages/AssessmentGuide'))
const CheckIn = lazy(() => import('./pages/CheckIn'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ExamPrep = lazy(() => import('./pages/ExamPrep'))
const WeeklyInsight = lazy(() => import('./pages/WeeklyInsight'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-lavender-200 border-t-lavender-500 rounded-full animate-spin" />
        <span className="text-sm text-gray-400 dark:text-gray-500">加载中...</span>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
      <ScrollToTop />
      <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/relax" element={<Relax />} />
          <Route path="/about" element={<About />} />
          <Route path="/games" element={<Games />} />
          <Route path="/mood-diary" element={<MoodDiary />} />
          <Route path="/treehole" element={<TreeHole />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/assessment-guide" element={<AssessmentGuide />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/exam-prep" element={<ExamPrep />} />
          <Route path="/weekly-insight" element={<WeeklyInsight />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </Suspense>
      </ErrorBoundary>
    </UserProvider>
    </ThemeProvider>
  )
}

export default App
