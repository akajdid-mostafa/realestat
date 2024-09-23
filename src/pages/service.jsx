import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { Box, Container, ChakraBaseProvider } from "@chakra-ui/react"; // Combine Chakra UI imports
import theme from "../types/CmsSingleTypes/theme";
import Footer from "../components/Index/Footer";
import "../styles/globals.css";
import Layout from "../components/Index/Layout";
import Manage from "../components/manage";
import ContactForm from "../components/Index/ContactForm";
import CoreFeatures from "../components/CoreFeatures";
import Work from "../components/work";

const service = ({ siteInfo }) => {
  return (
    <ChakraBaseProvider theme={theme}>
      <Layout siteInfo={siteInfo}>
        <Box>
          <CoreFeatures 
          firsttitle="Gestion immobilière"
          title="Gérer tous les biens immobiliers avec une garantie de rendement mensuel fixe"
          text="Gérez tous vos biens immobiliers par l'intermédiaire de notre bureau, avec des rendements garantis et sans tracas."
          image="/images/sale.jpg"
          />
          <Box>
            <Work
            title1="Contacter l'Agence"
            text1="Gérez tous vos biens immobiliers par l'intermédiaire de notre bureau, avec des rendements garantis et sans tracas."
            title2="Navigateur immobilier"
            text2="Gérez tous vos biens immobiliers par l'intermédiaire de notre bureau, avec des rendements garantis et sans tracas."
            title3="Accord sur les conditions"
            text3="Gérez tous vos biens immobiliers par l'intermédiaire de notre bureau, avec des rendements garantis et sans tracas."
            title4="Paiement des cotisations"
            text4="Gérez tous vos biens immobiliers par l'intermédiaire de notre bureau, avec des rendements garantis et sans tracas."
            />
          </Box>
          <CoreFeatures 
          firsttitle="Vendre votre bien"
          title="Bienvenue pour nous faire découvrir votre bien"
          text="Vous êtes au bon endroit pour confier votre bien à notre agence et vous assurer une vente légale et rentable."
          image="/images/manger.jpg"
          />
          <Box>
            <Work
            title1="Contacter l'Agence"
            text1="Gérez tous vos biens immobiliers par l'intermédiaire de notre bureau, avec des rendements garantis et sans tracas."
            title2="Navigateur immobilier"
            text2="Gérez tous vos biens immobiliers par l'intermédiaire de notre bureau, avec des rendements garantis et sans tracas."
            title3="Accord sur les conditions"
            text3="Gérez tous vos biens immobiliers par l'intermédiaire de notre bureau, avec des rendements garantis et sans tracas."
            title4="Paiement des cotisations"
            text4="Gérez tous vos biens immobiliers par l'intermédiaire de notre bureau, avec des rendements garantis et sans tracas."
            />
          </Box>
          <Container maxW={{ base: "none", md: "container.xl" }} py={4}>
            <ContactForm />
          </Container>
          <Footer />
        </Box>
      </Layout>
    </ChakraBaseProvider>
  );
};
export default service;
