import { useState, useRef, useEffect, useCallback } from 'react';

interface PlanetData {
  name: string;
  diameter: number; // km
  distanceFromSun: number; // million km
  orbitalPeriod: number; // Earth days
  color: string;
  radius: number; // visual radius in pixels
  orbitRadius: number; // visual orbit radius in pixels
  angle: number; // current angle in radians
  description: string;
}

const initialPlanets: PlanetData[] = [
  {
    name: 'Mercury',
    diameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    color: '#b5b5b5',
    radius: 4,
    orbitRadius: 60,
    angle: Math.random() * Math.PI * 2,
    description: 'The smallest planet and closest to the Sun. It has no atmosphere and extreme temperature variations.',
  },
  {
    name: 'Venus',
    diameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    color: '#e8cda0',
    radius: 7,
    orbitRadius: 90,
    angle: Math.random() * Math.PI * 2,
    description: 'The hottest planet with a thick toxic atmosphere. It rotates in the opposite direction to most planets.',
  },
  {
    name: 'Earth',
    diameter: 12756,
    distanceFromSun: 149.6,
    orbitalPeriod: 365,
    color: '#4da6ff',
    radius: 7,
    orbitRadius: 125,
    angle: Math.random() * Math.PI * 2,
    description: 'Our home planet — the only known world with liquid water on its surface and life.',
  },
  {
    name: 'Mars',
    diameter: 6792,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    color: '#e07050',
    radius: 5,
    orbitRadius: 165,
    angle: Math.random() * Math.PI * 2,
    description: 'The Red Planet, with the tallest volcano (Olympus Mons) and deepest canyon in the solar system.',
  },
  {
    name: 'Jupiter',
    diameter: 142984,
    distanceFromSun: 778.6,
    orbitalPeriod: 4333,
    color: '#d4a574',
    radius: 16,
    orbitRadius: 220,
    angle: Math.random() * Math.PI * 2,
    description: 'The largest planet with a Great Red Spot storm larger than Earth. It has at least 95 moons.',
  },
  {
    name: 'Saturn',
    diameter: 120536,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10759,
    color: '#f0d68a',
    radius: 14,
    orbitRadius: 280,
    angle: Math.random() * Math.PI * 2,
    description: 'Famous for its stunning ring system made of ice and rock. It could float in water if there were a big enough ocean!',
  },
  {
    name: 'Uranus',
    diameter: 51118,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30687,
    color: '#7de8e8',
    radius: 10,
    orbitRadius: 335,
    angle: Math.random() * Math.PI * 2,
    description: 'An ice giant that rotates on its side. It has a blue-green color due to methane in its atmosphere.',
  },
  {
    name: 'Neptune',
    diameter: 49528,
    distanceFromSun: 4495.1,
    orbitalPeriod: 60190,
    color: '#4466ff',
    radius: 10,
    orbitRadius: 380,
    angle: Math.random() * Math.PI * 2,
    description: 'The windiest planet with speeds over 2,000 km/h. It has a vivid blue color and 16 known moons.',
  },
];

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const planetsRef = useRef<PlanetData[]>(initialPlanets.map(p => ({ ...p })));
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const getCenter = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    return { x: canvas.width / 2, y: canvas.height / 2 };
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, planets: PlanetData[]) => {
    const canvas = ctx.canvas;
    const { x: centerX, y: centerY } = getCenter();

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars background
    const starSeed = 42;
    for (let i = 0; i < 200; i++) {
      const sx = ((starSeed * (i + 1) * 7919) % canvas.width);
      const sy = ((starSeed * (i + 1) * 6271) % canvas.height);
      const brightness = 0.3 + ((i * 3571) % 70) / 100;
      const size = 0.5 + ((i * 2347) % 15) / 10;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.fill();
    }

    // Draw orbit paths
    planets.forEach((planet) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw Sun
    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
    sunGradient.addColorStop(0, '#fff7e0');
    sunGradient.addColorStop(0.3, '#ffdd44');
    sunGradient.addColorStop(0.7, '#ff9900');
    sunGradient.addColorStop(1, '#ff6600');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 28, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();

    // Sun glow
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 25, centerX, centerY, 50);
    glowGradient.addColorStop(0, 'rgba(255, 200, 50, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 200, 50, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Draw planets
    planets.forEach((planet) => {
      const px = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const py = centerY + Math.sin(planet.angle) * planet.orbitRadius;

      // Planet glow
      const planetGlow = ctx.createRadialGradient(px, py, planet.radius * 0.5, px, py, planet.radius * 2);
      planetGlow.addColorStop(0, planet.color + '40');
      planetGlow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(px, py, planet.radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = planetGlow;
      ctx.fill();

      // Planet body
      const planetGradient = ctx.createRadialGradient(
        px - planet.radius * 0.3,
        py - planet.radius * 0.3,
        0,
        px,
        py,
        planet.radius
      );
      planetGradient.addColorStop(0, lightenColor(planet.color, 40));
      planetGradient.addColorStop(0.7, planet.color);
      planetGradient.addColorStop(1, darkenColor(planet.color, 30));
      ctx.beginPath();
      ctx.arc(px, py, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = planetGradient;
      ctx.fill();

      // Saturn rings
      if (planet.name === 'Saturn') {
        ctx.beginPath();
        ctx.ellipse(px, py, planet.radius * 2, planet.radius * 0.5, 0.3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(240, 214, 138, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Hover/selected highlight
      if (hoveredPlanet === planet.name || selectedPlanet?.name === planet.name) {
        ctx.beginPath();
        ctx.arc(px, py, planet.radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Planet name label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '11px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(planet.name, px, py + planet.radius + 14);
    });
  }, [getCenter, hoveredPlanet, selectedPlanet]);

  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (lastTimeRef.current === 0) lastTimeRef.current = time;
    const delta = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    if (isPlayingRef.current) {
      planetsRef.current = planetsRef.current.map((planet) => {
        // Speed factor: base speed scaled by orbital period
        // Faster planets (shorter period) move faster
        const angularSpeed = (2 * Math.PI) / (planet.orbitalPeriod * 0.05);
        const newAngle = planet.angle + angularSpeed * delta * speedRef.current;
        return { ...planet, angle: newAngle };
      });
    }

    draw(ctx, planetsRef.current);
    animationRef.current = requestAnimationFrame(animate);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resize();
    window.addEventListener('resize', resize);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { x: centerX, y: centerY } = getCenter();

    let clickedPlanet: PlanetData | null = null;
    for (const planet of planetsRef.current) {
      const px = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const py = centerY + Math.sin(planet.angle) * planet.orbitRadius;
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= planet.radius + 8) {
        clickedPlanet = { ...planet };
        break;
      }
    }
    setSelectedPlanet(clickedPlanet);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { x: centerX, y: centerY } = getCenter();

    let found = false;
    for (const planet of planetsRef.current) {
      const px = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const py = centerY + Math.sin(planet.angle) * planet.orbitRadius;
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= planet.radius + 8) {
        setHoveredPlanet(planet.name);
        canvas.style.cursor = 'pointer';
        found = true;
        break;
      }
    }
    if (!found) {
      setHoveredPlanet(null);
      canvas.style.cursor = 'default';
    }
  };

  return (
    <div className="w-full h-screen bg-[#0a0a1a] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#0d0d24]/80 backdrop-blur border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">☀️</span>
          <h1 className="text-white text-lg font-semibold tracking-wide">Solar System Explorer</h1>
        </div>
        <p className="text-white/50 text-sm hidden sm:block">Click on a planet to learn more</p>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Canvas area */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
          />

          {/* Controls overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#1a1a3a]/90 backdrop-blur-md rounded-full px-5 py-2.5 border border-white/10 shadow-xl">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="2" y="1" width="3.5" height="12" rx="1" />
                  <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M3 1.5v11l9-5.5z" />
                </svg>
              )}
            </button>

            {/* Speed control */}
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs font-medium">Speed</span>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-24 h-1.5 accent-blue-400 cursor-pointer"
              />
              <span className="text-white text-xs font-mono w-10 text-center">{speed.toFixed(1)}x</span>
            </div>

            {/* Speed presets */}
            <div className="flex gap-1">
              {[0.5, 1, 2, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    speed === s
                      ? 'bg-blue-500/30 text-blue-300 border border-blue-400/40'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/10'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Planet info panel */}
        {selectedPlanet && (
          <div className="lg:w-80 bg-[#0d0d24]/95 backdrop-blur-md border-t lg:border-t-0 lg:border-l border-white/10 p-6 overflow-y-auto animate-slideIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold">{selectedPlanet.name}</h2>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Planet visual */}
            <div className="flex justify-center mb-6">
              <div
                className="rounded-full shadow-lg"
                style={{
                  width: `${Math.max(60, selectedPlanet.radius * 4)}px`,
                  height: `${Math.max(60, selectedPlanet.radius * 4)}px`,
                  background: `radial-gradient(circle at 35% 35%, ${lightenColor(selectedPlanet.color, 40)}, ${selectedPlanet.color}, ${darkenColor(selectedPlanet.color, 30)})`,
                  boxShadow: `0 0 30px ${selectedPlanet.color}40, inset -5px -5px 15px rgba(0,0,0,0.3)`,
                }}
              />
            </div>

            {/* Description */}
            <p className="text-white/70 text-sm leading-relaxed mb-6">{selectedPlanet.description}</p>

            {/* Stats */}
            <div className="space-y-3">
              <StatCard
                icon="📏"
                label="Diameter"
                value={`${selectedPlanet.diameter.toLocaleString()} km`}
              />
              <StatCard
                icon="🌞"
                label="Distance from Sun"
                value={`${selectedPlanet.distanceFromSun.toLocaleString()} million km`}
              />
              <StatCard
                icon="🔄"
                label="Orbital Period"
                value={formatOrbitalPeriod(selectedPlanet.orbitalPeriod)}
              />
              <StatCard
                icon="⚡"
                label="Relative Speed"
                value={getRelativeSpeed(selectedPlanet.orbitalPeriod)}
              />
            </div>

            {/* Fun fact */}
            <div className="mt-6 p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-white/50 text-xs font-medium mb-1">💡 Fun Fact</p>
              <p className="text-white/70 text-xs leading-relaxed">{getFunFact(selectedPlanet.name)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-white/50 text-xs">{label}</p>
        <p className="text-white text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(2.55 * percent));
  const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(2.55 * percent));
  const b = Math.min(255, (num & 0x0000ff) + Math.round(2.55 * percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - Math.round(2.55 * percent));
  const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(2.55 * percent));
  const b = Math.max(0, (num & 0x0000ff) - Math.round(2.55 * percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function formatOrbitalPeriod(days: number): string {
  if (days < 365) return `${days} Earth days`;
  const years = (days / 365.25).toFixed(1);
  return `${years} Earth years (${days.toLocaleString()} days)`;
}

function getRelativeSpeed(period: number): string {
  const earthPeriod = 365;
  const ratio = earthPeriod / period;
  if (ratio > 1) return `${ratio.toFixed(1)}x faster than Earth`;
  return `${(1 / ratio).toFixed(1)}x slower than Earth`;
}

function getFunFact(name: string): string {
  const facts: Record<string, string> = {
    Mercury: 'Despite being closest to the Sun, Mercury is not the hottest planet — Venus is, due to its greenhouse effect!',
    Venus: 'A day on Venus is longer than its year. It takes 243 Earth days to rotate once but only 225 days to orbit the Sun.',
    Earth: 'Earth is the only planet not named after a Greek or Roman god. Its name comes from Old English and Germanic words.',
    Mars: 'Mars has seasons like Earth because its axis is tilted at a similar angle — about 25 degrees.',
    Jupiter: 'Jupiter\'s Great Red Spot is a storm that has been raging for at least 350 years and could fit 1-3 Earths inside it.',
    Saturn: 'Saturn\'s density is so low (0.687 g/cm³) that it would float in water if you could find a bathtub big enough!',
    Uranus: 'Uranus rotates on its side with an axial tilt of 98°, likely caused by a collision with an Earth-sized object long ago.',
    Neptune: 'Neptune was the first planet found by mathematical prediction rather than observation, discovered in 1846.',
  };
  return facts[name] || '';
}
