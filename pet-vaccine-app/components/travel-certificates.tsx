"use client"

import type React from "react"

import { useState } from "react"
import { Plane, QrCode, Download, Shield, Globe, FileText, Plus, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  batch: string
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

interface TravelCertificatesProps {
  pets: Pet[]
  vaccines: Vaccine[]
  certificates: TravelCertificate[]
  onAddCertificate: (certificate: Omit<TravelCertificate, "id">) => void
}

export function TravelCertificates({ pets, vaccines, certificates, onAddCertificate }: TravelCertificatesProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<TravelCertificate | null>(null)
  const [newCertificate, setNewCertificate] = useState({
    petId: "",
    destination: "",
    departureDate: "",
    vaccines: [] as string[],
    veterinarian: "Dr. Carlos Mendes",
    clinic: "Clínica Veterinária São Francisco",
    crmv: "CRMV-SP 12345",
    issueDate: new Date().toISOString().split("T")[0],
    validUntil: "",
    qrCode: "",
    certificateNumber: "",
  })

  const countries = [
    { code: "US", name: "Estados Unidos", requirements: ["Antirrábica", "Múltipla", "Certificado USDA"] },
    { code: "CA", name: "Canadá", requirements: ["Antirrábica", "Múltipla", "Exame clínico"] },
    {
      code: "UK",
      name: "Reino Unido",
      requirements: ["Antirrábica", "Múltipla", "Microchip", "Titulação antirrábica"],
    },
    { code: "FR", name: "França", requirements: ["Antirrábica", "Múltipla", "Microchip", "Passaporte Europeu"] },
    { code: "DE", name: "Alemanha", requirements: ["Antirrábica", "Múltipla", "Microchip", "Passaporte Europeu"] },
    { code: "JP", name: "Japão", requirements: ["Antirrábica", "Múltipla", "Quarentena", "Exames laboratoriais"] },
    { code: "AU", name: "Austrália", requirements: ["Antirrábica", "Múltipla", "Quarentena obrigatória", "Microchip"] },
    { code: "AR", name: "Argentina", requirements: ["Antirrábica", "Múltipla", "Certificado SENASA"] },
    { code: "UY", name: "Uruguai", requirements: ["Antirrábica", "Múltipla", "Exame clínico"] },
    { code: "CL", name: "Chile", requirements: ["Antirrábica", "Múltipla", "Certificado SAG"] },
  ]

  const airlines = [
    "LATAM Airlines",
    "Gol Linhas Aéreas",
    "Azul Linhas Aéreas",
    "American Airlines",
    "Delta Air Lines",
    "United Airlines",
    "Air France",
    "Lufthansa",
    "KLM",
    "Emirates",
    "Qatar Airways",
    "TAP Air Portugal",
  ]

  const generateCertificateNumber = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    return `AGRODEZ-${year}-${random}`
  }

  const generateQRCode = (certificate: any) => {
    const data = {
      certificateNumber: certificate.certificateNumber,
      petName: pets.find((p) => p.id === certificate.petId)?.name,
      destination: certificate.destination,
      issueDate: certificate.issueDate,
      veterinarian: certificate.veterinarian,
      crmv: certificate.crmv,
    }
    return `https://agrodez.com/verify/${btoa(JSON.stringify(data))}`
  }

  const getPetVaccines = (petId: string) => {
    return vaccines.filter((v) => v.petId === petId)
  }

  const getRequiredVaccines = (destination: string) => {
    const country = countries.find((c) => c.name === destination)
    return country?.requirements || []
  }

  const isVaccineValid = (vaccine: Vaccine, travelDate: string) => {
    const vaccineDate = new Date(vaccine.date)
    const nextDue = new Date(vaccine.nextDue)
    const travel = new Date(travelDate)

    return vaccineDate <= travel && travel <= nextDue
  }

  const handleCreateCertificate = (e: React.FormEvent) => {
    e.preventDefault()
    const certificateNumber = generateCertificateNumber()
    const validUntil = new Date(newCertificate.departureDate)
    validUntil.setFullYear(validUntil.getFullYear() + 1)

    const certificate = {
      ...newCertificate,
      certificateNumber,
      validUntil: validUntil.toISOString().split("T")[0],
      qrCode: "",
    }

    certificate.qrCode = generateQRCode(certificate)
    onAddCertificate(certificate)

    setNewCertificate({
      petId: "",
      destination: "",
      departureDate: "",
      vaccines: [],
      veterinarian: "Dr. Carlos Mendes",
      clinic: "Clínica Veterinária São Francisco",
      crmv: "CRMV-SP 12345",
      issueDate: new Date().toISOString().split("T")[0],
      validUntil: "",
      qrCode: "",
      certificateNumber: "",
    })
    setIsCreating(false)
  }

  const renderCertificatePreview = (certificate: TravelCertificate) => {
    const pet = pets.find((p) => p.id === certificate.petId)
    const petVaccines = getPetVaccines(certificate.petId)

    return (
      <div className="bg-white border-2 border-primary p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center border-b-2 border-primary pb-4 mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src="/agrodez-logo.png" alt="A-agrodez" className="h-12" />
            <div className="h-12 w-px bg-gray-300" />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-primary">CERTIFICADO INTERNACIONAL</h1>
              <p className="text-sm text-muted-foreground">DE SAÚDE ANIMAL</p>
            </div>
          </div>
          <p className="text-lg font-semibold">INTERNATIONAL HEALTH CERTIFICATE</p>
          <p className="text-sm text-muted-foreground">Válido para transporte aéreo internacional</p>
        </div>

        {/* Certificate Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nº do Certificado</p>
            <p className="font-bold text-primary">{certificate.certificateNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Data de Emissão</p>
            <p className="font-semibold">{new Date(certificate.issueDate).toLocaleDateString("pt-BR")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Válido até</p>
            <p className="font-semibold">{new Date(certificate.validUntil).toLocaleDateString("pt-BR")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Destino</p>
            <p className="font-semibold">{certificate.destination}</p>
          </div>
        </div>

        {/* Pet Information */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-lg mb-3">DADOS DO ANIMAL / ANIMAL DATA</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Nome / Name:</p>
              <p className="font-semibold">{pet?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Espécie / Species:</p>
              <p className="font-semibold">{pet?.species === "dog" ? "Canina / Canine" : "Felina / Feline"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Raça / Breed:</p>
              <p className="font-semibold">{pet?.breed}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Peso / Weight:</p>
              <p className="font-semibold">{pet?.weight} kg</p>
            </div>
            <div>
              <p className="text-sm font-medium">Data de Nascimento / Birth Date:</p>
              <p className="font-semibold">{pet ? new Date(pet.birthDate).toLocaleDateString("pt-BR") : ""}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Proprietário / Owner:</p>
              <p className="font-semibold">{pet?.owner}</p>
            </div>
          </div>
        </div>

        {/* Vaccination Record */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3">REGISTRO DE VACINAÇÃO / VACCINATION RECORD</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-2 text-left">Vacina / Vaccine</th>
                  <th className="p-2 text-left">Data / Date</th>
                  <th className="p-2 text-left">Lote / Batch</th>
                  <th className="p-2 text-left">Válida até / Valid until</th>
                </tr>
              </thead>
              <tbody>
                {petVaccines.map((vaccine, index) => (
                  <tr key={vaccine.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-2 font-medium">{vaccine.name}</td>
                    <td className="p-2">{new Date(vaccine.date).toLocaleDateString("pt-BR")}</td>
                    <td className="p-2">{vaccine.batch}</td>
                    <td className="p-2">{new Date(vaccine.nextDue).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Veterinarian Info */}
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-lg mb-3">VETERINÁRIO RESPONSÁVEL / ATTENDING VETERINARIAN</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Nome / Name:</p>
              <p className="font-semibold">{certificate.veterinarian}</p>
            </div>
            <div>
              <p className="text-sm font-medium">CRMV:</p>
              <p className="font-semibold">{certificate.crmv}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium">Clínica / Clinic:</p>
              <p className="font-semibold">{certificate.clinic}</p>
            </div>
          </div>
        </div>

        {/* QR Code and Signature */}
        <div className="flex justify-between items-end">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 border-2 border-dashed border-gray-400 rounded flex items-center justify-center mb-2">
              <QrCode className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-xs text-muted-foreground">QR Code de Verificação</p>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-gray-400 w-48 mb-2"></div>
            <p className="text-sm font-medium">{certificate.veterinarian}</p>
            <p className="text-xs text-muted-foreground">{certificate.crmv}</p>
            <p className="text-xs text-muted-foreground">Assinatura Digital</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t border-gray-300">
          <p className="text-xs text-muted-foreground">
            Este certificado é válido para transporte aéreo internacional e atende aos requisitos sanitários
            internacionais. / This certificate is valid for international air transport and meets international sanitary
            requirements.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Certificados de Viagem</h1>
          <p className="text-muted-foreground">Certificados internacionais para transporte aéreo de pets</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Novo Certificado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Criar Certificado Internacional</DialogTitle>
              <DialogDescription>Gere um certificado válido para viagens aéreas internacionais</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCertificate} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="petSelect">Pet *</Label>
                  <Select
                    value={newCertificate.petId}
                    onValueChange={(value) => setNewCertificate((prev) => ({ ...prev, petId: value }))}
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
                  <Label htmlFor="destination">Destino *</Label>
                  <Select
                    value={newCertificate.destination}
                    onValueChange={(value) => setNewCertificate((prev) => ({ ...prev, destination: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o país de destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departureDate">Data da Viagem *</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={newCertificate.departureDate}
                    onChange={(e) => setNewCertificate((prev) => ({ ...prev, departureDate: e.target.value }))}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issueDate">Data de Emissão *</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={newCertificate.issueDate}
                    onChange={(e) => setNewCertificate((prev) => ({ ...prev, issueDate: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="veterinarian">Veterinário Responsável *</Label>
                  <Input
                    id="veterinarian"
                    value={newCertificate.veterinarian}
                    onChange={(e) => setNewCertificate((prev) => ({ ...prev, veterinarian: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crmv">CRMV *</Label>
                  <Input
                    id="crmv"
                    value={newCertificate.crmv}
                    onChange={(e) => setNewCertificate((prev) => ({ ...prev, crmv: e.target.value }))}
                    placeholder="CRMV-SP 12345"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="clinic">Clínica Veterinária *</Label>
                  <Input
                    id="clinic"
                    value={newCertificate.clinic}
                    onChange={(e) => setNewCertificate((prev) => ({ ...prev, clinic: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {newCertificate.destination && (
                <Alert>
                  <Globe className="h-4 w-4" />
                  <AlertTitle>Requisitos para {newCertificate.destination}</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside mt-2">
                      {getRequiredVaccines(newCertificate.destination).map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Gerar Certificado
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Certificados Emitidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{certificates.length}</p>
            <p className="text-xs text-muted-foreground">Total de certificados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Válidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {certificates.filter((c) => new Date(c.validUntil) > new Date()).length}
            </p>
            <p className="text-xs text-muted-foreground">Certificados válidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Companhias Aceitas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{airlines.length}+</p>
            <p className="text-xs text-muted-foreground">Companhias aéreas</p>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Certificado Oficial A-agrodez</AlertTitle>
        <AlertDescription>
          Nossos certificados são reconhecidos internacionalmente e aceitos pelas principais companhias aéreas. Cada
          certificado possui QR Code para verificação de autenticidade.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="certificates" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="certificates">Meus Certificados</TabsTrigger>
          <TabsTrigger value="requirements">Requisitos por País</TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="space-y-4">
          {certificates.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {certificates.map((certificate) => {
                const pet = pets.find((p) => p.id === certificate.petId)
                const isValid = new Date(certificate.validUntil) > new Date()

                return (
                  <Card key={certificate.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>{pet?.species === "dog" ? "🐕" : "🐱"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{pet?.name}</h4>
                              <Badge variant={isValid ? "default" : "destructive"}>
                                {isValid ? "Válido" : "Expirado"}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>🌍 Destino: {certificate.destination}</p>
                              <p>📅 Viagem: {new Date(certificate.departureDate).toLocaleDateString("pt-BR")}</p>
                              <p>📋 Nº: {certificate.certificateNumber}</p>
                              <p>⏰ Válido até: {new Date(certificate.validUntil).toLocaleDateString("pt-BR")}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedCertificate(certificate)}
                            className="gap-1"
                          >
                            <FileText className="h-3 w-3" />
                            Ver
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                            <Download className="h-3 w-3" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Plane className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhum certificado emitido</h3>
                <p className="text-muted-foreground mb-4">Crie seu primeiro certificado de viagem</p>
                <Button onClick={() => setIsCreating(true)} className="bg-primary hover:bg-primary/90">
                  Criar Certificado
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <div className="grid gap-4">
            {countries.map((country) => (
              <Card key={country.code}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {country.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Requisitos obrigatórios:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {country.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Certificate Preview Modal */}
      {selectedCertificate && (
        <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Certificado Internacional de Saúde Animal</DialogTitle>
              <DialogDescription>Certificado Nº {selectedCertificate.certificateNumber}</DialogDescription>
            </DialogHeader>
            {renderCertificatePreview(selectedCertificate)}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setSelectedCertificate(null)}>
                Fechar
              </Button>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Download className="h-4 w-4" />
                Baixar PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Companhias Aéreas Parceiras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {airlines.map((airline) => (
              <div key={airline} className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>{airline}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
