/* ==========================================================
   OWAISI HOSPITAL — SHARED SITE SCRIPT
   Handles: navbar toggle, doctors slider, service search,
            home form validation, active nav link
   ========================================================== */
(function () {
    'use strict';

    /* ------------------------------------------------------
       1. ACTIVE NAV LINK (auto-detect current page)
       ------------------------------------------------------ */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPage) link.classList.add('active');
    });

    /* ------------------------------------------------------
       2. MOBILE NAV — close menu after clicking a link
       (CSS checkbox already toggles; this just closes on nav)
       ------------------------------------------------------ */
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelectorAll('.nav-links a');
    if (menuToggle) {
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                menuToggle.checked = false;
            });
        });
    }

    /* ------------------------------------------------------
       3. DOCTORS PAGE — slider prev/next + dots sync
       ------------------------------------------------------ */
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');
    const slideBtns = document.querySelectorAll('.slide-btn');
    const dots = document.querySelectorAll('.slide-dots .dot');

    if (page1 && page2 && slideBtns.length === 2) {
        const prevBtn = slideBtns[0];
        const nextBtn = slideBtns[1];

        function goToPage(pageNumber) {
            if (pageNumber === 1) {
                page1.checked = true;
            } else {
                page2.checked = true;
            }
            updateDotHighlight();
        }

        function updateDotHighlight() {
            dots.forEach(function (dot, i) {
                dot.style.background = '';
            });
            if (page1.checked && dots[0]) dots[0].style.background = 'var(--teal)';
            if (page2.checked && dots[1]) dots[1].style.background = 'var(--amber)';
        }

        prevBtn.addEventListener('click', function (e) {
            e.preventDefault();
            goToPage(1);
        });

        nextBtn.addEventListener('click', function (e) {
            e.preventDefault();
            goToPage(2);
        });

        // Keyboard arrows for accessibility
        document.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') goToPage(1);
            if (e.key === 'ArrowRight') goToPage(2);
        });
    }

    /* ------------------------------------------------------
       4. DOCTORS PAGE — prevent flip when clicking flip-btn
       (label already toggles checkbox; this closes any open
        card when you click another card's flip button)
       ------------------------------------------------------ */
    const flipInputs = document.querySelectorAll('.card input[type="checkbox"]');
    flipInputs.forEach(function (input) {
        input.addEventListener('change', function () {
            if (this.checked) {
                flipInputs.forEach(function (other) {
                    if (other !== input) other.checked = false;
                });
            }
        });
    });

    /* ------------------------------------------------------
       5. SERVICES PAGE — live search filter on organ cards
       ------------------------------------------------------ */
    const searchField = document.querySelector('.search-field');
    const organCards = document.querySelectorAll('.services-grid .organ-card');

    if (searchField && organCards.length) {
        const noResults = document.createElement('p');
        noResults.className = 'no-results';
        noResults.textContent = 'No matching tests found. Try “heart”, “liver”, or “kidney”.';
        noResults.style.cssText =
            'grid-column: 1 / -1; text-align: center; color: #6b7c8c; padding: 30px; font-size: 1rem; display: none;';
        document.querySelector('.services-grid').appendChild(noResults);

        searchField.addEventListener('input', function () {
            const query = this.value.trim().toLowerCase();
            let visibleCount = 0;

            organCards.forEach(function (card) {
                const text = card.textContent.toLowerCase();
                const match = !query || text.indexOf(query) !== -1;
                card.style.display = match ? '' : 'none';
                if (match) visibleCount++;
            });

            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        });
    }

    /* ------------------------------------------------------
       6. HOME PAGE — patient form validation + redirect
       ------------------------------------------------------ */
    const patientForm = document.querySelector('form[action="index.html"]');

    if (patientForm) {
        patientForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = patientForm.querySelector('input[placeholder*="name" i]');
            const age = patientForm.querySelector('input[type="number"]');
            const email = patientForm.querySelector('input[type="email"]');
            const phone = patientForm.querySelector('input[type="tel"]');

            const errors = [];

            if (!name || name.value.trim().length < 2) {
                errors.push('Please enter a valid name (at least 2 characters).');
            }
            if (!age || age.value === '' || Number(age.value) < 1 || Number(age.value) > 120) {
                errors.push('Please enter a valid age (1–120).');
            }
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
                errors.push('Please enter a valid email address.');
            }
            if (!phone || !/^[0-9+\-\s()]{7,15}$/.test(phone.value.trim())) {
                errors.push('Please enter a valid phone number (7–15 digits).');
            }

            if (errors.length) {
                showFormMessage(errors.join(' '), 'error');
                return;
            }

            showFormMessage('Thank you, ' + name.value.trim() + '! Redirecting…', 'success');
            setTimeout(function () {
                window.location.href = 'index.html';
            }, 900);
        });

        function showFormMessage(text, type) {
            let box = patientForm.querySelector('.form-message');
            if (!box) {
                box = document.createElement('p');
                box.className = 'form-message';
                box.style.cssText =
                    'margin-top:14px;font-size:0.85rem;padding:10px 12px;border-radius:6px;';
                patientForm.appendChild(box);
            }
            box.textContent = text;
            box.style.background = type === 'error' ? 'rgba(194,65,12,0.15)' : 'rgba(76,175,80,0.18)';
            box.style.color = type === 'error' ? '#ffd9c9' : '#c9f7d1';
            box.style.border = '1px solid ' + (type === 'error' ? 'rgba(194,65,12,0.4)' : 'rgba(76,175,80,0.4)');
        }
    }

    /* ------------------------------------------------------
       7. ABOUT PAGE — smooth reveal on scroll (subtle)
       ------------------------------------------------------ */
    if ('IntersectionObserver' in window) {
        const revealTargets = document.querySelectorAll(
            '.info-card, .leader-card, .detail-card, .founder-section, .about-section'
        );
        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        revealTargets.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
})();