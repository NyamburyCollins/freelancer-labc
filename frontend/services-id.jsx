"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      // Simulate fetch
      setService({
        id,
        title: "Logo Design",
        description: "Need a clean and modern logo for our startup.",
        budget: 150,
        client: "johndoe",
        status: "open",
        category: "Design"
      });
    }
  }, [id, navigate]);

  const handleApply = () => {
    setHasApplied(true);
    alert("Application submitted!");
  };

  if (!service) return <div className="text-center mt-20 text-gray-600">Loading service...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <Card className="w-full max-w-3xl shadow-md">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{service.title}</h1>
          <p className="text-gray-700 mb-2">{service.description}</p>
          <p className="text-gray-500 text-sm mb-1">Category: {service.category}</p>
          <p className="text-gray-500 text-sm mb-1">Budget: ${service.budget}</p>
          <p className="text-gray-500 text-sm mb-4">Posted by: {service.client}</p>

          <Button 
            onClick={handleApply} 
            disabled={hasApplied} 
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {hasApplied ? "Application Sent" : "Apply for this Service"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
