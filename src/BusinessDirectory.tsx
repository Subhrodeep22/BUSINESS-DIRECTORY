"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Building2, Users, Package, Wrench, Phone, Mail, MapPin, Loader2 } from "lucide-react"

interface Business {
  id: string
  name: string
  description: string
  email: string
  phone: string
  address: string
  category: "product" | "service"
  createdAt: string
}

type View = "home" | "user" | "business" | "products" | "services"

export default function BusinessDirectory() {
  const [currentView, setCurrentView] = useState<View>("home")
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    category: "" as "product" | "service" | "",
  })

  // Load businesses on component mount
  useEffect(() => {
    loadBusinesses()
  }, [])

  const loadBusinesses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/businesses')
      const data = await response.json()
      setBusinesses(data)
    } catch (error) {
      console.error('Error loading businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || !formData.email || !formData.category) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const newBusiness = await response.json()
        setBusinesses([...businesses, newBusiness])
        setFormData({ name: "", description: "", email: "", phone: "", address: "", category: "" })
        alert("Business added successfully!")
        setCurrentView("home")
      } else {
        alert("Failed to add business")
      }
    } catch (error) {
      alert("Error adding business")
    } finally {
      setSubmitting(false)
    }
  }

  const productBusinesses = businesses.filter((b) => b.category === "product")
  const serviceBusinesses = businesses.filter((b) => b.category === "service")

  // Grid display component for businesses
  const BusinessGrid = ({ businesses, type }: { businesses: Business[], type: string }) => {
    if (businesses.length === 0) {
      return (
        <Card>
          <CardContent className="text-center py-8">
            {type === "product" ? 
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" /> : 
              <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            }
            <p className="text-gray-500 mb-4">No {type} businesses found.</p>
            <Button onClick={() => setCurrentView("business")}>Add First Business</Button>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-4 font-semibold text-gray-700">Business Name</th>
              <th className="text-left p-4 font-semibold text-gray-700">Description</th>
              <th className="text-left p-4 font-semibold text-gray-700">Contact</th>
              <th className="text-left p-4 font-semibold text-gray-700">Address</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((business) => (
              <tr key={business.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {business.category === "product" ? 
                      <Package className="h-5 w-5 text-purple-600" /> : 
                      <Wrench className="h-5 w-5 text-orange-600" />
                    }
                    <div>
                      <div className="font-semibold text-gray-900">{business.name}</div>
                      <div className="text-sm text-gray-500 capitalize">{business.category}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-gray-700 line-clamp-2 max-w-xs">
                    {business.description}
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{business.email}</span>
                    </div>
                    {business.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{business.phone}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  {business.address ? (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-700">{business.address}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No address provided</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Business Directory</h1>
          <p className="text-gray-600">Connect businesses with customers</p>
        </div>

        {/* Back Button */}
        {currentView !== "home" && (
          <Button
            variant="outline"
            onClick={() => {
              if (currentView === "products" || currentView === "services") {
                setCurrentView("user")
              } else {
                setCurrentView("home")
              }
            }}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}

        {/* Home View */}
        {currentView === "home" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView("business")}>
              <CardHeader className="text-center">
                <Building2 className="h-16 w-16 mx-auto text-blue-600 mb-4" />
                <CardTitle className="text-2xl">Business</CardTitle>
                <CardDescription>Register your business</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">Add Your Business</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView("user")}>
              <CardHeader className="text-center">
                <Users className="h-16 w-16 mx-auto text-green-600 mb-4" />
                <CardTitle className="text-2xl">User</CardTitle>
                <CardDescription>Browse businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">Browse Directory ({businesses.length})</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User View */}
        {currentView === "user" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView("products")}>
              <CardHeader className="text-center">
                <Package className="h-16 w-16 mx-auto text-purple-600 mb-4" />
                <CardTitle className="text-2xl">Products</CardTitle>
                <CardDescription>Product businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">View Products ({productBusinesses.length})</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView("services")}>
              <CardHeader className="text-center">
                <Wrench className="h-16 w-16 mx-auto text-orange-600 mb-4" />
                <CardTitle className="text-2xl">Services</CardTitle>
                <CardDescription>Service businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">View Services ({serviceBusinesses.length})</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Business Form */}
        {currentView === "business" && (
          <Card>
            <CardHeader>
              <CardTitle>Register Your Business</CardTitle>
              <CardDescription>Fill out the form to add your business</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Business Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter business name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: "product" | "service") => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">Product Business</SelectItem>
                        <SelectItem value="service">Service Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your business"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="business@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Business St, City, State"
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? "Adding..." : "Register Business"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products View with Grid */}
        {currentView === "products" && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Package className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold">Product Businesses</h2>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {productBusinesses.length} businesses
              </span>
            </div>
            <BusinessGrid businesses={productBusinesses} type="product" />
          </div>
        )}

        {/* Services View with Grid */}
        {currentView === "services" && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Wrench className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-bold">Service Businesses</h2>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {serviceBusinesses.length} businesses
              </span>
            </div>
            <BusinessGrid businesses={serviceBusinesses} type="service" />
          </div>
        )}
      </div>
    </div>
  )
}
