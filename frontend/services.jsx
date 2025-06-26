"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    // Simulate fetching services
    setServices([
      { id: 1, title: "Logo Design", category: "Design", description: "Need a logo for my startup." },
      { id: 2, title: "Blog Writing", category: "Writing", description: "Need weekly blog posts." },
      { id: 3, title: "Web Development", category: "Dev", description: "Build a freelance website." },
    ]);
  }, [navigate]);

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || s.category === category)
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Browse Services</h1>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
        <Input
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs"
        />
        <Select onValueChange={setCategory} defaultValue="">
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Writing">Writing</SelectItem>
            <SelectItem value="Dev">Dev</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((service) => (
          <Card key={service.id} className="shadow hover:shadow-lg transition cursor-pointer" onClick={() => navigate(`/services/${service.id}`)}>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{service.title}</h2>
              <p className="text-sm text-gray-500 mb-2">Category: {service.category}</p>
              <p className="text-gray-700">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
