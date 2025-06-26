"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data or verify auth token here
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardContent className="p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-center text-gray-600">
            Here you can manage your profile, view or post services, and track applications.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <h2 className="text-xl font-semibold text-blue-700 mb-2">My Profile</h2>
              <p className="text-gray-600">Edit your personal info and preferences.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <h2 className="text-xl font-semibold text-green-700 mb-2">My Services</h2>
              <p className="text-gray-600">View, post, or manage your service listings.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <h2 className="text-xl font-semibold text-purple-700 mb-2">Applications</h2>
              <p className="text-gray-600">Track your sent and received applications.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
