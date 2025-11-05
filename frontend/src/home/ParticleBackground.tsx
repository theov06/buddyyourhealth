// frontend/src/ParticleBackground.tsx

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const particlesConfig = {
    // --- Overall Background Settings ---
    background: {
        color: { value: "#0A0A0A" },
    },
    // --- Particle Settings (Subtle, slow moving dots) ---
    particles: {
        number: { value: 100 }, 
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: {
            value: 0.5,
            random: true,
            anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false },
        },
        size: {
            value: 1.5,
            random: true,
        },
        move: {
            enable: true,
            speed: 0.1, 
            random: true,
            out_mode: "out",
            bounce: false,
        },
    },
    interactivity: {
        events: { onHover: { enable: false }, onClick: { enable: false } },
    }
};

export default function ParticleBackground() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options = useMemo(() => particlesConfig, []);

    if (init) {
        return (
            <Particles
                id="tsparticles"
                options={options}
            />
        );
    }

    return <></>;
}