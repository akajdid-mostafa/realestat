/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button  } from "@chakra-ui/react"
import Link from 'next/link'



// Service data with Chakra UI compatible color classes
const services = [
  {
    image: "/images/achat.jpg", // Add image path here
    title: "Achat d'un bien immobilier",
    description: "Trouvez la propriété de vos rêves grâce à nos expériences photographiques immersives et à nos listes complètes, y compris des propriétés uniques que vous ne trouverez nulle part ailleurs.",
    cta: "Trouver un bien",
    href:"/properties?tab=FOR%2BVente",
  },
  {
    image: "/images/lour.jpg",
    title: "Location immobiliers",
    description: "Profitez de l'expérience de la location d'un bien immobilier - de la consultation de notre vaste réseau à l'envoi de candidatures et au paiement du loyer, le tout en un seul endroit.",
    cta: "Louer un bien", 
    href: "/properties?tab=FOR%2BLocation",      
  },
  {
    image: "/images/vent.jpg",
    title: "Vente d'un bien immobilier",
    description: "Vendez votre propriété en toute sérénité avec notre expertise. Que ce soit via notre programme innovant ou une vente traditionnelle, nous vous accompagnons à chaque étape pour une transaction réussie.",
    cta: "Vendre votre bien",
    href: "/service",
  },
  {
    image: "/images/managment.jpg",
    title: "Gestion immobilière",
    description: "Simplifiez la gestion de vos biens immobiliers avec notre service complet. De la maintenance à la recherche de locataires, nous nous occupons de tout pour maximiser votre investissement et assurer votre tranquillité d'esprit.",
    cta: "Gérer votre bien",
    href: "/service",
  }
]

export default function CardService() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5  // Adjust this value based on when you want the animation to start
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <div ref={ref} className="container mx-auto px-4 py-16">
      <div className="text-center mb-6">
        <h3 className="text-xl font-medium text-gray-600 mb-4">Nos services</h3>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre objectif principal</h2>
        <div className="w-80 h-1 bg-blue-600 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 mt-14 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <motion.div 
            key={index}
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: (index < 2) ? -200 : 200 },
              visible: { opacity: 1, x: 0 }
            }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-105 relative flex flex-col justify-between" // Added flex layout here
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div>
              <div className={`h-2 bg-blue-600`}></div>
              <div className="p-4">
                <div className="flex justify-center mb-4">
                  <div className={` bg-opacity-20 rounded-full flex items-center justify-center`}>
                    {/* Increase image size */}
                    <img src={service.image} alt={service.title} className="w-48 h-48" /> 
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4  text-center">{service.title}</h3>
                <p className="text-gray-600 p-2 font-semibold text-center ">{service.description}</p>
              </div>
            </div>
            <div className="pb-8 pl-4 pr-4">
              <div className="flex justify-center">
                <Link href={service.href}>
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
                </Link>
              </div>
            </div>
            <motion.div 
              className={`absolute bottom-0 left-0 w-full h-1 bg-blue-600`}
              initial={{ width: "0%" }}
              animate={{ width: hoveredIndex === index ? "100%" : "0%" }}
              transition={{ duration: 0.6 }}
            ></motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
