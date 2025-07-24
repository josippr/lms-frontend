import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginUser, fetchProfile } from "../../service/apiService";
import { setIsLoggedIn } from "../../redux/actions/general";
import { setProfile, setProfileLoaded } from "../../redux/actions/profile";
import { setTheme } from "@/redux/actions/config";

function Login({ className, ...props }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(username, password);
      if (!response?.token) throw new Error("Invalid response from server.");

      localStorage.setItem("token", response.token);
      dispatch(setIsLoggedIn(true));

      const profileResponse = await fetchProfile(response.token);
      if (!profileResponse) throw new Error("Failed to fetch user profile.");

      dispatch(
        setProfile({
          username: profileResponse.username || "",
          email: profileResponse.email ?? "",
          language: profileResponse.language,
          theme: profileResponse.darkMode ? "dark" : "light",
          routes: profileResponse.routes || [],
          notificationPreferences: profileResponse.notificationPreferences,
          licenseExpirationDate: profileResponse.license?.expiryDate || null,
          linkedNodes: profileResponse.linkedNodes || [],
        })
      );
      dispatch(setTheme(profileResponse.darkMode ? "dark" : "light"));
      dispatch(setProfileLoaded(true));
      navigate("/");
    } catch (err) {
      let message = "An unexpected error occurred. Please try again.";
      if (err.response?.data?.message) message = err.response.data.message;
      else if (err.message) message = err.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("text-foreground bg-background w-full h-full flex flex-col gap-6 justify-center items-center min-h-screen p-6", className)} {...props}>
      <Card className="w-full max-w-md p-6">
        <CardHeader className={"w-full max-w-md p-6"}>
          <h1 className="w-full max-w-sm text-2xl font-bold mb-8">Live Network Monitoring System</h1>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your credentials below to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="your-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 mt-[-8px] -mb-2">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;