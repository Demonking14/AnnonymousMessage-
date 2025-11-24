'use client'
import { Form , FormControl,  FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verification } from '@/schemas/verifySchema'
import { ApiResponse } from '@/util/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import {  useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

function verifyAccount() {
    const router = useRouter();
    const usernameParam = useParams<{username:string}>();
 const form = useForm<z.infer<typeof verification>>({
     resolver: zodResolver(verification),
   });
    const onSubmit = async(data:z.infer<typeof verification>)=>{
        try {
            const response = await axios.post('/api/verifycode' , {usrname:usernameParam .username, code:data.code});
            toast("Username verified successfully");
            router.replace('/sign-in')
            
        } catch (error) {
              console.log("Error in verification of code");
                  const axiosError = error as AxiosError<ApiResponse>;
                  const errorMessage = axiosError.response?.data.message;
            
                  console.log(errorMessage);
                  toast("Erro while verifying the code ");
            
        }

    }
    
  return (


    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
                <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Verify Your Account</h1>
                <p className='mb-4'>
                    Enter the verification Code sent to your email
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <FormField control={form.control}
                    name='code'
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Verification Code</FormLabel>
                            <FormControl>
                                <Input placeholder='code' {...field}/>
                            </FormControl>
                        </FormItem>
                    )}/>
                    <Button type='submit' >Submit</Button>
                </form>

            </Form>
        </div>
    </div>
  )
}

export default verifyAccount