document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.getElementById('menu-icon');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const signInBtn = document.getElementById('custom-signin-btn');

    function openSidebar() {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        // Trap focus for accessibility
        sidebar.setAttribute('tabindex', '-1');
        sidebar.focus();
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }

    menuIcon.addEventListener('click', openSidebar);
    menuIcon.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') openSidebar();
    });
    sidebarOverlay.addEventListener('click', closeSidebar);

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeSidebar);
    }

    // Clerk sign-in logic
    window.addEventListener('load', async function () {
        await Clerk.load();
        const authDiv = document.getElementById('clerk-auth');
        const signInBtn = document.getElementById('custom-signin-btn');
        if (!authDiv || !signInBtn) return;
        authDiv.style.display = "none";
        signInBtn.style.display = "block";
        signInBtn.onclick = function() {
            Clerk.openSignIn();
        };
        if (Clerk.user) {
            signInBtn.style.display = "none";
            authDiv.style.display = "block";
            authDiv.innerHTML = `<div id="user-button"></div>`;
            Clerk.mountUserButton(document.getElementById('user-button'));
        }
    });

    // 3D logo tilt effect (follow mouse anywhere on page)
    const logo = document.getElementById('cf-logo-text');
    if (logo) {
        let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;
        const maxTilt = 25; // degrees

        function animate() {
            currentX += (mouseX - currentX) * 0.15;
            currentY += (mouseY - currentY) * 0.15;
            logo.style.transform = `perspective(600px) rotateY(${currentX}deg) rotateX(${-currentY}deg)`;
            requestAnimationFrame(animate);
        }

        document.addEventListener('mousemove', function(e) {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const x = e.clientX / w;
            const y = e.clientY / h;
            mouseX = (x - 0.5) * 2 * maxTilt;
            mouseY = (y - 0.5) * 2 * maxTilt;
        });

        document.addEventListener('mouseleave', function() {
            mouseX = 0;
            mouseY = 0;
        });

        animate();
    }
});

//email 

function Sendmail(event) {
    event.preventDefault();
    let parms = {
        from_name: document.getElementById("name").value,
        from_email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value
    };
    emailjs.send("service_q8h9guk", "template_442gkah", parms)
        .then(function(response) {
            alert("Your message has been sent successfully! We will get back to you soon. Thank you!");
            // Optionally clear the form
            document.querySelector('.about-contact-form').reset();
        }, function(error) {
            alert("Failed to send message. Please try again later.");
        });
}
