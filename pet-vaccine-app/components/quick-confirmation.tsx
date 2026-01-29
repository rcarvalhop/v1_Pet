"use client"

import { useState } from "react"
import { Check, Clock, Calendar, Pill, Syringe, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Pet {
  id: string
  name: string
  species: "dog" | "cat"
  breed: string
  weight: number
  owner: string
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

interface QuickConfirmationProps {
  pets: Pet[]
  pendingItems: PendingVaccine[]
  onConfirmVaccine: (confirmation: any) => void
  onConfirmMedication: (confirmation: any) => void
}

export default function QuickConfirmation({
  pets,
  pendingItems,
  onConfirmVaccine,
  onConfirmMedication,
}: QuickConfirmationProps) {
  const [selectedItem, setSelectedItem] = useState<PendingVaccine | null>(null)
  const [confirmationData, setConfirmationData] = useState({
    applicationDate: new Date().toISOString().split("T")[0],
    batch: "",
    notes: "",
    nextDueDate: "",
    confirmedBy: "veterinarian" as "veterinarian" | "owner",
  })

  // Regras para cálculo da próxima dose
  const vaccineIntervals = {
    "V8 (Óctupla)": { months: 12, type: "annual" },
    "V10 (Múltipla)": { months: 12, type: "annual" },
    "V12 (Múltipla)": { months: 12, type: "annual" },
    Antirrábica: { months: 12, type: "annual" },
    "Tríplice Felina": { months: 12, type: "annual" },
    "Quádrupla Felina": { months: 12, type: "annual" },
    "Quíntupla Felina": { months: 12, type: "annual" },
    Giárdia: { months: 12, type: "annual" },
    Leishmaniose: { months: 12, type: "annual" },
    "Leucemia Felina": { months: 12, type: "annual" },
    "Gripe Canina": { months: 6, type: "biannual" },
    "Tosse dos Canis": { months: 12, type: "annual" },
  }

  const medicationIntervals = {
    Bravecto: { months: 3, type: "quarterly" },
    NexGard: { months: 1, type: "monthly" },
    Simparic: { months: 1, type: "monthly" },
    Revolution: { months: 1, type: "monthly" },
    Advocate: { months: 1, type: "monthly" },
    Drontal: { months: 3, type: "quarterly" },
    Milbemax: { months: 3, type: "quarterly" },
    Heartgard: { months: 1, type: "monthly" },
  }

  const calculateNextDue = (itemName: string, applicationDate: string, type: "vaccine" | "medication") => {
    const intervals = type === "vaccine" ? vaccineIntervals : medicationIntervals
    const interval = intervals[itemName as keyof typeof intervals]

    if (!interval) return ""

    const appDate = new Date(applicationDate)
    const nextDate = new Date(appDate)
    nextDate.setMonth(nextDate.getMonth() + interval.months)

    return nextDate.toISOString().split("T")[0]
  }

  const handleItemSelect = (item: PendingVaccine) => {
    setSelectedItem(item)
    const nextDue = calculateNextDue(item.vaccineName, confirmationData.applicationDate, item.type)
    setConfirmationData((prev) => ({
      ...prev,
      nextDueDate: nextDue,
    }))
  }

  const handleDateChange = (date: string) => {
    setConfirmationData((prev) => ({ ...prev, applicationDate: date }))
    if (selectedItem) {
      const nextDue = calculateNextDue(selectedItem.vaccineName, date, selectedItem.type)
      setConfirmationData((prev) => ({ ...prev, nextDueDate: nextDue }))
    }
  }

  const handleQuickConfirm = () => {
    if (!selectedItem) return

    const confirmation = {
      id: selectedItem.id,
      petId: selectedItem.petId,
      name: selectedItem.vaccineName,
      date: confirmationData.applicationDate,
      nextDue: confirmationData.nextDueDate,
      veterinarian: selectedItem.veterinarian,
      clinic: selectedItem.clinic,
      batch: confirmationData.batch,
      notes: confirmationData.notes,
      confirmedBy: confirmationData.confirmedBy,
      confirmedAt: new Date().toISOString(),
    }

    if (selectedItem.type === "vaccine") {
      onConfirmVaccine(confirmation)
    } else {
      onConfirmMedication(confirmation)
    }

    // Reset form
    setSelectedItem(null)
    setConfirmationData({
      applicationDate: new Date().toISOString().split("T")[0],
      batch: "",
      notes: "",
      nextDueDate: "",
      confirmedBy: "veterinarian",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-orange-200 bg-orange-50"
      case "low":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Urgente</Badge>
      case "medium":
        return <Badge variant="secondary">Moderada</Badge>
      case "low":
        return <Badge variant="outline">Baixa</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const getOverdueDays = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = today.getTime() - due.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary">Confirmação Rápida</h2>
          <p className="text-sm text-muted-foreground">Confirme aplicações pendentes</p>
        </div>
        <Badge variant="destructive" className="gap-1">
          <Clock className="h-3 w-3" />
          {pendingItems.length} pendentes
        </Badge>
      </div>

      {/* Lista de itens pendentes */}
      <div className="space-y-3">
        {pendingItems.map((item) => {
          const pet = pets.find((p) => p.id === item.petId)
          const overdueDays = getOverdueDays(item.dueDate)

          return (
            <Card
              key={item.id}
              className={`cursor-pointer transition-all hover:shadow-md ${getPriorityColor(item.priority)}`}
              onClick={() => handleItemSelect(item)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{pet?.species === "dog" ? "🐕" : "🐱"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm truncate">{pet?.name}</h4>
                        {getPriorityBadge(item.priority)}
                        {item.type === "vaccine" ? (
                          <Syringe className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Pill className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-primary">{item.vaccineName}</p>
                      <div className="text-xs text-muted-foreground">
                        <p>Vencimento: {new Date(item.dueDate).toLocaleDateString("pt-BR")}</p>
                        {overdueDays > 0 && <p className="text-red-600 font-medium">Atrasado há {overdueDays} dias</p>}
                        <p>👨‍⚕️ {item.veterinarian}</p>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                    <Check className="h-3 w-3" />
                    Confirmar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {pendingItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Check className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-600" />
            <h3 className="text-lg font-semibold mb-2">Tudo em dia!</h3>
            <p className="text-muted-foreground">Não há vacinas ou medicamentos pendentes</p>
          </CardContent>
        </Card>
      )}

      {/* Modal de confirmação */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedItem?.type === "vaccine" ? (
                <Syringe className="h-5 w-5 text-blue-600" />
              ) : (
                <Pill className="h-5 w-5 text-green-600" />
              )}
              Confirmar {selectedItem?.type === "vaccine" ? "Vacina" : "Medicamento"}
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.vaccineName} - {pets.find((p) => p.id === selectedItem?.petId)?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="applicationDate">Data da Aplicação *</Label>
              <Input
                id="applicationDate"
                type="date"
                value={confirmationData.applicationDate}
                onChange={(e) => handleDateChange(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            {confirmationData.nextDueDate && (
              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span>Próxima dose:</span>
                    <Badge variant="outline" className="font-mono">
                      {new Date(confirmationData.nextDueDate).toLocaleDateString("pt-BR")}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="batch">Lote {selectedItem?.type === "vaccine" ? "da Vacina" : "do Medicamento"}</Label>
              <Input
                id="batch"
                value={confirmationData.batch}
                onChange={(e) => setConfirmationData((prev) => ({ ...prev, batch: e.target.value }))}
                placeholder="Número do lote"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmedBy">Confirmado por</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={confirmationData.confirmedBy === "veterinarian" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setConfirmationData((prev) => ({ ...prev, confirmedBy: "veterinarian" }))}
                  className="flex-1"
                >
                  Veterinário
                </Button>
                <Button
                  type="button"
                  variant={confirmationData.confirmedBy === "owner" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setConfirmationData((prev) => ({ ...prev, confirmedBy: "owner" }))}
                  className="flex-1"
                >
                  Tutor
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={confirmationData.notes}
                onChange={(e) => setConfirmationData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Reações, observações..."
                rows={2}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setSelectedItem(null)} className="flex-1">
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
              <Button onClick={handleQuickConfirm} className="flex-1 bg-primary hover:bg-primary/90">
                <Check className="h-4 w-4 mr-1" />
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
