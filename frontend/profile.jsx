"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "", bio: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      // Simulate fetching user data
      setUser({ username: "johndoe", email: "john@example.com", bio: "Freelance developer" });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Simulate saving profile
    console.log("Profile saved:", user);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">My Profile</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <Input
                name="username"
                value={user.username}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                name="email"
                value={user.email}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <Input
                name="bio"
                value={user.bio}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <Button onClick={handleSave} className="mt-4 w-full">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
