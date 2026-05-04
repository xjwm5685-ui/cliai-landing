document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const interactiveElements = document.querySelectorAll('a, button, .bento-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // 2. Terminal Animation Simulation
    const typedEl = document.querySelector('.typed');
    const predictionEl = document.querySelector('.prediction');
    
    const scenarios = [
        {
            typed: 'git st',
            prediction: 'atus',
            accept: 'git status',
            prompt: 'PS D:\\sanqiu\\workspace> '
        },
        {
            typed: 'npm r',
            prediction: 'un dev',
            accept: 'npm run dev',
            prompt: 'PS D:\\code\\my-node-app> '
        },
        {
            typed: 'go b',
            prediction: 'uild .',
            accept: 'go build .',
            prompt: 'PS D:\\code\\my-go-app> '
        },
        {
            typed: 'docke',
            prediction: 'r-compose up -d',
            accept: 'docker-compose up -d',
            prompt: 'PS D:\\sanqiu\\workspace> '
        }
    ];

    let currentScenario = 0;
    const promptEl = document.querySelector('.prompt');

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function typeText(text, element, speed = 80) {
        element.textContent = '';
        for (let i = 0; i < text.length; i++) {
            element.textContent += text.charAt(i);
            await sleep(speed + (Math.random() * 40));
        }
    }

    async function runTerminalSimulation() {
        while (true) {
            const scenario = scenarios[currentScenario];
            
            // Update Prompt
            promptEl.textContent = scenario.prompt;
            
            // Clear
            typedEl.textContent = '';
            predictionEl.textContent = '';
            
            await sleep(800);
            
            // Type the base command
            await typeText(scenario.typed, typedEl, 70);
            
            // Show prediction instantly
            // Adding a small delay to simulate engine thinking, but keep it fast
            await sleep(100);
            predictionEl.textContent = scenario.prediction;
            
            // Wait for user "Shift + Right Arrow"
            await sleep(1500);
            
            // Accept prediction
            predictionEl.textContent = '';
            typedEl.textContent = scenario.accept;
            
            // Wait before next command
            await sleep(2500);
            
            currentScenario = (currentScenario + 1) % scenarios.length;
        }
    }

    runTerminalSimulation();

    // 3. Installation Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.install-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 4. Copy Functionality
    const copyBtns = document.querySelectorAll('.copy-btn');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const textToCopy = btn.getAttribute('data-copy');
            try {
                await navigator.clipboard.writeText(textToCopy);
                const originalText = btn.textContent;
                btn.textContent = '已复制 [OK]';
                btn.style.color = 'var(--accent)';
                btn.style.borderColor = 'var(--accent)';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.color = '';
                    btn.style.borderColor = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                btn.textContent = '复制失败 [ERR]';
            }
        });
    });

    // 5. Scroll Reveal using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });
    
    // 6. 3D Tilt Effect (Vanilla JS) - Removed for Hero, kept for Bento cards
    const tiltElements = document.querySelectorAll('.bento-card');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -1.5; // subtle rotation
            const rotateY = ((x - centerX) / centerX) * 1.5;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // 7. Particle Background
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let particles = [];

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        // Add mouse interaction for particles
        let mouse = {
            x: null,
            y: null,
            radius: 150
        };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5 + 0.5;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
                // Move slowly to the left to simulate TRAE background flow
                this.speedX = -Math.random() * 0.5 - 0.1; 
                this.speedY = Math.random() * 0.4 - 0.2;
                this.color = `rgba(0, 255, 136, ${Math.random() * 0.4 + 0.2})`;
            }
            update() {
                // Natural movement
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around screen for continuous flow
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;

                // Mouse interaction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let maxDistance = mouse.radius;
                    let force = (maxDistance - distance) / maxDistance;
                    let directionX = forceDirectionX * force * this.density;
                    let directionY = forceDirectionY * force * this.density;

                    if (distance < mouse.radius) {
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            // Density for network effect
            const particleCount = Math.floor((width * height) / 8000); 
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Draw lines between close particles
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 255, 136, ${0.2 - distance/600})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // 8. Three.js 3D Background Element
    initThreeJSBackground();

    function initThreeJSBackground() {
        const container = document.getElementById('three-canvas-container');
        if (!container || typeof THREE === 'undefined') return;

        // Scene setup
        const scene = new THREE.Scene();
        
        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Group to hold all 3D objects
        const group = new THREE.Group();
        scene.add(group);

        // Create a custom glowing material function
        function createGlowMaterial(colorHex, opacity) {
            return new THREE.MeshBasicMaterial({
                color: colorHex,
                wireframe: true,
                transparent: true,
                opacity: opacity,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
        }

        // 1. Central Core (Icosahedron)
        const coreGeo = new THREE.IcosahedronGeometry(8, 1);
        const coreMat = createGlowMaterial(0x00ff88, 0.4);
        const core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);

        // 2. Inner Core (Smaller Solid)
        const innerGeo = new THREE.IcosahedronGeometry(4, 0);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0x00cc6a,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const inner = new THREE.Mesh(innerGeo, innerMat);
        group.add(inner);

        // 3. Outer Ring 1 (Torus)
        const ring1Geo = new THREE.TorusGeometry(15, 0.2, 16, 100);
        const ring1Mat = createGlowMaterial(0x00ff88, 0.3);
        const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
        ring1.rotation.x = Math.PI / 2;
        group.add(ring1);

        // 4. Outer Ring 2 (Torus) - Angled
        const ring2Geo = new THREE.TorusGeometry(20, 0.1, 16, 100);
        const ring2Mat = createGlowMaterial(0x00cc6a, 0.2);
        const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
        ring2.rotation.x = Math.PI / 3;
        ring2.rotation.y = Math.PI / 4;
        group.add(ring2);

        // 5. Outer Ring 3 (Torus) - Counter Angled
        const ring3Geo = new THREE.TorusGeometry(25, 0.05, 16, 100);
        const ring3Mat = createGlowMaterial(0x00ff88, 0.15);
        const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
        ring3.rotation.x = -Math.PI / 4;
        ring3.rotation.y = -Math.PI / 6;
        group.add(ring3);

        // 6. Data Stream Lines
        const streamGeo = new THREE.BufferGeometry();
        const streamCount = 50;
        const streamPos = new Float32Array(streamCount * 3);
        for(let i = 0; i < streamCount * 3; i++) {
            streamPos[i] = (Math.random() - 0.5) * 40;
        }
        streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPos, 3));
        const streamMat = new THREE.LineBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.15
        });
        const streamLines = new THREE.LineSegments(streamGeo, streamMat);
        group.add(streamLines);

        // 4. Floating Particles around the core
        const particlesGeo = new THREE.BufferGeometry();
        const particlesCount = 800; // Increased particle count
        const posArray = new Float32Array(particlesCount * 3);
        
        for(let i = 0; i < particlesCount * 3; i++) {
            // Spread particles in a larger sphere
            posArray[i] = (Math.random() - 0.5) * 120;
        }
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMat = new THREE.PointsMaterial({
            size: 0.2,
            color: 0x00ff88,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
        group.add(particlesMesh);

        // Position the entire group
        group.position.x = 20;
        group.position.y = 5;

        // Mouse interaction variables
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', onDocumentMouseMove, false);

        function onDocumentMouseMove(event) {
            mouseX = (event.clientX - windowHalfX) * 0.001;
            mouseY = (event.clientY - windowHalfY) * 0.001;
        }

        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            
            // Adjust position for mobile
            if(window.innerWidth < 1024) {
                group.position.x = 0;
                group.position.y = 15;
            } else {
                group.position.x = 20;
                group.position.y = 5;
            }
        }

        // Initial check for mobile
        onWindowResize();

        // Animation loop
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Base rotation for individual elements
            core.rotation.x += 0.002;
            core.rotation.y += 0.003;
            inner.rotation.x -= 0.005;
            inner.rotation.y -= 0.004;
            
            ring1.rotation.z += 0.005;
            ring2.rotation.z -= 0.003;
            ring3.rotation.x += 0.004;
            
            streamLines.rotation.y += 0.002;
            streamLines.rotation.z -= 0.001;
            
            particlesMesh.rotation.y = elapsedTime * 0.05;

            // Interactive rotation based on mouse (applied to whole group)
            targetX = mouseX * 2;
            targetY = mouseY * 2;
            
            group.rotation.y += 0.05 * (targetX - group.rotation.y);
            group.rotation.x += 0.05 * (targetY - group.rotation.x);

            renderer.render(scene, camera);
        }

        animate();
    }
});