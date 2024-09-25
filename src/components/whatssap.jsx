// WhatsAppFloatingButton.js
import React from 'react';
import Image from 'next/image';


export const WhatsApp = () => {
  const phoneNumber = '+212808649090'; // Replace with your WhatsApp number
  const message = 'Hi *IMMOCEAN*! I need more info about oceanconnecting https://immocean.ma/'; // Replace with your default message

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      style={styles.button}
    >
      <Image 
        src="/images/whatsapp.svg"
        alt="WhatsApp" 
        style={styles.icon} 
        width={40}
        height={40}
      />
    </a>
  );
};

const styles = {
    button: {
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      backgroundColor: '#25D366',
      borderRadius: '50%',
      padding: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textDecoration: 'none',
      color: 'white',
      zIndex: '1000',
      transition: 'transform 0.3s ease-in-out',
      animation: 'pulse 2s infinite'
    },
    icon: {
      width: '40px',
      height: '40px',
    },
  };

export default WhatsApp;
