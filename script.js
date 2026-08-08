const SUPABASE_URL = "https://whxlatxnqjpccwrmtmph.supabase.co";

const SUPABASE_KEY = "sb_publishable_wlqTaOkM3fML9cuUES54fw_8TlbSi-H";

const WHATSAPP_NUMBER = "917093334820";


// ==========================================
// SUPABASE REQUEST
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
// LOAD ALL SERVICES + SUB SERVICES
// ==========================================

async function loadWebsiteServices() {

    const grid = document.querySelector(".grid");

    if (!grid) return;

    try {

        // Load main services
        const services = await supabaseGet(
            "services",
            "?select=*&order=sort_order.asc"
        );


        // Load sub services
        const subServices = await supabaseGet(
            "sub_services",
            "?select=*&order=sort_order.asc"
        );


        console.log("MAIN SERVICES:", services);

        console.log("SUB SERVICES:", subServices);


        // Clear old hard-coded services
        grid.innerHTML = "";


        // Create service cards
        services.forEach(service => {

            const serviceId = service.id;

            const serviceName =
                service.service_name || "Service";


            const description =
                service.description ||
                "Click below to view available services.";


            // Find sub services belonging to this service
            const children = subServices.filter(
                sub =>
                    Number(sub.service_id) === Number(serviceId)
            );


            const article = document.createElement("article");

            article.className = "service";


            // --------------------------------------
            // SERVICE CARD
            // --------------------------------------

            article.innerHTML = `

                <h3>${escapeHTML(serviceName)}</h3>

                <p>
                    ${escapeHTML(description)}
                </p>

                <button class="service-button">
                    View Services
                </button>

                <div class="sub-service-list"></div>

            `;


            grid.appendChild(article);


            const button =
                article.querySelector(".service-button");


            const subList =
                article.querySelector(".sub-service-list");


            // --------------------------------------
            // IF SUB SERVICES EXIST
            // --------------------------------------

            if (children.length > 0) {

                button.addEventListener("click", () => {

                    subList.classList.toggle("show");


                    if (subList.classList.contains("show")) {

                        button.textContent = "Hide Services";


                        subList.innerHTML = "";


                        children.forEach(sub => {

                            const subButton =
                                document.createElement("button");


                            subButton.className =
                                "sub-service-button";


                            subButton.textContent =
                                sub.sub_service_name ||
                                sub.name ||
                                "Sub Service";


                            subButton.addEventListener(
                                "click",
                                () => {

                                    showSubService(
                                        service,
                                        sub
                                    );

                                }
                            );


                            subList.appendChild(
                                subButton
                            );

                        });

                    } else {

                        button.textContent =
                            "View Services";

                    }

                });

            }


            // --------------------------------------
            // NO SUB SERVICES
            // --------------------------------------

            else {

                button.textContent =
                    "View & WhatsApp";


                button.addEventListener(
                    "click",
                    () => {

                        const docs =
                            getDocuments(service.documents);


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
            "Website services loading failed:",
            error
        );


        grid.innerHTML = `

            <div class="service">

                <h3>Services temporarily unavailable</h3>

                <p>
                    Please contact MBSC SOLUTIONS on WhatsApp.
                </p>

                <a
                    class="primary"
                    target="_blank"
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

function showSubService(service, subService) {

    const serviceName =
        service.service_name || "Service";


    const subName =
        subService.sub_service_name ||
        subService.name ||
        "Sub Service";


    // Use documents from main service
    const docs =
        getDocuments(service.documents);


    showDocs(
        `${serviceName} – ${subName}`,
        docs
    );

}



// ==========================================
// DOCUMENTS
// ==========================================

function getDocuments(documents) {

    if (!documents) {

        return [
            "Please contact us for the service-specific checklist"
        ];

    }


    // If documents are stored like:
    // Aadhaar Card, PAN Card, Bank Statement

    if (typeof documents === "string") {

        return documents
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);

    }


    // If already an array

    if (Array.isArray(documents)) {

        return documents;

    }


    return [
        "Please contact us for the service-specific checklist"
    ];

}



// ==========================================
// SHOW DOCUMENTS + WHATSAPP
// ==========================================

function showDocs(service, docs) {

    const box =
        document.getElementById("documentBox");


    if (!box) return;


    const documentText =
        docs
            .map(d => `• ${d}`)
            .join("\n");


    const message =
`*MBSC SOLUTIONS*

*I need this – ${service}*

*Required Documents:*
${documentText}`;


    box.innerHTML = `

        <p class="eyebrow">
            REQUIREMENTS
        </p>

        <h3>
            ${escapeHTML(service)}
        </h3>

        <ul>

            ${docs.map(d => `
                <li>
                    ${escapeHTML(d)}
                </li>
            `).join("")}

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
// HTML SECURITY
// ==========================================

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

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
