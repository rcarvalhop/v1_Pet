"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Calculator, Apple, AlertCircle, Info } from "lucide-react"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Pet {
  id: string
  name: string
  species: "dog" | "cat"
  breed: string
  birthDate: string
  weight: number
  owner: string
  activityLevel?: "low" | "moderate" | "high"
  neutered?: boolean
  healthConditions?: string[]
}

interface NutritionalPlan {
  id: string
  petId: string
  foodBrand: string
  foodLine: string
  dailyAmount: number
  mealsPerDay: number
  calories: number
  protein: number
  fat: number
  fiber: number
  startDate: string
  veterinarian: string
  notes?: string
  supplements?: string[]
}

interface NutritionalPlanProps {
  pets: Pet[]
  nutritionalPlans: NutritionalPlan[]
  onAddNutritionalPlan: (plan: Omit<NutritionalPlan, "id">) => void
}

export function NutritionalPlan({ pets, nutritionalPlans, onAddNutritionalPlan }: NutritionalPlanProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [selectedPet, setSelectedPet] = useState<string>("")
  const [newPlan, setNewPlan] = useState({
    petId: "",
    foodBrand: "",
    foodLine: "",
    dailyAmount: 0,
    mealsPerDay: 2,
    calories: 0,
    protein: 0,
    fat: 0,
    fiber: 0,
    startDate: new Date().toISOString().split("T")[0],
    veterinarian: "Dr. Carlos Mendes",
    notes: "",
    supplements: [] as string[],
  })

  const foodBrands = {
    "Royal Canin": {
      dog: [
        { name: "Golden Retriever Adult", protein: 23, fat: 12, fiber: 3.9, calories: 4000 },
        { name: "Labrador Adult", protein: 25, fat: 11, fiber: 3.8, calories: 3950 },
        { name: "German Shepherd Adult", protein: 24, fat: 12, fiber: 4.2, calories: 3980 },
        { name: "Mini Adult", protein: 27, fat: 16, fiber: 2.5, calories: 4100 },
        { name: "Medium Adult", protein: 25, fat: 14, fiber: 2.8, calories: 4050 },
        { name: "Maxi Adult", protein: 26, fat: 13, fiber: 3.1, calories: 4000 },
        { name: "Digestive Care", protein: 24, fat: 12, fiber: 4.5, calories: 3900 },
        { name: "Weight Care", protein: 28, fat: 9, fiber: 6.5, calories: 3650 },
      ],
      cat: [
        { name: "Persian Adult", protein: 30, fat: 22, fiber: 5.2, calories: 4200 },
        { name: "British Shorthair Adult", protein: 31, fat: 19, fiber: 4.8, calories: 4150 },
        { name: "Indoor Adult", protein: 27, fat: 13, fiber: 6.1, calories: 3900 },
        { name: "Sterilised", protein: 37, fat: 12, fiber: 6.4, calories: 3750 },
        { name: "Digestive Care", protein: 38, fat: 15, fiber: 5.8, calories: 3950 },
        { name: "Hairball Care", protein: 34, fat: 15, fiber: 6.9, calories: 3900 },
      ],
    },
    "Hill's": {
      dog: [
        { name: "Science Diet Adult", protein: 21, fat: 13, fiber: 3.5, calories: 4000 },
        { name: "Prescription Diet i/d", protein: 25.5, fat: 14.9, fiber: 2.5, calories: 4120 },
        { name: "Prescription Diet r/d", protein: 35.9, fat: 8.5, fiber: 11, calories: 3200 },
        { name: "Prescription Diet k/d", protein: 14.2, fat: 18.3, fiber: 2.5, calories: 4120 },
        { name: "Science Diet Small Paws", protein: 24.5, fat: 15.5, fiber: 3, calories: 4150 },
      ],
      cat: [
        { name: "Science Diet Adult", protein: 32, fat: 20, fiber: 3, calories: 4200 },
        { name: "Prescription Diet i/d", protein: 38.4, fat: 15.5, fiber: 1.4, calories: 4120 },
        { name: "Prescription Diet r/d", protein: 39.9, fat: 8.9, fiber: 8.5, calories: 3200 },
        { name: "Prescription Diet k/d", protein: 28.6, fat: 19.4, fiber: 1.4, calories: 4120 },
        { name: "Science Diet Indoor", protein: 35.2, fat: 15.2, fiber: 6.9, calories: 3900 },
      ],
    },
    Premier: {
      dog: [
        { name: "Golden Formula", protein: 24, fat: 14, fiber: 4, calories: 4050 },
        { name: "Ambientes Internos", protein: 26, fat: 12, fiber: 4.5, calories: 3950 },
        { name: "Raças Pequenas", protein: 28, fat: 16, fiber: 3.5, calories: 4200 },
        { name: "Sênior", protein: 22, fat: 10, fiber: 5, calories: 3800 },
      ],
      cat: [
        { name: "Ambientes Internos", protein: 33, fat: 12, fiber: 6, calories: 3900 },
        { name: "Castrados", protein: 35, fat: 10, fiber: 7, calories: 3750 },
        { name: "Sênior", protein: 30, fat: 12, fiber: 5.5, calories: 3850 },
      ],
    },
    Pedigree: {
      dog: [
        { name: "Adulto", protein: 21, fat: 8, fiber: 4, calories: 3600 },
        { name: "Raças Pequenas", protein: 24, fat: 10, fiber: 3.5, calories: 3750 },
        { name: "Sênior", protein: 20, fat: 7, fiber: 4.5, calories: 3500 },
      ],
      cat: [],
    },
    Whiskas: {
      dog: [],
      cat: [
        { name: "Adulto", protein: 32, fat: 13, fiber: 4, calories: 3950 },
        { name: "Castrado", protein: 34, fat: 11, fiber: 5, calories: 3800 },
        { name: "Sênior", protein: 30, fat: 12, fiber: 4.5, calories: 3750 },
      ],
    },
  }

  const supplements = [
    "Ômega 3",
    "Ômega 6",
    "Glucosamina",
    "Condroitina",
    "Probióticos",
    "L-Carnitina",
    "Taurina",
    "Vitamina E",
    "Vitamina C",
    "Cálcio",
    "Fósforo",
    "Zinco",
  ]

  const getAgeInMonths = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - birth.getTime())
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
    return diffMonths
  }

  const calculateIdealWeight = (pet: Pet) => {
    // Simplified calculation based on breed and species
    if (pet.species === "dog") {
      const breedWeights: { [key: string]: { min: number; max: number } } = {
        "Golden Retriever": { min: 25, max: 34 },
        Labrador: { min: 25, max: 36 },
        "German Shepherd": { min: 22, max: 40 },
        Poodle: { min: 20, max: 32 },
        Bulldog: { min: 18, max: 25 },
        Beagle: { min: 9, max: 11 },
        Yorkshire: { min: 2, max: 3.2 },
        Chihuahua: { min: 1.5, max: 3 },
      }
      const breedWeight = breedWeights[pet.breed] || { min: 10, max: 30 }
      return (breedWeight.min + breedWeight.max) / 2
    } else {
      return pet.neutered ? 4.5 : 4.0 // Average cat weight
    }
  }

  const calculateDailyCalories = (pet: Pet) => {
    const idealWeight = calculateIdealWeight(pet)
    const ageInMonths = getAgeInMonths(pet.birthDate)
    let baseCalories = 0

    if (pet.species === "dog") {
      baseCalories = Math.round(70 * Math.pow(idealWeight, 0.75))
    } else {
      baseCalories = Math.round(70 * Math.pow(idealWeight, 0.75))
    }

    // Adjust for activity level
    const activityMultiplier = {
      low: pet.neutered ? 1.2 : 1.4,
      moderate: pet.neutered ? 1.4 : 1.6,
      high: pet.neutered ? 1.6 : 1.8,
    }

    const multiplier = activityMultiplier[pet.activityLevel || "moderate"]

    // Adjust for age
    if (ageInMonths < 12) {
      return Math.round(baseCalories * multiplier * 2) // Puppies/kittens need more calories
    } else if (ageInMonths > 84) {
      return Math.round(baseCalories * multiplier * 0.8) // Senior pets need fewer calories
    }

    return Math.round(baseCalories * multiplier)
  }

  const calculateFoodAmount = (calories: number, foodCalories: number) => {
    return Math.round((calories / foodCalories) * 1000) // grams per day
  }

  const getWeightStatus = (pet: Pet) => {
    const idealWeight = calculateIdealWeight(pet)
    const currentWeight = pet.weight
    const percentage = ((currentWeight - idealWeight) / idealWeight) * 100

    if (percentage > 20) return { status: "Obesidade", color: "text-red-600", variant: "destructive" as const }
    if (percentage > 10) return { status: "Sobrepeso", color: "text-orange-600", variant: "secondary" as const }
    if (percentage < -10) return { status: "Abaixo do peso", color: "text-blue-600", variant: "outline" as const }
    return { status: "Peso ideal", color: "text-green-600", variant: "default" as const }
  }

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault()
    onAddNutritionalPlan(newPlan)
    setNewPlan({
      petId: "",
      foodBrand: "",
      foodLine: "",
      dailyAmount: 0,
      mealsPerDay: 2,
      calories: 0,
      protein: 0,
      fat: 0,
      fiber: 0,
      startDate: new Date().toISOString().split("T")[0],
      veterinarian: "Dr. Carlos Mendes",
      notes: "",
      supplements: [],
    })
    setIsCreating(false)
  }

  const handleFoodLineChange = (foodLine: string) => {
    const pet = pets.find((p) => p.id === newPlan.petId)
    if (!pet || !newPlan.foodBrand) return

    const brandData = foodBrands[newPlan.foodBrand as keyof typeof foodBrands]
    const speciesData = brandData[pet.species]
    const foodData = speciesData.find((f) => f.name === foodLine)

    if (foodData) {
      const dailyCalories = calculateDailyCalories(pet)
      const dailyAmount = calculateFoodAmount(dailyCalories, foodData.calories)

      setNewPlan((prev) => ({
        ...prev,
        foodLine,
        dailyAmount,
        calories: dailyCalories,
        protein: foodData.protein,
        fat: foodData.fat,
        fiber: foodData.fiber,
      }))
    }
  }

  const renderNutritionalCard = (plan: NutritionalPlan) => {
    const pet = pets.find((p) => p.id === plan.petId)
    const weightStatus = pet ? getWeightStatus(pet) : null
    const mealAmount = Math.round(plan.dailyAmount / plan.mealsPerDay)

    return (
      <Card key={plan.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{pet?.species === "dog" ? "🐕" : "🐱"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-base truncate">{pet?.name}</h4>
              <p className="text-xs text-muted-foreground truncate">
                {pet?.breed} • {pet?.weight}kg
              </p>
              {weightStatus && (
                <Badge variant={weightStatus.variant} className="mt-1 text-xs">
                  {weightStatus.status}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-primary/5 p-3 rounded-lg">
              <h5 className="font-semibold text-primary text-sm mb-2">Ração Atual</h5>
              <p className="font-medium text-sm truncate">
                {plan.foodBrand} - {plan.foodLine}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Quantidade</p>
                  <p className="font-semibold">{plan.dailyAmount}g/dia</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Refeições</p>
                  <p className="font-semibold">
                    {plan.mealsPerDay}x ({mealAmount}g)
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Calorias</p>
                  <p className="font-semibold">{plan.calories} kcal</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Veterinário</p>
                  <p className="font-semibold text-xs truncate">{plan.veterinarian}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-blue-50 rounded">
                <p className="text-xs text-muted-foreground">Proteína</p>
                <p className="text-sm font-bold text-blue-600">{plan.protein}%</p>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded">
                <p className="text-xs text-muted-foreground">Gordura</p>
                <p className="text-sm font-bold text-orange-600">{plan.fat}%</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <p className="text-xs text-muted-foreground">Fibra</p>
                <p className="text-sm font-bold text-green-600">{plan.fiber}%</p>
              </div>
            </div>

            {plan.supplements && plan.supplements.length > 0 && (
              <div>
                <p className="text-xs font-medium mb-1">Suplementos:</p>
                <div className="flex flex-wrap gap-1">
                  {plan.supplements.map((supplement) => (
                    <Badge key={supplement} variant="outline" className="text-xs">
                      {supplement}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {plan.notes && <div className="bg-gray-50 p-2 rounded text-xs text-muted-foreground">{plan.notes}</div>}
          </div>
        </CardContent>
      </Card>
    )
  }

  const selectedPetData = pets.find((p) => p.id === selectedPet)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-primary">Nutrição</h1>
          <p className="text-sm text-muted-foreground">Planos nutricionais</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Novo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Criar Plano Nutricional</DialogTitle>
              <DialogDescription>Configure a alimentação ideal para seu pet</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="petSelect">Pet *</Label>
                  <Select
                    value={newPlan.petId}
                    onValueChange={(value) => setNewPlan((prev) => ({ ...prev, petId: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o pet" />
                    </SelectTrigger>
                    <SelectContent>
                      {pets.map((pet) => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.name} ({pet.species === "dog" ? "Cão" : "Gato"}) - {pet.weight}kg
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foodBrand">Marca da Ração *</Label>
                  <Select
                    value={newPlan.foodBrand}
                    onValueChange={(value) => setNewPlan((prev) => ({ ...prev, foodBrand: value, foodLine: "" }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(foodBrands).map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="foodLine">Linha da Ração *</Label>
                  <Select
                    value={newPlan.foodLine}
                    onValueChange={handleFoodLineChange}
                    required
                    disabled={!newPlan.foodBrand || !newPlan.petId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a linha da ração" />
                    </SelectTrigger>
                    <SelectContent>
                      {newPlan.foodBrand && newPlan.petId && (
                        <>
                          {foodBrands[newPlan.foodBrand as keyof typeof foodBrands][
                            pets.find((p) => p.id === newPlan.petId)?.species || "dog"
                          ].map((food) => (
                            <SelectItem key={food.name} value={food.name}>
                              {food.name}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mealsPerDay">Refeições por dia *</Label>
                  <Select
                    value={newPlan.mealsPerDay.toString()}
                    onValueChange={(value) => setNewPlan((prev) => ({ ...prev, mealsPerDay: Number.parseInt(value) }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 refeição</SelectItem>
                      <SelectItem value="2">2 refeições</SelectItem>
                      <SelectItem value="3">3 refeições</SelectItem>
                      <SelectItem value="4">4 refeições</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="veterinarian">Veterinário Responsável *</Label>
                  <Input
                    id="veterinarian"
                    value={newPlan.veterinarian}
                    onChange={(e) => setNewPlan((prev) => ({ ...prev, veterinarian: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {newPlan.petId && newPlan.foodLine && (
                <Alert>
                  <Calculator className="h-4 w-4" />
                  <AlertTitle>Cálculo Automático</AlertTitle>
                  <AlertDescription>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="font-medium">Quantidade diária: {newPlan.dailyAmount}g</p>
                        <p className="font-medium">Calorias: {newPlan.calories} kcal</p>
                      </div>
                      <div>
                        <p className="font-medium">
                          Por refeição: {Math.round(newPlan.dailyAmount / newPlan.mealsPerDay)}g
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Baseado no peso, idade e nível de atividade do pet
                        </p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="supplements">Suplementos (opcional)</Label>
                <div className="grid grid-cols-3 gap-2">
                  {supplements.map((supplement) => (
                    <label key={supplement} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newPlan.supplements.includes(supplement)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewPlan((prev) => ({ ...prev, supplements: [...prev.supplements, supplement] }))
                          } else {
                            setNewPlan((prev) => ({
                              ...prev,
                              supplements: prev.supplements.filter((s) => s !== supplement),
                            }))
                          }
                        }}
                        className="rounded"
                      />
                      <span>{supplement}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={newPlan.notes}
                  onChange={(e) => setNewPlan((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Instruções especiais, restrições alimentares, etc."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Criar Plano
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs">Planos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-primary">{nutritionalPlans.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs">Peso Ideal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-green-600">
              {pets.filter((pet) => getWeightStatus(pet).status === "Peso ideal").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs">Dieta</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-orange-600">
              {pets.filter((pet) => ["Sobrepeso", "Obesidade"].includes(getWeightStatus(pet).status)).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs">Marcas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-blue-600">{new Set(nutritionalPlans.map((p) => p.foodBrand)).size}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plans">Planos Nutricionais</TabsTrigger>
          <TabsTrigger value="calculator">Calculadora Nutricional</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          {nutritionalPlans.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">{nutritionalPlans.map(renderNutritionalCard)}</div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Apple className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhum plano nutricional</h3>
                <p className="text-muted-foreground mb-4">Crie o primeiro plano nutricional para seus pets</p>
                <Button onClick={() => setIsCreating(true)} className="bg-primary hover:bg-primary/90">
                  Criar Plano
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculadora Nutricional
              </CardTitle>
              <CardDescription>Calcule as necessidades nutricionais do seu pet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedPet} onValueChange={setSelectedPet}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um pet para calcular" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name} ({pet.species === "dog" ? "Cão" : "Gato"}) - {pet.weight}kg
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedPetData && (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Informações do Pet</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Nome:</span> {selectedPetData.name}
                          </p>
                          <p>
                            <span className="font-medium">Espécie:</span>{" "}
                            {selectedPetData.species === "dog" ? "Cão" : "Gato"}
                          </p>
                          <p>
                            <span className="font-medium">Raça:</span> {selectedPetData.breed}
                          </p>
                          <p>
                            <span className="font-medium">Peso atual:</span> {selectedPetData.weight}kg
                          </p>
                          <p>
                            <span className="font-medium">Idade:</span> {getAgeInMonths(selectedPetData.birthDate)}{" "}
                            meses
                          </p>
                          <p>
                            <span className="font-medium">Castrado:</span> {selectedPetData.neutered ? "Sim" : "Não"}
                          </p>
                          <p>
                            <span className="font-medium">Atividade:</span>{" "}
                            {selectedPetData.activityLevel === "low"
                              ? "Baixa"
                              : selectedPetData.activityLevel === "high"
                                ? "Alta"
                                : "Moderada"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">Cálculos Nutricionais</h4>
                        <div className="space-y-3">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground">Peso ideal estimado</p>
                            <p className="text-lg font-bold text-blue-600">
                              {calculateIdealWeight(selectedPetData).toFixed(1)}kg
                            </p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground">Calorias diárias necessárias</p>
                            <p className="text-lg font-bold text-green-600">
                              {calculateDailyCalories(selectedPetData)} kcal
                            </p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground">Status do peso</p>
                            <Badge variant={getWeightStatus(selectedPetData).variant} className="mt-1">
                              {getWeightStatus(selectedPetData).status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedPetData.healthConditions && selectedPetData.healthConditions.length > 0 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Condições de Saúde</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc list-inside mt-2">
                            {selectedPetData.healthConditions.map((condition, index) => (
                              <li key={index} className="capitalize">
                                {condition}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-2 text-sm">Consulte seu veterinário para um plano nutricional específico.</p>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Dicas Nutricionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium">Transição Gradual</p>
              <p className="text-muted-foreground">Sempre faça a mudança de ração gradualmente ao longo de 7-10 dias</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium">Horários Regulares</p>
              <p className="text-muted-foreground">Mantenha horários fixos para as refeições</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-purple-600 mt-0.5" />
            <div>
              <p className="font-medium">Água Fresca</p>
              <p className="text-muted-foreground">Sempre disponibilize água limpa e fresca</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-orange-600 mt-0.5" />
            <div>
              <p className="font-medium">Controle de Peso</p>
              <p className="text-muted-foreground">
                Monitore o peso regularmente e ajuste as porções conforme necessário
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
