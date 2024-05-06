import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  auth.useDeviceLanguage();

  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      toast.success("Success to Login with Google !", {
        position: "top-center",
      });
      navigate("/homepage");
    })
    .catch((error) => {
      // Handle Errors here.

      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      toast.error(`Failed to Login with Google: ${error.message}`, {
        position: "top-center",
      });
    });
  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export default GoogleLogin;
