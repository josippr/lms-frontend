import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Input, Button } from "@heroui/react";
import { loginUser, fetchProfile } from "../../service/apiService";
import { useNavigate } from "react-router-dom";
import { setIsLoggedIn } from "../../redux/actions/general";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(username, password);
      
      if (!response?.token) {
        throw new Error("Invalid response from server.");
      }

      localStorage.setItem("token", response.token);
      dispatch(setIsLoggedIn(true));

      // after successful login, fetch user profile
      const profileResponse = await fetchProfile(response.token);
      if (!profileResponse) {
        throw new Error("Failed to fetch user profile.");
      }
      //TODO store profile information in redux profile
      // log response to console for debugging
      console.log("User Profile:", profileResponse);

      navigate("/");
    } catch (err) {
      // Fallback message
      let message = "An unexpected error occurred. Please try again.";

      // Check for known error structures
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:w-full sm:w-full h-auto px-4 pt-48 m-auto flex flex-col items-center justify-center gap-12">
      <h2>Login</h2>
      <div className="w-auto max-w-1xl h-auto flex flex-col items-center p-4 justify-center gap-8">
        <Input
          type="text"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <Button
          color="primary"
          className="w-full"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;