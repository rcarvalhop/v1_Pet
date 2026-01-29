"use client"

import type React from "react"

import { useState } from "react"
import { Plus, FileText, Search } from "lucide-react"
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

interface Pet {
  id: string
  name: string
  species: "dog" | "cat"
  breed: string
  birthDate: string
  weight: number
  owner: string
}

interface Vaccine {
  id: string
  petId: string
  name: string
  date: string
  nextDue: string
  veterinarian: string
  clinic: string
  batch: string
  notes?: string
}

interface VaccineRecordProps {
  pets: Pet[]
  vaccines: Vaccine[]
  onAddVaccine: (vaccine: Omit<Vaccine, "id">) => void
}

export default function VaccineRecord({ pets, vaccines, onAddVaccine }: VaccineRecordProps) {
  const [selectedPet, setSelectedPet] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingVaccine, setIsAddingVaccine] = useState(false)
  const [newVaccine, setNewVaccine] = useState({
    petId: "",
    name: "",
    date: "",
    nextDue: "",
    veterinarian: "",
    clinic: "",
    batch: "",
    notes: "",
  })

  const dogVaccines = [
    "V8 (Óctupla)",
    "V10 (Múltipla)",
    "V12 (Múltipla)",
    "Antirrábica",
    "Giárdia",
    "Leishmaniose",
    "Gripe Canina",
    "Tosse dos Canis",
  ]

  const catVaccines = [
    "Tríplice Felina (V3)",
    "Quádrupla Felina (V4)",
    "Quíntupla Felina (V5)",
    "Antirrábica",
    "Leucemia Felina (FeLV)",
    "Clamidiose",
  ]

  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.owner.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const displayedPets = selectedPet === "all" ? filteredPets : pets.filter((pet) => pet.id === selectedPet)

  const getPetVaccines = (petId: string) => {
    return vaccines
      .filter((vaccine) => vaccine.petId === petId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const getVaccineStatus = (nextDue: string) => {
    const today = new Date()
    const dueDate = new Date(nextDue)
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { status: "Atrasada", variant: "destructive" as const }
    if (diffDays <= 30) return { status: "Próxima do Vencimento", variant: "secondary" as const }
    return { status: "Em Dia", variant: "default" as const }
  }

  const handleAddVaccine = (e: React.FormEvent) => {
    e.preventDefault()
    onAddVaccine(newVaccine)
    setNewVaccine({
      petId: "",
      name: "",
      date: "",
      nextDue: "",
      veterinarian: "",
      clinic: "",
      batch: "",
      notes: "",
    })
    setIsAddingVaccine(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Vacinas</h1>
        <Dialog open={isAddingVaccine} onOpenChange={setIsAddingVaccine}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Nova
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nova Vacina</DialogTitle>
              <DialogDescription>Adicione uma nova vacina ao histórico do pet</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddVaccine} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="petSelect">Pet *</Label>
                  <Select
                    value={newVaccine.petId}
                    onValueChange={(value) => setNewVaccine((prev) => ({ ...prev, petId: value }))}
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
                  <Label htmlFor="vaccineName">Vacina *</Label>
                  <Select
                    value={newVaccine.name}
                    onValueChange={(value) => setNewVaccine((prev) => ({ ...prev, name: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a vacina" />
                    </SelectTrigger>
                    <SelectContent>
                      {newVaccine.petId &&
                        (pets.find((p) => p.id === newVaccine.petId)?.species === "dog"
                          ? dogVaccines
                          : catVaccines
                        ).map((vaccine) => (
                          <SelectItem key={vaccine} value={vaccine}>
                            {vaccine}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vaccineDate">Data da Aplicação *</Label>
                  <Input
                    id="vaccineDate"
                    type="date"
                    value={newVaccine.date}
                    onChange={(e) => setNewVaccine((prev) => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextDue">Próxima Dose *</Label>
                  <Input
                    id="nextDue"
                    type="date"
                    value={newVaccine.nextDue}
                    onChange={(e) => setNewVaccine((prev) => ({ ...prev, nextDue: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="veterinarian">Veterinário *</Label>
                  <Input
                    id="veterinarian"
                    value={newVaccine.veterinarian}
                    onChange={(e) => setNewVaccine((prev) => ({ ...prev, veterinarian: e.target.value }))}
                    placeholder="Nome do veterinário"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinic">Clínica *</Label>
                  <Input
                    id="clinic"
                    value={newVaccine.clinic}
                    onChange={(e) => setNewVaccine((prev) => ({ ...prev, clinic: e.target.value }))}
                    placeholder="Nome da clínica"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="batch">Lote da Vacina *</Label>
                  <Input
                    id="batch"
                    value={newVaccine.batch}
                    onChange={(e) => setNewVaccine((prev) => ({ ...prev, batch: e.target.value }))}
                    placeholder="Número do lote"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vaccineNotes">Observações</Label>
                <Textarea
                  id="vaccineNotes"
                  value={newVaccine.notes}
                  onChange={(e) => setNewVaccine((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Reações, observações do veterinário, etc."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setIsAddingVaccine(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Registrar Vacina</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pet ou proprietário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedPet} onValueChange={setSelectedPet}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por pet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os pets</SelectItem>
            {pets.map((pet) => (
              <SelectItem key={pet.id} value={pet.id}>
                {pet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {displayedPets.map((pet) => {
          const petVaccines = getPetVaccines(pet.id)
          return (
            <Card key={pet.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{pet.species === "dog" ? "🐕" : "🐱"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="truncate">{pet.name}</span>
                      <Badge variant={pet.species === "dog" ? "default" : "secondary"} className="text-xs">
                        {pet.species === "dog" ? "Cão" : "Gato"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs truncate">
                      {pet.breed} • {pet.weight}kg • {pet.owner}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {petVaccines.length > 0 ? (
                  <div className="space-y-3">
                    {petVaccines.map((vaccine) => {
                      const status = getVaccineStatus(vaccine.nextDue)
                      return (
                        <div key={vaccine.id} className="border rounded-lg p-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm truncate">{vaccine.name}</h4>
                              <Badge variant={status.variant} className="text-xs">
                                {status.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p>📅 {new Date(vaccine.date).toLocaleDateString("pt-BR")}</p>
                              <p>🔄 {new Date(vaccine.nextDue).toLocaleDateString("pt-BR")}</p>
                              <p>👨‍⚕️ {vaccine.veterinarian}</p>
                              <p>🏥 {vaccine.clinic}</p>
                              <p>📦 {vaccine.batch}</p>
                              {vaccine.notes && <p>📝 {vaccine.notes}</p>}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma vacina registrada</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-transparent"
                      onClick={() => {
                        setNewVaccine((prev) => ({ ...prev, petId: pet.id }))
                        setIsAddingVaccine(true)
                      }}
                    >
                      Registrar Primeira Vacina
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {displayedPets.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Nenhum pet encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
