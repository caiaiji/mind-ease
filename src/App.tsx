import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import Assessment from './pages/Assessment'
import Relax from './pages/Relax'
import About from './pages/About'
import Games from './pages/Games'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/relax" element={<Relax />} />
        <Route path="/about" element={<About />} />
        <Route path="/games" element={<Games />} />
      </Route>
    </Routes>
  )
}

export default App
