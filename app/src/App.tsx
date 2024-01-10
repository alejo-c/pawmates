import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import NotFoundPage from './pages/NotFoundPage'
import HomePage from './pages/HomePage'
import PetDetailsPage from './pages/PetDetailsPage'
import RequestsPage from './pages/RequestsPage'
import PetsPage from './pages/PetsPage'
import AdoptersPage from './pages/AdoptersPage'

const App = () => {
  const appStyle = 'bg-light-subtle text-white pt-5'
  return <>
    <div className={appStyle} data-bs-theme='dark' >
      <BrowserRouter>
        <Navbar />
        <Sidebar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/requests' element={<RequestsPage />} />
          <Route path='/adopters' element={<AdoptersPage />} />
          <Route path='/pets' element={<PetsPage />} />
          <Route path='/adoptpet/:id' element={<PetDetailsPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  </>
}

export default App
