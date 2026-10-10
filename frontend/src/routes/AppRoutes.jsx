import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import { ROLES } from '../utils/constants'

// Public pages
import LandingPage   from '../pages/LandingPage'
import AboutPage     from '../pages/AboutPage'
import ContactPage   from '../pages/ContactPage'
import LoginPage     from '../pages/LoginPage'
import RegisterPage  from '../pages/RegisterPage'

// Student pages
import StudentDashboard    from '../pages/student/StudentDashboard'
import StudentProfilePage  from '../pages/student/StudentProfilePage'
import UniversitiesPage    from '../pages/student/UniversitiesPage'
import ApplicationsPage    from '../pages/student/ApplicationsPage'
import DocumentsPage       from '../pages/student/DocumentsPage'
import ServicesPage        from '../pages/student/ServicesPage'
import BookingsPage        from '../pages/student/BookingsPage'
import SubscriptionPage    from '../pages/student/SubscriptionPage'

// Provider pages
import ProviderDashboard    from '../pages/provider/ProviderDashboard'
import MyServicesPage       from '../pages/provider/MyServicesPage'
import AppointmentsPage     from '../pages/provider/AppointmentsPage'
import ReviewsPage          from '../pages/provider/ReviewsPage'
import ProviderProfilePage  from '../pages/provider/ProviderProfilePage'

// Admin pages
import AdminDashboard          from '../pages/admin/AdminDashboard'
import ManageStudentsPage      from '../pages/admin/ManageStudentsPage'
import ManageProvidersPage     from '../pages/admin/ManageProvidersPage'
import ManageUniversitiesPage  from '../pages/admin/ManageUniversitiesPage'
import ManageApplicationsPage  from '../pages/admin/ManageApplicationsPage'
import ManageSubscriptionsPage from '../pages/admin/ManageSubscriptionsPage'
import ReportsPage             from '../pages/admin/ReportsPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/about"    element={<AboutPage />} />
      <Route path="/contact"  element={<ContactPage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Student */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
        <Route path="/student/dashboard"    element={<StudentDashboard />} />
        <Route path="/student/profile"      element={<StudentProfilePage />} />
        <Route path="/student/universities" element={<UniversitiesPage />} />
        <Route path="/student/applications" element={<ApplicationsPage />} />
        <Route path="/student/documents"    element={<DocumentsPage />} />
        <Route path="/student/services"     element={<ServicesPage />} />
        <Route path="/student/bookings"     element={<BookingsPage />} />
        <Route path="/student/subscription" element={<SubscriptionPage />} />
      </Route>

      {/* Provider */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.PROVIDER]} />}>
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/provider/services"  element={<MyServicesPage />} />
        <Route path="/provider/appointments" element={<AppointmentsPage />} />
        <Route path="/provider/reviews"   element={<ReviewsPage />} />
        <Route path="/provider/profile"   element={<ProviderProfilePage />} />
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="/admin/dashboard"      element={<AdminDashboard />} />
        <Route path="/admin/students"       element={<ManageStudentsPage />} />
        <Route path="/admin/providers"      element={<ManageProvidersPage />} />
        <Route path="/admin/universities"   element={<ManageUniversitiesPage />} />
        <Route path="/admin/applications"   element={<ManageApplicationsPage />} />
        <Route path="/admin/subscriptions"  element={<ManageSubscriptionsPage />} />
        <Route path="/admin/reports"        element={<ReportsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
