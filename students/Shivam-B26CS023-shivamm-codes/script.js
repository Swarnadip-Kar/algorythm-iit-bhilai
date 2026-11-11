document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       SCROLL REVEAL
       ========================================== */

    const revealElements = document.querySelectorAll(
        "h2, h3, p, table, ul, ol, .society-card, #visitor-form"
    );

    revealElements.forEach((element) => {
        element.classList.add("reveal");
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.08
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });


    /* ==========================================
       SOCIETY CARD INTERACTION
       ========================================== */

    document.querySelectorAll(".society-card").forEach((card) => {

        card.addEventListener("click", () => {
            card.classList.toggle("expanded");
        });

    });


    /* ==========================================
       CONTACT FORM
       ========================================== */

    const form = document.querySelector(".visitor-form");

    if (!form) {
        return;
    }

    const submitButton =
        form.querySelector(".visitor-submit");

    const messageBox =
        document.createElement("div");

    messageBox.className = "form-message";

    form.prepend(messageBox);


    /* ==========================================
       DISPLAY FORM MESSAGE
       ========================================== */

    function showMessage(message, type) {

        messageBox.textContent = message;

        messageBox.className =
            `form-message ${type}`;

        messageBox.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }


    /* ==========================================
       FORM SUBMISSION
       ========================================== */

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name =
            document
                .querySelector("#visitor-name")
                ?.value
                .trim();

        const email =
            document
                .querySelector("#visitor-email")
                ?.value
                .trim();

        if (!name || !email) {

            showMessage(
                "Please enter your name and email.",
                "error"
            );

            return;
        }


        /* --------------------------------------
           Browser validation
           -------------------------------------- */

        if (!form.checkValidity()) {

            form.reportValidity();

            return;
        }


        /* --------------------------------------
           Loading state
           -------------------------------------- */

        submitButton.disabled = true;

        const originalButtonHTML =
            submitButton.innerHTML;

        submitButton.innerHTML = `
            <span>Sending...</span>
            <span class="arrow">⌛</span>
        `;


        /* --------------------------------------
           Collect form data
           -------------------------------------- */

        const formData =
            new FormData(form);

        const data =
            Object.fromEntries(formData.entries());


        try {

            /* ----------------------------------
               VERCEL SERVERLESS API
               ---------------------------------- */

            const response = await fetch(
                "/api/submit-visitor",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );


            let result;

            try {

                result =
                    await response.json();

            } catch {

                throw new Error(
                    "The server returned an invalid response."
                );

            }


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Unable to send your message."
                );

            }


            /* ----------------------------------
               SUCCESS
               ---------------------------------- */

            showMessage(
                "✓ Thanks! Your details have been sent successfully.",
                "success"
            );

            form.reset();


        } catch (error) {

            console.error(
                "Contact form error:",
                error
            );

            showMessage(
                error.message ||
                "Unable to send your message. Please try again later.",
                "error"
            );


        } finally {

            submitButton.disabled = false;

            submitButton.innerHTML =
                originalButtonHTML;
        }

    });


    /* ==========================================
       EMAIL VALIDATION
       ========================================== */

    const emailInput =
        document.querySelector("#visitor-email");

    if (emailInput) {

        emailInput.addEventListener(
            "blur",
            () => {

                const emailRegex =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (
                    emailInput.value &&
                    !emailRegex.test(
                        emailInput.value.trim()
                    )
                ) {

                    emailInput.setCustomValidity(
                        "Please enter a valid email address."
                    );

                } else {

                    emailInput.setCustomValidity("");

                }

            }
        );
    }


    /* ==========================================
       PHONE INPUT
       ========================================== */

    const phoneInput =
        document.querySelector("#visitor-phone");

    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            () => {

                phoneInput.value =
                    phoneInput.value.replace(
                        /[^0-9+\-\s()]/g,
                        ""
                    );

            }
        );
    }


    /* ==========================================
       CURRENT YEAR
       ========================================== */

    document
        .querySelectorAll("[data-year]")
        .forEach((element) => {

            element.textContent =
                new Date().getFullYear();

        });

});