'use client'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verification } from '@/schemas/verifySchema'
import { ApiResponse } from '@/util/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

function VerifyAccount() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const usernameParam = useParams<{ username: string }>();
    
    const form = useForm<z.infer<typeof verification>>({
        resolver: zodResolver(verification),
    });
    
    const onSubmit = async (data: z.infer<typeof verification>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/verifycode', {
                username: usernameParam.username, // Fixed: typo and space
                code: data.code
            });
            toast.success("Username verified successfully");
            router.replace('/sign-in');
        } catch (error) {
            console.log("Error in verification of code");
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            console.log(errorMessage);
            toast.error(errorMessage || "Error while verifying the code"); // Fixed: use actual error message
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                        Verify Your Account
                    </h1>
                    <p className='mb-4'>
                        Enter the verification code sent to your email
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name='code'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter 6-digit code' {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? 'Verifying...' : 'Submit'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default VerifyAccount;