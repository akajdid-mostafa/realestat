'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Home, DollarSign, Handshake } from 'lucide-react'
import { Button } from "@chakra-ui/react"

// Service data with Chakra UI compatible color classes
const services = [
  {
    icon: Home,
    title: "Vente immobiliers",
    description: "Trouvez la propriété de vos rêves grâce à nos expériences photographiques immersives et à nos listes complètes, y compris des propriétés uniques que vous ne trouverez nulle part ailleurs.",
    cta: "Trouver un bien",
  },
  {
    icon: DollarSign,
    title: "Location immobiliers",
    description: "Profitez de l'expérience de la location d'un bien immobilier - de la consultation de notre vaste réseau à l'envoi de candidatures et au paiement du loyer, le tout en un seul endroit.",
    cta: "Louer un bien",
  },
  {
    icon: Handshake,
    title: "Consultation sur la propriété",
    description: "Whether you choose our innovative Offers program or a traditional sale, we'll guide you to a successful and profitable transaction.",
    cta: "Sell A Home",
  }
]

export default function CardService() {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-600 mb-2">Our Services</h3>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Main Focus</h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 mt-14 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-105 relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className={`h-2 bg-blue-600`}></div>
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className={`w-20 h-20 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center`}>
                  <service.icon className={`w-10 h-10 text-blue-600`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{service.title}</h3>
              <p className="text-gray-600 mb-6 text-center">{service.description}</p>
              <div className="flex justify-center">
                <Button
                  bg="blue.600"
                  color="white"
                  variant="solid"
                  width="full"
                  size="lg"
                  fontWeight="bold"
                  borderRadius="full"
                  _hover={{
                    bg: "blue.700",
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  _active={{
                    bg: "blue.800",
                    transform: "translateY(-1px)",
                    boxShadow: "md",
                  }}
                  transition="all 0.3s"
                >
                  {service.cta}
                </Button>
              </div>
              <motion.div 
                className={`absolute bottom-0 left-0 w-full h-1 bg-blue-600`}
                initial={{ width: "0%" }}
                animate={{ width: hoveredIndex === index ? "100%" : "0%" }}
                transition={{ duration: 0.6 }}
              ></motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
