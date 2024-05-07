import { useEffect, useState } from "react";
import food from "../assets/food.png";
import styles from "../styles";
import CustomButton from "../components/Button";
import Login from "../components/Login";
import Register from "../components/Register";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Intro = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/homepage");
    }
  }, [currentUser, navigate]);

  const handleLogin = () => {
    setLoginOpen(loginOpen ? false : true);
    setRegisterOpen(false);
  };
  const handleRegister = () => {
    setRegisterOpen(registerOpen ? false : true);
    setLoginOpen(false);
  };
  return (
    <div className="container mx-auto ">
      <div className="dark:bg-gray-800 bg-white md:mt-40 mt-10 mx-4 shadow-lg rounded-lg md:items-start md:max-h-[1000px]">
        <div className="flex justify-center md:pt-20 p-2 mx-auto md:flex-row lg:px-8 flex-col">
          <div className="flex  text-center lg:text-left ">
            <div className="space-y-10 ">
              <div>
                <div className="mb-1 text-md font-bold uppercase tracking-wider text-dark">
                  Get Started
                </div>
                <h2 className="mb-4 text-4xl font-black text-black md:text-6xl leading-relaxed">
                  Embark on your culinary journey{" "}
                  <sapn className="text-blue-600 dark:text-blue-500 ">
                    Today!
                  </sapn>
                </h2>
                <h3 className="text-xl  md:text-2xl font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                  Just enter your ingredients and let our{" "}
                  <strong className="bg-lightblue p-1 rounded">
                    Google Gemini AI
                  </strong>{" "}
                  based app recommend delicious recipes instantly. Experience
                  amazing cooking from day one without the hassle. Set up your
                  custom recipe dashboard and start building incredible culinary
                  services.
                </h3>
              </div>
              <div
                className={`
  ${styles.flexCenter} 
gap-4
md:gap-8
md:justify-start
 
`}
              >
                <div>
                  <CustomButton
                    onClick={handleRegister}
                    color="#08D9D6"
                    width="200px"
                  >
                    Create Account
                  </CustomButton>
                </div>

                <div>
                  <CustomButton onClick={handleLogin}>Login</CustomButton>
                </div>
              </div>
            </div>
          </div>
          <div className="  text-blue-500 lg:justify-end lg:min-w-[600px] md:max-h-[600px] ">
            <img src={food} alt="food" className="w-full h-full" />
          </div>
        </div>
      </div>
      {loginOpen && (
        <Login handleLogin={handleLogin} handleRegister={handleRegister} />
      )}
      {registerOpen && (
        <Register handleLogin={handleLogin} handleRegister={handleRegister} />
      )}
    </div>
  );
};

export default Intro;
