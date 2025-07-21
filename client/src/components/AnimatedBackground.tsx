// import { useEffect, useRef } from "react";
// import * as THREE from "three";

// const ThreeBackground = () => {
//   const mountRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const scene = new THREE.Scene();

//     const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     camera.position.z = 5;

//     const renderer = new THREE.WebGLRenderer({ alpha: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);

//     const mount = mountRef.current;
//     if (mount) {
//       mount.appendChild(renderer.domElement);
//     }

//     // Zərrəciklər
//     const particleCount = 1200;
//     const geometry = new THREE.BufferGeometry();
//     const positions = new Float32Array(particleCount * 3);

//     for (let i = 0; i < particleCount * 3; i++) {
//       positions[i] = (Math.random() - 0.5) * 20;
//     }

//     geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

//     const material = new THREE.PointsMaterial({
//       size: 0.08,
//       color: new THREE.Color("#a855f7"), // bənövşəyi
//       transparent: true,
//       opacity: 0.8,
//     });

//     const particles = new THREE.Points(geometry, material);
//     scene.add(particles);

//     const animate = () => {
//       requestAnimationFrame(animate);
//       particles.rotation.y += 0.0015;
//       particles.rotation.x += 0.0007;
//       renderer.render(scene, camera);
//     };

//     animate();

//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       if (mount?.contains(renderer.domElement)) {
//         mount.removeChild(renderer.domElement);
//       }
//     };
//   }, []);

//   return (
//     <div
//       ref={mountRef}
//       className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900"
//     />
//   );
// };

// export default ThreeBackground;

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const mount = mountRef.current;
    if (mount) {
      mount.appendChild(renderer.domElement);
    }

    // Create bubble spheres
    const bubbleCount = 80;
    const bubbles: THREE.Mesh[] = [];

    for (let i = 0; i < bubbleCount; i++) {
      const geometry = new THREE.SphereGeometry(
        Math.random() * 0.3 + 0.1, // Random size between 0.1 and 0.4
        16,
        16
      );

      // Alternate between green and white colors
      const isGreen = Math.random() > 0.5;
      const material = new THREE.MeshBasicMaterial({
        color: isGreen ? new THREE.Color("#90EE90") : new THREE.Color("#FFFFFF"), // Light green or white
        transparent: true,
        opacity: Math.random() * 0.4 + 0.6, // Random opacity between 0.6 and 1.0
      });

      const bubble = new THREE.Mesh(geometry, material);
      
      // Random position
      bubble.position.x = (Math.random() - 0.5) * 20;
      bubble.position.y = (Math.random() - 0.5) * 20;
      bubble.position.z = (Math.random() - 0.5) * 20;
      
      // Store random velocity for each bubble
      (bubble as any).velocity = {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      };

      bubbles.push(bubble);
      scene.add(bubble);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      
      // Animate each bubble individually
      bubbles.forEach((bubble) => {
        const velocity = (bubble as any).velocity;
        
        // Move bubbles
        bubble.position.x += velocity.x;
        bubble.position.y += velocity.y;
        bubble.position.z += velocity.z;
        
        // Rotate bubbles
        bubble.rotation.x += 0.01;
        bubble.rotation.y += 0.015;
        
        // Bounce off boundaries
        if (bubble.position.x > 10 || bubble.position.x < -10) velocity.x *= -1;
        if (bubble.position.y > 10 || bubble.position.y < -10) velocity.y *= -1;
        if (bubble.position.z > 10 || bubble.position.z < -10) velocity.z *= -1;
      });
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mount?.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-green-50 via-green-100 to-green-200"
    />
  );
};

export default ThreeBackground;