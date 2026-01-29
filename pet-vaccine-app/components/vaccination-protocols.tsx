"use client"

import { useState } from "react"
import { Calendar, Shield, AlertCircle, CheckCircle, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Pet {
  id: string
  name: string
  species: "dog" | "cat"
  birthDate: string
}

interface Vaccine {
  id: string
  petId: string
  name: string
  date: string
  nextDue: string
}

interface VaccinationProtocolsProps {
  pets: Pet[]
  vaccines: Vaccine[]
}

export function VaccinationProtocols({ pets, vaccines }: VaccinationProtocolsProps) {
  const [selectedPet, setSelectedPet] = useState<string>("")

  const dogProtocols = {
    puppy: [
      {
        name: "V8 ou V10 (Múltipla)",
        type: "core" as const,
        ages: [6, 9, 12, 16],
        description:
          "Cinomose, Hepatite, Parainfluenza, Parvovirose, Parainfluenza, Coronavirose, Adenovirose, Leptospirose",
        wsava: true,
        required: true,
      },
      {
        name: "Antirrábica",
        type: "core" as const,
        ages: [16],
        description: "Raiva - Obrigatória por lei",
        wsava: true,
        required: true,
      },
      {
        name: "Giárdia",
        type: "non-core" as const,
        ages: [8, 12],
        description: "Prevenção contra giardíase",
        wsava: false,
        required: false,
      },
      {
        name: "Tosse dos Canis",
        type: "non-core" as const,
        ages: [8, 12],
        description: "Bordetella bronchiseptica e Parainfluenza",
        wsava: false,
        required: false,
      },
      {
        name: "Leishmaniose",
        type: "non-core" as const,
        ages: [16, 20, 24],
        description: "Prevenção contra leishmaniose visceral",
        wsava: false,
        required: false,
      },
    ],
    adult: [
      {
        name: "V8 ou V10 (Múltipla) - Reforço Anual",
        type: "core" as const,
        ages: ["anual"],
        description: "Reforço anual das vacinas múltiplas",
        wsava: true,
        required: true,
      },
      {
        name: "Antirrábica - Reforço Anual",
        type: "core" as const,
        ages: ["anual"],
        description: "Reforço anual obrigatório",
        wsava: true,
        required: true,
      },
      {
        name: "Giárdia - Reforço Anual",
        type: "non-core" as const,
        ages: ["anual"],
        description: "Reforço anual conforme exposição",
        wsava: false,
        required: false,
      },
      {
        name: "Tosse dos Canis - Reforço Anual",
        type: "non-core" as const,
        ages: ["anual"],
        description: "Reforço anual para cães expostos",
        wsava: false,
        required: false,
      },
      {
        name: "Leishmaniose - Reforço Anual",
        type: "non-core" as const,
        ages: ["anual"],
        description: "Reforço anual em áreas endêmicas",
        wsava: false,
        required: false,
      },
    ],
  }

  const catProtocols = {
    kitten: [
      {
        name: "Tríplice Felina (V3)",
        type: "core" as const,
        ages: [6, 9, 12, 16],
        description: "Panleucopenia, Rinotraqueíte, Calicivirose",
        wsava: true,
        required: true,
      },
      {
        name: "Antirrábica",
        type: "core" as const,
        ages: [16],
        description: "Raiva - Obrigatória por lei",
        wsava: true,
        required: true,
      },
      {
        name: "Leucemia Felina (FeLV)",
        type: "non-core" as const,
        ages: [12, 16],
        description: "Para gatos com acesso à rua",
        wsava: false,
        required: false,
      },
      {
        name: "Clamidiose",
        type: "non-core" as const,
        ages: [9, 12],
        description: "Chlamydia felis",
        wsava: false,
        required: false,
      },
    ],
    adult: [
      {
        name: "Tríplice Felina - Reforço Anual",
        type: "core" as const,
        ages: ["anual"],
        description: "Reforço anual das vacinas essenciais",
        wsava: true,
        required: true,
      },
      {
        name: "Antirrábica - Reforço Anual",
        type: "core" as const,
        ages: ["anual"],
        description: "Reforço anual obrigatório",
        wsava: true,
        required: true,
      },
      {
        name: "Leucemia Felina - Reforço Anual",
        type: "non-core" as const,
        ages: ["anual"],
        description: "Para gatos com acesso à rua",
        wsava: false,
        required: false,
      },
    ],
  }

  const getAgeInWeeks = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - birth.getTime())
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
    return diffWeeks
  }

  const getPetVaccines = (petId: string) => {
    return vaccines.filter((v) => v.petId === petId)
  }

  const isVaccineCompleted = (petId: string, vaccineName: string) => {
    const petVaccines = getPetVaccines(petId)
    return petVaccines.some((v) => v.name.toLowerCase().includes(vaccineName.toLowerCase().split(" ")[0]))
  }

  const renderProtocolCard = (protocol: any, pet: Pet) => {
    const isCompleted = isVaccineCompleted(pet.id, protocol.name)
    const ageInWeeks = getAgeInWeeks(pet.birthDate)

    return (
      <Card key={protocol.name} className={`${isCompleted ? "border-green-200 bg-green-50" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">{protocol.name}</h4>
                <Badge variant={protocol.type === "core" ? "default" : "outline"}>
                  {protocol.type === "core" ? "Essencial" : "Opcional"}
                </Badge>
                {protocol.wsava && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    WSAVA
                  </Badge>
                )}
                {protocol.required && (
                  <Badge variant="destructive" className="bg-red-100 text-red-800">
                    Obrigatória
                  </Badge>
                )}
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{protocol.description}</p>
              <div className="text-xs text-muted-foreground">
                {Array.isArray(protocol.ages) ? (
                  <p>Idades: {protocol.ages.join(", ")} semanas</p>
                ) : (
                  <p>Frequência: {protocol.ages}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              {isCompleted ? (
                <Badge variant="default" className="bg-green-600">
                  Completa
                </Badge>
              ) : (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  Pendente
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const selectedPetData = pets.find((p) => p.id === selectedPet)
  const ageInWeeks = selectedPetData ? getAgeInWeeks(selectedPetData.birthDate) : 0
  const ageCategory = ageInWeeks < 20 ? "puppy" : "adult"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Protocolos de Vacinação</h1>
          <p className="text-muted-foreground">Baseado nas diretrizes WSAVA, CFMV e AAHA</p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Protocolos Atualizados 2024</AlertTitle>
        <AlertDescription>
          Seguimos as mais recentes diretrizes da WSAVA (World Small Animal Veterinary Association) e do CFMV (Conselho
          Federal de Medicina Veterinária) para garantir a melhor proteção aos pets.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Vacinas Core (Essenciais)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">100%</p>
            <p className="text-xs text-muted-foreground">Recomendadas para todos os pets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Protocolo WSAVA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">2024</p>
            <p className="text-xs text-muted-foreground">Diretrizes atualizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Conformidade Legal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">CFMV</p>
            <p className="text-xs text-muted-foreground">Aprovado pelo conselho</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecionar Pet para Protocolo</CardTitle>
          <CardDescription>Escolha um pet para ver o protocolo vacinal recomendado</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedPet} onValueChange={setSelectedPet}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um pet" />
            </SelectTrigger>
            <SelectContent>
              {pets.map((pet) => (
                <SelectItem key={pet.id} value={pet.id}>
                  {pet.name} ({pet.species === "dog" ? "Cão" : "Gato"}) - {getAgeInWeeks(pet.birthDate)} semanas
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedPetData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Protocolo para {selectedPetData.name}
              </CardTitle>
              <CardDescription>
                {selectedPetData.species === "dog" ? "Cão" : "Gato"} • {ageInWeeks} semanas de idade •{" "}
                {ageCategory === "puppy" ? "Filhote" : "Adulto"}
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="recommended" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recommended">Protocolo Recomendado</TabsTrigger>
              <TabsTrigger value="schedule">Cronograma Vacinal</TabsTrigger>
            </TabsList>

            <TabsContent value="recommended" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vacinas Essenciais (Core)</h3>
                {selectedPetData.species === "dog"
                  ? dogProtocols[ageCategory as keyof typeof dogProtocols]
                      .filter((p) => p.type === "core")
                      .map((protocol) => renderProtocolCard(protocol, selectedPetData))
                  : catProtocols[ageCategory === "puppy" ? "kitten" : "adult"]
                      .filter((p) => p.type === "core")
                      .map((protocol) => renderProtocolCard(protocol, selectedPetData))}

                <h3 className="text-lg font-semibold mt-6">Vacinas Opcionais (Non-Core)</h3>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Vacinas opcionais devem ser consideradas baseadas no estilo de vida, exposição e região geográfica
                    do pet.
                  </AlertDescription>
                </Alert>
                {selectedPetData.species === "dog"
                  ? dogProtocols[ageCategory as keyof typeof dogProtocols]
                      .filter((p) => p.type === "non-core")
                      .map((protocol) => renderProtocolCard(protocol, selectedPetData))
                  : catProtocols[ageCategory === "puppy" ? "kitten" : "adult"]
                      .filter((p) => p.type === "non-core")
                      .map((protocol) => renderProtocolCard(protocol, selectedPetData))}
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Cronograma Vacinal
                  </CardTitle>
                  <CardDescription>Idades recomendadas para cada vacina</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ageCategory === "puppy" && (
                      <div className="grid gap-4">
                        <div className="border-l-4 border-primary pl-4">
                          <h4 className="font-semibold">6-8 semanas</h4>
                          <p className="text-sm text-muted-foreground">
                            Primeira dose da vacina múltipla (V8/V10 ou Tríplice Felina)
                          </p>
                        </div>
                        <div className="border-l-4 border-primary pl-4">
                          <h4 className="font-semibold">9-12 semanas</h4>
                          <p className="text-sm text-muted-foreground">
                            Segunda dose + vacinas opcionais (Giárdia, Tosse dos Canis)
                          </p>
                        </div>
                        <div className="border-l-4 border-primary pl-4">
                          <h4 className="font-semibold">12-16 semanas</h4>
                          <p className="text-sm text-muted-foreground">Terceira dose + Leucemia Felina (gatos)</p>
                        </div>
                        <div className="border-l-4 border-red-500 pl-4">
                          <h4 className="font-semibold">16+ semanas</h4>
                          <p className="text-sm text-muted-foreground">
                            Antirrábica (obrigatória) + última dose múltipla
                          </p>
                        </div>
                      </div>
                    )}
                    {ageCategory === "adult" && (
                      <div className="grid gap-4">
                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-semibold">Anualmente</h4>
                          <p className="text-sm text-muted-foreground">
                            Reforço de todas as vacinas essenciais (múltipla + antirrábica)
                          </p>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold">Conforme Exposição</h4>
                          <p className="text-sm text-muted-foreground">
                            Vacinas opcionais baseadas no estilo de vida do pet
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Diretrizes Internacionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium">WSAVA (World Small Animal Veterinary Association)</p>
              <p className="text-muted-foreground">Diretrizes globais para vacinação de pequenos animais</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium">CFMV (Conselho Federal de Medicina Veterinária)</p>
              <p className="text-muted-foreground">Regulamentação brasileira para vacinação animal</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-purple-600 mt-0.5" />
            <div>
              <p className="font-medium">AAHA (American Animal Hospital Association)</p>
              <p className="text-muted-foreground">Protocolos norte-americanos de vacinação</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
