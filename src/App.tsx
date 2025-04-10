import { Route, Routes } from "react-router-dom"
import Login from "./authentication/Login"
import Register from "./authentication/Register"
import DashboardPage from "./components/dashboard"
import DashboardLayout from "./components/layout"
import ProductsPage from "./components/products/product"
import ProductDetail from "./components/products/productDetails"
import { AuthProvider } from "./context/auth.context"
import { CartPage } from "./components/cart/cart"

const App = () => {
  return (

    <>
      <AuthProvider>

        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>
        </Routes>
      </AuthProvider>

    </>
  )
}

export default App