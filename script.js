// ==========================================================
// MBSC SOLUTIONS - SERVICES SCRIPT
// ==========================================================

// ==========================================================
// SUPABASE CONFIG
// ==========================================================

// IMPORTANT:
// Replace these two values with your real Supabase values.

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";


// ==========================================================
// CHECK SUPABASE
// ==========================================================

if (!window.supabase) {

    console.error("Supabase library is not loaded.");

}


// ==========================================================
// CREATE SUPABASE CLIENT
// ==========================================================

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


// ==========================================================
// GLOBAL
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

    if (!grid) {

        console.error(
            "servicesGrid not found in index.html"
        );

        return;

    }


    grid.innerHTML = `
        <div class="service">
            <h3>Loading Services...</h3>
            <p>Please wait while services are loading.</p>
        </div>
    `;


    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("services")

            .select("*")

            .order("id", {
                ascending: true
            });


        // ==================================================
        // SUPABASE ERROR
        // ==================================================

        if (error) {

            console.error(
                "SUPABASE ERROR:",
                error
            );


            grid.innerHTML = `
                <div class="service">
                    <h3>Services could not be loaded</h3>

                    <p>
                        Please check your Supabase
                        connection and services table.
                    </p>
                </div>
            `;

            return;

        }


        // ==================================================
        // NO DATA
        // ==================================================

        if (
            !data ||
            data.length === 0
        ) {

            grid.innerHTML = `
                <div class="service">
                    <h3>No Services Found</h3>

                    <p>
                        Your Supabase services table
                        is currently empty.
                    </p>
                </div>
            `;

            return;

        }


        // ==================================================
        // CLEAR LOADING
        // ==================================================

        grid.innerHTML = "";


        // ==================================================
        // CREATE SERVICES
        // ==================================================

        data.forEach(
            service => {

                createServiceCard(
                    service
                );

            }
        );


    } catch (error) {

        console.error(
            "SERVICE LOAD ERROR:",
            error
        );


        grid.innerHTML = `
            <div class="service">

                <h3>
                    Connection Error
                </h3>

                <p>
                    Unable to connect to Supabase.
                    Please check the configuration.
                </p>

            </div>
        `;

    }

}


// ==========================================================
// CREATE SERVICE CARD
// ==========================================================

function createServiceCard(service) {

    if (!grid) return;


    const article =
        document.createElement(
            "article"
        );


    article.className =
        "service";


    // ======================================================
    // SERVICE NAME
    // ======================================================

    const serviceName =
        service.name ||
        service.service_name ||
        service.title ||
        "Service";


    // ======================================================
    // DESCRIPTION
    // ======================================================

    const description =
        service.description ||
        service.details ||
        service.content ||
        "Click below for more details.";


    // ======================================================
    // DOCUMENTS
    // ======================================================

    const docs =
        service.documents ||
        service.requirements ||
        service.docs ||
        "";


    // ======================================================
    // TITLE
    // ======================================================

    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        serviceName;


    // ======================================================
    // DESCRIPTION
    // ======================================================

    const desc =
        document.createElement(
            "p"
        );


    desc.textContent =
        description;


    // ======================================================
    // BUTTON
    // ======================================================

    const button =
        document.createElement(
            "button"
        );


    button.className =
        "service-button";


    button.textContent =
        "View & WhatsApp";


    // ======================================================
    // BUTTON CLICK
    // ======================================================

    button.addEventListener(
        "click",
        function () {

            showServiceDocuments(
                serviceName,
                docs,
                service
            );

        }
    );


    // ======================================================
    // ADD ELEMENTS
    // ======================================================

    article.appendChild(
        title
    );


    article.appendChild(
        desc
    );


    article.appendChild(
        button
    );


    // ======================================================
    // LOANS VIDEO
    // ======================================================

    if (
        String(serviceName)
            .trim()
            .toLowerCase() ===
        "loans"
    ) {

        addLoansVideo(
            article
        );

    }


    // ======================================================
    // APPEND CARD
    // ======================================================

    grid.appendChild(
        article
    );

}


// ==========================================================
// LOANS VIDEO
// ==========================================================

function addLoansVideo(article) {

    const video =
        document.createElement(
            "video"
        );


    video.className =
        "loans-video";


    // IMPORTANT:
    // Put your video in the same folder as index.html

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
        "aria-hidden",
        "true"
    );


    // ======================================================
    // VIDEO OVERLAY
    // ======================================================

    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "loans-video-overlay";


    // ======================================================
    // INSERT VIDEO
    // ======================================================

    article.prepend(
        video
    );


    article.prepend(
        overlay
    );


    // ======================================================
    // PLAY
    // ======================================================

    video.play()
        .catch(
            function () {

                console.log(
                    "Loans video autoplay waiting."
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
            "documentBox not found."
        );

        return;

    }


    // ======================================================
    // CLEAR
    // ======================================================

    documentBox.innerHTML =
        "";


    // ======================================================
    // HEADING
    // ======================================================

    const heading =
        document.createElement(
            "h3"
        );


    heading.textContent =
        serviceName;


    documentBox.appendChild(
        heading
    );


    // ======================================================
    // DOCUMENT LIST
    // ======================================================

    const list =
        document.createElement(
            "ul"
        );


    list.className =
        "requirements-list";


    let documentItems =
        [];


    // ======================================================
    // ARRAY
    // ======================================================

    if (
        Array.isArray(docs)
    ) {

        documentItems =
            docs;

    }


    // ======================================================
    // STRING
    // ======================================================

    else if (
        typeof docs ===
        "string"
    ) {

        documentItems =
            docs

                .split(
                    /\r?\n|,|;/
                )

                .map(
                    item =>
                        item.trim()
                )

                .filter(
                    Boolean
                );

    }


    // ======================================================
    // NO DOCUMENTS
    // ======================================================

    if (
        documentItems.length === 0
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


    // ======================================================
    // DOCUMENT ITEMS
    // ======================================================

    else {

        documentItems.forEach(
            function (itemText) {

                const item =
                    document.createElement(
                        "li"
                    );


                item.className =
                    "requirement-item";


                const bullet =
                    document.createElement(
                        "span"
                    );


                bullet.className =
                    "bullet";


                bullet.textContent =
                    "•";


                const text =
                    document.createElement(
                        "span"
                    );


                text.className =
                    "requirement-text";


                text.textContent =
                    itemText;


                item.appendChild(
                    bullet
                );


                item.appendChild(
                    text
                );


                list.appendChild(
                    item
                );

            }
        );

    }


    // ======================================================
    // ADD LIST
    // ======================================================

    documentBox.appendChild(
        list
    );


    // ======================================================
    // WHATSAPP
    // ======================================================

    const whatsappButton =
        document.createElement(
            "a"
        );


    whatsappButton.className =
        "primary";


    whatsappButton.href =
        whatsappLink(
            "Hello MBSC SOLUTIONS, I need details about " +
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


    // ======================================================
    // SCROLL
    // ======================================================

    const documentsSection =
        document.querySelector(
            ".documents"
        );


    if (documentsSection) {

        documentsSection.scrollIntoView(
            {
                behavior: "smooth",
                block: "start"
            }
        );

    }

}


// ==========================================================
// SUB SERVICE BUTTON
// ==========================================================

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".sub-service-button"
            );


        if (!button) return;


        const serviceName =
            button.dataset.service ||
            button.textContent.trim();


        const documents =
            button.dataset.documents ||
            "";


        showServiceDocuments(
            serviceName,
            documents,
            {}
        );

    }
);


// ==========================================================
// PAGE VISIBILITY
// ==========================================================

document.addEventListener(
    "visibilitychange",
    function () {

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
            function (video) {

                video.play()
                    .catch(
                        () => {}
                    );

            }
        );

    }
);


// ==========================================================
// START
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadServices();

    }
);
