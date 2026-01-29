"use client"

import type React from "react"

import { useState } from "react"
import { User, Phone, Mail, MapPin, Clock, Award, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface VetInfo {
  name: string
  crmv: string
  specialty: string
  phone: string
  email: string
  clinic: string
  address: string
  workingHours: string
  experience: string
  bio: string
}

export default function VetProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [vetInfo, setVetInfo] = useState<VetInfo>({
    name: "Dr. Carlos Mendes",
    crmv: "CRMV-SP 12345",
    specialty: "Clínica Geral e Cirurgia",
    phone: "(11) 99999-9999",
    email: "carlos.mendes@veterinaria.com",
    clinic: "Clínica Veterinária São Francisco",
    address: "Rua das Flores, 123 - São Paulo, SP",
    workingHours: "Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h",
    experience: "15 anos",
    bio: "Veterinário formado pela USP com especialização em cirurgia de pequenos animais. Atua há mais de 15 anos na área, com foco em bem-estar animal e medicina preventiva.",
  })

  const [editForm, setEditForm] = useState<VetInfo>(vetInfo)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setVetInfo(editForm)
    setIsEditing(false)
  }

  const specialties = [
    "Clínica Geral",
    "Cirurgia",
    "Dermatologia",
    "Cardiologia",
    "Oncologia",
    "Ortopedia",
    "Oftalmologia",
    "Neurologia",
    "Medicina Felina",
    "Medicina de Animais Exóticos",
  ]

  const achievements = [
    { title: "Especialização em Cirurgia", year: "2015", institution: "FMVZ-USP" },
    { title: "Curso de Cardiologia Veterinária", year: "2018", institution: "ANCLIVEPA" },
    { title: "Certificação em Bem-Estar Animal", year: "2020", institution: "CFMV" },
    { title: "Pós-graduação em Medicina Felina", year: "2022", institution: "Qualittas" },
  ]

  const services = [
    "Consultas Clínicas",
    "Vacinação",
    "Cirurgias Gerais",
    "Exames Laboratoriais",
    "Ultrassonografia",
    "Radiografia",
    "Internação",
    "Emergências 24h",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Perfil Veterinário</h1>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Edit className="h-4 w-4" />
              Editar Perfil
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Perfil Veterinário</DialogTitle>
              <DialogDescription>Atualize suas informações profissionais</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crmv">CRMV *</Label>
                  <Input
                    id="crmv"
                    value={editForm.crmv}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, crmv: e.target.value }))}
                    placeholder="CRMV-SP 12345"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade *</Label>
                  <Input
                    id="specialty"
                    value={editForm.specialty}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, specialty: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experiência *</Label>
                  <Input
                    id="experience"
                    value={editForm.experience}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, experience: e.target.value }))}
                    placeholder="15 anos"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="clinic">Clínica *</Label>
                  <Input
                    id="clinic"
                    value={editForm.clinic}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, clinic: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    value={editForm.address}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, address: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="workingHours">Horário de Funcionamento *</Label>
                  <Input
                    id="workingHours"
                    value={editForm.workingHours}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, workingHours: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={editForm.bio}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Conte um pouco sobre sua formação e experiência..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg?height=64&width=64" />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{vetInfo.name}</CardTitle>
                <CardDescription className="text-lg">{vetInfo.crmv}</CardDescription>
                <Badge variant="secondary" className="mt-2">
                  {vetInfo.specialty}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Informações de Contato</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{vetInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{vetInfo.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{vetInfo.clinic}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{vetInfo.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{vetInfo.workingHours}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Sobre</h3>
              <p className="text-muted-foreground leading-relaxed">{vetInfo.bio}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Serviços Oferecidos</h3>
              <div className="grid gap-2 md:grid-cols-2">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span className="text-sm">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Experiência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{vetInfo.experience}</div>
                <p className="text-sm text-muted-foreground">de experiência</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formação e Certificações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <h4 className="font-semibold text-sm">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.institution}</p>
                    <p className="text-xs text-muted-foreground">{achievement.year}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Especialidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {specialties.slice(0, 6).map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
