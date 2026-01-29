"use client"

import { useState } from "react"
import { Bell, AlertTriangle, Calendar, Pill, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Pet {
  id: string
  name: string
  species: "dog" | "cat"
  owner: string
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

interface NotificationCenterProps {
  notifications: Notification[]
  pets: Pet[]
  onMarkAsRead: (notificationId: string) => void
}

export default function NotificationCenter({ notifications, pets, onMarkAsRead }: NotificationCenterProps) {
  const [filterType, setFilterType] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "vaccine_overdue":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "medication_reminder":
        return <Pill className="h-5 w-5 text-blue-500" />
      case "appointment_reminder":
        return <Calendar className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Alta</Badge>
      case "medium":
        return <Badge variant="secondary">Média</Badge>
      case "low":
        return <Badge variant="outline">Baixa</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "vaccine_overdue":
        return "Vacina Atrasada"
      case "medication_reminder":
        return "Lembrete de Medicamento"
      case "appointment_reminder":
        return "Lembrete de Consulta"
      default:
        return "Notificação"
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesType = filterType === "all" || notification.type === filterType
    const matchesPriority = filterPriority === "all" || notification.priority === filterPriority
    return matchesType && matchesPriority
  })

  const unreadNotifications = filteredNotifications.filter((n) => !n.isRead)
  const readNotifications = filteredNotifications.filter((n) => n.isRead)

  const renderNotificationCard = (notification: Notification) => {
    const pet = pets.find((p) => p.id === notification.petId)
    const timeAgo = getTimeAgo(new Date(notification.date))

    return (
      <Card
        key={notification.id}
        className={`transition-all hover:shadow-md ${
          !notification.isRead ? "border-l-4 border-l-primary bg-primary/5" : ""
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-sm">{notification.title}</h4>
                    {getPriorityBadge(notification.priority)}
                    {!notification.isRead && (
                      <Badge variant="default" className="bg-primary">
                        Nova
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-xs">{pet?.species === "dog" ? "🐕" : "🐱"}</AvatarFallback>
                      </Avatar>
                      <span>{pet?.name}</span>
                    </div>
                    <span>•</span>
                    <span>{timeAgo}</span>
                    <span>•</span>
                    <span>{getTypeLabel(notification.type)}</span>
                  </div>
                </div>
                {!notification.isRead && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="ml-2 h-8 w-8 p-0"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Agora"
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h atrás`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d atrás`

    return date.toLocaleDateString("pt-BR")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Central de Notificações</h1>
          <p className="text-muted-foreground">Acompanhe lembretes importantes sobre seus pets</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            {unreadNotifications.length} não lidas
          </Badge>
        </div>
      </div>

      <div className="flex gap-4">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="vaccine_overdue">Vacinas Atrasadas</SelectItem>
            <SelectItem value="medication_reminder">Medicamentos</SelectItem>
            <SelectItem value="appointment_reminder">Consultas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as prioridades</SelectItem>
            <SelectItem value="high">Alta Prioridade</SelectItem>
            <SelectItem value="medium">Média Prioridade</SelectItem>
            <SelectItem value="low">Baixa Prioridade</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="unread" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unread" className="gap-2">
            <Bell className="h-4 w-4" />
            Não Lidas ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="read" className="gap-2">
            <Check className="h-4 w-4" />
            Lidas ({readNotifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unread" className="space-y-4">
          {unreadNotifications.length > 0 ? (
            <div className="space-y-4">
              {unreadNotifications
                .sort((a, b) => {
                  // Sort by priority first (high -> medium -> low)
                  const priorityOrder = { high: 3, medium: 2, low: 1 }
                  if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[b.priority] - priorityOrder[a.priority]
                  }
                  // Then by date (newest first)
                  return new Date(b.date).getTime() - new Date(a.date).getTime()
                })
                .map(renderNotificationCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma notificação não lida</h3>
                <p className="text-muted-foreground">Todas as notificações foram visualizadas</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-4">
          {readNotifications.length > 0 ? (
            <div className="space-y-4">
              {readNotifications
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(renderNotificationCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Check className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma notificação lida</h3>
                <p className="text-muted-foreground">As notificações lidas aparecerão aqui</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {notifications.length > 0 && (
        <Card className="bg-gradient-to-r from-primary/10 to-agrodez-yellow/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <AlertTriangle className="h-5 w-5" />
              Dicas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Vacinas atrasadas podem comprometer a saúde do seu pet</p>
            <p>• Mantenha sempre os medicamentos preventivos em dia</p>
            <p>• Consulte regularmente seu veterinário para orientações</p>
            <p>• Em caso de emergência, procure atendimento imediatamente</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
