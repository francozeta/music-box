'use client'

import { useState } from 'react'
import { MessageCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function ContactSupport() {
  const [open, setOpen] = useState(false)
  
  const handleWhatsApp = () => {
    window.open('https://web.whatsapp.com/send?phone=51965080664', '_blank')
  }

  const handleEmail = () => {
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=francozeta2011@gmail.com', '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start bg-zinc-900 text-white"
        >
          <MessageCircle size={24} />
          <span className="ml-2 max-lg:hidden">Contact Support</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2 bg-zinc-900 text-white"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="h-5 w-5" />
            Contact via WhatsApp
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2 bg-zinc-900 text-white"
            onClick={handleEmail}
          >
            <Mail className="h-5 w-5" />
            Contact via Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}