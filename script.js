// ==========================================================
// MBSC SOLUTIONS - COMPLETE SCRIPT.JS
// ==========================================================


// ==========================================================
// 1. SUPABASE CONFIG
// ==========================================================

const SUPABASE_URL =
    "https://whxlatxnqjpccwrmtmph.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_wlqTaOkM3fML9cuUES54fw_8TlbSi-H";


// ==========================================================
// 2. WHATSAPP NUMBER
// ==========================================================

const WHATSAPP_NUMBER =
    "917093334820";


// ==========================================================
// 3. GLOBAL VARIABLES
// ==========================================================

let servicesGrid = null;
let documentBox = null;


// ==========================================================
// 4. WHATSAPP LINK
// ==========================================================

function createWhatsAppLink(message) {

    return (
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message)
    );

}


// ==========================================================
// 5. HTML ESCAPE
// ==========================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================================
// 6. SHOW MESSAGE IN SERVICES
// ==========================================================

function showServiceMessage(title, message) {

    if (!servicesGrid) {
        return;
    }

    servicesGrid.innerHTML = `
        <div class="service">

            <h3>
                ${escapeHTML(title)}
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>
    `;

}


// ==========================================================
// 7. LOAD SERVICES FROM SUPABASE
// ==========================================================

async function loadServices() {

    console.log(
        "======================================"
    );

    console.log(
        "MBSC SOLUTIONS"
    );

    console.log(
        "Loading Services..."
    );

    console.log(
        "======================================"
    );


    // ------------------------------------------------------
    // FIND HTML ELEMENTS
    // ------------------------------------------------------

    servicesGrid =
        document.getElementById(
            "servicesGrid"
        );

    documentBox =
        document.getElementById(
            "documentBox"
        );


    // ------------------------------------------------------
    // CHECK SERVICES GRID
    // ------------------------------------------------------

    if (!servicesGrid) {

        console.error(
            "MBSC ERROR: #servicesGrid not found."
        );

        return;
    }


    // ------------------------------------------------------
    // LOADING MESSAGE
    // ------------------------------------------------------

    servicesGrid.innerHTML = `
        <div class="service loading-service">

            <h3>
                Loading Services...
            </h3>

            <p>
                Please wait while our services are loading.
            </p>

        </div>
    `;


    // ======================================================
    // SUPABASE REST API
    // ======================================================

    const apiURL =
        SUPABASE_URL +
        "/rest/v1/services?select=*";


    console.log(
        "Supabase URL:",
        SUPABASE_URL
    );


    console.log(
        "Services API:",
        apiURL
    );


    try {

        // ==================================================
        // FETCH SERVICES
        // ==================================================

        const response =
            await fetch(
                apiURL,
                {
                    method: "GET",

                    headers: {

                        "apikey":
                            SUPABASE_PUBLISHABLE_KEY,

                        "Authorization":
                            "Bearer " +
                            SUPABASE_PUBLISHABLE_KEY,

                        "Content-Type":
                            "application/json"

                    }
                }
            );


        console.log(
            "Supabase HTTP Status:",
            response.status
        );


        // ==================================================
        // READ RESPONSE
        // ==================================================

        const responseText =
            await response.text();


        console.log(
            "Supabase Response:",
            responseText
        );


        // ==================================================
        // CHECK HTTP ERROR
        // ==================================================

        if (!response.ok) {

            console.error(
                "SUPABASE ERROR:",
                responseText
            );


            showServiceMessage(
                "Unable to Load Services",
                "Supabase Error " +
                response.status +
                ": " +
                responseText
            );


            return;
        }


        // ==================================================
        // PARSE JSON
        // ==================================================

        let services;


        try {

            services =
                JSON.parse(
                    responseText
                );

        }

        catch (jsonError) {

            console.error(
                "JSON ERROR:",
                jsonError
            );


            showServiceMessage(
                "Services Error",
                "Supabase returned an invalid response."
            );


            return;
        }


        // ==================================================
        // CHECK ARRAY
        // ==================================================

        if (
            !Array.isArray(services)
        ) {

            console.error(
                "Invalid services data:",
                services
            );


            showServiceMessage(
                "Services Error",
                "Invalid data received from Supabase."
            );


            return;
        }


        // ==================================================
        // CHECK EMPTY
        // ==================================================

        if (
            services.length === 0
        ) {

            console.warn(
                "services table is empty."
            );


            showServiceMessage(
                "No Services Found",
                "The services table is connected but contains no records."
            );


            return;
        }


        // ==================================================
        // CLEAR LOADING
        // ==================================================

        servicesGrid.innerHTML =
            "";


        // ==================================================
        // CREATE ALL SERVICE CARDS
        // ==================================================

        services.forEach(
            function(service) {

                createServiceCard(
                    service
                );

            }
        );


        // ==================================================
        // SUCCESS
        // ==================================================

        console.log(
            "======================================"
        );

        console.log(
            "MBSC SERVICES LOADED SUCCESSFULLY"
        );

        console.log(
            "Total Services:",
            services.length
        );

        console.log(
            services
        );

        console.log(
            "======================================"
        );

    }

    catch (error) {

        console.error(
            "MBSC CONNECTION ERROR:",
            error
        );


        showServiceMessage(
            "Connection Error",
            error.message ||
            "Unable to connect to Supabase."
        );

    }

}


// ==========================================================
// 8. CREATE SERVICE CARD
// ==========================================================

function createServiceCard(service) {

    if (!servicesGrid) {
        return;
    }


    // ------------------------------------------------------
    // CARD
    // ------------------------------------------------------

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "service";


    // ------------------------------------------------------
    // SERVICE NAME
    // ------------------------------------------------------

    const serviceName =
        service.name ||
        service.service_name ||
        service.title ||
        service.service ||
        "Service";


    // ------------------------------------------------------
    // DESCRIPTION
    // ------------------------------------------------------

    const description =
        service.description ||
        service.details ||
        service.short_description ||
        "Click below to view service details.";


    // ------------------------------------------------------
    // DOCUMENTS
    // ------------------------------------------------------

    const documents =
        service.documents ||
        service.requirements ||
        service.docs ||
        service.document_list ||
        "";


    // ------------------------------------------------------
    // TITLE
    // ------------------------------------------------------

    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        serviceName;


    // ------------------------------------------------------
    // DESCRIPTION
    // ------------------------------------------------------

    const descriptionElement =
        document.createElement(
            "p"
        );


    descriptionElement.textContent =
        description;


    // ------------------------------------------------------
    // BUTTON
    // ------------------------------------------------------

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "service-button";


    button.textContent =
        "View & WhatsApp";


    // ------------------------------------------------------
    // BUTTON CLICK
    // ------------------------------------------------------

    button.addEventListener(
        "click",
        function() {

            showServiceDocuments(
                serviceName,
                documents
            );

        }
    );


    // ------------------------------------------------------
    // ADD CARD CONTENT
    // ------------------------------------------------------

    card.appendChild(
        title
    );


    card.appendChild(
        descriptionElement
    );


    card.appendChild(
        button
    );


    // ======================================================
    // LOANS VIDEO
    // ======================================================

    const lowerName =
        String(serviceName)
            .trim()
            .toLowerCase();


    if (
        lowerName === "loans" ||
        lowerName.includes("loan")
    ) {

        addLoansVideo(
            card
        );

    }


    // ======================================================
    // ADD CARD TO GRID
    // ======================================================

    servicesGrid.appendChild(
        card
    );

}


// ==========================================================
// 9. ADD LOANS VIDEO
// ==========================================================

function addLoansVideo(card) {

    console.log(
        "Adding Loans video..."
    );


    // ------------------------------------------------------
    // VIDEO
    // ------------------------------------------------------

    const video =
        document.createElement(
            "video"
        );


    video.className =
        "loans-video";


    // IMPORTANT:
    // loans.mp4 should be in same folder as index.html

    video.src =
        "loans.mp4";


    video.autoplay =
        true;


    video.loop =
        true;


    video.muted =
        true;


    video.playsInline =
        true;


    video.preload =
        "auto";


    video.setAttribute(
        "muted",
        ""
    );


    video.setAttribute(
        "playsinline",
        ""
    );


    // ------------------------------------------------------
    // VIDEO ERROR
    // ------------------------------------------------------

    video.addEventListener(
        "error",
        function() {

            console.error(
                "MBSC ERROR: loans.mp4 not found or cannot be played."
            );

        }
    );


    // ------------------------------------------------------
    // VIDEO LOADED
    // ------------------------------------------------------

    video.addEventListener(
        "loadeddata",
        function() {

            console.log(
                "MBSC: loans.mp4 loaded successfully."
            );

        }
    );


    // ------------------------------------------------------
    // OVERLAY
    // ------------------------------------------------------

    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "loans-video-overlay";


    // ------------------------------------------------------
    // ADD TO CARD
    // ------------------------------------------------------

    card.prepend(
        video
    );


    card.prepend(
        overlay
    );


    // ------------------------------------------------------
    // PLAY
    // ------------------------------------------------------

    video.play()
        .catch(
            function(error) {

                console.log(
                    "Loans video autoplay message:",
                    error
                );

            }
        );

}


// ==========================================================
// 10. SHOW DOCUMENTS
// ==========================================================

function showServiceDocuments(
    serviceName,
    documents
) {

    if (!documentBox) {

        documentBox =
            document.getElementById(
                "documentBox"
            );

    }


    if (!documentBox) {

        console.error(
            "MBSC ERROR: documentBox not found."
        );

        return;
    }


    // ------------------------------------------------------
    // CLEAR
    // ------------------------------------------------------

    documentBox.innerHTML =
        "";


    // ------------------------------------------------------
    // HEADING
    // ------------------------------------------------------

    const heading =
        document.createElement(
            "h3"
        );


    heading.textContent =
        serviceName;


    documentBox.appendChild(
        heading
    );


    // ------------------------------------------------------
    // LIST
    // ------------------------------------------------------

    const list =
        document.createElement(
            "ul"
        );


    list.className =
        "requirements-list";


    let items =
        [];


    // ------------------------------------------------------
    // ARRAY
    // ------------------------------------------------------

    if (
        Array.isArray(documents)
    ) {

        items =
            documents;

    }


    // ------------------------------------------------------
    // STRING
    // ------------------------------------------------------

    else if (
        typeof documents ===
        "string"
    ) {

        items =
            documents
                .split(
                    /\r?\n|,|;/
                )
                .map(
                    function(item) {

                        return item.trim();

                    }
                )
                .filter(
                    Boolean
                );

    }


    // ------------------------------------------------------
    // NO DOCUMENTS
    // ------------------------------------------------------

    if (
        items.length === 0
    ) {

        const item =
            document.createElement(
                "li"
            );


        item.className =
            "requirement-item";


        item.innerHTML = `
            <span class="bullet">
                •
            </span>

            <span class="requirement-text">
                Contact us for document requirements.
            </span>
        `;


        list.appendChild(
            item
        );

    }


    // ------------------------------------------------------
    // DOCUMENT ITEMS
    // ------------------------------------------------------

    else {

        items.forEach(
            function(itemText) {

                const item =
                    document.createElement(
                        "li"
                    );


                item.className =
                    "requirement-item";


                item.innerHTML = `
                    <span class="bullet">
                        •
                    </span>

                    <span class="requirement-text">
                        ${escapeHTML(itemText)}
                    </span>
                `;


                list.appendChild(
                    item
                );

            }
        );

    }


    // ------------------------------------------------------
    // ADD LIST
    // ------------------------------------------------------

    documentBox.appendChild(
        list
    );


    // ------------------------------------------------------
    // WHATSAPP BUTTON
    // ------------------------------------------------------

    const whatsapp =
        document.createElement(
            "a"
        );


    whatsapp.className =
        "primary";


    whatsapp.href =
        createWhatsAppLink(
            "Hello MBSC SOLUTIONS, " +
            "I need details about " +
            serviceName +
            "."
        );


    whatsapp.target =
        "_blank";


    whatsapp.rel =
        "noopener noreferrer";


    whatsapp.textContent =
        "Message on WhatsApp";


    documentBox.appendChild(
        whatsapp
    );


    // ------------------------------------------------------
    // SCROLL TO DOCUMENTS
    // ------------------------------------------------------

    const documentsSection =
        document.querySelector(
            ".documents"
        );


    if (
        documentsSection
    ) {

        documentsSection.scrollIntoView(
            {
                behavior: "smooth",
                block: "start"
            }
        );

    }

}


// ==========================================================
// 11. SUB SERVICE BUTTON SUPPORT
// ==========================================================

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".sub-service-button"
            );


        if (!button) {
            return;
        }


        const serviceName =
            button.dataset.service ||
            button.textContent.trim();


        const documents =
            button.dataset.documents ||
            "";


        showServiceDocuments(
            serviceName,
            documents
        );

    }
);


// ==========================================================
// 12. KEEP LOANS VIDEO PLAYING
// ==========================================================

document.addEventListener(
    "visibilitychange",
    function() {

        if (
            document.visibilityState !==
            "visible"
        ) {

            return;
        }


        const videos =
            document.querySelectorAll(
                ".loans-video"
            );


        videos.forEach(
            function(video) {

                video.play()
                    .catch(
                        function() {}
                    );

            }
        );

    }
);


// ==========================================================
// 13. START WEBSITE
// ==========================================================

function startMBSC() {

    console.log(
        "MBSC: Website starting..."
    );


    loadServices();

}


// ==========================================================
// 14. DOM READY
// ==========================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startMBSC
    );

}
else {

    startMBSC();

}


// ==========================================================
// END
// ==========================================================
