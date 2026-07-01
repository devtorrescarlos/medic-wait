import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import RegisterPage from "../pages/auth/Register";
import LoginPage from "../pages/auth/Login";
import AuthLayout from "../layouts/AuthLayout";
import ConfirmAccountPage from "../pages/auth/ConfirmAccount";
import ForgotPasswordPage from "../pages/auth/ForgotPassword";
import ResendConfirmationEmailPage from "../pages/auth/ResendConfirmationEmail";
import ResetPasswordPage from "../pages/auth/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
import DoctorDashboardPage from "../pages/dashboard/doctor/DoctorDashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import SlotsPage from "../pages/dashboard/doctor/slots/SlotsPage";
import ScheduleRegisterPage from "../pages/dashboard/doctor/schedules/ScheduleRegisterPage";
import SlotUpdatePage from "../pages/dashboard/doctor/slots/SlotUpdatePage";
import ScheduleCalendarPage from "../pages/dashboard/doctor/schedules/ScheduleCalendarPage";
import ScheduleUpdatePage from "../pages/dashboard/doctor/schedules/ScheduleUpdatePage";
import AppointmentsPage from "../pages/dashboard/doctor/appointments/AppointmentsPage";
import AppointmentDetailPage from "../pages/dashboard/doctor/appointments/AppointmentDetailPage";
import PatientsPage from "../pages/dashboard/doctor/medical-records/PatientsPage";
import PatientsDetailPage from "../pages/dashboard/doctor/medical-records/PatientsDetailPage";
import MedicalRecordCreatePage from "../pages/dashboard/doctor/medical-records/MedicalRecordCreatePage";
import MedicalRecordAnnexeCreatePage from "../pages/dashboard/doctor/medical-records/MedicalRecordAnnexeCreatePage";
import DoctorMedicalRecordDetailPage from "../pages/dashboard/doctor/medical-records/MedicalRecordDetailPage";
import DoctorMedicalRecordAnnexeDetailPage from "../pages/dashboard/doctor/medical-records/MedicalRecordAnnexeDetailPage";
import PatientDashboard from "../pages/dashboard/patient/PatientDashboard";
import PatientAppointmentsPage from "../pages/dashboard/patient/appointments/PatientAppointmentsPage";
import DoctorsPage from "../pages/dashboard/patient/doctors/DoctorsPage";
import DoctorDetailPage from "../pages/dashboard/patient/doctors/DoctorDetailPage";
import AppointmentBookingPage from "../pages/dashboard/patient/appointments/AppointmentBookingPage";
import PatientAppointmentPageDetail from "../pages/dashboard/patient/appointments/PatientAppointmentPageDetail";
import PatientMedicalRecordsDetailPage from "../pages/dashboard/patient/history/PatientMedicalRecordsDetailPage";
import PatientMedicalRecordDetailPage from "../pages/dashboard/patient/history/MedicalRecordDetailPage";
import PatientMedicalRecordAnnexeDetailPage from "../pages/dashboard/patient/history/MedicalRecordAnnexeDetailPage";
import MyDoctorsPage from "../pages/dashboard/patient/history/MyDoctorsPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="create-account" element={<RegisterPage />} />
        <Route path="confirm-account/:token" element={<ConfirmAccountPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="resend-confirmation-email"
          element={<ResendConfirmationEmailPage />}
        />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
        <Route path="dashboard/doctor" element={<DashboardLayout />}>
          <Route index element={<DoctorDashboardPage />} />
          <Route path="slots" element={<SlotsPage />} />
          <Route path="slots/edit/:id" element={<SlotUpdatePage />} />
          <Route path="schedule/register" element={<ScheduleRegisterPage />} />
          <Route path="schedule/edit/:id" element={<ScheduleUpdatePage />} />
          <Route path="schedule" element={<ScheduleCalendarPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="appointments/:id" element={<AppointmentDetailPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="patients/:id" element={<PatientsDetailPage />} />
          <Route
            path="medical-records/create/:id"
            element={<MedicalRecordCreatePage />}
          />
          <Route
            path="medical-records/annexe/create/:id"
            element={<MedicalRecordAnnexeCreatePage />}
          />
          <Route
            path="medical-records/annexe/:id"
            element={<DoctorMedicalRecordAnnexeDetailPage />}
          />
          <Route
            path="medical-records/:id"
            element={<DoctorMedicalRecordDetailPage />}
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
        <Route path="dashboard/patient" element={<DashboardLayout />}>
          <Route index element={<PatientDashboard />} />
          <Route path="my-appointments" element={<PatientAppointmentsPage />} />
          <Route
            path="my-appointments/:id"
            element={<PatientAppointmentPageDetail />}
          />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="doctors/:id" element={<DoctorDetailPage />} />
          <Route path="history" element={<MyDoctorsPage />} />
          <Route
            path="history/:id"
            element={<PatientMedicalRecordsDetailPage />}
          />
          <Route
            path="history/records/:id"
            element={<PatientMedicalRecordDetailPage />}
          />
          <Route
            path="history/annexe/:id"
            element={<PatientMedicalRecordAnnexeDetailPage />}
          />
          <Route
            path="appointment/:doctorId/:slotId"
            element={<AppointmentBookingPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRouter;
