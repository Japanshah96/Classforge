import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear token and update login state
    localStorage.removeItem("token");
    setIsLoggedIn(false);

    // Redirect to login
    navigate("/login");
  }, [navigate, setIsLoggedIn]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg text-gray-700">Logging out...</p>
    </div>
  );
};

export default Logout;
