'use-client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
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

type messageProp  = {
    message:Message;
    onMessageDelete : (messageID:string)=>void;

}
export function CardDemo({message , onMessageDelete}:messageProp) {
    const handleMessageDelete =async ()=>{
       const response =  axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
       toast("Message deleted successfully")
       onMessageDelete(String(message._id));
    }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
         <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><X/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleMessageDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      </CardHeader>
    
    </Card>
  )
}
