// ==========================================================
// MBSC SOLUTIONS - SERVICES SCRIPT
// ==========================================================

// ==========================================================
// SUPABASE CONFIG
// ==========================================================

// IMPORTANT:
// IKKADA nee actual Supabase URL and Anon Key pettali.

const SUPABASE_URL = "sb_publishable_wlqTaOkM3fML9cuUES54fw_8TlbSi-H";
const SUPABASE_ANON_KEY = "sb_publishable_...";


// ==========================================================
// SUPABASE CONNECTION
// ==========================================================

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


// ==========================================================
// GLOBAL ELEMENTS
// ==========================================================

const grid =
    document.getElementById("servicesGrid");

const documentBox =
    document.getElementById("documentBox");


// ==========================================================
// WHATSAPP
// ==========================================================

const WHATSAPP_NUMBER =
    "917093334820";

function whatsappLink(message) {

    return (
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message)
    );

}


// ==========================================================
// LOAD SERVICES
// ==========================================================

async function loadServices() {

    console.log("MBSC: Loading services...");

    if (!grid) {

        console.error(
            "MBSC: servicesGrid element not found."
        );

        return;
    }


    // ------------------------------------------------------
    // Loading
    // ------------------------------------------------------

    grid.innerHTML = `
        <div class="service">
            <h3>Loading Services...</h3>
            <p>Please wait while services are loading.</p>
        </div>
    `;


    // ------------------------------------------------------
    // Check Supabase configuration
    // ------------------------------------------------------

    if (
        SUPABASE_URL ===
        "PASTE_YOUR_SUPABASE_URL_HERE"
        ||
        SUPABASE_ANON_KEY ===
        "PASTE_YOUR_SUPABASE_ANON_KEY_HERE"
    ) {

        grid.innerHTML = `
            <div class="service">
                <h3>Supabase Not Connected</h3>

                <p>
                    Please add your Supabase URL and
                    Anon Key inside script.js.
                </p>
            </div>
        `;

        console.error(
            "MBSC: Supabase URL / Anon Key missing."
        );

        return;
    }


    try {

        // --------------------------------------------------
        // Get services
        // --------------------------------------------------

        const {
            data,
            error
        } = await supabaseClient

            .from("services")

            .select("*")

            .order(
                "id",
                {
                    ascending: true
                }
            );


        // --------------------------------------------------
        // Supabase error
        // --------------------------------------------------

        if (error) {

            console.error(
                "MBSC Supabase Error:",
                error
            );


            grid.innerHTML = `
                <div class="service">
                    <h3>Unable to Load Services</h3>

                    <p>
                        ${escapeHTML(
                            error.message ||
                            "Supabase error occurred."
                        )}
                    </p>
                </div>
            `;

            return;
        }


        // --------------------------------------------------
        // No services
        // --------------------------------------------------

        if (
            !data ||
            data.length === 0
        ) {

            grid.innerHTML = `
                <div class="service">
                    <h3>No Services Found</h3>

                    <p>
                        Supabase connected successfully,
                        but the services table is empty.
                    </p>
                </div>
            `;

            console.warn(
                "MBSC: services table is empty."
            );

            return;
        }


        // --------------------------------------------------
        // Clear loading
        // --------------------------------------------------

        grid.innerHTML = "";


        // --------------------------------------------------
        // Create cards
        // --------------------------------------------------

        data.forEach(
            function(service) {

                createServiceCard(
                    service
                );

            }
        );


        console.log(
            "MBSC: Services loaded:",
            data
        );

    }

    catch (error) {

        console.error(
            "MBSC: Unexpected error:",
            error
        );


        grid.innerHTML = `
            <div class="service">
                <h3>Something Went Wrong</h3>

                <p>
                    Please check Supabase
                    connection and try again.
                </p>
            </div>
        `;

    }

}


// ==========================================================
// CREATE SERVICE CARD
// ==========================================================

function createServiceCard(service) {

    const article =
        document.createElement("article");


    article.className =
        "service";


    // ------------------------------------------------------
    // Service name
    // ------------------------------------------------------

    const serviceName =
        service.name ||
        service.service_name ||
        service.title ||
        "Service";


    // ------------------------------------------------------
    // Description
    // ------------------------------------------------------

    const description =
        service.description ||
        service.details ||
        "Click below to view service details.";


    // ------------------------------------------------------
    // Documents
    // ------------------------------------------------------

    const docs =
        service.documents ||
        service.requirements ||
        service.docs ||
        "";


    // ------------------------------------------------------
    // Title
    // ------------------------------------------------------

    const title =
        document.createElement("h3");

    title.textContent =
        serviceName;


    // ------------------------------------------------------
    // Description
    // ------------------------------------------------------

    const desc =
        document.createElement("p");

    desc.textContent =
        description;


    // ------------------------------------------------------
    // Button
    // ------------------------------------------------------

    const button =
        document.createElement("button");


    button.className =
        "service-button";


    button.textContent =
        "View & WhatsApp";


    // ------------------------------------------------------
    // Button click
    // ------------------------------------------------------

    button.addEventListener(
        "click",
        function() {

            showServiceDocuments(
                serviceName,
                docs,
                service
            );

        }
    );


    // ------------------------------------------------------
    // Add elements
    // ------------------------------------------------------

    article.appendChild(title);

    article.appendChild(desc);

    article.appendChild(button);


    // ------------------------------------------------------
    // Loans video
    // ------------------------------------------------------

    if (
        String(serviceName)
            .trim()
            .toLowerCase()
            .includes("loan")
    ) {

        addLoansVideo(article);

    }


    // ------------------------------------------------------
    // Add card to grid
    // ------------------------------------------------------

    grid.appendChild(article);

}


// ==========================================================
// LOANS VIDEO
// ==========================================================

function addLoansVideo(article) {

    const video =
        document.createElement("video");


    video.className =
        "loans-video";


    // IMPORTANT:
    // Video file must be inside same folder
    // as index.html

    video.src =
        "loans.mp4";


    video.autoplay = true;

    video.loop = true;

    video.muted = true;

    video.playsInline = true;


    video.setAttribute(
        "aria-hidden",
        "true"
    );


    // ------------------------------------------------------
    // Overlay
    // ------------------------------------------------------

    const overlay =
        document.createElement("div");


    overlay.className =
        "loans-video-overlay";


    // ------------------------------------------------------
    // Put video behind card content
    // ------------------------------------------------------

    article.prepend(video);

    article.prepend(overlay);


    // ------------------------------------------------------
    // Play
    // ------------------------------------------------------

    video.play()
        .catch(
            function(error) {

                console.log(
                    "Loans video autoplay waiting:",
                    error
                );

            }
        );

}


// ==========================================================
// SHOW DOCUMENTS
// ==========================================================

function showServiceDocuments(
    serviceName,
    docs,
    service
) {

    if (!documentBox) {

        console.error(
            "MBSC: documentBox not found."
        );

        return;
    }


    // ------------------------------------------------------
    // Clear
    // ------------------------------------------------------

    documentBox.innerHTML = "";


    // ------------------------------------------------------
    // Heading
    // ------------------------------------------------------

    const heading =
        document.createElement("h3");


    heading.textContent =
        serviceName;


    documentBox.appendChild(
        heading
    );


    // ------------------------------------------------------
    // List
    // ------------------------------------------------------

    const list =
        document.createElement("ul");


    list.className =
        "requirements-list";


    let documentItems = [];


    // ------------------------------------------------------
    // Array documents
    // ------------------------------------------------------

    if (
        Array.isArray(docs)
    ) {

        documentItems =
            docs;

    }


    // ------------------------------------------------------
    // String documents
    // ------------------------------------------------------

    else if (
        typeof docs === "string"
    ) {

        documentItems =
            docs

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
    // No documents
    // ------------------------------------------------------

    if (
        documentItems.length === 0
    ) {

        const item =
            document.createElement("li");


        item.className =
            "requirement-item";


        item.innerHTML = `
            <span class="bullet">•</span>

            <span class="requirement-text">
                Contact us for document requirements.
            </span>
        `;


        list.appendChild(
            item
        );

    }


    // ------------------------------------------------------
    // Documents
    // ------------------------------------------------------

    else {

        documentItems.forEach(
            function(itemText) {

                const item =
                    document.createElement("li");


                item.className =
                    "requirement-item";


                item.innerHTML = `
                    <span class="bullet">•</span>

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
    // Add list
    // ------------------------------------------------------

    documentBox.appendChild(
        list
    );


    // ------------------------------------------------------
    // WhatsApp
    // ------------------------------------------------------

    const whatsappButton =
        document.createElement("a");


    whatsappButton.className =
        "primary";


    whatsappButton.href =
        whatsappLink(
            "Hello MBSC SOLUTIONS, " +
            "I need details about " +
            serviceName +
            "."
        );


    whatsappButton.target =
        "_blank";


    whatsappButton.rel =
        "noopener noreferrer";


    whatsappButton.textContent =
        "Message on WhatsApp";


    documentBox.appendChild(
        whatsappButton
    );


    // ------------------------------------------------------
    // Scroll
    // ------------------------------------------------------

    const documentsSection =
        document.querySelector(
            ".documents"
        );


    if (documentsSection) {

        documentsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// ==========================================================
// ESCAPE HTML
// ==========================================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ==========================================================
// PAGE LOAD
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "MBSC: Page loaded."
        );

        loadServices();

    }
);


// ==========================================================
// VISIBILITY CHANGE
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
