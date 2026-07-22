import { Link } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";

export default function Home() {
  const { isAuthenticated, role } = useAuth();

  const dashboardPath = role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient";
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-white">
      <header className="px-6 lg:px-16 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-800">MedicWait</span>
        </div>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              to={dashboardPath}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              Ir al Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="text-gray-600 hover:text-emerald-600 font-medium transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/auth/create-account"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <section className="px-6 lg:px-16 pt-20 pb-24 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Gestión médica simplificada
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Tu salud,{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-500">
                  nuestra prioridad
                </span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                MedicWait optimiza la gestión de citas médicas, permitiendo a
                doctores y pacientes conectarse de manera eficiente. Agenda,
                reprograma y gestiona tus consultas desde cualquier lugar.
              </p>

              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Link
                    to={dashboardPath}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-colors shadow-lg shadow-emerald-200"
                  >
                    Ir al Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/auth/create-account"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-colors shadow-lg shadow-emerald-200"
                    >
                      Comenzar ahora
                    </Link>
                    <Link
                      to="/auth/login"
                      className="border-2 border-gray-200 hover:border-emerald-500 text-gray-700 hover:text-emerald-600 px-8 py-3.5 rounded-xl font-semibold text-lg transition-colors"
                    >
                      Ya tengo cuenta
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />

              <div className="relative bg-white rounded-2xl shadow-xl shadow-emerald-100/50 p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">
                      DR
                    </div>
                    <div className="w-10 h-10 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">
                      LP
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">
                      MC
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">Próximas citas</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-emerald-50 rounded-xl">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-bold">
                      10
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        Dra. María López
                      </div>
                      <div className="text-sm text-gray-500">
                        08:00 am - Consulta general
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-teal-50 rounded-xl">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 font-bold">
                      11
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        Dr. Carlos Ruiz
                      </div>
                      <div className="text-sm text-gray-500">
                        10:30 am - Cardiología
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-emerald-50 rounded-xl">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-bold">
                      14
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        Dra. Ana Torres
                      </div>
                      <div className="text-sm text-gray-500">
                        03:00 pm - Pediatría
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 lg:px-16 py-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Todo lo que necesitas en un solo lugar
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Una plataforma completa para la gestión de citas médicas,
                diseñada tanto para profesionales de la salud como para
                pacientes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-emerald-50 rounded-2xl p-8 transition-shadow hover:shadow-lg">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                  <svg
                    className="w-7 h-7 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Agenda inteligente
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Programa y gestiona tus citas médicas de forma rápida.
                  Visualiza la disponibilidad en tiempo real y evita conflictos
                  de horario.
                </p>
              </div>

              <div className="bg-teal-50 rounded-2xl p-8 transition-shadow hover:shadow-lg">
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-5">
                  <svg
                    className="w-7 h-7 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Historial clínico
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Accede al historial médico completo de tus pacientes. Registra
                  diagnósticos, recetas y documentos importantes de forma
                  segura.
                </p>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-8 transition-shadow hover:shadow-lg">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                  <svg
                    className="w-7 h-7 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Datos seguros
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Tus datos y los de tus pacientes están protegidos con los más
                  altos estándares de seguridad y encriptación.
                </p>
              </div>

              <div className="bg-teal-50 rounded-2xl p-8 transition-shadow hover:shadow-lg">
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-5">
                  <svg
                    className="w-7 h-7 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Notificaciones
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Recibe recordatorios automáticos de tus citas. Nunca más
                  olvides una consulta médica importante.
                </p>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-8 transition-shadow hover:shadow-lg">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                  <svg
                    className="w-7 h-7 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 006 0m-6 0a2 2 0 006 0m-2-6h.01M13 7h.01M13 11h.01M13 15h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Gestión de slots
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Define tus bloques de disponibilidad de manera flexible. Los
                  pacientes solo verán horarios disponibles para agendar.
                </p>
              </div>

              <div className="bg-teal-50 rounded-2xl p-8 transition-shadow hover:shadow-lg">
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-5">
                  <svg
                    className="w-7 h-7 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Pacientes
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Administra tu lista de pacientes con su información de
                  contacto y historial de consultas de manera organizada.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 lg:px-16 py-24 max-w-7xl mx-auto">
          <div className="bg-linear-to-br from-emerald-600 via-teal-600 to-emerald-800 rounded-3xl p-12 lg:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                ¿Listo para transformar tu práctica médica?
              </h2>
              <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                Únete a MedicWait y descubre cómo la tecnología puede
                simplificar la gestión de tu consultorio médico.
              </p>
              {isAuthenticated ? (
                <Link
                  to={dashboardPath}
                  className="inline-block bg-white text-emerald-700 hover:bg-emerald-50 px-10 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg"
                >
                  Ir al Dashboard
                </Link>
              ) : (
                <Link
                  to="/auth/create-account"
                  className="inline-block bg-white text-emerald-700 hover:bg-emerald-50 px-10 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg"
                >
                  Crear cuenta gratuita
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <span className="font-semibold text-gray-700">MedicWait</span>
          </div>

          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} MedicWait. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
