import { Routes, Route } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import Assessment from './pages/Assessment'
import Relax from './pages/Relax'
import About from './pages/About'
import Games from './pages/Games'
import MoodDiary from './pages/MoodDiary'
import TreeHole from './pages/TreeHole'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import PrivacyPolicy from './pages/PrivacyPolicy'
import AssessmentGuide from './pages/AssessmentGuide'

function App() {
  return (
    <UserProvider>
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
        </Route>
      </Routes>
    </UserProvider>
  )
}

export default App
