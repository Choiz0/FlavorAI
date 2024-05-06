import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Loading from "../components/Loading";

const AuthContext = createContext(null); // Provide a default value

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          photoURL: user.photoURL,
          displayName: user.displayName,
        };
        setCurrentUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        setCurrentUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />; // 로딩 컴포넌트 또는 로딩 표시
  }
  return (
    <AuthContext.Provider value={{ currentUser, auth }}>
      {children}
    </AuthContext.Provider>
  );
};
