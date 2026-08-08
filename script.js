const SUPABASE_URL = "https://whxlatxnqjpccwrmtmph.supabase.co";
const SUPABASE_KEY = "sb_publishable_wlqTaOkM3fML9cuUES54fw_8TlbSi-H";
const WHATSAPP_NUMBER = "917093334820";

// ==========================================
// SUPABASE GET
// ==========================================

async function supabaseGet(table, query = "") {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/${table}${query}`,
        {
            method: "GET",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json"
            }
        }
    );

    if (!response.ok) {
        const error = await response.text();
        console.error(`Supabase ${table} Error:`, error);
        throw new Error(error);
    }

    return await response.json();
}


// ==========================================
// LOAN SERVICE NAMES
// ==========================================

const LOAN_NAMES = [
    "Tractor Loans",
    "Business Loans",
    "Agri SME Loans",
    "Construction Equipment Loans",
    "Gold Loans",
    "Commercial Vehicle Loans",
    "Home Loans",
    "Auto & Car Loans",
    "Bike Loans"
];


// ==========================================
// LOAD WEBSITE SERVICES
// ==========================================

async function loadWebsiteServices() {

    const grid = document.querySelector(".grid");

    if (!grid) return;

    try {

        const services = await supabaseGet(
            "services",
            "?select=*&order=sort_order.asc"
        );

        const subServices = await supabaseGet(
            "sub_services",
            "?select=*&order=sort_order.asc"
        );

        const subServiceItems = await supabaseGet(
            "sub_service_items",
            "?select=*&order=sort_order.asc"
        );

        console.log("SERVICES:", services);
        console.log("SUB SERVICES:", subServices);
        console.log("SUB SERVICE ITEMS:", subServiceItems);


        // ======================================
        // FIND LOANS MAIN SERVICE
        // ======================================

        const loansService = services.find(
            service =>
                service.service_name === "Loans"
        );


        // ======================================
        // MAIN SERVICES TO DISPLAY
        // ======================================

        const displayServices = services.filter(
            service => {

                // Hide old individual loan services
                if (
                    LOAN_NAMES.includes(
                        service.service_name
                    )
                ) {
                    return false;
                }

                return true;
            }
        );


        // ======================================
        // ADD LOANS IF EXISTS
        // ======================================

        if (
            loansService &&
            !displayServices.some(
                service =>
                    service.id === loansService.id
            )
        ) {

            displayServices.push(
                loansService
            );

        }


        grid.innerHTML = "";


        // ======================================
        // CREATE MAIN SERVICES
        // ======================================

        displayServices.forEach(service => {

            const serviceId =
                service.id;

            const serviceName =
                service.service_name ||
                "Service";


            const description =
                service.description ||
                "Click below to view available services.";


            // ==================================
            // FIND SUB SERVICES
            // ==================================

            let children =
                subServices.filter(
                    sub =>
                        Number(
                            sub.service_id
                        ) ===
                        Number(serviceId)
                );


            // ==================================
            // CREATE ARTICLE
            // ==================================

            const article =
                document.createElement("article");

            article.className =
                "service";


            article.innerHTML = `
                <h3>
                    ${escapeHTML(serviceName)}
                </h3>

                <p>
                    ${escapeHTML(description)}
                </p>

                <button class="service-button">
                    ${
                        children.length > 0
                            ? "View Services"
                            : "View & WhatsApp"
                    }
                </button>

                <div class="sub-service-list"></div>
            `;


            grid.appendChild(article);


            const button =
                article.querySelector(
                    ".service-button"
                );


            const subList =
                article.querySelector(
                    ".sub-service-list"
                );


            // ==================================
            // HAS SUB SERVICES
            // ==================================

            if (children.length > 0) {

                button.addEventListener(
                    "click",
                    () => {

                        subList.classList.toggle(
                            "show"
                        );


                        if (
                            subList.classList.contains(
                                "show"
                            )
                        ) {

                            button.textContent =
                                "Hide Services";


                            subList.innerHTML =
                                "";


                            children.forEach(
                                sub => {

                                    const subButton =
                                        document.createElement(
                                            "button"
                                        );


                                    subButton.className =
                                        "sub-service-button";


                                    subButton.textContent =
                                        sub.sub_service_name ||
                                        "Sub Service";


                                    subButton.addEventListener(
                                        "click",
                                        () => {

                                            showSubService(
                                                service,
                                                sub,
                                                subServiceItems
                                            );

                                        }
                                    );


                                    subList.appendChild(
                                        subButton
                                    );

                                }
                            );

                        } else {

                            button.textContent =
                                "View Services";

                        }

                    }
                );

            }


            // ==================================
            // NO SUB SERVICES
            // ==================================

            else {

                button.addEventListener(
                    "click",
                    () => {

                        const docs =
                            getDocuments(
                                service.documents
                            );


                        showDocs(
                            serviceName,
                            docs
                        );

                    }
                );

            }

        });

    } catch (error) {

        console.error(
            "Website loading failed:",
            error
        );


        grid.innerHTML = `
            <div class="service">

                <h3>
                    Services temporarily unavailable
                </h3>

                <p>
                    Please contact MBSC SOLUTIONS
                    on WhatsApp.
                </p>

                <a
                    class="primary"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://wa.me/${WHATSAPP_NUMBER}"
                >
                    WhatsApp Us
                </a>

            </div>
        `;

    }

}


// ==========================================
// SHOW SUB SERVICE
// ==========================================

function showSubService(
    service,
    subService,
    subServiceItems
) {

    const serviceName =
        service.service_name ||
        "Service";


    const subName =
        subService.sub_service_name ||
        "Sub Service";


    // ======================================
    // FIND ITEMS
    // ======================================

    const items =
        subServiceItems.filter(
            item =>
                Number(
                    item.sub_service_id
                ) ===
                Number(
                    subService.id
                )
        );


    // ======================================
    // ITEMS EXIST
    // ======================================

    if (items.length > 0) {

        showItems(
            serviceName,
            subService,
            items
        );

        return;

    }


    // ======================================
    // NO ITEMS
    // ======================================

    const docs =
        getDocuments(
            subService.documents ||
            service.documents
        );


    showDocs(
        `${serviceName} – ${subName}`,
        docs
    );

}


// ==========================================
// SHOW SUB SERVICE ITEMS
// ==========================================

function showItems(
    serviceName,
    subService,
    items
) {

    const box =
        document.getElementById(
            "documentBox"
        );


    if (!box) return;


    const subName =
        subService.sub_service_name ||
        "Sub Service";


    box.innerHTML = `
        <p class="eyebrow">
            ${escapeHTML(serviceName)}
        </p>

        <h3>
            ${escapeHTML(subName)}
        </h3>

        <ul class="item-list">

            ${items.map(item => `
                <li>

                    <button
                        class="item-button"
                        data-item-id="${item.id}"
                    >

                        ${escapeHTML(
                            item.item_name
                        )}

                    </button>

                </li>
            `).join("")}

        </ul>

        <p>
            Select an item above to view requirements.
        </p>
    `;


    // ======================================
    // ITEM BUTTONS
    // ======================================

    const buttons =
        box.querySelectorAll(
            ".item-button"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const itemId =
                        Number(
                            button.dataset.itemId
                        );


                    const selectedItem =
                        items.find(
                            item =>
                                Number(
                                    item.id
                                ) ===
                                itemId
                        );


                    if (!selectedItem) {
                        return;
                    }


                    const docs =
                        getDocuments(
                            selectedItem.documents
                        );


                    showDocs(
                        `${serviceName} – ${subName} – ${selectedItem.item_name}`,
                        docs
                    );

                }
            );

        }
    );


    box.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// ==========================================
// GET DOCUMENTS
// ==========================================

function getDocuments(documents) {

    // NULL / EMPTY
    if (
        documents === null ||
        documents === undefined ||
        documents === ""
    ) {

        return [
            "Please contact MBSC SOLUTIONS for requirements"
        ];

    }


    // ARRAY
    if (Array.isArray(documents)) {

        return documents
            .map(
                item =>
                    String(item).trim()
            )
            .filter(Boolean);

    }


    // STRING
    if (typeof documents === "string") {

        return documents
            .split(",")
            .map(
                item =>
                    item.trim()
            )
            .filter(Boolean);

    }


    return [
        "Please contact MBSC SOLUTIONS for requirements"
    ];

}


// ==========================================
// SHOW DOCUMENTS + WHATSAPP
// ==========================================

function showDocs(
    service,
    docs
) {

    const box =
        document.getElementById(
            "documentBox"
        );


    if (!box) return;


    const documentList =
        Array.isArray(docs)
            ? docs
            : getDocuments(docs);


    // ======================================
    // WHATSAPP MESSAGE
    // ======================================

    const message =
        `*MBSC SOLUTIONS*

*I need this – ${service}*

*Required Documents:*
${documentList
    .map(
        d => `• ${d}`
    )
    .join("\n")}`;


    // ======================================
    // DISPLAY DOCUMENTS
    // ======================================

    box.innerHTML = `
        <p class="eyebrow">
            REQUIREMENTS
        </p>

        <h3>
            ${escapeHTML(service)}
        </h3>

        <ul class="requirements-list">

            ${documentList
                .map(
                    d => `
                        <li>
                            ${escapeHTML(d)}
                        </li>
                    `
                )
                .join("")}

        </ul>

        <a
            class="primary"
            target="_blank"
            rel="noopener noreferrer"
            href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}"
        >
            WhatsApp for ${escapeHTML(service)}
        </a>
    `;


    box.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


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


// ==========================================
// START WEBSITE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadWebsiteServices();

    }
);
