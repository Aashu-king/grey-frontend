import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingCart, Package, ChevronLeft, Menu, Bell, LogOut } from 'lucide-react'
import { CartCount } from './cart/cartCount'
import axios from 'axios'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Products', icon: Package, href: '/products' },
    {
      name: 'Cart',
      icon: ShoppingCart,
      href: '/cart',
      withCount: true
    },
  ]

  const handleLogout = async () => {
    try {

      localStorage.removeItem('token')

      delete axios.defaults.headers.common['Authorization']

      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
      // Fallback cleanup if API call fails
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      navigate('/')
    }
  }
  return (
    <div className="flex h-screen bg-gray-50">
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed z-30 flex flex-col h-full bg-white shadow-lg transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-64' : 'w-20'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen ? (
            <div className="flex items-center">
              <div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold">
                D
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-800">DashStore</span>
            </div>
          ) : (
            <div className="h-8 w-8 bg-indigo-600 rounded-md mx-auto flex items-center justify-center text-white font-bold">
              D
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          <nav className="flex-1 overflow-y-auto py-2">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center p-3 rounded-lg text-sm font-medium relative
                    ${location.pathname.startsWith(item.href)
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                  `}
                  >
                    <div className="relative">
                      <item.icon className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                      {item.withCount && <CartCount />}
                    </div>
                    {sidebarOpen && item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>


          <div className="p-4 border-t border-gray-200 mt-auto">
            <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
              {sidebarOpen && (
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <span className="text-sm font-medium">JD</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">John Doe</p>
                    <p className="text-xs font-medium text-gray-500">Admin</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
      `}>
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">


            <button
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 flex justify-between items-center">
              <div className="flex items-center max-w-md w-full">
              </div>

              <div className="flex items-center space-x-4">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                <Link
                  to="/cart"
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 relative"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <CartCount />
                </Link>
                <div className="relative">
                  <button className="flex items-center space-x-2">
                    <span className="hidden lg:block text-sm font-medium text-gray-700">John Doe</span>
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <span className="text-sm font-medium">JD</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}