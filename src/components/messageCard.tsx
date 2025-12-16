'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { X } from "lucide-react"
import axios from "axios"
import { ApiResponse } from "@/util/ApiResponse"
import { Message } from "@/models/Users"
import { toast } from "sonner"

type MessageCardProps = {
  message: Message
  onMessageDelete: (messageID: string) => void
}

export function CardDemo({ message, onMessageDelete }: MessageCardProps) {
  const handleMessageDelete = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      )

      if (!response.data.success) {
        toast.error(response.data.message || "Failed to delete message")
        return
      }

      toast.success(response.data.message || "Message deleted successfully")
      onMessageDelete(String(message._id))
    } catch (error) {
      const err = error as any
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while deleting message"
      toast.error(msg)
      console.error("Error deleting message:", err)
    }
  }

  const formattedDate = new Date(message.createdAt).toLocaleString()

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Anonymous Message
        </CardTitle>
        <CardAction>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete this message permanently?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleMessageDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-gray-800 leading-relaxed">
          {message.content}
        </p>
        <CardDescription className="text-xs text-gray-500">
          {formattedDate}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

