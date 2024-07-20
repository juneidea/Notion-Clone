// import { jwtDecode } from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import api from "../app/api";

export const useDjangoAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp!!;
    const now = Date.now() / 1000;
    if (tokenExpiration > now) {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  };

  return { isAuthenticated, isLoading, auth, checkToken };
};
