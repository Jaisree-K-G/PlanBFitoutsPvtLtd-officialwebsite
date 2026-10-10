/* =====================================================
   PLAN B FITOUTS
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   HEADER SCROLL EFFECT
===================================================== */

/* =========================================================
   HEADER SCROLL STATE
   ========================================================= */

const siteHeader =
    document.querySelector(".site-header");

if (siteHeader) {

    const updateHeader = () => {

        if (window.scrollY > 30) {

            siteHeader.classList.add("scrolled");

        } else {

            siteHeader.classList.remove("scrolled");

        }

    };


    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    updateHeader();

}



/* =====================================================
   HERO PARALLAX
===================================================== */

const heroImage =
    document.querySelector(".hero-image");


window.addEventListener("scroll", () => {

    if (!heroImage) return;


    const scrollPosition =
        window.scrollY;


    if (scrollPosition < window.innerHeight) {

        heroImage.style.transform =
            `scale(1.03) translateY(${scrollPosition * 0.12}px)`;

    }

});



/* =====================================================
   MOBILE MENU TOGGLE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const menuButton = document.querySelector(".mobile-menu-button");
    const mobileNav = document.querySelector(".mobile-navigation");

    if (!menuButton || !mobileNav) {
        console.warn("Mobile menu elements not found.");
        return;
    }

    menuButton.setAttribute("aria-expanded", "false");

    menuButton.addEventListener("click", (event) => {
        event.preventDefault();

        const isOpen = mobileNav.classList.toggle("active");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });

    // Close the menu after clicking a navigation link
    mobileNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mobileNav.classList.remove("active");
            menuButton.setAttribute("aria-expanded", "false");
        });
    });

    // Close the menu when pressing Escape
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            mobileNav.classList.remove("active");
            menuButton.setAttribute("aria-expanded", "false");
        }
    });

});




/* =====================================================
   BEFORE / AFTER SLIDER
===================================================== */

const beforeAfter =
    document.getElementById("beforeAfter");


const beforeImage =
    document.getElementById("beforeImage");


const comparisonLine =
    document.getElementById("comparisonLine");


const comparisonHint =
    document.getElementById("comparisonHint");



let isDragging = false;


/*
   Set the slider position.

   value = percentage from 0 to 100.
*/

function setComparisonPosition(value) {

    if (!beforeImage || !comparisonLine) return;


    /*
       Keep the slider between 0 and 100.
    */

    value =
        Math.max(
            0,
            Math.min(100, value)
        );


    /*
       Reveal the BEFORE image
       without changing its size.

       Both images remain perfectly
       aligned and at the same scale.
    */

    beforeImage.style.clipPath =
        `polygon(
            0 0,
            ${value}% 0,
            ${value}% 100%,
            0 100%
        )`;


    /*
       Move the divider.
    */

    comparisonLine.style.left =
        `${value}%`;

}


/* =====================================================
   GET POINTER POSITION
===================================================== */

function updateSlider(clientX) {

    if (!beforeAfter) return;


    const rect =
        beforeAfter.getBoundingClientRect();


    const x =
        clientX - rect.left;


    let percentage =
        (x / rect.width) * 100;


    setComparisonPosition(percentage);


    /*
       Hide the instruction once
       the user starts interacting.
    */

    if (comparisonHint) {

        comparisonHint.classList.add("hidden");

    }

}



/* =====================================================
   MOUSE
===================================================== */

if (beforeAfter) {

    beforeAfter.addEventListener(
        "mousedown",
        (event) => {

            isDragging = true;

            updateSlider(event.clientX);

        }
    );


    window.addEventListener(
        "mousemove",
        (event) => {

            if (!isDragging) return;

            updateSlider(event.clientX);

        }
    );


    window.addEventListener(
        "mouseup",
        () => {

            isDragging = false;

        }
    );

}



/* =====================================================
   TOUCH
===================================================== */

if (beforeAfter) {

    beforeAfter.addEventListener(
        "touchstart",
        (event) => {

            isDragging = true;


            const touch =
                event.touches[0];


            updateSlider(touch.clientX);

        },
        {
            passive: true
        }
    );


    beforeAfter.addEventListener(
        "touchmove",
        (event) => {

            if (!isDragging) return;


            const touch =
                event.touches[0];


            updateSlider(touch.clientX);

        },
        {
            passive: true
        }
    );


    beforeAfter.addEventListener(
        "touchend",
        () => {

            isDragging = false;

        }
    );

}



/* =====================================================
   INITIAL POSITION
===================================================== */

setComparisonPosition(50);



/* =====================================================
   CONSOLE
===================================================== */

console.log(
    "Plan B Fitouts — Design | Plan | Execute"
);

/* =========================================================
   ABOUT SECTION REVEAL
========================================================= */

const aboutRevealElements = document.querySelectorAll(
    ".about-section .reveal"
);

if (aboutRevealElements.length) {

    const aboutObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    aboutObserver.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12
        }
    );

    aboutRevealElements.forEach((element) => {
        aboutObserver.observe(element);
    });
}

/* =========================================================
   VISION & MISSION REVEAL
========================================================= */

const vmRevealElements = document.querySelectorAll(
    ".vision-mission-section .vm-reveal"
);

if (vmRevealElements.length) {

    const vmObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    vmObserver.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12
        }
    );

    vmRevealElements.forEach((element) => {
        vmObserver.observe(element);
    });

}




/* =========================================================
   WHAT WE DO — PLAN B FITOUT SYSTEM
   ========================================================= */


/* =========================================================
   PLAN B FITOUTS
   WHAT WE DO — INTERACTIVE FITOUT SYSTEM
   ========================================================= */


/* =========================================================
   ELEMENTS
   ========================================================= */

const fitoutServices =
    document.querySelectorAll(".fitout-service");

const fitoutImages =
    document.querySelectorAll(".fitout-image");

const fitoutSystem =
    document.querySelector(".fitout-system");


/* =========================================================
   SERVICE DATA
   ========================================================= */

const fitoutStates = {

    design: {
        image: "design"
    },

    gc: {
        image: "gc"
    },

    mep: {
        image: "mep"
    }

};


/* =========================================================
   SHOW SELECTED SERVICE
   ========================================================= */

function showFitoutState(state) {

    const data =
        fitoutStates[state];

    if (!data) {
        return;
    }


    /* -----------------------------------------------------
       CHANGE IMAGE
       ----------------------------------------------------- */

    fitoutImages.forEach((image) => {

        image.classList.remove("active");

    });


    const targetImage =
        document.querySelector(
            `.fitout-image[data-image="${data.image}"]`
        );


    if (targetImage) {

        targetImage.classList.add("active");

    }


    /* -----------------------------------------------------
       ACTIVE SERVICE
       ----------------------------------------------------- */

    fitoutServices.forEach((service) => {

        service.classList.toggle(
            "is-active",
            service.dataset.service === state
        );

    });

}


/* =========================================================
   SHOW DEFAULT FINISHED SPACE
   ========================================================= */

function showCompletedSpace() {


    /* -----------------------------------------------------
       SHOW FINISHED IMAGE
       ----------------------------------------------------- */

    fitoutImages.forEach((image) => {

        image.classList.remove("active");

    });


    const completedImage =
        document.querySelector(
            '.fitout-image[data-image="finished"]'
        );


    if (completedImage) {

        completedImage.classList.add("active");

    }


    /* -----------------------------------------------------
       REMOVE ACTIVE SERVICE
       ----------------------------------------------------- */

    fitoutServices.forEach((service) => {

        service.classList.remove("is-active");

    });

}


/* =========================================================
   SERVICE INTERACTION
   ========================================================= */

fitoutServices.forEach((service) => {


    /* -----------------------------------------------------
       MOUSE HOVER
       ----------------------------------------------------- */

    service.addEventListener(
        "mouseenter",
        () => {

            showFitoutState(
                service.dataset.service
            );

        }
    );


    /* -----------------------------------------------------
       KEYBOARD FOCUS
       ----------------------------------------------------- */

    service.addEventListener(
        "focus",
        () => {

            showFitoutState(
                service.dataset.service
            );

        }
    );


    /* -----------------------------------------------------
       CLICK / TOUCH
       ----------------------------------------------------- */

    service.addEventListener(
        "click",
        () => {

            showFitoutState(
                service.dataset.service
            );

        }
    );

});


/* =========================================================
   RETURN TO DEFAULT
   ========================================================= */

/*
   When the pointer leaves the complete image/service
   system, return to the finished-space image.
*/

if (fitoutSystem) {

    fitoutSystem.addEventListener(
        "mouseleave",
        () => {

            showCompletedSpace();

        }
    );

}


/* =========================================================
   INITIAL STATE
   ========================================================= */

showCompletedSpace();








/* =========================================================
   OUR SERVICES — GLASS CARD INTERACTION
   ========================================================= */

if (typeof lucide !== "undefined") {
    lucide.createIcons();
}


const serviceCards =
    document.querySelectorAll(
        ".service-card"
    );


/* ---------------------------------------------------------
   CARD HOVER
   --------------------------------------------------------- */

serviceCards.forEach((card) => {

    card.addEventListener(
        "mouseenter",
        () => {

            card.classList.add(
                "is-hovered"
            );

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.classList.remove(
                "is-hovered"
            );

        }
    );


    /*
     * Keyboard accessibility
     */

    card.addEventListener(
        "focus",
        () => {

            card.classList.add(
                "is-hovered"
            );

        }
    );


    card.addEventListener(
        "blur",
        () => {

            card.classList.remove(
                "is-hovered"
            );

        }
    );

});


/* =========================================================
   OUR EXPERTISE — INTERACTIVE SECTOR ATLAS
   ========================================================= */

const expertiseCards =
    document.querySelectorAll(".expertise-card");


function activateExpertiseCard(card) {

    expertiseCards.forEach((item) => {
        item.classList.remove("is-active");
    });

    if (card) {
        card.classList.add("is-active");
    }
}


expertiseCards.forEach((card) => {

    /* Desktop hover */

    card.addEventListener("mouseenter", () => {
        activateExpertiseCard(card);
    });


    /*
       Keyboard accessibility
    */

    card.addEventListener("focus", () => {
        activateExpertiseCard(card);
    });


    /*
       Mobile / touch interaction
    */

    card.addEventListener("click", () => {

        const wasActive =
            card.classList.contains("is-active");

        if (wasActive) {
            card.classList.remove("is-active");
        } else {
            activateExpertiseCard(card);
        }

    });


    /*
       Keyboard activation
    */

    card.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            const wasActive =
                card.classList.contains("is-active");

            if (wasActive) {
                card.classList.remove("is-active");
            } else {
                activateExpertiseCard(card);
            }

        }

    });

});


/*
   When mouse leaves the entire section,
   return to neutral state.
*/

const expertiseSection =
    document.querySelector(".our-expertise-section");


if (expertiseSection) {

    expertiseSection.addEventListener(
        "mouseleave",
        () => {

            expertiseCards.forEach((card) => {
                card.classList.remove("is-active");
            });

        }
    );

}








/* =========================================================
   OUR PRESTIGIOUS CLIENTS
   DYNAMIC LOGO MARQUEE
   ========================================================= */

/* =========================================================
   PLAN B FITOUTS
   PRESTIGIOUS CLIENTS
   SINGLE ROW MARQUEE
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const section =
        document.querySelector(
            ".prestigious-clients-section"
        );

    if (!section) {
        return;
    }


    const track =
        section.querySelector(
            "#clientTrack"
        );


    const marquee =
        section.querySelector(
            "#clientsMarquee"
        );


    const previousButton =
        section.querySelector(
            "#clientsPrevious"
        );


    const nextButton =
        section.querySelector(
            "#clientsNext"
        );


    if (!track || !marquee) {
        return;
    }


    /* =====================================================
       SETTINGS
       ===================================================== */

    const JSON_PATH =
        "assets/images/clients/clients.json";


    const SPEED =
        42;


    /* =====================================================
       STATE
       ===================================================== */

    let animationFrame =
        null;


    let position =
        0;


    let lastTime =
        0;


    let isPaused =
        false;


    let loopWidth =
        0;


    /* =====================================================
       CREATE LOGO
       ===================================================== */

    function createClientLogo(
        filename
    ) {

        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "client-logo";


        const image =
            document.createElement(
                "img"
            );


        image.src =
            "assets/images/clients/" +
            filename;


        image.alt =
            "Plan B Fitouts client";


        image.loading =
            "lazy";


        wrapper.appendChild(
            image
        );


        return wrapper;

    }


    /* =====================================================
       BUILD TRACK
       ===================================================== */

    function buildTrack(
        logos
    ) {

        track.innerHTML =
            "";


        /*
           Create the original set.
        */

        logos.forEach(
            function (
                filename
            ) {

                track.appendChild(
                    createClientLogo(
                        filename
                    )
                );

            }
        );


        /*
           Duplicate the entire set.

           This allows the track to move continuously
           without an empty space.
        */

        logos.forEach(
            function (
                filename
            ) {

                const clone =
                    createClientLogo(
                        filename
                    );


                clone.setAttribute(
                    "aria-hidden",
                    "true"
                );


                track.appendChild(
                    clone
                );

            }
        );


        /*
           Wait for layout before measuring.
        */

        requestAnimationFrame(
            function () {

                calculateLoopWidth();

                position = 0;

                lastTime =
                    performance.now();

                startAnimation();

            }
        );

    }


    /* =====================================================
       CALCULATE LOOP WIDTH
       ===================================================== */

    function calculateLoopWidth() {

        const items =
            track.children;


        if (
            items.length < 2
        ) {

            loopWidth = 0;

            return;

        }


        /*
           Since the second half is an exact
           duplicate of the first half, the
           distance from item 0 to the first
           duplicate is the loop distance.
        */

        const middleIndex =
            Math.floor(
                items.length / 2
            );


        const first =
            items[0]
                .getBoundingClientRect();


        const duplicate =
            items[middleIndex]
                .getBoundingClientRect();


        loopWidth =
            duplicate.left -
            first.left;

    }


    /* =====================================================
       ANIMATION
       ===================================================== */

    function animate(
        timestamp
    ) {

        if (!lastTime) {

            lastTime =
                timestamp;

        }


        const delta =
            timestamp -
            lastTime;


        lastTime =
            timestamp;


        if (
            !isPaused &&
            loopWidth > 0
        ) {

            position -=
                (
                    SPEED *
                    delta /
                    1000
                );


            /*
               When the first complete set
               has moved away, reset only the
               mathematical position.

               Because the second set is
               identical, the user sees no jump.
            */

            if (
                Math.abs(position) >=
                loopWidth
            ) {

                position +=
                    loopWidth;

            }


            track.style.transform =
                `translate3d(${position}px,-50%,0)`;

        }


        animationFrame =
            requestAnimationFrame(
                animate
            );

    }


    function startAnimation() {

        if (
            animationFrame
        ) {

            cancelAnimationFrame(
                animationFrame
            );

        }


        lastTime =
            performance.now();


        animationFrame =
            requestAnimationFrame(
                animate
            );

    }


    /* =====================================================
       PAUSE WHEN HOVERING
       ===================================================== */

    marquee.addEventListener(
        "mouseenter",
        function () {

            isPaused =
                true;

        }
    );


    marquee.addEventListener(
        "mouseleave",
        function () {

            isPaused =
                false;

            lastTime =
                performance.now();

        }
    );


    /* =====================================================
       ARROW CONTROLS
       ===================================================== */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                /*
                   Move forward by one logo.
                */

                const first =
                    track.children[0];


                if (!first) {
                    return;
                }


                const second =
                    track.children[1];


                if (!second) {
                    return;
                }


                const firstRect =
                    first.getBoundingClientRect();


                const secondRect =
                    second.getBoundingClientRect();


                const step =
                    secondRect.left -
                    firstRect.left;


                position -=
                    step;

            }
        );

    }


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            function () {

                const first =
                    track.children[0];


                const second =
                    track.children[1];


                if (
                    !first ||
                    !second
                ) {

                    return;

                }


                const firstRect =
                    first.getBoundingClientRect();


                const secondRect =
                    second.getBoundingClientRect();


                const step =
                    secondRect.left -
                    firstRect.left;


                position +=
                    step;


                /*
                   Keep the mathematical position
                   inside a safe range.
                */

                if (
                    position > 0
                ) {

                    position -=
                        loopWidth;

                }

            }
        );

    }


    /* =====================================================
       RESIZE
       ===================================================== */

    let resizeTimer;


    window.addEventListener(
        "resize",
        function () {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    function () {

                        calculateLoopWidth();

                    },
                    150
                );

        }
    );


    /* =====================================================
       LOAD CLIENTS
       ===================================================== */

    async function loadClients() {

        try {

            const response =
                await fetch(
                    JSON_PATH
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    "Unable to load clients.json. Status: " +
                    response.status
                );

            }


            const logos =
                await response.json();


            if (
                !Array.isArray(logos) ||
                logos.length === 0
            ) {

                console.warn(
                    "No client logos found."
                );

                return;

            }


            buildTrack(
                logos
            );


        } catch (error) {

            console.error(
                "Plan B Clients Error:",
                error
            );

        }

    }


    loadClients();


})();






/* =========================================================
   PLAN B FITOUTS
   PROJECTS — CONTINUOUS CAROUSEL
   ========================================================= */

/* =========================================================
   PLAN B FITOUTS
   PROJECTS
   CONTINUOUS CINEMATIC CAROUSEL
   ========================================================= */

/* =========================================================
   PLAN B FITOUTS
   PROJECTS
   TRUE MEASURED-POSITION CAROUSEL
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const section =
        document.querySelector(
            ".projects-gallery-section"
        );

    if (!section) {
        return;
    }


    const viewer =
        section.querySelector(
            "#projectsViewer"
        );


    const track =
        section.querySelector(
            "#projectsTrack"
        );


    const filters =
        section.querySelectorAll(
            ".project-filter"
        );


    const previousButton =
        section.querySelector(
            "#projectPrevButton"
        );


    const nextButton =
        section.querySelector(
            "#projectNextButton"
        );


    const pagination =
        section.querySelector(
            "#projectPaginationDots"
        );


    if (!viewer || !track) {

        console.warn(
            "Projects carousel elements are missing."
        );

        return;

    }


    /* =====================================================
       SETTINGS
       ===================================================== */

    const JSON_PATH =
        "assets/images/projects/projects.json";


    const TRANSITION_TIME =
        850;


    const AUTOPLAY_TIME =
        3000;


    /* =====================================================
       STATE
       ===================================================== */

    let allProjects =
        [];


    let visibleProjects =
        [];


    let cards =
        [];


    let currentIndex =
        0;


    let isAnimating =
        false;


    let autoplayTimer =
        null;


    /* =====================================================
       IMAGE CACHE
       ===================================================== */

    const imageCache =
        new Map();


    function getImagePath(project) {

        return (
            "assets/images/projects/" +
            project.image
        );

    }


    function preloadImage(project) {

        if (!project) {

            return Promise.resolve();

        }


        const src =
            getImagePath(project);


        if (
            imageCache.has(src)
        ) {

            return imageCache.get(src);

        }


        const promise =
            new Promise(
                function (resolve) {

                    const image =
                        new Image();


                    image.decoding =
                        "async";


                    image.onload =
                        async function () {

                            try {

                                if (
                                    image.decode
                                ) {

                                    await image.decode();

                                }

                            } catch (error) {}

                            imageCache.set(
                                src,
                                image
                            );

                            resolve();

                        };


                    image.onerror =
                        function () {

                            console.warn(
                                "Unable to load project image:",
                                src
                            );

                            resolve();

                        };


                    image.src =
                        src;

                }
            );


        imageCache.set(
            src,
            promise
        );


        return promise;

    }


    async function preloadAllProjects() {

        await Promise.all(
            allProjects.map(
                preloadImage
            )
        );

    }


    /* =====================================================
       CREATE CARD
       ===================================================== */

    function createProjectCard(
        project,
        index
    ) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "project-card";


        const image =
            document.createElement(
                "img"
            );


        image.src =
            getImagePath(project);


        image.alt =
            project.title || "";


        image.draggable =
            false;


        /* INFO */

        const info =
            document.createElement(
                "div"
            );


        info.className =
            "project-card-info";


        /* CATEGORY */

        const category =
            document.createElement(
                "div"
            );


        category.className =
            "project-card-category";


        const categoryLine =
            document.createElement(
                "span"
            );


        category.appendChild(
            categoryLine
        );


        category.appendChild(
            document.createTextNode(
                (
                    project.category ||
                    ""
                ).toUpperCase()
            )
        );


        /* TITLE */

        const title =
            document.createElement(
                "h3"
            );


        title.textContent =
            project.title || "";


        /* DESCRIPTION */

        const description =
            document.createElement(
                "p"
            );


        description.textContent =
            project.description || "";


        info.appendChild(
            category
        );


        info.appendChild(
            title
        );


        info.appendChild(
            description
        );


        /* COUNTER */

        const counter =
            document.createElement(
                "div"
            );


        counter.className =
            "project-card-counter";


        const current =
            document.createElement(
                "span"
            );


        current.className =
            "current";


        current.textContent =
            String(
                index + 1
            ).padStart(
                2,
                "0"
            );


        const slash =
            document.createElement(
                "span"
            );


        slash.textContent =
            "/";


        const total =
            document.createElement(
                "span"
            );


        total.textContent =
            String(
                visibleProjects.length
            ).padStart(
                2,
                "0"
            );


        counter.appendChild(
            current
        );


        counter.appendChild(
            slash
        );


        counter.appendChild(
            total
        );


        /* BUILD */

        card.appendChild(
            image
        );


        card.appendChild(
            info
        );


        card.appendChild(
            counter
        );


        return card;

    }


    /* =====================================================
       BUILD TRACK
       ===================================================== */

    function buildTrack() {

        track.innerHTML =
            "";


        cards =
            [];


        visibleProjects.forEach(
            function (
                project,
                index
            ) {

                const card =
                    createProjectCard(
                        project,
                        index
                    );


                track.appendChild(
                    card
                );


                cards.push(
                    card
                );

            }
        );

    }


    /* =====================================================
       MEASURE ACTUAL CARD STEP
       ===================================================== */

    function getActualCardStep() {

        if (
            cards.length < 2
        ) {

            return 0;

        }


        /*
           IMPORTANT:

           Do NOT assume that the gap is 28px.

           We measure the actual rendered distance
           between the first and second cards.

           This completely removes cumulative
           positioning error.
        */

        const first =
            cards[0]
                .getBoundingClientRect();


        const second =
            cards[1]
                .getBoundingClientRect();


        return (
            second.left -
            first.left
        );

    }


    /* =====================================================
       GET CARD WIDTH
       ===================================================== */

    function getCardWidth() {

        if (
            !cards.length
        ) {

            return 0;

        }


        return cards[0]
            .getBoundingClientRect()
            .width;

    }


    /* =====================================================
       CENTER POSITION
       ===================================================== */

    function getCenterOffset() {

        if (
            !cards.length
        ) {

            return 0;

        }


        const cardWidth =
            getCardWidth();


        /*
           Viewer is full browser width.

           Put the exact center of the card
           on the exact center of the viewer.
        */

        return (
            viewer.clientWidth / 2
            -
            cardWidth / 2
        );

    }


    /* =====================================================
       UPDATE ACTIVE CARD
       ===================================================== */

    function updateCardStates() {

        cards.forEach(
            function (
                card,
                index
            ) {

                card.classList.toggle(
                    "is-active",
                    index === currentIndex
                );

            }
        );


        updatePagination();

    }


    /* =====================================================
       POSITION TRACK
       ===================================================== */

    function setTrackPosition(
        animate
    ) {

        if (
            !cards.length
        ) {

            return;

        }


        /*
           Measure the ACTUAL rendered step.
        */

        const cardStep =
            getActualCardStep();


        const centerOffset =
            getCenterOffset();


        /*
           Current card's left edge should be:

           viewer center
           minus half card width
           minus its actual track position
        */

        const x =
            centerOffset
            -
            (
                currentIndex *
                cardStep
            );


        if (
            animate
        ) {

            track.style.transition =
                `transform ${TRANSITION_TIME}ms cubic-bezier(.22,.61,.36,1)`;

        } else {

            track.style.transition =
                "none";

        }


        track.style.transform =
            `translate3d(${x}px,0,0)`;


        updateCardStates();

    }


    /* =====================================================
       PAGINATION
       ===================================================== */

    function updatePagination() {

        if (!pagination) {
            return;
        }


        pagination.innerHTML =
            "";


        visibleProjects.forEach(
            function (
                project,
                index
            ) {

                const dot =
                    document.createElement(
                        "button"
                    );


                dot.type =
                    "button";


                dot.className =
                    "project-pagination-dot";


                if (
                    index === currentIndex
                ) {

                    dot.classList.add(
                        "active"
                    );

                }


                dot.setAttribute(
                    "aria-label",
                    "View project " +
                    (index + 1)
                );


                dot.addEventListener(
                    "click",
                    function () {

                        if (
                            isAnimating ||
                            index === currentIndex
                        ) {

                            return;

                        }


                        goTo(
                            index
                        );

                    }
                );


                pagination.appendChild(
                    dot
                );

            }
        );

    }


    /* =====================================================
       GO TO
       ===================================================== */

    function goTo(
        targetIndex
    ) {

        if (
            isAnimating
        ) {

            return;

        }


        if (
            visibleProjects.length <= 1
        ) {

            return;

        }


        const length =
            visibleProjects.length;


        let newIndex =
            targetIndex;


        if (
            newIndex >= length
        ) {

            newIndex =
                0;

        }


        if (
            newIndex < 0
        ) {

            newIndex =
                length - 1;

        }


        isAnimating =
            true;


        currentIndex =
            newIndex;


        /*
           Move ONLY the track.

           Cards themselves never move,
           resize or scale.
        */

        setTrackPosition(
            true
        );


        restartAutoplay();


        setTimeout(
            function () {

                isAnimating =
                    false;

            },
            TRANSITION_TIME + 40
        );

    }


    /* =====================================================
       NEXT
       ===================================================== */

    function nextProject() {

        if (
            isAnimating
        ) {

            return;

        }


        goTo(
            currentIndex + 1
        );

    }


    /* =====================================================
       PREVIOUS
       ===================================================== */

    function previousProject() {

        if (
            isAnimating
        ) {

            return;

        }


        goTo(
            currentIndex - 1
        );

    }


    /* =====================================================
       FILTERS
       ===================================================== */

    filters.forEach(
        function (
            filter
        ) {

            filter.addEventListener(
                "click",
                async function () {

                    if (
                        isAnimating
                    ) {

                        return;

                    }


                    const category =
                        filter.dataset.category;


                    filters.forEach(
                        function (
                            button
                        ) {

                            button.classList.remove(
                                "active"
                            );

                        }
                    );


                    filter.classList.add(
                        "active"
                    );


                    if (
                        !category ||
                        category === "all"
                    ) {

                        visibleProjects =
                            allProjects.slice();

                    } else {

                        visibleProjects =
                            allProjects.filter(
                                function (
                                    project
                                ) {

                                    return (
                                        project.category ===
                                        category
                                    );

                                }
                            );

                    }


                    currentIndex =
                        0;


                    await Promise.all(
                        visibleProjects.map(
                            preloadImage
                        )
                    );


                    buildTrack();


                    requestAnimationFrame(
                        function () {

                            requestAnimationFrame(
                                function () {

                                    setTrackPosition(
                                        false
                                    );

                                }
                            );

                        }
                    );


                    restartAutoplay();

                }
            );

        }
    );


    /* =====================================================
       AUTOPLAY
       ===================================================== */

    function startAutoplay() {

        stopAutoplay();


        if (
            visibleProjects.length <= 1
        ) {

            return;

        }


        autoplayTimer =
            setInterval(
                function () {

                    nextProject();

                },
                AUTOPLAY_TIME
            );

    }


    function stopAutoplay() {

        if (
            autoplayTimer
        ) {

            clearInterval(
                autoplayTimer
            );


            autoplayTimer =
                null;

        }

    }


    function restartAutoplay() {

        stopAutoplay();

        startAutoplay();

    }


    /* =====================================================
       HOVER PAUSE
       ===================================================== */

    viewer.addEventListener(
        "mouseenter",
        function () {

            stopAutoplay();

        }
    );


    viewer.addEventListener(
        "mouseleave",
        function () {

            startAutoplay();

        }
    );


    /* =====================================================
       TOUCH SWIPE
       ===================================================== */

    let touchStartX =
        0;


    let touchStartY =
        0;


    viewer.addEventListener(
        "touchstart",
        function (
            event
        ) {

            if (
                !event.touches.length
            ) {

                return;

            }


            touchStartX =
                event.touches[0]
                    .clientX;


            touchStartY =
                event.touches[0]
                    .clientY;


            stopAutoplay();

        },
        {
            passive: true
        }
    );


    viewer.addEventListener(
        "touchend",
        function (
            event
        ) {

            if (
                !event.changedTouches.length
            ) {

                return;

            }


            const touchEndX =
                event.changedTouches[0]
                    .clientX;


            const touchEndY =
                event.changedTouches[0]
                    .clientY;


            const deltaX =
                touchEndX -
                touchStartX;


            const deltaY =
                touchEndY -
                touchStartY;


            if (
                Math.abs(deltaX) > 50 &&
                Math.abs(deltaX) >
                Math.abs(deltaY)
            ) {

                if (
                    deltaX < 0
                ) {

                    nextProject();

                } else {

                    previousProject();

                }

            }


            startAutoplay();

        },
        {
            passive: true
        }
    );


    /* =====================================================
       RESIZE
       ===================================================== */

    let resizeTimer;


    window.addEventListener(
        "resize",
        function () {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    function () {

                        setTrackPosition(
                            false
                        );

                    },
                    150
                );

        }
    );


    /* =====================================================
       BUTTONS
       ===================================================== */

    if (
        nextButton
    ) {

        nextButton.addEventListener(
            "click",
            nextProject
        );

    }


    if (
        previousButton
    ) {

        previousButton.addEventListener(
            "click",
            previousProject
        );

    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    async function initialize() {

        try {

            const response =
                await fetch(
                    JSON_PATH
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    "Unable to load projects.json. Status: " +
                    response.status
                );

            }


            const data =
                await response.json();


            if (
                !Array.isArray(data) ||
                !data.length
            ) {

                throw new Error(
                    "projects.json contains no projects."
                );

            }


            allProjects =
                data;


            visibleProjects =
                data.slice();


            currentIndex =
                0;


            await preloadAllProjects();


            buildTrack();


            requestAnimationFrame(
                function () {

                    requestAnimationFrame(
                        function () {

                            setTrackPosition(
                                false
                            );


                            startAutoplay();

                        }
                    );

                }
            );


        } catch (error) {

            console.error(
                "Plan B Projects Gallery Error:",
                error
            );

        }

    }


    initialize();


})();