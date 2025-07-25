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

    const bubbleCount = 80;
    const bubbles: THREE.Mesh[] = [];

    for (let i = 0; i < bubbleCount; i++) {
      const geometry = new THREE.SphereGeometry(
        Math.random() * 0.3 + 0.1,
        16,
        16
      );

      const isGreen = Math.random() > 0.5;
      const material = new THREE.MeshBasicMaterial({
        color: isGreen
          ? new THREE.Color("#90EE90")
          : new THREE.Color("#FFFFFF"),
        transparent: true,
        opacity: Math.random() * 0.4 + 0.6,
      });

      const bubble = new THREE.Mesh(geometry, material);

      bubble.position.x = (Math.random() - 0.5) * 20;
      bubble.position.y = (Math.random() - 0.5) * 20;
      bubble.position.z = (Math.random() - 0.5) * 20;

      (bubble as any).velocity = {
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005,
        z: (Math.random() - 0.5) * 0.005,
      };

      bubbles.push(bubble);
      scene.add(bubble);
    }

    const animate = () => {
      requestAnimationFrame(animate);

      bubbles.forEach((bubble) => {
        const velocity = (bubble as any).velocity;

        bubble.position.x += velocity.x;
        bubble.position.y += velocity.y;
        bubble.position.z += velocity.z;

        bubble.rotation.x += 0.01;
        bubble.rotation.y += 0.015;

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
      className="fixed top-0 left-0 w-full h-full -z-10 
               bg-gradient-to-br from-green-50 via-green-100 to-green-200 
               dark:bg-gradient-to-br dark:from-green-900 dark:via-green-900 dark:to-green-700"
    />
  );
};

export default ThreeBackground;
