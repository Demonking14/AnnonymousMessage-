'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from '@/data/messages.json'
import Autoplay from 'embla-carousel-autoplay'

function Home() {
  return (
    <>
      <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-8 md:py-12 min-h-screen bg-gradient-to-b from-gray-50 to-white'>
        <section className='text-center mb-8 md:mb-12 max-w-4xl'>
          <h1 className='text-3xl md:text-5xl lg:text-6xl font-bold bg-black bg-clip-text text-transparent mb-4'>
            Dive into the World of Mystry Conversation
          </h1>
          <p className='mt-3 md:mt-4 text-base md:text-lg text-gray-600'>
            Explore MystryMessage - Where your identity remains a secret
          </p>
        </section>
        
        <div className="w-full max-w-6xl">
          <Carousel 
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {messages.map((message, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 hover:border-blue-300">
                      <CardHeader className="pb-3">
                        <h3 className="text-lg font-semibold text-gray-800">{message.title}</h3>
                      </CardHeader>
                      <CardContent className="flex-1 flex items-center justify-center p-4 md:p-6 min-h-[120px] md:min-h-[140px]">
                        <span className="text-base md:text-lg font-medium text-gray-700 text-center leading-relaxed">
                          {message.content}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </main>
      
      <footer className='bg-gray-900 text-white text-center py-6 mt-auto'>
        <p className='text-sm'>© 2024 MystryMessage. All rights reserved. Made with ❤️ for privacy lovers.</p>
      </footer>
    </>
  )
}

export default Home