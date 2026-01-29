"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Pet {
  name: string
  species: "dog" | "cat"
  breed: string
  birthDate: string
  weight: number
  owner: string
  ownerPhone: string
  ownerEmail: string
  microchip?: string
  notes?: string
}

interface PetRegistrationProps {
  onAddPet: (pet: Pet) => void
  onBack: () => void
}

export default function PetRegistration({ onAddPet, onBack }: PetRegistrationProps) {
  const [formData, setFormData] = useState<Pet>({
    name: "",
    species: "dog",
    breed: "",
    birthDate: "",
    weight: 0,
    owner: "",
    ownerPhone: "",
    ownerEmail: "",
    microchip: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddPet(formData)
    onBack()
  }

  const handleChange = (field: keyof Pet, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const dogBreeds = [
    "Golden Retriever",
    "Labrador",
    "Pastor Alemão",
    "Bulldog",
    "Poodle",
    "Rottweiler",
    "Beagle",
    "Dachshund",
    "Yorkshire",
    "Shih Tzu",
    "SRD (Sem Raça Definida)",
  ]

  const catBreeds = [
    "Persa",
    "Siamês",
    "Maine Coon",
    "British Shorthair",
    "Ragdoll",
    "Bengal",
    "Sphynx",
    "Russian Blue",
    "Abissínio",
    "SRD (Sem Raça Definida)",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">Cadastrar Pet</h1>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Informações do Pet</CardTitle>
          <CardDescription className="text-sm">Preencha os dados do seu pet</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {/* Campos em layout vertical para mobile */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Pet *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Ex: Rex, Mimi"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="species">Espécie *</Label>
                  <Select
                    value={formData.species}
                    onValueChange={(value: "dog" | "cat") => handleChange("species", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Cão</SelectItem>
                      <SelectItem value="cat">Gato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight || ""}
                    onChange={(e) => handleChange("weight", Number.parseFloat(e.target.value) || 0)}
                    placeholder="25.5"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="breed">Raça *</Label>
                <Select value={formData.breed} onValueChange={(value) => handleChange("breed", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a raça" />
                  </SelectTrigger>
                  <SelectContent>
                    {(formData.species === "dog" ? dogBreeds : catBreeds).map((breed) => (
                      <SelectItem key={breed} value={breed}>
                        {breed}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleChange("birthDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="microchip">Microchip</Label>
                <Input
                  id="microchip"
                  value={formData.microchip}
                  onChange={(e) => handleChange("microchip", e.target.value)}
                  placeholder="Número do microchip (opcional)"
                />
              </div>
            </div>

            {/* Seção do proprietário */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-base font-semibold">Dados do Proprietário</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="owner">Nome Completo *</Label>
                  <Input
                    id="owner"
                    value={formData.owner}
                    onChange={(e) => handleChange("owner", e.target.value)}
                    placeholder="Nome do proprietário"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerPhone">Telefone *</Label>
                  <Input
                    id="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={(e) => handleChange("ownerPhone", e.target.value)}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerEmail">E-mail *</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => handleChange("ownerEmail", e.target.value)}
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Informações adicionais sobre o pet"
                rows={3}
              />
            </div>

            {/* Botões em layout mobile */}
            <div className="flex flex-col space-y-2 pt-4">
              <Button type="submit" className="w-full">
                Cadastrar Pet
              </Button>
              <Button type="button" variant="outline" onClick={onBack} className="w-full bg-transparent">
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
