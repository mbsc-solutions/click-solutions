// ==========================================================
// MBSC SOLUTIONS - COMPLETE SCRIPT
// ==========================================================

// ==========================================================
// SUPABASE CONFIG
// ==========================================================

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// ==========================================================
// GLOBAL
// ==========================================================

const grid = document.querySelector(".grid");
const documentBox = document.getElementById("documentBox");


// ==========================================================
// WHATSAPP
// ==========================================================

const WHATSAPP_NUMBER = "917093334820";

function whatsappLink(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}


// ==========================================================
// LOAD SERVICES
// ==========================================================

async function loadServices() {

    if (!grid) return;

    grid.innerHTML = `
        <div class="service">
            <h3>Loading Services...</h3>
            <p>Please wait...</p>
        </div>
    `;

    try {

        const { data, error } = await supabaseClient
            .from("services")
            .select("*")
            .order("id", { ascending: true });

        if (error) {
            console.error("Supabase Error:", error);

            grid.innerHTML = `
                <div class="service">
                    <h3>Unable to load services</h3>
                    <p>Please refresh the page.</p>
                </div>
            `;

            return;
        }

        if (!data || data.length === 0) {

            grid.innerHTML = `
                <div class="service">
                    <h3>No Services Found</h3>
                    <p>Please add services in Supabase.</p>
                </div>
            `;

            return;
        }

        grid.innerHTML = "";

        data.forEach(service => {
            createServiceCard(service);
        });

    } catch (err) {

        console.error(err);

        grid.innerHTML = `
            <div class="service">
                <h3>Error</h3>
                <p>Something went wrong while loading services.</p>
            </div>
        `;
    }
}


// ==========================================================
// CREATE SERVICE CARD
// ==========================================================

function createServiceCard(service) {

    const article = document.createElement("article");

    article.className = "service";

    const serviceName =
        service.name ||
        service.service_name ||
        service.title ||
        "Service";

    const description =
        service.description ||
        service.details ||
        "Click below for more details.";

    const docs =
        service.documents ||
        service.requirements ||
        service.docs ||
        "";

    const serviceId = service.id;


    // ======================================================
    // SERVICE TITLE
    // ======================================================

    const title = document.createElement("h3");

    title.textContent = serviceName;


    // ======================================================
    // DESCRIPTION
    // ======================================================

    const desc = document.createElement("p");

    desc.textContent = description;


    // ======================================================
    // VIEW BUTTON
    // ======================================================

    const button = document.createElement("button");

    button.className = "service-button";

    button.textContent = "View & WhatsApp";


    // ======================================================
    // BUTTON ACTION
    // ======================================================

    button.addEventListener("click", function () {

        showServiceDocuments(
            serviceName,
            docs,
            service
        );

    });


    // ======================================================
    // ADD ELEMENTS
    // ======================================================

    article.appendChild(title);

    article.appendChild(desc);

    article.appendChild(button);


    // ======================================================
    // LOANS VIDEO
    // ======================================================

    if (
        String(serviceName)
            .trim()
            .toLowerCase() === "loans"
    ) {

        addLoansVideo(article);

    }


    // ======================================================
    // ADD CARD
    // ======================================================

    grid.appendChild(article);
}


// ==========================================================
// LOANS BACKGROUND VIDEO
// ==========================================================

function addLoansVideo(article) {

    // Video
    const video = document.createElement("video");

    video.className = "loans-video";

    // IMPORTANT:
    // Upload your video with this exact filename
    video.src = "audio_vadhu.mp4";

    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    video.setAttribute("aria-hidden", "true");

    // Overlay
    const overlay = document.createElement("div");

    overlay.className = "loans-video-overlay";

    // Put video behind everything
    article.prepend(video);

    article.prepend(overlay);

    // Try playing video
    const playPromise = video.play();

    if (playPromise !== undefined) {

        playPromise.catch(() => {

            console.log(
                "Loans video waiting for browser autoplay permission."
            );

        });

    }
}


// ==========================================================
// SHOW DOCUMENTS
// ==========================================================

function showServiceDocuments(
    serviceName,
    docs,
    service
) {

    if (!documentBox) return;


    // ======================================================
    // DOCUMENT SECTION
    // ======================================================

    documentBox.innerHTML = "";


    const heading = document.createElement("h3");

    heading.textContent =
        serviceName;


    documentBox.appendChild(heading);


    // ======================================================
    // DOCUMENT LIST
    // ======================================================

    const list = document.createElement("ul");

    list.className = "requirements-list";


    let documentItems = [];


    // Array
    if (Array.isArray(docs)) {

        documentItems = docs;

    }

    // String
    else if (typeof docs === "string") {

        documentItems = docs
            .split(/\r?\n|,|;/)
            .map(item => item.trim())
            .filter(Boolean);

    }


    // ======================================================
    // NO DOCUMENTS
    // ======================================================

    if (documentItems.length === 0) {

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

        list.appendChild(item);

    }


    // ======================================================
    // DOCUMENT ITEMS
    // ======================================================

    else {

        documentItems.forEach(itemText => {

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

            list.appendChild(item);

        });

    }


    documentBox.appendChild(list);


    // ======================================================
    // WHATSAPP BUTTON
    // ======================================================

    const whatsappButton =
        document.createElement("a");

    whatsappButton.className =
        "primary";

    whatsappButton.href =
        whatsappLink(
            `Hello MBSC SOLUTIONS, I need details about ${serviceName}.`
        );

    whatsappButton.target = "_blank";

    whatsappButton.rel =
        "noopener noreferrer";

    whatsappButton.textContent =
        "Message on WhatsApp";


    documentBox.appendChild(
        whatsappButton
    );


    // ======================================================
    // SCROLL TO DOCUMENTS
    // ======================================================

    const documentsSection =
        document.querySelector(".documents");

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
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================================
// MOBILE MENU / SERVICE HELPERS
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

        showServiceDocuments(
            serviceName,
            button.dataset.documents || "",
            {}
        );

    }
);


// ==========================================================
// LOAD EVERYTHING
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadServices();

    }
);


// ==========================================================
// PAGE VISIBILITY
// Keep Loans video playing when page becomes visible
// ==========================================================

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState !== "visible"
        ) {
            return;
        }

        const videos =
            document.querySelectorAll(
                ".loans-video"
            );

        videos.forEach(video => {

            video.play().catch(() => {});

        });

    }
);
