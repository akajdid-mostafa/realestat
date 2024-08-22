// house.js

const House = [
    {
      id: 1,
      title: 'Cozy Cottage',
      fullBathrooms: 1,
      halfBathrooms: 1,
      bedrooms: 2,
      squareFeet: 1200,
      location: 'Countryside, USA',
      thumbnail: {
        data: {
          attributes: {
            formats: {
              small: {
                url: '/images/hero.jpg',
              },
            },
            url: '/images/hero.jpg',
          },
        },
      },
    },
    {
      id: 2,
      title: 'Modern Apartment',
      fullBathrooms: 2,
      halfBathrooms: 0,
      bedrooms: 3,
      squareFeet: 1500,
      location: 'City Center, USA',
      thumbnail: {
        data: {
          attributes: {
            formats: {
              small: {
                url: '/images/OIP.jfif',
              },
            },
            url: '/images/modern-apartment.jpg',
          },
        },
      },
    },
    // Add more house objects as needed
  ];
  
  export default House;
  