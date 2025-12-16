'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { messageSchema } from '@/schemas/messageSchema';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { ApiResponse } from '@/util/ApiResponse';
import { toast } from 'sonner';

function Page() {
  const [sending, setSending] = useState(false);
  const params = useParams();
  const username = params?.username as string;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setSending(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username,
        content: data.content,
      });

      if (!response.data.success) {
        toast.error(response.data.message || 'Failed to send message');
      } else {
        toast.success(response.data.message || 'Message sent successfully');
      }

      console.log('Message submitted', { username, ...data });
      form.reset();
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } }
        message?: string
      };
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong while sending message';
      toast.error(msg);
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-16 pb-10 bg-white">
      <div className="w-full max-w-3xl">
        <h1 className="text-center font-bold text-3xl md:text-5xl mb-10">
          Public Profile Link
        </h1>

        <p className="text-sm md:text-base font-semibold mb-3">
          Send Anonymous Message to <span className="font-bold">@{username}</span>
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-full h-12 md:h-14 rounded-xl px-4 py-3 text-sm md:text-base border border-gray-200 shadow-sm"
                      placeholder="Write your anonymous message here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                disabled={sending}
                className="mt-4 px-8 py-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white"
              >
                {sending ? 'Sending...' : 'Send It'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;