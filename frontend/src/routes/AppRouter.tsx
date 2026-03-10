import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import RegisterPage from '../pages/auth/Register'
import LoginPage from '../pages/auth/Login'
import AuthLayout from '../layouts/AuthLayout'
import ConfirmAccountPage from '../pages/auth/ConfirmAccount'
import ForgotPasswordPage from '../pages/auth/ForgotPassword'
import ResendConfirmationEmailPage from '../pages/auth/ResendConfirmationEmail'
import ResetPasswordPage from '../pages/auth/ResetPassword'
import ProtectedRoute from './ProtectedRoute'
import DoctorDashboardPage from '../pages/dashboard/DoctorDashboard'
import DashboardLayout from '../layouts/DashboardLayout'


function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="create-account" element={<RegisterPage />} />
        <Route path="confirm-account/:token" element={<ConfirmAccountPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="resend-confirmation-email" element={<ResendConfirmationEmailPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
        <Route path="dashboard/doctor" element={<DashboardLayout />}>
          <Route index element={<DoctorDashboardPage />} />
        </Route>
      </Route>


    </Routes>
  )
}

export default AppRouter
