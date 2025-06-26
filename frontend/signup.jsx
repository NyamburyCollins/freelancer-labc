"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "freelancer", // or "client"
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Signup failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token); // store JWT
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Sign Up</h1>
          {error && <p className="text-red-600">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="username" placeholder="Username" onChange={handleChange} required />
            <Input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <Input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <Input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
