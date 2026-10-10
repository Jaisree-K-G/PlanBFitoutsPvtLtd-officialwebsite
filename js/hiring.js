/* =========================================================

   PLAN B FITOUTS — HIRING PAGE

   Dynamic Jobs + Resume Upload + Submission Response

   ========================================================= */


(() => {

    "use strict";


    const JOBS_URL = "assets/images/hiring/jobs.json";


    const APPS_SCRIPT_URL =

        "https://script.google.com/macros/s/AKfycbx47odKu0MSCf1AdRmSZu0ZS62l8J-dD8dD1FD6q2D0qzNiW731hqBm8V7UEJw22tCb/exec";


    const MAX_FILE_SIZE = 5 * 1024 * 1024;


    const jobList = document.getElementById("jobList");

    const applicationRole = document.getElementById("applicationRole");

    const hiringForm = document.getElementById("hiringForm");

    const resumeInput = document.getElementById("resume");

    const resumeFileName = document.getElementById("resumeFileName");

    const applicationSection = document.getElementById("application");

    const applicationSubmit = document.getElementById("applicationSubmit");


    let jobs = [];

    let isSubmitting = false;

    let submissionTimer = null;

    let activeSubmissionToken = "";


    /* =====================================================

       LOAD JOBS

       ===================================================== */


    async function loadJobs() {

        if (!jobList) return;


        try {

            const response = await fetch(JOBS_URL, {

                method: "GET",

                cache: "no-store"

            });


            if (!response.ok) {

                throw new Error("Could not load jobs.json: HTTP " + response.status);

            }


            const data = await response.json();


            if (!Array.isArray(data)) {

                throw new Error("jobs.json must contain a JSON array.");

            }


            jobs = data;

            renderJobs();

            populateJobSelect();


            console.log("Plan B Hiring: roles loaded", getOpenJobs());


        } catch (error) {

            console.error("Plan B Hiring: job loading error", error);


            jobList.innerHTML = `

                <div class="jobs-error">

                    <span>PB / HR</span>

                    <strong>Unable to load current openings.</strong>

                    <p>Please refresh the page and try again.</p>

                </div>

            `;

        }

    }


    function getOpenJobs() {

        return jobs.filter(job =>

            String(job.status || "").trim().toLowerCase() === "open"

        );

    }


    /* =====================================================

       RENDER OPENINGS — ORIGINAL CSS CLASS STRUCTURE

       ===================================================== */


    function renderJobs() {

        const openJobs = getOpenJobs();


        if (!openJobs.length) {

            jobList.innerHTML = `

                <div class="no-openings">

                    <div class="no-openings-number">PB / HR</div>

                    <div class="no-openings-content">

                        <h3>NO CURRENT OPENINGS.</h3>

                        <p>

                            We don't have any active positions at the moment,

                            but you can still send us your profile for future opportunities.

                        </p>

                        <button type="button"

                            class="job-apply-button general-application-button"

                            data-role="General Application">

                            SEND YOUR PROFILE <span>↗</span>

                        </button>

                    </div>

                </div>

            `;


            bindJobButtons();

            return;

        }


        jobList.innerHTML = openJobs.map((job, index) => `

            <article class="job-row">

                <div class="job-index">

                    ${String(index + 1).padStart(2, "0")}

                </div>


                <div class="job-main">

                    <div class="job-title-line">

                        <h3>${escapeHTML(job.title)}</h3>

                        <span class="job-status">OPEN</span>

                    </div>


                    <p class="job-description">

                        ${escapeHTML(job.description)}

                    </p>


                    <div class="job-meta">

                        <span>

                            <small>DEPARTMENT</small>

                            ${escapeHTML(job.department)}

                        </span>

                        <span>

                            <small>LOCATION</small>

                            ${escapeHTML(job.location)}

                        </span>

                        <span>

                            <small>TYPE</small>

                            ${escapeHTML(job.type)}

                        </span>

                        <span>

                            <small>EXPERIENCE</small>

                            ${escapeHTML(job.experience)}

                        </span>

                    </div>

                </div>


                <div class="job-action">

                    <button type="button"

                        class="job-apply-button"

                        data-role="${escapeAttribute(job.title)}">

                        APPLY <span>↗</span>

                    </button>

                </div>

            </article>

        `).join("");


        bindJobButtons();

    }


    function populateJobSelect() {

        if (!applicationRole) return;


        const previousValue = applicationRole.value;


        applicationRole.innerHTML = `

            <option value="" disabled>Select a position</option>

        `;


        getOpenJobs().forEach(job => {

            const option = document.createElement("option");

            option.value = job.title;

            option.textContent = job.title;

            applicationRole.appendChild(option);

        });


        const generalOption = document.createElement("option");

        generalOption.value = "General Application";

        generalOption.textContent = "General Application";

        applicationRole.appendChild(generalOption);


        const validValues = [

            ...getOpenJobs().map(job => job.title),

            "General Application"

        ];


        if (validValues.includes(previousValue)) {

            applicationRole.value = previousValue;

        } else {

            applicationRole.selectedIndex = 0;

        }

    }


    function bindJobButtons() {

        document.querySelectorAll(".job-apply-button").forEach(button => {

            button.addEventListener("click", () => {

                if (applicationRole && button.dataset.role) {

                    applicationRole.value = button.dataset.role;

                }


                scrollToApplication();

            });

        });

    }


    function scrollToApplication() {

        if (!applicationSection) return;


        const top =

            applicationSection.getBoundingClientRect().top +

            window.scrollY - 90;


        window.scrollTo({ top, behavior: "smooth" });

    }


    /* =====================================================

       RESUME VALIDATION

       ===================================================== */


    if (resumeInput) {

        resumeInput.addEventListener("change", () => {

            const file = resumeInput.files && resumeInput.files[0];


            if (!file) {

                if (resumeFileName) {

                    resumeFileName.textContent = "No file selected";

                }


                return;

            }


            const extension = file.name.split(".").pop().toLowerCase();


            if (!["pdf", "doc", "docx"].includes(extension)) {

                alert("Please upload a PDF, DOC or DOCX resume.");

                resumeInput.value = "";


                if (resumeFileName) {

                    resumeFileName.textContent = "No file selected";

                }


                return;

            }


            if (file.size === 0 || file.size > MAX_FILE_SIZE) {

                alert("Please select a non-empty resume of 5 MB or less.");

                resumeInput.value = "";


                if (resumeFileName) {

                    resumeFileName.textContent = "No file selected";

                }


                return;

            }


            if (resumeFileName) {

                resumeFileName.textContent = file.name;

            }

        });

    }


    /* =====================================================

       HIDDEN IFRAME

       ===================================================== */


    function getSubmissionFrame() {

        let frame = document.getElementById("pbHiringSubmitFrame");


        if (frame) return frame;


        frame = document.createElement("iframe");

        frame.id = "pbHiringSubmitFrame";

        frame.name = "pbHiringSubmitFrame";

        frame.title = "Plan B hiring submission";

        frame.setAttribute("aria-hidden", "true");


        Object.assign(frame.style, {

            position: "fixed",

            width: "1px",

            height: "1px",

            left: "-10000px",

            top: "-10000px",

            opacity: "0",

            border: "0",

            pointerEvents: "none"

        });


        document.body.appendChild(frame);

        return frame;

    }


    /* =====================================================

       ADD HIDDEN RESUME FIELDS

       ===================================================== */


    function setHiddenField(name, value) {

        let field = hiringForm.querySelector(

            `input[type="hidden"][name="${name}"]`

        );


        if (!field) {

            field = document.createElement("input");

            field.type = "hidden";

            field.name = name;

            hiringForm.appendChild(field);

        }


        field.value = value;

    }


    function readFileAsDataURL(file) {

        return new Promise((resolve, reject) => {

            const reader = new FileReader();


            reader.onload = () => resolve(String(reader.result || ""));

            reader.onerror = () => reject(new Error("Unable to read the resume file."));


            reader.readAsDataURL(file);

        });

    }


        /* =====================================================

       THREE-STEP APPLICATION WIZARD

       ===================================================== */


    let activeStep = 0;

    let wizardPanels = [];


    function setupApplicationWizard() {

        if (!hiringForm || hiringForm.dataset.wizardReady === "true") return;


        const roleField = hiringForm.querySelector(".application-role-field");

        const grids = Array.from(hiringForm.querySelectorAll(":scope > .application-grid"));

        const resumeBlock = hiringForm.querySelector(":scope > .resume-upload");

        const submitBlock = hiringForm.querySelector(":scope > .application-submit");

        const messageField = hiringForm.querySelector(":scope > .application-field:not(.application-role-field)");


        if (!roleField || grids.length < 2 || !resumeBlock || !submitBlock) return;


        const personalGrid = grids[0];

        const professionalGrid = grids[1];

        const experienceField = personalGrid.querySelector("#experience")?.closest(".application-field");

        if (experienceField) professionalGrid.appendChild(experienceField);


        const stepDefinitions = [

            {

                title: "Personal Details",

                subtitle: "Let's start with the basics.",

                number: "01"

            },

            {

                title: "Professional Background",

                subtitle: "Tell us about your experience.",

                number: "02"

            },

            {

                title: "Resume & Submit",

                subtitle: "One final step before we receive your application.",

                number: "03"

            }

        ];


        const progress = document.createElement("div");

        progress.className = "pb-wizard-progress";

        progress.setAttribute("aria-label", "Application progress");

        progress.innerHTML = `

            <div class="pb-wizard-progress-line"><span></span></div>

            ${stepDefinitions.map((step, index) => `

                <div class="pb-wizard-progress-step" data-step-indicator="${index}">

                    <span class="pb-wizard-step-number">${step.number}</span>

                    <span class="pb-wizard-step-label">${step.title}</span>

                </div>

            `).join("")}

        `;


        const intro = document.createElement("div");

        intro.className = "pb-wizard-intro";

        intro.innerHTML = `

            <div class="pb-wizard-eyebrow">YOUR APPLICATION / <span>01 — 03</span></div>

            <h3 id="pbWizardTitle">Personal Details<span>.</span></h3>

            <p id="pbWizardSubtitle">Let's start with the basics.</p>

        `;


        const originalBlocks = [

            [roleField, personalGrid],

            [professionalGrid, messageField].filter(Boolean),

            [resumeBlock, submitBlock]

        ];


        const panelContainer = document.createElement("div");

        panelContainer.className = "pb-wizard-panels";


        wizardPanels = originalBlocks.map((blocks, index) => {

            const panel = document.createElement("section");

            panel.className = "pb-wizard-panel";

            panel.dataset.wizardStep = String(index);

            panel.setAttribute("aria-labelledby", "pbWizardTitle");

            blocks.forEach(block => panel.appendChild(block));


            const nav = document.createElement("div");

            nav.className = "pb-wizard-navigation";


            if (index > 0) {

                const back = document.createElement("button");

                back.type = "button";

                back.className = "pb-wizard-back";

                back.innerHTML = "← <span>BACK</span>";

                back.addEventListener("click", () => showWizardStep(index - 1));

                nav.appendChild(back);

            } else {

                const note = document.createElement("span");

                note.className = "pb-wizard-privacy-note";

                note.textContent = "YOUR DETAILS ARE KEPT PRIVATE";

                nav.appendChild(note);

            }


            if (index < 2) {

                const next = document.createElement("button");

                next.type = "button";

                next.className = "pb-wizard-next";

                next.innerHTML = 'NEXT STEP <span>↗</span>';

                next.addEventListener("click", () => {

                    if (validateWizardPanel(panel)) showWizardStep(index + 1);

                });

                nav.appendChild(next);

            } else {

                const finalNote = document.createElement("span");

                finalNote.className = "pb-wizard-privacy-note";

                finalNote.textContent = "PDF / DOC / DOCX · MAX 5 MB";

                nav.appendChild(finalNote);

            }


            panel.appendChild(nav);

            panelContainer.appendChild(panel);

            return panel;

        });


        hiringForm.insertBefore(progress, hiringForm.firstChild);

        hiringForm.insertBefore(intro, progress.nextSibling);

        hiringForm.insertBefore(panelContainer, intro.nextSibling);


        // Replace the original submit label while preserving the existing submit button.

        if (applicationSubmit) {

            applicationSubmit.innerHTML = 'SUBMIT APPLICATION <span>↗</span>';

            applicationSubmit.classList.add("pb-wizard-submit");

        }


        hiringForm.dataset.wizardReady = "true";

        injectWizardStyles();

        showWizardStep(0);

    }


    function validateWizardPanel(panel) {

        const controls = Array.from(panel.querySelectorAll("input, select, textarea"))

            .filter(control => !control.disabled && control.type !== "hidden");


        for (const control of controls) {

            if (!control.checkValidity()) {

                control.reportValidity();

                control.focus({ preventScroll: true });

                control.scrollIntoView({ behavior: "smooth", block: "center" });

                return false;

            }

        }

        return true;

    }


    function showWizardStep(stepIndex) {

        if (!wizardPanels.length) return;


        activeStep = Math.max(0, Math.min(stepIndex, wizardPanels.length - 1));


        wizardPanels.forEach((panel, index) => {

            const isActive = index === activeStep;

            panel.hidden = !isActive;

            panel.classList.toggle("is-active", isActive);


            // Only active-step fields participate in native browser validation.

            panel.querySelectorAll("input, select, textarea").forEach(control => {

                if (!control.hasAttribute("data-wizard-required")) {

                    control.dataset.wizardRequired = control.required ? "true" : "false";

                }

                control.required = isActive && control.dataset.wizardRequired === "true";

            });

        });


        document.querySelectorAll("[data-step-indicator]").forEach((indicator, index) => {

            indicator.classList.toggle("is-active", index === activeStep);

            indicator.classList.toggle("is-complete", index < activeStep);

            if (index === activeStep) indicator.setAttribute("aria-current", "step");

            else indicator.removeAttribute("aria-current");

        });


        const title = document.getElementById("pbWizardTitle");

        const subtitle = document.getElementById("pbWizardSubtitle");

        const count = document.querySelector(".pb-wizard-eyebrow span");

        const copy = [

            ["Personal Details", "Let's start with the basics."],

            ["Professional Background", "Tell us about your experience."],

            ["Resume & Submit", "Attach your resume and send your application."]

        ][activeStep];


        if (title) title.innerHTML = `${copy[0]}<span>.</span>`;

        if (subtitle) subtitle.textContent = copy[1];

        if (count) count.textContent = `${String(activeStep + 1).padStart(2, "0")} — 03`;


        const progressLine = document.querySelector(".pb-wizard-progress-line span");

        if (progressLine) progressLine.style.width = `${(activeStep / 2) * 100}%`;


        if (applicationSubmit) {

            applicationSubmit.disabled = isSubmitting;

            applicationSubmit.innerHTML = isSubmitting

                ? '<span>SUBMITTING...</span>'

                : 'SUBMIT APPLICATION <span>↗</span>';

        }

    }


    function injectWizardStyles() {
        if (document.getElementById("pbHiringWizardStyles")) return;

        const style = document.createElement("style");
        style.id = "pbHiringWizardStyles";
        style.textContent = `
            .application-composer { overflow: hidden; border: 1px solid rgba(255,255,255,.55); border-radius: 20px; background: #f8f6f0; box-shadow: 0 24px 70px rgba(0,0,0,.22); }
            .application-topbar { display: none; }
            #hiringForm { padding: 34px 40px 36px; }
            .pb-wizard-progress { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); position: relative; gap: 12px; margin: 0 0 30px; padding: 0 0 5px; }
            .pb-wizard-progress-line { position: absolute; height: 2px; background: #deded8; top: 16px; left: 16.5%; right: 16.5%; z-index: 0; }
            .pb-wizard-progress-line span { display: block; height: 100%; width: 0; background: #ff6f00; transition: width .3s ease; }
            .pb-wizard-progress-step { display: flex; flex-direction: column; align-items: center; gap: 7px; min-width: 0; position: relative; z-index: 1; text-align: center; }
            .pb-wizard-step-number { display: grid; place-items: center; width: 34px; height: 34px; border: 1px solid #d5d8d5; border-radius: 50%; color: #56666a; background: #f8f6f0; font: 700 11px/1 "Century Gothic",Arial,sans-serif; transition: background .25s,color .25s,border-color .25s; }
            .pb-wizard-progress-step.is-active .pb-wizard-step-number, .pb-wizard-progress-step.is-complete .pb-wizard-step-number { border-color: #ff6f00; color: #fff; background: #ff6f00; box-shadow: none; }
            .pb-wizard-step-label { color: #647174; font: 700 9px/1.4 "Century Gothic",Arial,sans-serif; letter-spacing: -.02em; text-transform: none; }
            .pb-wizard-progress-step.is-active .pb-wizard-step-label, .pb-wizard-progress-step.is-complete .pb-wizard-step-label { color: #263d43; }
            .pb-wizard-intro { padding: 0; margin: 0 0 20px; border: 0; }
            .pb-wizard-eyebrow { display: none; }
            .pb-wizard-intro h3 { margin: 0 0 5px; color: #173640; font: 700 20px/1.35 "Century Gothic",Arial,sans-serif; letter-spacing: -.035em; }
            .pb-wizard-intro h3 span { color: #ff6f00; }
            .pb-wizard-intro p { margin: 0; color: #718084; font: 12px/1.6 "Century Gothic",Arial,sans-serif; }
            .pb-wizard-panel[hidden] { display: none !important; }
            .pb-wizard-panel { animation: pbWizardEnter .22s ease both; }
            .pb-wizard-panel .application-role-field { margin-bottom: 15px; }
            .pb-wizard-panel .application-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); column-gap: 12px; row-gap: 0; margin-bottom: 0; }
            .pb-wizard-panel .application-field { min-width: 0; margin-bottom: 14px; }
            .pb-wizard-panel .application-field label { margin-bottom: 6px; color: #526469; font-size: 9px; font-weight: 700; letter-spacing: 0; }
            .pb-wizard-panel .application-field input, .pb-wizard-panel .application-field select, .pb-wizard-panel .application-field textarea { width: 100%; min-height: 38px; padding: 9px 11px; border: 1px solid #d6dcd9; border-radius: 3px; background: #fff; color: #243d43; font: 11px/1.4 "Century Gothic",Arial,sans-serif; box-shadow: none; transition: border-color .2s,box-shadow .2s; }
            .pb-wizard-panel .application-field textarea { min-height: 100px; resize: vertical; }
            .pb-wizard-panel .application-field input::placeholder, .pb-wizard-panel .application-field textarea::placeholder { color: #a2abad; }
            .pb-wizard-panel .application-field input:focus, .pb-wizard-panel .application-field select:focus, .pb-wizard-panel .application-field textarea:focus { outline: none; border-color: #ff6f00; box-shadow: 0 0 0 2px rgba(255,111,0,.10); }
            .pb-wizard-panel .application-role-field select { min-height: 39px; }
            .pb-wizard-panel .application-role-field, .pb-wizard-panel .resume-upload, .pb-wizard-panel .application-submit { grid-column: 1 / -1; }
            .pb-wizard-panel .resume-upload { margin-bottom: 16px; }
            .pb-wizard-panel .resume-dropzone { display: flex; align-items: center; gap: 14px; min-height: 88px; padding: 18px; border: 1px dashed #e3a16e; border-radius: 6px; background: rgba(255,255,255,.65); cursor: pointer; transition: background .2s,border-color .2s; }
            .pb-wizard-panel .resume-dropzone:hover { border-color: #ff6f00; background: #fff; }
            .pb-wizard-panel .resume-file-name { margin-top: 8px; overflow-wrap: anywhere; font-size: 11px; }
            .pb-wizard-navigation { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 18px; padding-top: 16px; border-top: 1px solid #e3e3dc; }
            .pb-wizard-next, .pb-wizard-back { min-height: 40px; padding: 0 20px; border-radius: 999px; font: 700 10px/1 "Century Gothic",Arial,sans-serif; letter-spacing: 0; cursor: pointer; transition: background .2s,transform .2s,box-shadow .2s; }
            .pb-wizard-next { margin-left: auto; border: 1px solid #ff6f00; color: #fff; background: #ff6f00; box-shadow: 0 4px 10px rgba(255,111,0,.12); }
            .pb-wizard-next span { margin-left: 8px; font-size: 13px; }
            .pb-wizard-back { border: 1px solid #d7ddda; color: #496066; background: transparent; }
            .pb-wizard-next:hover { background: #e96100; box-shadow: 0 6px 14px rgba(255,111,0,.2); transform: translateY(-1px); }
            .pb-wizard-back:hover { background: #eeece5; }
            .pb-wizard-privacy-note { color: #788588; font: 700 8px/1.5 "Century Gothic",Arial,sans-serif; letter-spacing: .04em; }
            .pb-wizard-submit { border-radius: 999px !important; }
            .pb-wizard-submit:disabled, .pb-wizard-next:disabled { opacity: .65; cursor: wait; }
            .pb-wizard-panel .application-submit { margin-top: 0; }
            @keyframes pbWizardEnter { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            @media (max-width: 900px) { #hiringForm { padding: 28px 26px 30px; } .pb-wizard-intro h3 { font-size: 19px; } }
            @media (max-width: 600px) {
                #hiringForm { padding: 22px 17px 24px; }
                .pb-wizard-progress { gap: 4px; margin-bottom: 25px; }
                .pb-wizard-progress-line { top: 15px; left: 17%; right: 17%; }
                .pb-wizard-step-number { width: 31px; height: 31px; font-size: 10px; }
                .pb-wizard-step-label { max-width: 100%; font-size: 8px; line-height: 1.3; }
                .pb-wizard-intro { margin-bottom: 18px; }
                .pb-wizard-intro h3 { font-size: 18px; }
                .pb-wizard-panel .application-grid { grid-template-columns: minmax(0,1fr); column-gap: 0; }
                .pb-wizard-panel .application-field { margin-bottom: 13px; }
                .pb-wizard-navigation { margin-top: 14px; padding-top: 14px; }
                .pb-wizard-next, .pb-wizard-back { min-height: 40px; padding: 0 16px; font-size: 9px; }
                .pb-wizard-privacy-note { max-width: 48%; font-size: 7px; }
            }
            @media (prefers-reduced-motion: reduce) { .pb-wizard-panel, .pb-wizard-progress-line span, .pb-wizard-next, .pb-wizard-back { animation: none; transition: none; } }
        `;
        document.head.appendChild(style);
    }


    /* =====================================================


       SUBMIT APPLICATION


       ===================================================== */


    if (hiringForm) {


        hiringForm.addEventListener("submit", async event => {


            event.preventDefault();


            if (isSubmitting) return;


            if (!hiringForm.checkValidity()) {


                hiringForm.reportValidity();


                return;


            }


            const file = resumeInput && resumeInput.files[0];


            if (!file) {


                alert("Please attach your resume before submitting.");


                if (resumeInput) resumeInput.focus();


                return;


            }


            if (file.size > MAX_FILE_SIZE) {


                alert("Resume must be 5 MB or smaller.");


                return;


            }


            isSubmitting = true;


            setSubmitButtonState(true);


            try {


                /*


                 * Encode the selected file for the Apps Script backend.


                 * The backend decodes this value and saves the file in Drive.


                 */


                const dataURL = await readFileAsDataURL(file);


                setHiddenField("resumeBase64", dataURL);


                setHiddenField("resumeFileName", file.name);


                // Correlate the backend response with this specific submission.


                activeSubmissionToken =


                    window.crypto && typeof window.crypto.randomUUID === "function"


                        ? window.crypto.randomUUID()


                        : Date.now().toString(36) + "-" +


                          Math.random().toString(36).slice(2) + "-" +


                          Math.random().toString(36).slice(2);


                setHiddenField("responseToken", activeSubmissionToken);


                const frame = getSubmissionFrame();


                hiringForm.target = frame.name;


                hiringForm.action = APPS_SCRIPT_URL;


                hiringForm.method = "POST";


                hiringForm.enctype = "application/x-www-form-urlencoded";


                submissionTimer = setTimeout(() => {


                    finishSubmission({


                        success: false,


                        message:


                            "We couldn't confirm the submission. Please check your connection and try again. If the application appears in the sheet, do not submit it again."


                    });


                }, 45000);


                /*


                 * Submit to the hidden iframe so the main page stays open.


                 */


                HTMLFormElement.prototype.submit.call(hiringForm);


            } catch (error) {


                console.error("Plan B Hiring submission error:", error);


                finishSubmission({


                    success: false,


                    message: error.message ||


                        "We couldn't prepare your resume. Please try again."


                });


            }


        });


    }


    /* =====================================================


       LISTEN FOR BACKEND RESPONSE


       ===================================================== */


    window.addEventListener("message", event => {


        const data = event.data;


        // Ignore unrelated messages and responses for previous submissions.


        if (!isSubmitting || !data || typeof data !== "object") {


            return;


        }


        if (typeof data.success !== "boolean") {


            return;


        }


        if (


            !activeSubmissionToken ||


            data.responseToken !== activeSubmissionToken


        ) {


            return;


        }


        finishSubmission(data);


    });


    function finishSubmission(result) {


        if (!isSubmitting) return;


        if (submissionTimer) {


            clearTimeout(submissionTimer);


            submissionTimer = null;


        }


        isSubmitting = false;


        setSubmitButtonState(false);


        activeSubmissionToken = "";


                if (result.success) {


            resetForm();


            showSuccessPopup(result.applicationId || "");


        } else if (result.code === "DUPLICATE_EMAIL") {


            alert(


                "You are already registered.\n\n" +


                "You cannot submit another response again.\n\n" +


                "If you have any concern about your previous response, " +


                "please reach out to hr@planbfitouts.in."


            );


        } else {


            alert(


                "Application not confirmed\n\n" +


                (result.message ||


                    "Please try again or contact the HR team.")


            );


        }


    }


    function setSubmitButtonState(busy) {


        if (!applicationSubmit) return;


        applicationSubmit.disabled = busy;


        applicationSubmit.innerHTML = busy


            ? "<span>SUBMITTING...</span>"


            : 'SEND APPLICATION <span>↗</span>';


    }


    function resetForm() {


        hiringForm.reset();


        if (resumeFileName) {


            resumeFileName.textContent = "No file selected";


        }


        ["resumeBase64", "resumeFileName", "responseToken"].forEach(name => {


            const field = hiringForm.querySelector(


                `input[type="hidden"][name="${name}"]`


            );


            if (field) field.value = "";


        });


        if (applicationRole) {


            applicationRole.selectedIndex = 0;


        }


    }


    /* =====================================================


       SUCCESS POPUP


       ===================================================== */


    function showSuccessPopup(applicationId) {


        const existing = document.getElementById("pbHiringSuccessPopup");


        if (existing) existing.remove();


        const popup = document.createElement("div");


        popup.id = "pbHiringSuccessPopup";


        popup.className = "pb-hiring-popup";


        popup.innerHTML = `


            <div class="pb-hiring-popup-backdrop"></div>


            <div class="pb-hiring-dialog"


                 role="dialog"


                 aria-modal="true"


                 aria-labelledby="pbHiringPopupTitle">


                <button type="button"


                        class="pb-hiring-dialog-close"


                        aria-label="Close">×</button>


                <div class="pb-hiring-dialog-logo">


                    <img src="assets/images/plan-b-logo.png"


                         alt="Plan B Fitouts">


                </div>


                <div class="pb-hiring-dialog-label">


                    APPLICATION RECEIVED


                </div>


                <h2 id="pbHiringPopupTitle">


                    Thank you for reaching out.


                </h2>


                <p class="pb-hiring-dialog-message">


                    Your application and resume have been received.


                    Our team will review your profile and get back to you.


                </p>


                <div class="pb-hiring-dialog-id"></div>


                <div class="pb-hiring-dialog-best">All the best!</div>


                <div class="pb-hiring-dialog-footer">


                    DESIGN / PLAN / EXECUTE


                </div>


            </div>


        `;


        document.body.appendChild(popup);


        document.body.classList.add("pb-hiring-popup-open");


        if (applicationId) {


            popup.querySelector(".pb-hiring-dialog-id").textContent =


                "APPLICATION ID: " + applicationId;


        }


        const close = () => {


            popup.classList.remove("is-visible");


            document.body.classList.remove("pb-hiring-popup-open");


            setTimeout(() => popup.remove(), 400);


        };


        popup.querySelector(".pb-hiring-dialog-close")


            .addEventListener("click", close);


        popup.querySelector(".pb-hiring-popup-backdrop")


            .addEventListener("click", close);


        requestAnimationFrame(() => {


            popup.classList.add("is-visible");


        });


    }


    /* =====================================================


       POPUP STYLES


       ===================================================== */


    function injectPopupStyles() {


        if (document.getElementById("pbHiringPopupStyles")) return;


        const style = document.createElement("style");


        style.id = "pbHiringPopupStyles";


        style.textContent = `


            body.pb-hiring-popup-open {


                overflow: hidden;


            }


            .pb-hiring-popup {


                position: fixed;


                inset: 0;


                z-index: 99999;


                display: flex;


                align-items: center;


                justify-content: center;


                padding: 20px;


                opacity: 0;


                visibility: hidden;


                transition: opacity .4s ease, visibility .4s ease;


            }


            .pb-hiring-popup.is-visible {


                opacity: 1;


                visibility: visible;


            }


            .pb-hiring-popup-backdrop {


                position: absolute;


                inset: 0;


                background: rgba(3,43,53,.72);


                backdrop-filter: blur(14px);


                -webkit-backdrop-filter: blur(14px);


            }


            .pb-hiring-dialog {


                position: relative;


                z-index: 2;


                width: min(500px, calc(100vw - 40px));


                padding: 42px 36px 30px;


                text-align: center;


                color: #032b35;


                background: linear-gradient(145deg, #fff, #f0f6f5);


                border: 1px solid rgba(255,255,255,.9);


                border-radius: 24px;


                box-shadow: 0 35px 100px rgba(0,0,0,.36);


                transform: translateY(25px) scale(.96);


                opacity: 0;


                transition: transform .5s ease, opacity .4s ease;


            }


            .pb-hiring-popup.is-visible .pb-hiring-dialog {


                transform: translateY(0) scale(1);


                opacity: 1;


            }


            .pb-hiring-dialog::before {


                content: "";


                position: absolute;


                top: 0;


                left: 50%;


                width: 90px;


                height: 3px;


                transform: translateX(-50%);


                background: linear-gradient(90deg,#ff6f00,#ffa700);


                border-radius: 0 0 4px 4px;


            }


            .pb-hiring-dialog-close {


                position: absolute;


                top: 12px;


                right: 14px;


                width: 36px;


                height: 36px;


                border: 0;


                border-radius: 50%;


                background: rgba(3,43,53,.06);


                color: #032b35;


                font-size: 25px;


                cursor: pointer;


            }


            .pb-hiring-dialog-logo {


                width: 180px;


                max-width: 75%;


                margin: 0 auto 24px;


            }


            .pb-hiring-dialog-logo img {


                display: block;


                width: 100%;


                height: auto;


                object-fit: contain;


            }


            .pb-hiring-dialog-label {


                margin-bottom: 10px;


                font-size: 10px;


                font-weight: 700;


                letter-spacing: 3px;


                color: #ff6f00;


            }


            .pb-hiring-dialog h2 {


                margin: 0 0 15px;


                font-family: "Century Gothic", CenturyGothic, Arial, sans-serif;


                font-size: 28px;


                font-weight: 500;


                color: #032b35;


            }


            .pb-hiring-dialog-message {


                max-width: 380px;


                margin: auto;


                font-family: "Century Gothic", CenturyGothic, Arial, sans-serif;


                font-size: 14px;


                line-height: 1.75;


                color: #5d696c;


            }


            .pb-hiring-dialog-id {


                margin-top: 18px;


                font-size: 11px;


                font-weight: 700;


                letter-spacing: 1px;


                color: #075468;


                overflow-wrap: anywhere;


            }


            .pb-hiring-dialog-best {


                margin: 24px 0;


                font-size: 15px;


                font-weight: 600;


                color: #032b35;


            }


            .pb-hiring-dialog-footer {


                padding-top: 17px;


                border-top: 1px solid rgba(3,43,53,.08);


                font-size: 9px;


                font-weight: 700;


                letter-spacing: 3px;


                color: #075468;


            }


            @media (max-width: 600px) {


                .pb-hiring-dialog {


                    padding: 40px 23px 27px;


                    border-radius: 20px;


                }


                .pb-hiring-dialog h2 {


                    font-size: 24px;


                }


            }


        `;


        document.head.appendChild(style);


    }


    /* =====================================================


       ESCAPE HELPERS


       ===================================================== */


    function escapeHTML(value) {


        return String(value ?? "")


            .replace(/&/g, "&amp;")


            .replace(/</g, "&lt;")


            .replace(/>/g, "&gt;")


            .replace(/"/g, "&quot;")


            .replace(/'/g, "&#039;");


    }


    function escapeAttribute(value) {


        return escapeHTML(value);


    }


    /* =====================================================


       INITIALIZE


       ===================================================== */


    injectPopupStyles();


    getSubmissionFrame();


    loadJobs();


    setupApplicationWizard();


})();
