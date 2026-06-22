import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import EditProduct from "./pages/EditProduct";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "₹";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [token]);

  return (
    <div className="min-h-screen w-full">
      <ToastContainer />

      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />

          <div className="flex w-full gap-10 h-[calc(100vh-73px)] overflow-hidden">
            <Sidebar />

            {/* <div className="py-5 w-full overflow-y-auto pr-4"> */}
            <div className="py-5 w-full min-w-0 overflow-y-auto pr-4">
              <Routes>
                <Route path="/" element={<Navigate to="/list" replace />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/edit/:id" element={<EditProduct token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="*" element={<Navigate to="/list" replace />} />
              </Routes>
            </div>
          </div>
        </>

      )}
    </div>
  );
};

export default App;
