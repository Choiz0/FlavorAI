import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

import { useEffect } from "react";
import Footer from "./Footer";
function Layout() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  return (
    <div className=" w-screen h-screen  min-w-[312px] ">
      <Navbar /> :
      <main className="lg:pt-36 flex  w-screen justify-center min-h-[94%]  min-w-[312px] printContent  bg-slate-50 ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
