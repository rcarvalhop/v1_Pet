"use client"

import { useState } from "react"
import { Plus, Calendar, FileText, Stethoscope, PawPrint, Bell, Menu, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PetRegistration from "@/components/pet-registration"
import VaccineRecord from "@/components/vaccine-record"
import VetProfile from "@/components/vet-profile"
import AppointmentScheduler from "@/components/appointment-scheduler"
import MedicationManager from "@/components/medication-manager"
import NotificationCenter from "@/components/notification-center"
import QuickConfirmation from "@/components/quick-confirmation"
import React from "react"
import { VaccinationProtocols } from "@/components/vaccination-protocols"
import { TravelCertificates } from "@/components/travel-certificates"
import { NutritionalPlan } from "@/components/nutritional-plan"

interface Pet {
  id: string
  name: string
  species: "dog" | "cat"
  breed: string
  birthDate: string
  weight: number
  owner: string
  photo?: string
  activityLevel?: "low" | "moderate" | "high"
  neutered?: boolean
  healthConditions?: string[]
}

interface Vaccine {
  id: string
  petId: string
  name: string
  date: string
  nextDue: string
  veterinarian: string
  batch: string
  notes?: string
}

interface Appointment {
  id: string
  petId: string
  date: string
  time: string
  type: string
  veterinarian: string
  notes?: string
}

interface Medication {
  id: string
  petId: string
  name: string
  type: "prescription" | "preventive"
  category: "antibiotic" | "anti-inflammatory" | "flea-tick" | "deworming" | "heartworm" | "other"
  dosage: string
  frequency: string
  startDate: string
  endDate: string
  veterinarian: string
  notes?: string
  isActive: boolean
}

interface Notification {
  id: string
  type: "vaccine_overdue" | "medication_reminder" | "appointment_reminder"
  petId: string
  title: string
  message: string
  date: string
  isRead: boolean
  priority: "low" | "medium" | "high"
}

interface VaccinationProtocol {
  id: string
  species: "dog" | "cat"
  ageGroup: "puppy" | "adult" | "senior"
  vaccines: {
    name: string
    type: "core" | "non-core"
    ageWeeks: number[]
    description: string
    required: boolean
  }[]
}

interface TravelCertificate {
  id: string
  petId: string
  destination: string
  departureDate: string
  vaccines: string[]
  veterinarian: string
  clinic: string
  crmv: string
  issueDate: string
  validUntil: string
  qrCode: string
  certificateNumber: string
}

interface PendingVaccine {
  id: string
  petId: string
  vaccineName: string
  dueDate: string
  type: "vaccine" | "medication"
  veterinarian: string
  clinic: string
  priority: "high" | "medium" | "low"
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [pets, setPets] = useState<Pet[]>([
    {
      id: "1",
      name: "Rex",
      species: "dog",
      breed: "Golden Retriever",
      birthDate: "2022-03-15",
      weight: 25.5,
      owner: "João Silva",
      activityLevel: "high",
      neutered: true,
      healthConditions: [],
    },
    {
      id: "2",
      name: "Mimi",
      species: "cat",
      breed: "Persa",
      birthDate: "2021-08-20",
      weight: 4.2,
      owner: "Maria Santos",
      activityLevel: "low",
      neutered: true,
      healthConditions: ["obesidade"],
    },
  ])

  const [vaccines, setVaccines] = useState<Vaccine[]>([
    {
      id: "1",
      petId: "1",
      name: "V10 (Múltipla)",
      date: "2024-01-15",
      nextDue: "2025-01-15",
      veterinarian: "Dr. Carlos Mendes",
      batch: "VAC2024001",
    },
    {
      id: "2",
      petId: "1",
      name: "Antirrábica",
      date: "2024-02-10",
      nextDue: "2025-02-10",
      veterinarian: "Dr. Carlos Mendes",
      batch: "RAB2024005",
    },
    {
      id: "3",
      petId: "2",
      name: "Tríplice Felina",
      date: "2024-01-20",
      nextDue: "2025-01-20",
      veterinarian: "Dra. Ana Costa",
      batch: "FEL2024003",
    },
  ])

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      petId: "1",
      date: "2024-12-20",
      time: "14:00",
      type: "Reforço Vacinal",
      veterinarian: "Dr. Carlos Mendes",
    },
    {
      id: "2",
      petId: "2",
      date: "2024-12-22",
      time: "10:30",
      type: "Consulta de Rotina",
      veterinarian: "Dra. Ana Costa",
    },
  ])

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "1",
      petId: "1",
      name: "Bravecto",
      type: "preventive",
      category: "flea-tick",
      dosage: "1 comprimido",
      frequency: "A cada 3 meses",
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      veterinarian: "Dr. Carlos Mendes",
      isActive: true,
    },
    {
      id: "2",
      petId: "2",
      name: "Amoxicilina",
      type: "prescription",
      category: "antibiotic",
      dosage: "250mg",
      frequency: "2x ao dia",
      startDate: "2024-01-10",
      endDate: "2024-01-20",
      veterinarian: "Dra. Ana Costa",
      isActive: false,
    },
  ])

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [protocols, setProtocols] = useState<VaccinationProtocol[]>([])
  const [certificates, setCertificates] = useState<TravelCertificate[]>([])
  const [nutritionalPlans, setNutritionalPlans] = useState([
    {
      id: "1",
      petId: "1",
      foodBrand: "Royal Canin",
      foodLine: "Golden Retriever Adult",
      dailyAmount: 320,
      mealsPerDay: 2,
      calories: 1280,
      protein: 23,
      fat: 12,
      fiber: 3.9,
      startDate: "2024-01-01",
      veterinarian: "Dr. Carlos Mendes",
      notes: "Ração específica para a raça, rica em EPA e DHA",
      supplements: ["Ômega 3"],
    },
    {
      id: "2",
      petId: "2",
      foodBrand: "Hill's",
      foodLine: "Prescription Diet r/d",
      dailyAmount: 45,
      mealsPerDay: 3,
      calories: 180,
      protein: 35,
      fat: 8.5,
      fiber: 11,
      startDate: "2024-01-01",
      veterinarian: "Dra. Ana Costa",
      notes: "Ração terapêutica para controle de peso",
      supplements: ["L-Carnitina"],
    },
  ])

  // Itens pendentes para confirmação rápida
  const [pendingItems, setPendingItems] = useState<PendingVaccine[]>([
    {
      id: "pending_1",
      petId: "1",
      vaccineName: "V10 (Múltipla)",
      dueDate: "2024-12-15",
      type: "vaccine",
      veterinarian: "Dr. Carlos Mendes",
      clinic: "Clínica Veterinária São Francisco",
      priority: "high",
    },
    {
      id: "pending_2",
      petId: "1",
      vaccineName: "Bravecto",
      dueDate: "2024-12-18",
      type: "medication",
      veterinarian: "Dr. Carlos Mendes",
      clinic: "Clínica Veterinária São Francisco",
      priority: "medium",
    },
    {
      id: "pending_3",
      petId: "2",
      vaccineName: "Tríplice Felina",
      dueDate: "2024-12-20",
      type: "vaccine",
      veterinarian: "Dra. Ana Costa",
      clinic: "Pet Care Clínica",
      priority: "medium",
    },
  ])

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const addPet = (pet: Omit<Pet, "id">) => {
    const newPet = { ...pet, id: Date.now().toString() }
    setPets([...pets, newPet])
  }

  const addVaccine = (vaccine: Omit<Vaccine, "id">) => {
    const newVaccine = { ...vaccine, id: Date.now().toString() }
    setVaccines([...vaccines, newVaccine])
  }

  const addAppointment = (appointment: Omit<Appointment, "id">) => {
    const newAppointment = { ...appointment, id: Date.now().toString() }
    setAppointments([...appointments, newAppointment])
  }

  const addMedication = (medication: Omit<Medication, "id">) => {
    const newMedication = { ...medication, id: Date.now().toString() }
    setMedications([...medications, newMedication])
  }

  const addNutritionalPlan = (plan: any) => {
    const newPlan = { ...plan, id: Date.now().toString() }
    setNutritionalPlans([...nutritionalPlans, newPlan])
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
  }

  // Função para confirmar vacina
  const handleConfirmVaccine = (confirmation: any) => {
    // Adicionar à lista de vacinas
    const newVaccine = {
      id: Date.now().toString(),
      petId: confirmation.petId,
      name: confirmation.name,
      date: confirmation.date,
      nextDue: confirmation.nextDue,
      veterinarian: confirmation.veterinarian,
      clinic: confirmation.clinic,
      batch: confirmation.batch,
      notes: confirmation.notes,
    }
    setVaccines([...vaccines, newVaccine])

    // Remover da lista de pendentes
    setPendingItems(pendingItems.filter((item) => item.id !== confirmation.id))

    // Criar notificação de sucesso
    const successNotification = {
      id: `success_${Date.now()}`,
      type: "vaccine_overdue" as const,
      petId: confirmation.petId,
      title: "Vacina Confirmada",
      message: `${confirmation.name} aplicada com sucesso. Próxima dose: ${new Date(confirmation.nextDue).toLocaleDateString("pt-BR")}`,
      date: new Date().toISOString(),
      isRead: false,
      priority: "low" as const,
    }
    setNotifications([...notifications, successNotification])
  }

  // Função para confirmar medicamento
  const handleConfirmMedication = (confirmation: any) => {
    // Atualizar medicamento existente ou criar novo
    const newMedication = {
      id: Date.now().toString(),
      petId: confirmation.petId,
      name: confirmation.name,
      type: "preventive" as const,
      category: "flea-tick" as const,
      dosage: "1 comprimido",
      frequency: "Conforme prescrição",
      startDate: confirmation.date,
      endDate: confirmation.nextDue,
      veterinarian: confirmation.veterinarian,
      notes: confirmation.notes,
      isActive: true,
    }
    setMedications([...medications, newMedication])

    // Remover da lista de pendentes
    setPendingItems(pendingItems.filter((item) => item.id !== confirmation.id))

    // Criar notificação de sucesso
    const successNotification = {
      id: `success_${Date.now()}`,
      type: "medication_reminder" as const,
      petId: confirmation.petId,
      title: "Medicamento Confirmado",
      message: `${confirmation.name} aplicado com sucesso. Próxima dose: ${new Date(confirmation.nextDue).toLocaleDateString("pt-BR")}`,
      date: new Date().toISOString(),
      isRead: false,
      priority: "low" as const,
    }
    setNotifications([...notifications, successNotification])
  }

  const generateNotifications = () => {
    const newNotifications: Notification[] = []
    const today = new Date()

    // Check for overdue vaccines
    vaccines.forEach((vaccine) => {
      const dueDate = new Date(vaccine.nextDue)
      if (dueDate < today) {
        const pet = pets.find((p) => p.id === vaccine.petId)
        const daysPast = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

        newNotifications.push({
          id: `vaccine_${vaccine.id}_${Date.now()}`,
          type: "vaccine_overdue",
          petId: vaccine.petId,
          title: "Vacina Atrasada",
          message: `${pet?.name} está com a vacina ${vaccine.name} atrasada há ${daysPast} dias`,
          date: today.toISOString(),
          isRead: false,
          priority: daysPast > 30 ? "high" : "medium",
        })
      }
    })

    // Check for medication reminders
    medications.forEach((medication) => {
      if (medication.isActive) {
        const endDate = new Date(medication.endDate)
        const daysUntilEnd = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilEnd <= 3 && daysUntilEnd >= 0) {
          const pet = pets.find((p) => p.id === medication.petId)

          newNotifications.push({
            id: `medication_${medication.id}_${Date.now()}`,
            type: "medication_reminder",
            petId: medication.petId,
            title: "Medicamento Terminando",
            message: `${pet?.name} - ${medication.name} termina em ${daysUntilEnd} dias`,
            date: today.toISOString(),
            isRead: false,
            priority: daysUntilEnd === 0 ? "high" : "medium",
          })
        }
      }
    })

    setNotifications((prev) => [...prev, ...newNotifications])
  }

  // Generate notifications on component mount
  React.useEffect(() => {
    generateNotifications()
  }, [vaccines, medications, pets])

  const getUnreadNotifications = () => {
    return notifications.filter((n) => !n.isRead)
  }

  const getUpcomingVaccines = () => {
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

    return vaccines.filter((vaccine) => {
      const dueDate = new Date(vaccine.nextDue)
      return dueDate >= today && dueDate <= thirtyDaysFromNow
    })
  }

  const getUpcomingAppointments = () => {
    const today = new Date()
    return appointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.date)
        return appointmentDate >= today
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const renderDashboard = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cartão Digital</h1>
        <Button onClick={() => setActiveTab("register-pet")} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Pet
        </Button>
      </div>

      {/* Confirmação Rápida - Destaque no topo */}
      {pendingItems.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Confirmações Pendentes
              <Badge variant="destructive">{pendingItems.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setActiveTab("quick-confirm")} className="w-full bg-primary hover:bg-primary/90">
              Ver Pendências ({pendingItems.length})
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Cards de estatísticas em grid mobile */}
      <div className="grid gap-3 grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Pets</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{pets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Vacinas</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{vaccines.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Próximas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{getUpcomingVaccines().length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">Consultas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{getUpcomingAppointments().length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de pets em layout mobile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Meus Pets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pets.map((pet) => (
            <div key={pet.id} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
              <Avatar className="h-10 w-10">
                <AvatarImage src={pet.photo || "/placeholder.svg"} />
                <AvatarFallback>{pet.species === "dog" ? "🐕" : "🐱"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{pet.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {pet.breed} • {pet.weight}kg
                </p>
              </div>
              <Badge variant={pet.species === "dog" ? "default" : "secondary"} className="text-xs">
                {pet.species === "dog" ? "Cão" : "Gato"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Próximas vacinas em layout mobile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Próximas Vacinas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {getUpcomingVaccines().map((vaccine) => {
            const pet = pets.find((p) => p.id === vaccine.petId)
            return (
              <div key={vaccine.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{vaccine.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {pet?.name} • {new Date(vaccine.nextDue).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Pendente
                </Badge>
              </div>
            )
          })}
          {getUpcomingVaccines().length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhuma vacina próxima do vencimento</p>
          )}
        </CardContent>
      </Card>

      {/* Próximas consultas em layout mobile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Próximas Consultas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getUpcomingAppointments().map((appointment) => {
              const pet = pets.find((p) => p.id === appointment.petId)
              return (
                <div key={appointment.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="text-center min-w-0">
                    <p className="text-xs font-medium">
                      {new Date(appointment.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                    </p>
                    <p className="text-xs text-muted-foreground">{appointment.time}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{pet?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{appointment.type}</p>
                  </div>
                  <Badge className="text-xs">Agendado</Badge>
                </div>
              )
            })}
            {getUpcomingAppointments().length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma consulta agendada</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo e título */}
            <div className="flex items-center space-x-2">
              <img src="/agrodez-logo.png" alt="A-agrodez" className="h-8 w-8" />
              <div className="flex items-center space-x-1">
                <PawPrint className="h-5 w-5 text-primary" />
                <span className="font-bold text-primary text-sm">VetCard</span>
              </div>
            </div>

            {/* Notificações e Menu Mobile */}
            <div className="flex items-center space-x-2">
              {/* Botão de confirmação rápida */}
              {pendingItems.length > 0 && (
                <button
                  onClick={() => setActiveTab("quick-confirm")}
                  className="relative p-2 text-muted-foreground hover:text-primary"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    {pendingItems.length}
                  </span>
                </button>
              )}

              {/* Botão de notificações */}
              <button
                onClick={() => setActiveTab("notifications")}
                className="relative p-2 text-muted-foreground hover:text-primary"
              >
                <Bell className="h-5 w-5" />
                {getUnreadNotifications().length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {getUnreadNotifications().length}
                  </span>
                )}
              </button>

              {/* Menu hambúrguer */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-muted-foreground hover:text-primary"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Menu mobile expandido */}
          {isMobileMenuOpen && (
            <div className="border-t bg-white pb-4">
              <div className="grid grid-cols-2 gap-2 p-4">
                <button
                  onClick={() => {
                    setActiveTab("dashboard")
                    setIsMobileMenuOpen(false)
                  }}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    activeTab === "dashboard" ? "bg-primary text-white" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-medium">Dashboard</div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("quick-confirm")
                    setIsMobileMenuOpen(false)
                  }}
                  className={`p-3 rounded-lg text-left transition-colors relative ${
                    activeTab === "quick-confirm" ? "bg-primary text-white" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-medium">Confirmações</div>
                  {pendingItems.length > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {pendingItems.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveTab("register-pet")
                    setIsMobileMenuOpen(false)
                  }}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    activeTab === "register-pet" ? "bg-primary text-white" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-medium">Cadastrar</div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("vaccines")
                    setIsMobileMenuOpen(false)
                  }}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    activeTab === "vaccines" ? "bg-primary text-white" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-medium">Vacinas</div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("medications")
                    setIsMobileMenuOpen(false)
                  }}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    activeTab === "medications" ? "bg-primary text-white" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-medium">Medicamentos</div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("nutrition")
                    setIsMobileMenuOpen(false)
                  }}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    activeTab === "nutrition" ? "bg-primary text-white" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-medium">Nutrição</div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("appointments")
                    setIsMobileMenuOpen(false)
                  }}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    activeTab === "appointments" ? "bg-primary text-white" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-medium">Consultas</div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("protocols")
                    setIsMobileMenuOpen(false)
                  }}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    activeTab === "protocols" ? "bg-primary text-white" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-medium">Protocolos</div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("travel")
                    setIsMobileMenuOpen(false)
                  }}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    activeTab === "travel" ? "bg-primary text-white" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-medium">Certificados</div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("vet-profile")
                    setIsMobileMenuOpen(false)
                  }}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    activeTab === "vet-profile" ? "bg-primary text-white" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-sm font-medium">Veterinário</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-4 pb-20">
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "quick-confirm" && (
          <QuickConfirmation
            pets={pets}
            pendingItems={pendingItems}
            onConfirmVaccine={handleConfirmVaccine}
            onConfirmMedication={handleConfirmMedication}
          />
        )}
        {activeTab === "register-pet" && <PetRegistration onAddPet={addPet} onBack={() => setActiveTab("dashboard")} />}
        {activeTab === "vaccines" && <VaccineRecord pets={pets} vaccines={vaccines} onAddVaccine={addVaccine} />}
        {activeTab === "appointments" && (
          <AppointmentScheduler pets={pets} appointments={appointments} onAddAppointment={addAppointment} />
        )}
        {activeTab === "vet-profile" && <VetProfile />}
        {activeTab === "medications" && (
          <MedicationManager pets={pets} medications={medications} onAddMedication={addMedication} />
        )}
        {activeTab === "nutrition" && (
          <NutritionalPlan pets={pets} nutritionalPlans={nutritionalPlans} onAddNutritionalPlan={addNutritionalPlan} />
        )}
        {activeTab === "notifications" && (
          <NotificationCenter notifications={notifications} pets={pets} onMarkAsRead={markNotificationAsRead} />
        )}
        {activeTab === "protocols" && <VaccinationProtocols pets={pets} vaccines={vaccines} />}
        {activeTab === "travel" && (
          <TravelCertificates
            pets={pets}
            vaccines={vaccines}
            certificates={certificates}
            onAddCertificate={(cert) => setCertificates([...certificates, { ...cert, id: Date.now().toString() }])}
          />
        )}
      </main>
    </div>
  )
}
