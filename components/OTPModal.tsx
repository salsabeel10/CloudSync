'use client'
import React, { useState } from 'react'
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
} from '@/components/ui/alert-dialog'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import Image from 'next/image'
import { Button } from './ui/button'
import { sendEmailOTP, verifySecret } from '@/lib/actions/user.action'
import { useRouter } from 'next/navigation'

const OTPModal = ({
  accountID,
  email,
}: {
  accountID: string
  email: string
}) => {
  const [isOpen, setIsOpen] = useState(true)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router= useRouter()

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const sessionID = await verifySecret({accountID,password})
      if(sessionID) router.push("/")
    } catch (error) {
      console.log('Failed to Verify OTP', error)
    } finally {
      setIsLoading(false)
    }
  }
  const handleResendOtp = async () => {
    await sendEmailOTP({email});
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter Your OTP
            <Image
              src="/assets/icons/close-dark.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => setIsOpen(false)}
              className="otp-close-button"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            We've Sent a Code to{' '}
            <span className="pl-1 text-brand">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup>
            <InputOTPSlot index={0} className="shad-otp-slot" />
            <InputOTPSlot index={1} className="shad-otp-slot" />
            <InputOTPSlot index={2} className="shad-otp-slot" />
            <InputOTPSlot index={3} className="shad-otp-slot" />
            <InputOTPSlot index={4} className="shad-otp-slot" />
            <InputOTPSlot index={5} className="shad-otp-slot" />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            <AlertDialogAction
              onClick={handleSubmit}
              className="shad-submit-btn h-12"
              type="button"
            >
              Submit
              {isLoading && (<Image 
                src="/assets/icons/loader.svg"
                alt='loader'
                width={24}
                height={24}
                className='ml-2 animate-spin'
              />)}
            </AlertDialogAction>
            <div className='subtitle-2 mt-2 text-center text-light-100'>
                Didn't get a Code ?
                <Button type='button'
                variant="link"
                className='pl-1 text-brand'
                onClick={handleResendOtp}
                >
                    Click To Resend
                </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default OTPModal
