import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Music from './pages/Music'
import Merch from './pages/Merch'
import Shows from './pages/Shows'
import Contact from './pages/Contact'
import CheckoutSuccess from './pages/CheckoutSuccess'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="music" element={<Music />} />
        <Route path="merch" element={<Merch />} />
        <Route path="shows" element={<Shows />} />
        <Route path="contact" element={<Contact />} />
        <Route path="checkout/success" element={<CheckoutSuccess />} />
      </Route>
    </Routes>
  )
}

export default App
