import React from 'react';
import Image from 'next/image';
import { MdOutgoingMail, MdPhoneInTalk, MdLocationOn, MdAccessTimeFilled } from 'react-icons/md';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FiYoutube } from 'react-icons/fi';
import { BsTwitterX } from 'react-icons/bs';


export default function Footer() {
    return (
        <section
            className=" footer-container px-3  bg-gray-50 sm:pt-16 lg:pt-14"
        >
            <div className="px-3 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
                    {/* Logo and Social Media Icons */}
                    <div className="flex flex-col items-start space-y-6">
                        <div className="flex flex-col items-start">
                            <Image
                                src="/images/logo-footer.png"
                                alt="Logo Footer"
                                width={150}
                                height={50}
                            />
                            <p className="text-base leading-relaxed text-gray-600 mt-7">
                                Nous fournissons un service complet pour la vente, l'achat ou la location de biens immobiliers. Nous opérons depuis plus de 10 ans. Recherchez des millions d'appartements et de maisons sur ImmOcean.
                            </p>
                        </div>
                        <ul className="flex space-x-3">
                            {/* Social Icons */}
                            <li>
                                <a href="mailto:maroc.immocean@gmail.com" title="Email" className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-8 h-8 hover:bg-blue-600 focus:bg-blue-600">
                                    <MdOutgoingMail className="w-5 h-5" />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.facebook.com/immocean" title="Facebook" className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-8 h-8 hover:bg-blue-600 focus:bg-blue-600">
                                    <FaFacebookF className="w-5 h-5" />
                                </a>
                            </li>
                            <li>
                                <a href="#" title="Instagram" className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-8 h-8 hover:bg-blue-600 focus:bg-blue-600">
                                    <FaInstagram className="w-5 h-5" />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.youtube.com/@Immocean" title="YouTube" className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-8 h-8 hover:bg-blue-600 focus:bg-blue-600">
                                    <FiYoutube className="w-5 h-5" />
                                </a>
                            </li>
                            <li>
                                <a href="#" title="Twitter" className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-8 h-8 hover:bg-blue-600 focus:bg-blue-600">
                                    <BsTwitterX className="w-5 h-5" />
                                </a>
                            </li>
                        </ul>
                    </div>
                    {/* Contact Information */}
                    <div>
                        <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">CONTACT US</p>
                        <ul className="mt-6 space-y-4">
                            <li className="flex items-center text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600">
                                <a href="mailto:maroc.immocean@gmail.com" className="flex items-center space-x-2">
                                    <MdOutgoingMail className="w-5 h-5" />
                                    <span>maroc.immocean@gmail.com</span>
                                </a>
                            </li>
                            <li className="flex items-center text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600">
                                <a href="tel:(+212)808649090" className="flex items-center space-x-2">
                                    <MdPhoneInTalk className="w-5 h-5" />
                                    <span>(+212) 808 649 090</span>
                                </a>
                            </li>
                            <li className="flex items-center text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600">
                                <a href="https://www.google.com/maps/place/OCEAN+SALON/@30.425408,-9.5784345,17.25z/data=!4m6!3m5!1s0xdb3b749bc4427ed:0x5bf6650d940ea1ea!8m2!3d30.4254483!4d-9.5755472!16s%2Fg%2F11tcq05c1r?entry=ttu&g_ep=EgoyMDI0MDgyMS4wIKXMDSoASAFQAw%3D%3D" className="flex items-center space-x-2">
                                    <MdLocationOn className="w-5 h-5" />
                                    <span>Garage Nr:, 791 EL GOUIRA, Agadir 80000</span>
                                </a>
                            </li>
                            <li className="flex items-center text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600">
                                <a href="#" className="flex items-center space-x-2">
                                    <MdAccessTimeFilled className="w-5 h-5" />
                                    <span>9:00 AM to 6:00 PM</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    {/* Newsletter Subscription */}
                    <div className="flex flex-col space-y-6">
                        <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Subscribe to newsletter</p>
                        <form action="#" method="POST" className="flex flex-col space-y-4">
                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                />
                            </div>
                            <button  type="submit" className="inline-flex items-center justify-center  px-6 py-4 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-md hover:bg-blue-700 focus:bg-blue-700">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
                <Image
                                src="/images/footer-art.svg"
                                alt=""
                                width="1200" 
                                height="160"
                            />
            </div>
        </section>
    );
}
