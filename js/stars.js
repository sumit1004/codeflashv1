// 3D revolving stars background for hero section

(function() {
    const canvas = document.getElementById('stars-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, dpr = window.devicePixelRatio || 1;

    // Starfield parameters
    const STAR_COUNT = 190;
    const STAR_COLOR = "#b3d1ff";
    const STAR_SIZE = [1.2, 2.5];
    const STAR_DEPTH = 600;
    const ROTATE_SPEED = 0.0001; // radians/ms (slower rotation)

    let stars = [];
    let lastTime = performance.now();
    let rotation = 0;

    function resize() {
        width = canvas.offsetWidth = canvas.parentElement.offsetWidth;
        height = canvas.offsetHeight = canvas.parentElement.offsetHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(1,0,0,1,0,0);
        ctx.scale(dpr, dpr);
    }

    function randomBetween(a, b) {
        return a + Math.random() * (b - a);
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            // Spherical coordinates
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = randomBetween(STAR_DEPTH * 0.5, STAR_DEPTH);
            stars.push({
                x: r * Math.sin(phi) * Math.cos(theta),
                y: r * Math.sin(phi) * Math.sin(theta),
                z: r * Math.cos(phi),
                size: randomBetween(STAR_SIZE[0], STAR_SIZE[1]),
                twinkle: Math.random() * Math.PI * 2
            });
        }
    }

    function project3D(x, y, z, rotY, rotX) {
        // Rotate around Y axis
        let x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
        let z1 = x * Math.sin(rotY) + z * Math.cos(rotY);
        // Rotate around X axis
        let y1 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
        // Perspective projection
        const fov = 420;
        const scale = fov / (fov + z2);
        return {
            x: width/2 + x1 * scale,
            y: height/2 + y1 * scale,
            visible: z2 > -fov
        };
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        const now = performance.now();
        const dt = now - lastTime;
        lastTime = now;
        rotation += ROTATE_SPEED * dt;

        // Animate a gentle up/down tilt
        const tilt = Math.sin(now * 0.0003) * 0.25;

        for (let star of stars) {
            // 3D rotation
            const pos = project3D(star.x, star.y, star.z, rotation, tilt);
            if (!pos.visible) continue;
            // Twinkle effect
            const tw = 0.7 + 0.3 * Math.abs(Math.sin(now * 0.002 + star.twinkle));
            ctx.globalAlpha = tw;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, star.size * tw, 0, 2 * Math.PI);
            ctx.fillStyle = STAR_COLOR;
            ctx.shadowColor = "#3b82f6";
            ctx.shadowBlur = 8 * tw;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }

    function init() {
        resize();
        createStars();
        draw();
    }

    window.addEventListener('resize', resize);
    setTimeout(init, 100); // Wait for layout

})();
