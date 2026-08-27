// ==========================================================
// MBSC SOLUTIONS
// COMPLETE SCRIPT.JS
// ==========================================================


// ==========================================================
// SUPABASE
// ==========================================================

const SUPABASE_URL =
    "https://whxlatxnqjpccwrmtmph.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_wlqTaOkM3fML9cuUES54fw_8TlbSi-H";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


// ==========================================================
// GLOBAL
// ==========================================================

const departmentsContainer =
    document.getElementById("departmentsContainer");

const documentBox =
    document.getElementById("documentBox");

const WHATSAPP_NUMBER =
    "917093334820";


// ==========================================================
// WHATSAPP
// ==========================================================

function whatsappLink(message) {

    return (
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message)
    );

}


// ==========================================================
// ESCAPE HTML
// ==========================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================================
// SERVICE NAME
// ==========================================================

function getServiceName(service) {

    return (
        service.service_name ||
        service.name ||
        service.title ||
        "Service"
    );

}


// ==========================================================
// SUB SERVICE NAME
// ==========================================================

function getSubServiceName(subService) {

    return (
        subService.sub_service_name ||
        subService.service_name ||
        subService.name ||
        subService.title ||
        "Service"
    );

}


// ==========================================================
// DOCUMENTS
// ==========================================================

function getDocuments(row) {

    return (
        row.documents ||
        row.requirements ||
        row.docs ||
        ""
    );

}


// ==========================================================
// NORMALIZE DOCUMENTS
// ==========================================================

function normalizeDocuments(docs) {

    if (Array.isArray(docs)) {

        return docs
            .map(function (item) {
                return String(item).trim();
            })
            .filter(Boolean);

    }


    if (typeof docs === "string") {

        return docs
            .split(/\r?\n|,|;/)
            .map(function (item) {
                return item.trim();
            })
            .filter(Boolean);

    }


    return [];

}


// ==========================================================
// LOAD SERVICES
// ==========================================================

async function loadServices() {

    if (!departmentsContainer) {

        console.error(
            "departmentsContainer not found."
        );

        return;

    }


    departmentsContainer.innerHTML = `
        <div class="loading-box">
            <div class="loading-spinner"></div>

            <h3>Loading Services...</h3>

            <p>
                Please wait while our services are loading.
            </p>
        </div>
    `;


    try {

        // ==================================================
        // MAIN SERVICES
        // ==================================================

        const servicesResult =
            await supabaseClient
                .from("services")
                .select("*")
                .order(
                    "sort_order",
                    {
                        ascending: true,
                        nullsFirst: false
                    }
                );


        if (servicesResult.error) {

            throw servicesResult.error;

        }


        const allServices =
            servicesResult.data || [];


        console.log(
            "SERVICES FROM SUPABASE:",
            allServices
        );


        // ==================================================
        // SUB SERVICES
        // ==================================================

        const subServicesResult =
            await supabaseClient
                .from("sub_services")
                .select("*")
                .order(
                    "sort_order",
                    {
                        ascending: true,
                        nullsFirst: false
                    }
                );


        if (subServicesResult.error) {

            throw subServicesResult.error;

        }


        const subServices =
            subServicesResult.data || [];


        console.log(
            "SUB SERVICES FROM SUPABASE:",
            subServices
        );


        // ==================================================
        // SUB SERVICE MAP
        // ==================================================

        const subServiceMap = {};


        subServices.forEach(
            function (subService) {

                const serviceId =
                    Number(
                        subService.service_id
                    );


                if (!serviceId) {

                    return;

                }


                if (!subServiceMap[serviceId]) {

                    subServiceMap[serviceId] = [];

                }


                subServiceMap[serviceId].push(
                    subService
                );

            }
        );


        // ==================================================
        // REMOVE DUPLICATE CHILD SERVICES
        // ==================================================

        const subServiceNames =
            new Set();


        subServices.forEach(
            function (subService) {

                const name =
                    getSubServiceName(
                        subService
                    )
                        .trim()
                        .toLowerCase();


                if (name) {

                    subServiceNames.add(
                        name
                    );

                }

            }
        );


        const services =
            allServices.filter(
                function (service) {

                    const name =
                        getServiceName(
                            service
                        )
                            .trim()
                            .toLowerCase();


                    return !subServiceNames.has(
                        name
                    );

                }
            );


        console.log(
            "MAIN SERVICES:",
            services
        );


        console.log(
            "SUB SERVICE MAP:",
            subServiceMap
        );


        // ==================================================
        // CREATE CARDS
        // ==================================================

        createDepartments(
            services,
            subServiceMap
        );


    }
    catch (error) {

        console.error(
            "CLICK LOAD SERVICES ERROR:",
            error
        );


        departmentsContainer.innerHTML = `

            <div class="error-box">

                <h3>
                    Unable to Load Services
                </h3>

                <p>
                    ${escapeHTML(
                        error.message ||
                        "Something went wrong."
                    )}
                </p>

            </div>

        `;

    }

}


// ==========================================================
// CREATE DEPARTMENTS
// ==========================================================

function createDepartments(
    services,
    subServiceMap
) {

    departmentsContainer.innerHTML = "";


    if (!services || services.length === 0) {

        departmentsContainer.innerHTML = `

            <div class="error-box">

                <h3>
                    No Services Found
                </h3>

                <p>
                    No services are available in the database.
                </p>

            </div>

        `;

        return;

    }


    services.forEach(
        function (service) {

            const serviceId =
                Number(service.id);


            const children =
                subServiceMap[serviceId] || [];


            createServiceCard(
                service,
                children
            );

        }
    );

    
}


// ==========================================================
// CREATE SERVICE CARD
// ==========================================================

function createServiceCard(
    service,
    children
) {

    const article =
        document.createElement("article");


    article.className =
        "service-card";


    const serviceName =
        getServiceName(service);


    const imageUrl =
        service.image_url || "";


    // ======================================================
    // SERVICE IMAGE
    // ======================================================

    if (imageUrl) {

        const imageWrapper =
            document.createElement("div");


        imageWrapper.className =
            "service-card-image-wrapper";


        const image =
            document.createElement("img");


        image.className =
            "service-card-image";


        image.src =
            imageUrl;


        image.alt =
            serviceName;


        image.loading =
            "lazy";


        imageWrapper.appendChild(
            image
        );


        article.appendChild(
            imageWrapper
        );

    }


    // ======================================================
    // CONTENT
    // ======================================================

    const content =
        document.createElement("div");


    content.className =
        "service-card-content";


    const label =
        document.createElement("span");


    label.className =
        "department-label";


    label.textContent =
        "SERVICE";


    const heading =
        document.createElement("h3");


    heading.textContent =
        serviceName;


    content.appendChild(
        label
    );


    content.appendChild(
        heading
    );


    // ======================================================
    // SUB SERVICES
    // 1-5 | 6-10 | 11+
    // ======================================================

    if (children.length > 0) {

        const subContainer =
            document.createElement("div");


        subContainer.className =
            "sub-services-container";


        // ==================================================
        // COLUMN 1
        // ==================================================

        const column1 =
            document.createElement("div");


        column1.className =
            "sub-service-column";


        // ==================================================
        // COLUMN 2
        // ==================================================

        const column2 =
            document.createElement("div");


        column2.className =
            "sub-service-column";


        // ==================================================
        // COLUMN 3
        // ==================================================

        const column3 =
            document.createElement("div");


        column3.className =
            "sub-service-column";


        // ==================================================
        // CREATE SUB BUTTON
        // ==================================================

        function createSubButton(
            subService,
            index
        ) {

            const button =
                document.createElement("button");


            button.type =
                "button";


            button.className =
                "sub-service-button";


            // ==============================================
            // NUMBER
            // ==============================================

            const number =
                document.createElement("span");


            number.className =
                "sub-service-number";


            number.textContent =
                (index + 1) + ".";


            // ==============================================
            // NAME
            // ==============================================

            const name =
                document.createElement("span");


            name.className =
                "sub-service-name";


            name.textContent =
                getSubServiceName(
                    subService
                );


            button.appendChild(
                number
            );


            button.appendChild(
                name
            );


            // ==============================================
            // CLICK
            // ==============================================

            button.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();


                    showSelectedService(
                        serviceName,
                        getSubServiceName(
                            subService
                        ),
                        getDocuments(
                            subService
                        )
                    );

                }
            );


            return button;

        }


        // ==================================================
        // DISTRIBUTE
        // ==================================================

        children.forEach(
            function (
                subService,
                index
            ) {

                const button =
                    createSubButton(
                        subService,
                        index
                    );


                // 1 - 5
                if (index < 5) {

                    column1.appendChild(
                        button
                    );

                }


                // 6 - 10
                else if (index < 10) {

                    column2.appendChild(
                        button
                    );

                }


                // 11+
                else {

                    column3.appendChild(
                        button
                    );

                }

            }
        );


        // ==================================================
        // ADD COLUMNS
        // ==================================================

        subContainer.appendChild(
            column1
        );


        subContainer.appendChild(
            column2
        );


        subContainer.appendChild(
            column3
        );


        content.appendChild(
            subContainer
        );

    }


    // ======================================================
    // ADD CONTENT
    // ======================================================

    article.appendChild(
        content
    );


    // ======================================================
    // NORMAL SERVICE
    // ======================================================

    if (children.length === 0) {

        article.addEventListener(
            "click",
            function () {

                showSelectedService(
                    serviceName,
                    serviceName,
                    getDocuments(
                        service
                    )
                );

            }
        );

    }


    article.style.cursor =
        "pointer";


    // ======================================================
    // ADD CARD
    // ======================================================

    departmentsContainer.appendChild(
        article
    );

}


// ==========================================================
// SHOW SELECTED SERVICE
// ==========================================================

function showSelectedService(
    serviceName,
    selectedService,
    documents
) {

    if (!documentBox) {

        return;

    }


    documentBox.innerHTML =
        "";


    const documentItems =
        normalizeDocuments(
            documents
        );


    // ======================================================
    // MAIN SERVICE
    // ======================================================

    const heading =
        document.createElement("h3");


    heading.textContent =
        serviceName;


    documentBox.appendChild(
        heading
    );


    // ======================================================
    // SELECTED SERVICE
    // ======================================================

    const selected =
        document.createElement("h4");


    selected.textContent =
        selectedService;


    documentBox.appendChild(
        selected
    );


    // ======================================================
    // DOCUMENT HEADING
    // ======================================================

    const documentHeading =
        document.createElement("p");


    documentHeading.innerHTML =
        "<strong>Required Documents</strong>";


    documentBox.appendChild(
        documentHeading
    );


    // ======================================================
    // DOCUMENT LIST
    // ======================================================

    const list =
        document.createElement("ul");


    list.className =
        "requirements-list";


    if (documentItems.length === 0) {

        const item =
            document.createElement("li");


        item.className =
            "requirement-item";


        item.textContent =
            "Contact us for document requirements.";


        list.appendChild(
            item
        );

    }
    else {

        documentItems.forEach(
            function (doc) {

                const item =
                    document.createElement("li");


                item.className =
                    "requirement-item";


                item.innerHTML = `
                    <span class="bullet">•</span>
                    <span>
                        ${escapeHTML(doc)}
                    </span>
                `;


                list.appendChild(
                    item
                );

            }
        );

    }


    documentBox.appendChild(
        list
    );


    // ======================================================
    // WHATSAPP MESSAGE
    // ======================================================

    let whatsappMessage =
        "Hello MBSC SOLUTIONS,\n\n" +
        "I need details about " +
        serviceName +
        " - " +
        selectedService +
        ".\n\n" +
        "Required Documents:\n";


    if (documentItems.length > 0) {

        whatsappMessage +=
            documentItems
                .map(
                    function (
                        doc,
                        index
                    ) {

                        return (
                            (index + 1) +
                            ". " +
                            doc
                        );

                    }
                )
                .join("\n");

    }
    else {

        whatsappMessage +=
            "Please confirm the required documents.";

    }


    // ======================================================
    // WHATSAPP BUTTON
    // ======================================================

    const whatsappButton =
        document.createElement("a");


   whatsappButton.className =
    "whatsapp-animated-button";


    whatsappButton.href =
        whatsappLink(
            whatsappMessage
        );


    whatsappButton.target =
        "_blank";


    whatsappButton.rel =
        "noopener noreferrer";


    whatsappButton.innerHTML = `
    <span class="whatsapp-video-wrap">
        <video
            class="whatsapp-video"
            autoplay
            muted
            loop
            playsinline
            preload="auto"
        >
            <source
                src="https://whxlatxnqjpccwrmtmph.supabase.co/storage/v1/object/public/images/whats%20app%20(online-video-cutter.com).mp4"
                type="video/mp4"
            >
        </video>
    </span>

    <span>WhatsApp</span>
`;

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

        documentsSection.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }

}

// ==========================================================
// HERO VIDEO
// ==========================================================

function setupHeroVideo() {

    const video =
        document.querySelector(
            ".hero-video"
        );


    if (!video) {

        return;

    }


    video.muted =
        true;


    video.setAttribute(
        "muted",
        ""
    );


    video.setAttribute(
        "playsinline",
        ""
    );


    video.play()
        .catch(
            function () {}
        );

}


// ==========================================================
// SERVICE STATUS
// ==========================================================

async function loadServiceStatus() {

    const totalCustomersElement =
        document.getElementById(
            "totalVisitingCustomers"
        );


    const serviceStatusBody =
        document.getElementById(
            "serviceStatusBody"
        );


    if (
        !totalCustomersElement ||
        !serviceStatusBody
    ) {

        return;

    }


    try {

        // ==================================================
        // TOTAL CUSTOMERS
        // ==================================================

        const statsResult =
            await supabaseClient
                .from("website_stats")
                .select(
                    "total_visiting_customers"
                )
                .limit(1)
                .maybeSingle();


        if (statsResult.error) {

            throw statsResult.error;

        }


        const totalCustomers =
            Number(
                statsResult.data
                    ?.total_visiting_customers || 0
            );


        totalCustomersElement.textContent =
            totalCustomers.toLocaleString(
                "en-IN"
            );


        // ==================================================
        // SERVICE STATUS
        // ==================================================

        const statusResult =
            await supabaseClient
                .from("service_status")
                .select(
                    "service_name, success_count, failed_count, processing_count, sort_order"
                )
                .order(
                    "sort_order",
                    {
                        ascending: true
                    }
                );


        if (statusResult.error) {

            throw statusResult.error;

        }


        const services =
            statusResult.data || [];


        if (services.length === 0) {

            serviceStatusBody.innerHTML = `

                <tr>

                    <td colspan="5">

                        No service status available.

                    </td>

                </tr>

            `;

            return;

        }


        serviceStatusBody.innerHTML =
            services.map(
                function (service) {

                    const success =
                        Number(
                            service.success_count || 0
                        );


                    const failed =
                        Number(
                            service.failed_count || 0
                        );


                    const processing =
                        Number(
                            service.processing_count || 0
                        );


                    const total =
                        success +
                        failed +
                        processing;


                    return `

                        <tr>

                            <td>
                                ${escapeHTML(
                                    service.service_name
                                )}
                            </td>


                            <td>
                                ${success}
                            </td>


                            <td>
                                ${failed}
                            </td>


                            <td>
                                ${processing}
                            </td>


                            <td>

                                <strong>
                                    ${total}
                                </strong>

                            </td>

                        </tr>

                    `;

                }
            ).join("");


    }
    catch (error) {

        // ==================================================
        // FIXED ERROR
        // ==================================================

        console.error(
            "Service Status Error:",
            error
        );


        serviceStatusBody.innerHTML = `

            <tr>

                <td colspan="5">

                    Unable to load service status.

                </td>

            </tr>

        `;

    }

}


// ==========================================================
// PAGE LOAD
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "MBSC SOLUTIONS page loaded."
        );


        setupHeroVideo();


        loadServices();


        loadServiceStatus();

    }
);


// ==========================================================
// VIDEO VISIBILITY
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


        const video =
            document.querySelector(
                ".hero-video"
            );


        if (video) {

            video.play()
                .catch(
                    function () {}
                );

        }

    }
);


// ==========================================================
// FINAL LOG
// ==========================================================

console.log(
    "MBSC SOLUTIONS script.js loaded successfully."
);