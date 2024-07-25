import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import api from "../app/api";

export const useDjangoAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const defaultUser = { id: -1, username: "" };
  const [user, setUser] = useState(defaultUser);

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser();
    }
  }, [isAuthenticated]);

  const auth = async (
    e: React.FormEvent<HTMLFormElement>,
    modal: HTMLDialogElement | null
  ) => {
    const formData = new FormData(e.currentTarget);
    try {
      setIsLoading(true);
      const res = await api.post("/api/token/", {
        username: formData.get("username"),
        password: formData.get("password"),
      });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      setIsAuthenticated(true);
      setIsLoading(false);
      modal?.close();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "there is an error";
      if (errorMsg.includes("401")) {
        alert("incorrect username or password");
      } else {
        alert(errorMsg);
      }
      setIsLoading(false);
    }
  };

  const checkToken = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("access");
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    if (isTokenActive(token)) {
      setIsAuthenticated(true);
    } else {
      await checkRefreshToken();
      const secondToken = localStorage.getItem("access");
      if (secondToken && isTokenActive(secondToken)) {
        setIsAuthenticated(true);
      }
    }
    setIsLoading(false);
  };

  const isTokenActive = (token: string) => {
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp!!;
    const now = Date.now() / 1000;
    return tokenExpiration > now;
  };

  const checkRefreshToken = async () => {
    const refresh = localStorage.getItem("refresh");
    try {
      const res = await api.post("/api/token/refresh/", { refresh });
      localStorage.setItem("access", res.data.access);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "there is an error";
      if (!errorMsg.includes("401")) {
        alert(errorMsg);
      }
    }
  };

  const getCurrentUser = async () => {
    try {
      const res = await api.get("/api/user/");
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("refresh");
    localStorage.removeItem("access");
  };

  return { isAuthenticated, isLoading, user, auth, checkToken, logout };
};
