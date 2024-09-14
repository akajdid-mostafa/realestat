// LoadingAnimation.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';
console.log("sqsq")
const LoadingAnimation = () => {
  return (
    <Box
      className="container"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'white',
      }}
    >
      <Box
        className="boxes"
        sx={{
          '--size': '48px', // Modified size
          '--duration': '800ms',
          height: 'calc(var(--size) * 2)',
          width: 'calc(var(--size) * 3)',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transformOrigin: '50% 50%',
          transform: 'rotateX(60deg) rotateZ(45deg) rotateY(0deg) translateZ(0px)',
        }}
      >
        {[...Array(4)].map((_, index) => (
          <Box
            key={index}
            className="box"
            sx={{
              width: 'var(--size)',
              height: 'var(--size)',
              top: 0,
              left: 0,
              position: 'absolute',
              transformStyle: 'preserve-3d',
              animation: `box${index + 1} var(--duration) linear infinite`,
              transform: `translate(${index % 2 === 0 ? '100%' : '0'}, ${index < 2 ? '0' : '100%'})`,
            }}
          >
            {[...Array(4)].map((_, divIndex) => (
              <Box
                key={divIndex}
                sx={{
                  '--background': '#5C8DF6', // Original color
                  '--top': 'auto',
                  '--right': 'auto',
                  '--bottom': 'auto',
                  '--left': 'auto',
                  '--translateZ': 'calc(var(--size) / 2)',
                  '--rotateY': '0deg',
                  '--rotateX': '0deg',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: 'var(--background)',
                  top: 'var(--top)',
                  right: 'var(--right)',
                  bottom: 'var(--bottom)',
                  left: 'var(--left)',
                  transform: `rotateY(var(--rotateY)) rotateX(var(--rotateX)) translateZ(var(--translateZ))`,
                  ...(divIndex === 1 && {
                    '--background': '#145af2',
                    '--right': '0',
                    '--rotateY': '90deg',
                  }),
                  ...(divIndex === 2 && {
                    '--background': '#447cf5',
                    '--rotateX': '-90deg',
                  }),
                  ...(divIndex === 3 && {
                    '--background': '#DBE3F4',
                    '--translateZ': 'calc(var(--size) * 3 * -1)',
                  }),
                }}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LoadingAnimation;