import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { loginUser } from "../../service/apiService";
import { useNavigate } from "react-router-dom";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();


  const handleLogin = () => {
    loginUser(username, password)
      .then((response) => {
        localStorage.setItem("token", response.token);
        navigate("/");
      })
  }

  return (
    <div className="lg:w-[1200px] sm:w-full px-4 pt-48 mx-auto flex flex-col items-center justify-center">
      <h2>Login</h2>
      <div className="w-auto max-w-[400px] flex flex-col items-center p-4 justify-center gap-8">
        <Input
          type="text"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button color="primary" className="w-full" onClick={handleLogin}>
          Login
        </Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;