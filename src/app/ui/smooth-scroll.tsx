
'use client';
import { ReactLenis } from '@studio-freight/react-lenis';

function SmoothScrolling({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.2, duration: 0.5, smoothTouch: true }}>
      {children}
    </ReactLenis>
  );
}

export default SmoothScrolling;