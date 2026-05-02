import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/User/Home";
import Products from "./pages/User/Products";
import UserLogin from "./pages/User/UserLogin";
import UserSignup from "./pages/User/UserSignup";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddProduct from "./pages/Admin/AddProduct";
import EditProduct from "./pages/Admin/EditProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add" element={<AddProduct />} />
        <Route path="/admin/edit/:id" element={<EditProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;