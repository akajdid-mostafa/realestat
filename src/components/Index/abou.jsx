import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaHome, FaImage, FaDumbbell, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion"; // For animations

const Abouta = () => {
    const router = useRouter();

    // Badge Component
    const Badge = ({ text }) => {
        return (
            <motion.span
                className="bg-blue-50 text-blue-600 rounded-full px-7 font-bold text-xl py-1"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 70 }}
            >
                {text}
            </motion.span>
        );
    };

    // Quote Component
    const Quote = ({ text, bgColorClass, borderColorClass }) => {
        return (
            <motion.div
                className={`quote text-gray-500 pl-10 ${bgColorClass} py-5 leading-7 lg:pr-32 pr-12 border-l-4 ${borderColorClass}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
            >
                {`"${text}"`}
            </motion.div>
        );
    };

    // IconWithText Component
    const IconWithText = ({ text, Icon }) => {
        return (
            <motion.div
                className="icon-with-text flex gap-4 items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
            >
                <div className="bg-blue-50 rounded-full p-3">
                    {Icon && <Icon className="text-blue-600 text-2xl" />}
                </div>
                <span className="text-gray-500 font-semibold text-xl">{text}</span>
            </motion.div>
        );
    };

    // ButtonRed Component
    const ButtonRed = ({ text, handleClick, width }) => {
        return (
            <motion.button
                className={`${width === "full" ? "w-full" : "w-60"} bg-blue-600 hover:bg-blue-800 transition-all tracking-wider rounded p-3 text-white`}
                style={{ padding: ".6rem" }}
                onClick={handleClick}
                whileHover={{ scale: 1.05, rotate: 3, transition: { duration: 0.3 } }}
            >
                {text}
            </motion.button>
        );
    };

    return (
        <motion.div
            className="container mx-auto px-16 mt-0 p-5 sm:mt-48 lg:mt-28"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 70 }}
        >
            <div className="grid grid-cols-12 items-center">
                <motion.div
                    className="col-span-12 lg:pr-10 mb-10 md:mb-10 lg:mb-0 md:col-span-12 lg:col-span-6 sm:col-span-12"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Image
                        className="mx-auto"
                        src="/images/7.png"
                        alt="House"
                        width={800} // Replace with your image width
                        height={600} // Replace with your image height
                    />
                </motion.div>
                <div className="col-span-12 md:col-span-12 lg:col-span-6 sm:col-span-12">
                    <Badge text="About Us" />
                    <motion.h1
                        className="my-6 font-bold sm:text-2xl md:text-2xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-tight"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        Le premier marché de la location de biens immobiliers
                        <span className="text-blue-600">.</span>
                    </motion.h1>
                    <motion.span
                        className="text-gray-500 mb-6 font-bold text-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Plus de 39 000 personnes travaillent pour nous dans plus de 70 pays à travers le monde.
                        dans le monde entier. L'étendue de notre couverture mondiale, combinée à des services
                        spécialisés
                    </motion.span>
                    <div className="icons grid grid-cols-12 mt-14">
                        <motion.div
                            className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <IconWithText Icon={FaHome} text="Conception d'une maison intelligente" />
                        </motion.div>
                        <motion.div
                            className="col-span-12 mt-6 sm:mt-0 sm:col-span-6 md:col-span-6 lg:col-span-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <IconWithText Icon={FaImage} text="Belle scène environnante" />
                        </motion.div>
                        <motion.div
                            className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6 mt-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <IconWithText Icon={FaDumbbell} text="Un mode de vie exceptionnel" />
                        </motion.div>
                        <motion.div
                            className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6 mt-6"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <IconWithText Icon={FaShieldAlt} text="Sécurité complète 24/7" />
                        </motion.div>
                    </div>

                    <div className="quote-section mt-8 font-semibold text-lg">
                        <Quote
                            text="Vous avez des questions ou besoin d'aide ? Nous sommes là pour vous aider ! Cliquez sur le bouton « Nous contacter » pour obtenir une assistance rapide de la part de notre équipe."
                            borderColorClass="border-blue-600"
                            bgColorClass="bg-blue-50"
                        />
                    </div>
                    <div className="btn-section mt-12 font-bold text-xl">
                        <ButtonRed
                            width="inherit"
                            text="Nous contacter"
                            handleClick={() => router.push("/contact")}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Abouta;
