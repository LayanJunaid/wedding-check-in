import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Weddings from "./pages/Weddings";
import WeddingDetail from "./pages/WeddingDetail";
import Scanner from "./pages/Scanner";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/weddings" />} />
          <Route
            path="/weddings"
            element={
              <ProtectedRoute roles={["admin", "superadmin"]}>
                <Weddings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/weddings/:id"
            element={
              <ProtectedRoute roles={["admin", "superadmin"]}>
                <WeddingDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scan"
            element={
              <ProtectedRoute roles={["admin", "superadmin", "security"]}>
                <Scanner />
              </ProtectedRoute>
            }
          />
          <Route path="/scanner" element={<Scanner />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
