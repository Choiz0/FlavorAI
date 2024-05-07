import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProfileLogo from "./ProfileLogo";
const Navbar = () => {
  const [hambergerOpen, setHambergerOpen] = useState(false);

  const { auth } = useAuth();

  const navigate = useNavigate();
  const NAVLIST = [
    ["AI Search Recipe", "/"],
    ["My Recipe", "/myrecipe"],
    ["Add New Recipe", "/addNewRecipe"],
  ];
  return (
    <nav className="bg-lavender shadow w-full  fixed  z-10 mb-2">
      <div className="lg:px-8 py-2 px-3">
        <div className=" lg:h-16  sm:h-12 h-10  flex lg:justify-between   justify-between items-center  ">
          <div className={`flex items-center lg:w-2/3`}>
            <Link className="flex-none " to="/">
              <img
                className="sm:w-[100px] sm:h-[100px] w-[80px] lg:w-[130px] lg:h-[130px]"
                src={logo}
                alt="logo"
              />
            </Link>
            {auth.currentUser ? (
              <div className="hidden md:block  ">
                <div
                  className={`flex items-baseline ml-20 lg:space-x-12 md:items-center  ${
                    !auth.currentUser ? "hidden" : ""
                  } `}
                >
                  {NAVLIST.map((item, i) => (
                    <Link
                      key={i}
                      className="text-navy min-w-36 md:text-xl md:text-center  lg:text-2xl border-4 border-transparent hover:drop-shadow-lg hover:shadow-white-50 transition-all hover:border-b-lightblue py-2 text-md font-medium"
                      to={item[1]}
                    >
                      {item[0]}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="md:flex hidden ">
            <ProfileLogo />
          </div>
          <div className="flex  md:hidden">
            <button
              onClick={() => setHambergerOpen(!hambergerOpen)}
              className={`text-gray-800  hover:text-gray-300 inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${
                auth.currentUser ? "" : "hidden"
              }`}
            >
              {!hambergerOpen ? (
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="md:w-8 md:h-8 w-6 h-6"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z"></path>
                </svg>
              ) : (
                <svg
                  className="md:w-8 md:h-8 w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="md:hidden ">
        {hambergerOpen && (
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 divide-y-2 divide-slate-100 ">
            <div className="flex gap-2 justify-end pr-4 z-1000 ">
              {" "}
              {auth.currentUser?.photoURL ? (
                <img
                  className="lg:h-12 lg:w-12 h-6 w-6 rounded-full"
                  src={auth.currentUser.photoURL}
                  alt=""
                />
              ) : (
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* SVG path data */}
                </svg>
              )}
              <>{auth.currentUser.displayName}</>
            </div>
            {NAVLIST.map((item, i) => (
              <Link
                key={i}
                className="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2  text-base "
                onClick={() => setHambergerOpen(false)}
                to={item[1]}
              >
                {item[0]}
              </Link>
            ))}

            <ProfileLogo mobile="true" />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
