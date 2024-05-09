import React from "react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const ProfileLogo = ({ mobile }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      toast.error("Logout Failed");
    }
  };
  const userFromStorage = localStorage.getItem("user");
  const userPhotoUrl = userFromStorage
    ? JSON.parse(userFromStorage).photoURL
    : null;
  const imageUrl = auth.currentUser?.photoURL || userPhotoUrl;

  return (
    <div className="md:flex items-center w-full md:justify-end">
      <div className="relative">
        {mobile ? (
          // Mobile version: Simple text link
          <div className="flex justify-between items-center">
            <Link
              to="#"
              onClick={handleLogout}
              className="block px-4 py-2 lg:text-lg text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
            >
              Logout
            </Link>
          </div>
        ) : (
          // Default version: Button with dropdown
          <>
            <button
              type="button"
              className={`flex px-1 items-center  md:justify-center w-full rounded-md ${
                auth.currentUser ? "md:px-4" : "bg-transparent"
              } md:py-2`}
              id="options-menu"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="lg:text-xl text-navy m-2">
                {auth.currentUser && auth.currentUser.displayName
                  ? auth.currentUser?.displayName || auth.currentUser?.email
                  : ""}
              </div>
              {auth.currentUser?.photoURL ? (
                <img
                  className="lg:h-8 lg:w-8 h-6 w-6 rounded-full"
                  src={imageUrl}
                  alt=""
                />
              ) : (
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <svg
                    className="h-8 w-8 text-slate-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {" "}
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />{" "}
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </svg>
              )}
            </button>

            {profileOpen && (
              <div className="absolute right-0 lg:w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg  ">
                {auth.currentUser ? (
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <Link
                      to="#"
                      className="block px-4 py-2 lg:text-lg text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      Logout
                    </Link>
                  </div>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileLogo;
