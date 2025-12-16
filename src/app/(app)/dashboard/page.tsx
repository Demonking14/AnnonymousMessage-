"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { Message } from "@/models/Users";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAcceptingSchema } from "@/schemas/acceptingMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/util/ApiResponse";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import { CardDemo } from "@/components/messageCard";

function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(true);
  const initializedUserId = useRef<string | null>(null);

  const handleDeleteMessage = (messageID: string) => {
    setMessages((prevMessages) => prevMessages.filter((message) => message._id !== messageID));
  };

  const form = useForm({
    resolver: zodResolver(isAcceptingSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("isAcceptingMessage");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-message');
      setValue('isAcceptingMessage', response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Error in getting message acceptance status');
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessage = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success("Showing Latest Messages", {
          description: "Refreshed messages",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Error in getting messages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { data: session } = useSession();
  const userId = session?.user?._id;
  
  useEffect(() => {
    if (!userId || initializedUserId.current === userId) return;
    initializedUserId.current = userId;
    fetchAcceptMessage();
    fetchMessage();
  }, [userId, fetchAcceptMessage, fetchMessage]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-message', {
        isAcceptingMessage: !acceptMessages
      });
      setValue('isAcceptingMessage', !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Error updating message acceptance');
    }
  };

  if (!session || !session.user) {
    return <div className="p-4">Please Login</div>;
  }

  const { username } = session.user;
  const baseURL = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const profileURL = `${baseURL}/u/${username}`;
  
  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(profileURL);
      toast.success("URL copied successfully");
    }
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={profileURL} 
            disabled 
            className="input input-bordered w-full border rounded-2xl p-4" 
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <Switch 
          {...register('isAcceptingMessage')} 
          checked={acceptMessages} 
          onCheckedChange={handleSwitchChange} 
          disabled={isSwitchLoading}
        />
        <span className="ml-2">Accept Messages: {acceptMessages ? 'ON' : 'OFF'}</span>
      </div>
      <Separator />

      <Button className="mt-4" variant='outline' onClick={(e) => {
        e.preventDefault();
        fetchMessage(true);
      }}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Refreshing...
          </>
        ) : (
          <>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh Messages
          </>
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <CardDemo
              key={String(message._id) || index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;