import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import RegisterPage from '../pages/auth/Register'
import LoginPage from '../pages/auth/Login'
import AuthLayout from '../layouts/AuthLayout'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="create-account" element={<RegisterPage />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
