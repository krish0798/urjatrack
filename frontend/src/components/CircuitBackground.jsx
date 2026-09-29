import { useEffect, useRef } from 'react';

export default function CircuitBackground() {
  const svgRef = useRef(null);

  useEffect(() => {
    // Generate random circuit paths
    const svg = svgRef.current;
    if (!svg) return;

    const width = window.innerWidth;
    const height = 700;
    const paths = [];
    const nodes = [];

    // Create horizontal + vertical circuit traces
    for (let i = 0; i < 12; i++) {
      const startX = Math.random() * width;
      const startY = Math.random() * height * 0.6;
      const segments = 3 + Math.floor(Math.random() * 4);
      let d = `M ${startX} ${startY}`;
      let x = startX;
      let y = startY;

      nodes.push({ x, y });

      for (let j = 0; j < segments; j++) {
        const horizontal = j % 2 === 0;
        if (horizontal) {
          x += (Math.random() - 0.5) * 300;
          x = Math.max(0, Math.min(width, x));
        } else {
          y += (Math.random() - 0.3) * 200;
          y = Math.max(0, Math.min(height, y));
        }
        d += ` L ${x} ${y}`;
        nodes.push({ x, y });
      }

      paths.push({ d, delay: Math.random() * 6 });
    }

    // Render paths
    const ns = 'http://www.w3.org/2000/svg';

    // Add gradient definition
    const defs = document.createElementNS(ns, 'defs');
    const gradient = document.createElementNS(ns, 'linearGradient');
    gradient.setAttribute('id', 'circuit-gradient');
    gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
    const stop1 = document.createElementNS(ns, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', 'rgba(0, 212, 255, 0)');
    const stop2 = document.createElementNS(ns, 'stop');
    stop2.setAttribute('offset', '50%');
    stop2.setAttribute('stop-color', 'rgba(0, 212, 255, 0.8)');
    const stop3 = document.createElementNS(ns, 'stop');
    stop3.setAttribute('offset', '100%');
    stop3.setAttribute('stop-color', 'rgba(0, 212, 255, 0)');
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    gradient.appendChild(stop3);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    paths.forEach(({ d, delay }) => {
      // Static trace line
      const staticPath = document.createElementNS(ns, 'path');
      staticPath.setAttribute('d', d);
      staticPath.setAttribute('class', 'circuit-line');
      svg.appendChild(staticPath);

      // Animated glow line
      const glowPath = document.createElementNS(ns, 'path');
      glowPath.setAttribute('d', d);
      glowPath.setAttribute('class', 'circuit-line-glow');
      glowPath.style.animationDelay = `${delay}s`;
      svg.appendChild(glowPath);
    });

    // Render junction nodes
    nodes.filter(() => Math.random() > 0.6).forEach(({ x, y }) => {
      const circle = document.createElementNS(ns, 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', '3');
      circle.setAttribute('class', 'circuit-node');
      circle.style.animationDelay = `${Math.random() * 3}s`;
      svg.appendChild(circle);
    });
  }, []);

  return (
    <svg
      ref={svgRef}
      className="circuit-svg"
      viewBox={`0 0 ${typeof window !== 'undefined' ? window.innerWidth : 1920} 700`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    />
  );
}
