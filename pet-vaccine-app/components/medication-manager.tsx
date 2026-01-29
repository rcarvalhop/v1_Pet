"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Pill, Search, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

interface MedicationManagerProps {
  pets: Pet[]
  medications: Medication[]
  onAddMedication: (medication: Omit<Medication, "id">) => void
}

export default function MedicationManager({ pets, medications, onAddMedication }: MedicationManagerProps) {
  const [isAddingMedication, setIsAddingMedication] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPet, setSelectedPet] = useState<string>("all")
  const [newMedication, setNewMedication] = useState({
    petId: "",
    name: "",
    type: "prescription" as const,
    category: "other" as const,
    dosage: "",
    frequency: "",
    startDate: "",
    endDate: "",
    veterinarian: "",
    notes: "",
    isActive: true,
  })

  const medicationCategories = {
    antibiotic: "Antibiótico",
    "anti-inflammatory": "Anti-inflamatório",
    "flea-tick": "Antipulgas/Carrapatos",
    deworming: "Vermífugo",
    heartworm: "Dirofilariose",
    other: "Outros",
  }

  const commonMedications = {
    prescription: [
      "Amoxicilina",
      "Cefalexina",
      "Enrofloxacina",
      "Prednisolona",
      "Meloxicam",
      "Tramadol",
      "Omeprazol",
      "Furosemida",
    ],
    preventive: ["Bravecto", "NexGard", "Simparic", "Revolution", "Advocate", "Drontal", "Milbemax", "Heartgard"],
  }

  const filteredMedications = medications.filter((medication) => {
    const pet = pets.find((p) => p.id === medication.petId)
    const matchesSearch =
      medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPet = selectedPet === "all" || medication.petId === selectedPet
    return matchesSearch && matchesPet
  })

  const activeMedications = filteredMedications.filter((m) => m.isActive)
  const inactiveMedications = filteredMedications.filter((m) => !m.isActive)

  const getMedicationStatus = (medication: Medication) => {
    const today = new Date()
    const endDate = new Date(medication.endDate)
    const daysUntilEnd = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (!medication.isActive) return { status: "Finalizado", variant: "secondary" as const, icon: CheckCircle }
    if (daysUntilEnd < 0) return { status: "Vencido", variant: "destructive" as const, icon: AlertTriangle }
    if (daysUntilEnd <= 3) return { status: "Terminando", variant: "secondary" as const, icon: AlertTriangle }
    return { status: "Ativo", variant: "default" as const, icon: CheckCircle }
  }

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault()
    onAddMedication(newMedication)
    setNewMedication({
      petId: "",
      name: "",
      type: "prescription",
      category: "other",
      dosage: "",
      frequency: "",
      startDate: "",
      endDate: "",
      veterinarian: "",
      notes: "",
      isActive: true,
    })
    setIsAddingMedication(false)
  }

  const renderMedicationCard = (medication: Medication) => {
    const pet = pets.find((p) => p.id === medication.petId)
    const status = getMedicationStatus(medication)
    const StatusIcon = status.icon

    return (
      <Card key={medication.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>{pet?.species === "dog" ? "🐕" : "🐱"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">{medication.name}</h4>
                  <Badge variant={status.variant} className="gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {status.status}
                  </Badge>
                  <Badge variant={medication.type === "prescription" ? "default" : "outline"}>
                    {medication.type === "prescription" ? "Receita" : "Preventivo"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium">{pet?.name}</p>
                  <p>📋 {medicationCategories[medication.category]}</p>
                  <p>
                    💊 {medication.dosage} - {medication.frequency}
                  </p>
                  <p>
                    📅 {new Date(medication.startDate).toLocaleDateString("pt-BR")} até{" "}
                    {new Date(medication.endDate).toLocaleDateString("pt-BR")}
                  </p>
                  <p>👨‍⚕️ {medication.veterinarian}</p>
                  {medication.notes && <p>📝 {medication.notes}</p>}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Controle de Medicamentos</h1>
          <p className="text-muted-foreground">Gerencie receitas veterinárias e produtos preventivos</p>
        </div>
        <Dialog open={isAddingMedication} onOpenChange={setIsAddingMedication}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Novo Medicamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Novo Medicamento</DialogTitle>
              <DialogDescription>Adicione um medicamento ao tratamento do pet</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddMedication} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="petSelect">Pet *</Label>
                  <Select
                    value={newMedication.petId}
                    onValueChange={(value) => setNewMedication((prev) => ({ ...prev, petId: value }))}
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
                  <Label htmlFor="medicationType">Tipo *</Label>
                  <Select
                    value={newMedication.type}
                    onValueChange={(value: "prescription" | "preventive") =>
                      setNewMedication((prev) => ({ ...prev, type: value }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prescription">Receita Veterinária</SelectItem>
                      <SelectItem value="preventive">Produto Preventivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicationName">Medicamento *</Label>
                  <Select
                    value={newMedication.name}
                    onValueChange={(value) => setNewMedication((prev) => ({ ...prev, name: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione ou digite o medicamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonMedications[newMedication.type].map((med) => (
                        <SelectItem key={med} value={med}>
                          {med}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={newMedication.category}
                    onValueChange={(value: any) => setNewMedication((prev) => ({ ...prev, category: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(medicationCategories).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosagem *</Label>
                  <Input
                    id="dosage"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication((prev) => ({ ...prev, dosage: e.target.value }))}
                    placeholder="Ex: 250mg, 1 comprimido"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequência *</Label>
                  <Input
                    id="frequency"
                    value={newMedication.frequency}
                    onChange={(e) => setNewMedication((prev) => ({ ...prev, frequency: e.target.value }))}
                    placeholder="Ex: 2x ao dia, A cada 3 meses"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newMedication.startDate}
                    onChange={(e) => setNewMedication((prev) => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Término *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newMedication.endDate}
                    onChange={(e) => setNewMedication((prev) => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="veterinarian">Veterinário Responsável *</Label>
                  <Input
                    id="veterinarian"
                    value={newMedication.veterinarian}
                    onChange={(e) => setNewMedication((prev) => ({ ...prev, veterinarian: e.target.value }))}
                    placeholder="Nome do veterinário"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicationNotes">Observações</Label>
                <Textarea
                  id="medicationNotes"
                  value={newMedication.notes}
                  onChange={(e) => setNewMedication((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Instruções especiais, efeitos colaterais observados, etc."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setIsAddingMedication(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Registrar Medicamento
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por medicamento ou nome do pet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedPet} onValueChange={setSelectedPet}>
          <SelectTrigger className="w-48">
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

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active" className="gap-2">
            <Pill className="h-4 w-4" />
            Medicamentos Ativos ({activeMedications.length})
          </TabsTrigger>
          <TabsTrigger value="inactive" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Histórico ({inactiveMedications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeMedications.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">{activeMedications.map(renderMedicationCard)}</div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Pill className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhum medicamento ativo</h3>
                <p className="text-muted-foreground mb-4">Não há medicamentos ativos no momento</p>
                <Button onClick={() => setIsAddingMedication(true)} className="bg-primary hover:bg-primary/90">
                  Adicionar Primeiro Medicamento
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {inactiveMedications.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">{inactiveMedications.map(renderMedicationCard)}</div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhum histórico</h3>
                <p className="text-muted-foreground">Não há medicamentos finalizados no histórico</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
