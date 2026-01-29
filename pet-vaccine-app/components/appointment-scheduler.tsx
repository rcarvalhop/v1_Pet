"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Calendar, Clock, User, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Pet {
  id: string
  name: string
  species: "dog" | "cat"
  breed: string
  owner: string
}

interface Appointment {
  id: string
  petId: string
  date: string
  time: string
  type: string
  veterinarian: string
  clinic: string
  notes?: string
  status: "scheduled" | "completed" | "cancelled"
}

interface AppointmentSchedulerProps {
  pets: Pet[]
  appointments: Appointment[]
  onAddAppointment: (appointment: Omit<Appointment, "id">) => void
}

interface GroomingService {
  id: string
  petId: string
  date: string
  time: string
  services: string[]
  groomer: string
  clinic: string
  petCondition: {
    skin: string
    coat: string
    ectoparasites: boolean
    wounds: boolean
    allergies: boolean
  }
  beforePhotos: string[]
  afterPhotos: string[]
  notes: string
  price: number
}

interface GroomingSchedulerProps {
  pets: Pet[]
  onScheduleGrooming: (grooming: Omit<GroomingService, "id">) => void
  onCancel: () => void
}

function GroomingScheduler({ pets, onScheduleGrooming, onCancel }: GroomingSchedulerProps) {
  const [groomingData, setGroomingData] = useState({
    petId: "",
    date: "",
    time: "",
    services: [] as string[],
    groomer: "",
    clinic: "",
    petCondition: {
      skin: "normal",
      coat: "normal",
      ectoparasites: false,
      wounds: false,
      allergies: false,
    },
    beforePhotos: [] as string[],
    afterPhotos: [] as string[],
    notes: "",
    price: 0,
  })

  const groomingServices = [
    { name: "Banho Completo", price: 35 },
    { name: "Tosa Higiênica", price: 25 },
    { name: "Tosa Completa", price: 60 },
    { name: "Corte de Unhas", price: 15 },
    { name: "Limpeza de Ouvidos", price: 20 },
    { name: "Escovação de Dentes", price: 25 },
    { name: "Hidratação", price: 30 },
    { name: "Perfume", price: 10 },
    { name: "Laço/Bandana", price: 8 },
  ]

  const groomers = [
    "Maria Silva - Tosadora",
    "João Santos - Pet Groomer",
    "Ana Costa - Especialista",
    "Carlos Oliveira - Tosador",
  ]

  const handleServiceToggle = (serviceName: string, price: number) => {
    const isSelected = groomingData.services.includes(serviceName)
    if (isSelected) {
      setGroomingData((prev) => ({
        ...prev,
        services: prev.services.filter((s) => s !== serviceName),
        price: prev.price - price,
      }))
    } else {
      setGroomingData((prev) => ({
        ...prev,
        services: [...prev.services, serviceName],
        price: prev.price + price,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onScheduleGrooming(groomingData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="groomingPet">Pet *</Label>
          <Select
            value={groomingData.petId}
            onValueChange={(value) => setGroomingData((prev) => ({ ...prev, petId: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o pet" />
            </SelectTrigger>
            <SelectContent>
              {pets.map((pet) => (
                <SelectItem key={pet.id} value={pet.id}>
                  {pet.name} ({pet.species === "dog" ? "Cão" : "Gato"})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="groomingGroomer">Tosador *</Label>
          <Select
            value={groomingData.groomer}
            onValueChange={(value) => setGroomingData((prev) => ({ ...prev, groomer: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tosador" />
            </SelectTrigger>
            <SelectContent>
              {groomers.map((groomer) => (
                <SelectItem key={groomer} value={groomer}>
                  {groomer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="groomingDate">Data *</Label>
          <Input
            id="groomingDate"
            type="date"
            value={groomingData.date}
            onChange={(e) => setGroomingData((prev) => ({ ...prev, date: e.target.value }))}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="groomingTime">Horário *</Label>
          <Input
            id="groomingTime"
            type="time"
            value={groomingData.time}
            onChange={(e) => setGroomingData((prev) => ({ ...prev, time: e.target.value }))}
            required
          />
        </div>
      </div>

      {/* Serviços */}
      <div className="space-y-3">
        <Label>Serviços *</Label>
        <div className="grid gap-3 md:grid-cols-2">
          {groomingServices.map((service) => (
            <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={service.name}
                  checked={groomingData.services.includes(service.name)}
                  onChange={() => handleServiceToggle(service.name, service.price)}
                  className="rounded"
                />
                <Label htmlFor={service.name} className="cursor-pointer">
                  {service.name}
                </Label>
              </div>
              <Badge variant="outline">R$ {service.price}</Badge>
            </div>
          ))}
        </div>
        <div className="text-right">
          <p className="font-semibold">Total: R$ {groomingData.price.toFixed(2)}</p>
        </div>
      </div>

      {/* Checklist do Pet */}
      <div className="space-y-4 border-t pt-4">
        <h4 className="font-semibold">Checklist do Pet</h4>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="skinCondition">Estado da Pele</Label>
            <Select
              value={groomingData.petCondition.skin}
              onValueChange={(value) =>
                setGroomingData((prev) => ({
                  ...prev,
                  petCondition: { ...prev.petCondition, skin: value },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="seca">Seca</SelectItem>
                <SelectItem value="oleosa">Oleosa</SelectItem>
                <SelectItem value="irritada">Irritada</SelectItem>
                <SelectItem value="feridas">Com feridas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coatCondition">Estado do Pelo</Label>
            <Select
              value={groomingData.petCondition.coat}
              onValueChange={(value) =>
                setGroomingData((prev) => ({
                  ...prev,
                  petCondition: { ...prev.petCondition, coat: value },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="emaranhado">Emaranhado</SelectItem>
                <SelectItem value="muito-sujo">Muito sujo</SelectItem>
                <SelectItem value="oleoso">Oleoso</SelectItem>
                <SelectItem value="ressecado">Ressecado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Checkboxes para condições */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="ectoparasites"
              checked={groomingData.petCondition.ectoparasites}
              onChange={(e) =>
                setGroomingData((prev) => ({
                  ...prev,
                  petCondition: { ...prev.petCondition, ectoparasites: e.target.checked },
                }))
              }
              className="rounded"
            />
            <Label htmlFor="ectoparasites" className="cursor-pointer text-red-600">
              Presença de ectoparasitas (pulgas, carrapatos)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="wounds"
              checked={groomingData.petCondition.wounds}
              onChange={(e) =>
                setGroomingData((prev) => ({
                  ...prev,
                  petCondition: { ...prev.petCondition, wounds: e.target.checked },
                }))
              }
              className="rounded"
            />
            <Label htmlFor="wounds" className="cursor-pointer text-orange-600">
              Ferimentos ou machucados
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allergies"
              checked={groomingData.petCondition.allergies}
              onChange={(e) =>
                setGroomingData((prev) => ({
                  ...prev,
                  petCondition: { ...prev.petCondition, allergies: e.target.checked },
                }))
              }
              className="rounded"
            />
            <Label htmlFor="allergies" className="cursor-pointer text-blue-600">
              Sinais de alergia ou sensibilidade
            </Label>
          </div>
        </div>
      </div>

      {/* Fotos */}
      <div className="space-y-4 border-t pt-4">
        <h4 className="font-semibold">Registro Fotográfico</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Fotos "Antes" (opcional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground">Clique para adicionar fotos do pet antes do banho e tosa</p>
              <Button type="button" variant="outline" className="mt-2 bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Fotos
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fotos "Depois" (opcional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground">Clique para adicionar fotos do pet após o banho e tosa</p>
              <Button type="button" variant="outline" className="mt-2 bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Fotos
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Observações */}
      <div className="space-y-2">
        <Label htmlFor="groomingNotes">Observações Especiais</Label>
        <Textarea
          id="groomingNotes"
          value={groomingData.notes}
          onChange={(e) => setGroomingData((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Comportamento do pet, produtos utilizados, reações observadas..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Agendar Banho e Tosa</Button>
      </div>
    </form>
  )
}

export default function AppointmentScheduler({ pets, appointments, onAddAppointment }: AppointmentSchedulerProps) {
  const [isScheduling, setIsScheduling] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [newAppointment, setNewAppointment] = useState({
    petId: "",
    date: "",
    time: "",
    type: "",
    veterinarian: "",
    clinic: "",
    notes: "",
    status: "scheduled" as const,
  })

  const appointmentTypes = [
    "Consulta de Rotina",
    "Vacinação",
    "Reforço Vacinal",
    "Consulta de Emergência",
    "Cirurgia",
    "Exames",
    "Retorno",
    "Castração",
    "Limpeza Dentária",
    "Banho e Tosa",
  ]

  const veterinarians = [
    "Dr. Carlos Mendes",
    "Dra. Ana Costa",
    "Dr. Roberto Silva",
    "Dra. Maria Santos",
    "Dr. João Oliveira",
  ]

  const clinics = [
    "Clínica Veterinária São Francisco",
    "Hospital Veterinário Central",
    "Pet Care Clínica",
    "Veterinária Amigo Fiel",
    "Centro Veterinário Vida Animal",
  ]

  const getUpcomingAppointments = () => {
    const today = new Date()
    return appointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.date)
        return appointmentDate >= today && appointment.status === "scheduled"
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const getPastAppointments = () => {
    const today = new Date()
    return appointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.date)
        return appointmentDate < today || appointment.status === "completed"
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const getAppointmentsByDate = (date: string) => {
    return appointments.filter((appointment) => appointment.date === date)
  }

  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    onAddAppointment(newAppointment)
    setNewAppointment({
      petId: "",
      date: "",
      time: "",
      type: "",
      veterinarian: "",
      clinic: "",
      notes: "",
      status: "scheduled",
    })
    setIsScheduling(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge>Agendado</Badge>
      case "completed":
        return <Badge variant="secondary">Realizado</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Agendamento de Consultas</h1>
        <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Agendar Consulta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Agendar Nova Consulta</DialogTitle>
              <DialogDescription>Agende uma consulta, procedimento ou serviço de banho e tosa</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="consultation" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="consultation">Consulta/Procedimento</TabsTrigger>
                <TabsTrigger value="grooming">Banho e Tosa</TabsTrigger>
              </TabsList>

              <TabsContent value="consultation" className="space-y-4">
                <form onSubmit={handleScheduleAppointment} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="petSelect">Pet *</Label>
                      <Select
                        value={newAppointment.petId}
                        onValueChange={(value) => setNewAppointment((prev) => ({ ...prev, petId: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o pet" />
                        </SelectTrigger>
                        <SelectContent>
                          {pets.map((pet) => (
                            <SelectItem key={pet.id} value={pet.id}>
                              {pet.name} ({pet.species === "dog" ? "Cão" : "Gato"})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="appointmentType">Tipo de Consulta *</Label>
                      <Select
                        value={newAppointment.type}
                        onValueChange={(value) => setNewAppointment((prev) => ({ ...prev, type: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {appointmentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="appointmentDate">Data *</Label>
                      <Input
                        id="appointmentDate"
                        type="date"
                        value={newAppointment.date}
                        onChange={(e) => setNewAppointment((prev) => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="appointmentTime">Horário *</Label>
                      <Input
                        id="appointmentTime"
                        type="time"
                        value={newAppointment.time}
                        onChange={(e) => setNewAppointment((prev) => ({ ...prev, time: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="veterinarian">Veterinário *</Label>
                      <Select
                        value={newAppointment.veterinarian}
                        onValueChange={(value) => setNewAppointment((prev) => ({ ...prev, veterinarian: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o veterinário" />
                        </SelectTrigger>
                        <SelectContent>
                          {veterinarians.map((vet) => (
                            <SelectItem key={vet} value={vet}>
                              {vet}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clinic">Clínica *</Label>
                      <Select
                        value={newAppointment.clinic}
                        onValueChange={(value) => setNewAppointment((prev) => ({ ...prev, clinic: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a clínica" />
                        </SelectTrigger>
                        <SelectContent>
                          {clinics.map((clinic) => (
                            <SelectItem key={clinic} value={clinic}>
                              {clinic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appointmentNotes">Observações</Label>
                    <Textarea
                      id="appointmentNotes"
                      value={newAppointment.notes}
                      onChange={(e) => setNewAppointment((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Sintomas, motivo da consulta, observações especiais..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setIsScheduling(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Agendar Consulta</Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="grooming" className="space-y-4">
                <GroomingScheduler
                  pets={pets}
                  onScheduleGrooming={(grooming) => {
                    const groomingAppointment = {
                      ...grooming,
                      type: "Banho e Tosa",
                      status: "scheduled" as const,
                    }
                    onAddAppointment(groomingAppointment)
                    setIsScheduling(false)
                  }}
                  onCancel={() => setIsScheduling(false)}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Consultas
            </CardTitle>
            <CardDescription>Consultas agendadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getUpcomingAppointments().map((appointment) => {
                const pet = pets.find((p) => p.id === appointment.petId)
                return (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{pet?.species === "dog" ? "🐕" : "🐱"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{pet?.name}</h4>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(appointment.date).toLocaleDateString("pt-BR")}
                            </p>
                            <p className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {appointment.time}
                            </p>
                            <p className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {appointment.veterinarian}
                            </p>
                            <p className="font-medium">{appointment.type}</p>
                            {appointment.notes && <p className="text-xs">Obs: {appointment.notes}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {getUpcomingAppointments().length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma consulta agendada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Histórico de Consultas
            </CardTitle>
            <CardDescription>Consultas realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {getPastAppointments().map((appointment) => {
                const pet = pets.find((p) => p.id === appointment.petId)
                return (
                  <div key={appointment.id} className="border rounded-lg p-4 opacity-75">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{pet?.species === "dog" ? "🐕" : "🐱"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{pet?.name}</h4>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                              {new Date(appointment.date).toLocaleDateString("pt-BR")} às {appointment.time}
                            </p>
                            <p>{appointment.type}</p>
                            <p>{appointment.veterinarian}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {getPastAppointments().length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma consulta no histórico</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
