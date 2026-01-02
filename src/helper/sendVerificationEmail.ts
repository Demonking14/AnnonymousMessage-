
import  VerificationEmail from '../../emailtemplate/verificationEmail';
import { Resend } from 'resend';
import { ApiResponse } from '@/util/ApiResponse';


const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function sendVerificationEmail(username:string , email : string , verifyCode:string): Promise<ApiResponse>  {
  try {
    console.log(email)
    await resend.emails.send({
      from: 'MystryMessage <onboarding@resend.dev>',
      to:[email],
      subject: 'Verification Code | MystryMessage',
      react: VerificationEmail({username  , verifyCode}),
    });


    return {success:true , message:"Email sent successfully" }
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error(err?.message ?? "Error in sending email from resend");
    return {success:false  , message: "Error in sending email from resend" }
    
  }
}
