// 版本自动刷新：检测构建时间戳，新部署时强制刷新清除缓存
const BUILD_VERSION = 'v-' + (__BUILD_TIME__ || 0)
const stored = localStorage.getItem('mindease-build-version')
if (stored && stored !== BUILD_VERSION) {
  localStorage.setItem('mindease-build-version', BUILD_VERSION)
  location.reload()
} else if (!stored) {
  localStorage.setItem('mindease-build-version', BUILD_VERSION)
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
