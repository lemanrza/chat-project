import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  useEffect(() => {
    if (token) {
      try {
        localStorage.setItem("token", JSON.stringify(token));
        toast.success("Login successful!");

        navigate("/app/feed");
      } catch (err) {
        console.log("error: ", err);
        toast.error("Invalid token. Please try logging in again.");
        navigate("/auth/login");
      }
    } else {
      toast.error("Token not found. Please try logging in again.");
      navigate("/auth/login");
    }
  }, [navigate, token]);

  return <div className="text-center mt-10 text-gray-600">Redirecting...</div>;
};

export default AuthCallback;
