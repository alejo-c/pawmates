import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import NotFoundPage from './pages/NotFoundPage'
import HomePage from './pages/HomePage'
import PetDetailsPage from './pages/PetDetailsPage'
import RequestsPage from './pages/RequestsPage'
import PetsPage from './pages/PetsPage'
import UsersPage from './pages/UsersPage'
import UserProfile from './pages/UserProfile'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

const App = () => (
  <div className='bg-light-subtle text-white' data-bs-theme='dark' >
    <BrowserRouter>
      <Navbar />
      <Sidebar />

      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/petdetail/:id' element={<PetDetailsPage />} />

        <Route path='/requests' element={<RequestsPage />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='/pets' element={<PetsPage />} />

        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/profile' element={<UserProfile />} />

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </div>
)

export default App