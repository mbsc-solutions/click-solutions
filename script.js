// ==========================================================
// MBSC SOLUTIONS
// COMPLETE SERVICES + DEPARTMENT / SUB-SERVICES SCRIPT
// ==========================================================

// ==========================================================
// SUPABASE CONFIG
// ==========================================================

const SUPABASE_URL =
    "https://whxlatxnqjpccwrmtmph.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_wlqTaOkM3fML9cuUES54fw_8TlbSi-H";

// ==========================================================
// SUPABASE CLIENT
// ==========================================================

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

// ==========================================================
// GLOBAL ELEMENTS
// ==========================================================

const departmentsContainer =
    document.getElementById("departmentsContainer");

const documentBox =
    document.getElementById("documentBox");

const WHATSAPP_NUMBER =
    "917093334820";

// ==========================================================
// WHATSAPP LINK
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
// GET SERVICE NAME
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
// GET SUB SERVICE NAME
// ==========================================================

function getSubServiceName(subService) {

    return (
        subService.sub_service_name ||
        subService.service_name ||
        subService.name ||
        subService.title ||
        "Sub Service"
    );

}

// ==========================================================
// GET DOCUMENTS
// ==========================================================

function getDocuments(item) {

    return (
        item.documents ||
        item.requirements ||
        item.docs ||
        ""
    );

}

// ==========================================================
// LOAD EVERYTHING
// ==========================================================

async function loadServices() {

    console.log("=================================");
    console.log("MBSC SOLUTIONS");
    console.log("Loading services...");
    console.log("=================================");

    if (!departmentsContainer) {

        console.error(
            "MBSC ERROR: departmentsContainer not found."
        );

        return;
    }

    departmentsContainer.innerHTML = `
        <div class="loading-box">

            <div class="loading-spinner"></div>

            <h3>
                Loading Services...
            </h3>

            <p>
                Please wait while our services are loading.
            </p>

        </div>
    `;

    try {

        // ==================================================
        // GET SERVICES
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

            console.error(
                "MBSC SERVICES ERROR:",
                servicesResult.error
            );

            showError(
                servicesResult.error.message
            );

            return;
        }

        const services =
            servicesResult.data || [];

        console.log(
            "MBSC: Services:",
            services
        );

        // ==================================================
        // GET SUB SERVICE ITEMS
        // ==================================================

        const subResult =
            await supabaseClient
                .from("sub_service_items")
                .select("*")
                .order(
                    "sort_order",
                    {
                        ascending: true,
                        nullsFirst: false
                    }
                );

        if (subResult.error) {

            console.error(
                "MBSC SUB SERVICE ERROR:",
                subResult.error
            );

            showError(
                subResult.error.message
            );

            return;
        }

        const subServices =
            subResult.data || [];

        console.log(
            "MBSC: Sub services:",
            subServices
        );

        // ==================================================
        // CREATE PAGE
        // ==================================================

        buildServiceDepartments(
            services,
            subServices
        );

        console.log(
            "MBSC: Services successfully displayed."
        );

    }

    catch (error) {

        console.error(
            "MBSC UNEXPECTED ERROR:",
            error
        );

        showError(
            "Unable to connect to Supabase."
        );

    }

}

// ==========================================================
// SHOW ERROR
// ==========================================================

function showError(message) {

    if (!departmentsContainer) {
        return;
    }

    departmentsContainer.innerHTML = `

        <div class="error-box">

            <h3>
                Unable to Load Services
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;

}

// ==========================================================
// BUILD SERVICE DEPARTMENTS
// ==========================================================

function buildServiceDepartments(
    services,
    subServices
) {

    departmentsContainer.innerHTML = "";

    // ======================================================
    // CREATE SUB-SERVICE MAP
    // ======================================================

    const subServiceMap = {};

    subServices.forEach(
        function(item) {

            const serviceId =
                String(item.service_id);

            if (!subServiceMap[serviceId]) {

                subServiceMap[serviceId] = [];

            }

            subServiceMap[serviceId].push(
                item
            );

        }
    );

    console.log(
        "MBSC: Sub-service map:",
        subServiceMap
    );

    // ======================================================
    // FIND LOAN SERVICES
    // ======================================================

    const loanServices =
        services.filter(
            function(service) {

                const name =
                    getServiceName(service)
                        .trim()
                        .toLowerCase();

                return (
                    name.includes("loan")
                    &&
                    name !== "loans"
                );

            }
        );

    // ======================================================
    // MAIN LOANS SERVICE
    // ======================================================

    const mainLoans =
        services.find(
            function(service) {

                return (
                    getServiceName(service)
                        .trim()
                        .toLowerCase()
                    === "loans"
                );

            }
        );

    console.log(
        "Main Loans:",
        mainLoans
    );

    console.log(
        "Loan sub services:",
        loanServices
    );

    // ======================================================
    // CREATE LOANS DEPARTMENT
    // ======================================================

    if (
        mainLoans &&
        loanServices.length > 0
    ) {

        createLoansDepartment(
            mainLoans,
            loanServices
        );

    }

    // ======================================================
    // OTHER SERVICES
    // ======================================================

    services.forEach(
        function(service) {

            const name =
                getServiceName(service)
                    .trim()
                    .toLowerCase();

            // Skip main Loans
            if (
                name === "loans"
            ) {
                return;
            }

            // Skip individual loan services
            if (
                name.includes("loan")
            ) {
                return;
            }

            // ==================================================
            // FIND SUB SERVICES
            // ==================================================

            const children =
                subServiceMap[
                    String(service.id)
                ] || [];

            console.log(
                "Department:",
                getServiceName(service),
                "Sub services:",
                children
            );

            // ==================================================
            // HAS SUB SERVICES
            // ==================================================

            if (
                children.length > 0
            ) {

                createDepartmentCard(
                    service,
                    children
                );

            }

            // ==================================================
            // NORMAL SERVICE
            // ==================================================

            else {

                createNormalServiceCard(
                    service
                );

            }

        }
    );

}

// ==========================================================
// CREATE LOANS DEPARTMENT
// ==========================================================

function createLoansDepartment(
    mainLoans,
    loanServices
) {

    const department =
        document.createElement("article");

    department.className =
        "loan-department";

    // ======================================================
    // HEADER
    // ======================================================

    const header =
        document.createElement("div");

    header.className =
        "department-header";

    header.innerHTML = `

        <div>

            <span class="department-label">
                DEPARTMENT
            </span>

            <h3>
                Loans
            </h3>

            <p>
                Choose the loan service you need.
            </p>

        </div>

    `;

    department.appendChild(
        header
    );

    // ======================================================
    // MAIN BUTTON
    // ======================================================

    const mainButton =
        document.createElement("button");

    mainButton.className =
        "loan-main-button";

    mainButton.textContent =
        "View Loan Services";

    department.appendChild(
        mainButton
    );

    // ======================================================
    // SUB SERVICES
    // ======================================================

    const subContainer =
        document.createElement("div");

    subContainer.className =
        "loan-sub-services";

    // ======================================================
    // ADD LOANS
    // ======================================================

    loanServices.forEach(
        function(service, index) {

            const name =
                getServiceName(service);

            const documents =
                getDocuments(service);

            const button =
                document.createElement("button");

            button.className =
                "loan-sub-button";

            button.innerHTML = `

                <span class="loan-number">
                    ${index + 1}.
                </span>

                <span>
                    ${escapeHTML(name)}
                </span>

            `;

            button.addEventListener(
                "click",
                function() {

                    showServiceDocuments(
                        name,
                        documents
                    );

                }
            );

            subContainer.appendChild(
                button
            );

        }
    );

    // ======================================================
    // WHATSAPP
    // ======================================================

    const whatsappButton =
        document.createElement("a");

    whatsappButton.className =
        "loan-whatsapp";

    whatsappButton.href =
        whatsappLink(
            "Hello MBSC SOLUTIONS, I need loan details."
        );

    whatsappButton.target =
        "_blank";

    whatsappButton.rel =
        "noopener noreferrer";

    whatsappButton.textContent =
        "WhatsApp for Loans";

    subContainer.appendChild(
        whatsappButton
    );

    // ======================================================
    // ADD CONTAINER
    // ======================================================

    department.appendChild(
        subContainer
    );

    // ======================================================
    // TOGGLE
    // ======================================================

    mainButton.addEventListener(
        "click",
        function() {

            const isOpen =
                subContainer.classList.toggle(
                    "show"
                );

            if (isOpen) {

                mainButton.textContent =
                    "Hide Loan Services";

            }

            else {

                mainButton.textContent =
                    "View Loan Services";

            }

        }
    );

    departmentsContainer.appendChild(
        department
    );

}

// ==========================================================
// CREATE NORMAL DEPARTMENT CARD
// ==========================================================

function createDepartmentCard(
    service,
    subServices
) {

    const department =
        document.createElement("article");

    department.className =
        "loan-department";

    const serviceName =
        getServiceName(service);

    const description =
        service.description ||
        service.details ||
        "Choose a service from " +
        serviceName +
        ".";

    // ======================================================
    // HEADER
    // ======================================================

    const header =
        document.createElement("div");

    header.className =
        "department-header";

    header.innerHTML = `

        <div>

            <span class="department-label">
                DEPARTMENT
            </span>

            <h3>
                ${escapeHTML(serviceName)}
            </h3>

            <p>
                ${escapeHTML(description)}
            </p>

        </div>

    `;

    department.appendChild(
        header
    );

    // ======================================================
    // MAIN BUTTON
    // ======================================================

    const mainButton =
        document.createElement("button");

    mainButton.className =
        "loan-main-button";

    mainButton.textContent =
        "View " +
        serviceName +
        " Services";

    department.appendChild(
        mainButton
    );

    // ======================================================
    // SUB SERVICE CONTAINER
    // ======================================================

    const subContainer =
        document.createElement("div");

    subContainer.className =
        "loan-sub-services";

    // ======================================================
    // CREATE SUB SERVICES
    // ======================================================

    subServices.forEach(
        function(subService, index) {

            const subName =
                getSubServiceName(
                    subService
                );

            const documents =
                getDocuments(
                    subService
                );

            const button =
                document.createElement("button");

            button.className =
                "loan-sub-button";

            button.innerHTML = `

                <span class="loan-number">
                    ${index + 1}.
                </span>

                <span>
                    ${escapeHTML(subName)}
                </span>

            `;

            button.addEventListener(
                "click",
                function() {

                    showServiceDocuments(
                        subName,
                        documents
                    );

                }
            );

            subContainer.appendChild(
                button
            );

        }
    );

    // ======================================================
    // WHATSAPP
    // ======================================================

    const whatsappButton =
        document.createElement("a");

    whatsappButton.className =
        "loan-whatsapp";

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
        "WhatsApp for " +
        serviceName;

    subContainer.appendChild(
        whatsappButton
    );

    department.appendChild(
        subContainer
    );

    // ======================================================
    // TOGGLE
    // ======================================================

    mainButton.addEventListener(
        "click",
        function() {

            const isOpen =
                subContainer.classList.toggle(
                    "show"
                );

            if (isOpen) {

                mainButton.textContent =
                    "Hide " +
                    serviceName +
                    " Services";

            }

            else {

                mainButton.textContent =
                    "View " +
                    serviceName +
                    " Services";

            }

        }
    );

    departmentsContainer.appendChild(
        department
    );

}

// ==========================================================
// NORMAL SERVICE CARD
// ==========================================================

function createNormalServiceCard(
    service
) {

    const article =
        document.createElement("article");

    article.className =
        "service-card";

    const name =
        getServiceName(service);

    const description =
        service.description ||
        service.details ||
        "Click below to view service details.";

    article.innerHTML = `

        <div class="service-card-content">

            <h3>
                ${escapeHTML(name)}
            </h3>

            <p>
                ${escapeHTML(description)}
            </p>

        </div>

    `;

    const button =
        document.createElement("button");

    button.className =
        "service-button";

    button.textContent =
        "View & WhatsApp";

    button.addEventListener(
        "click",
        function() {

            showServiceDocuments(
                name,
                getDocuments(service)
            );

        }
    );

    article.appendChild(
        button
    );

    departmentsContainer.appendChild(
        article
    );

}

// ==========================================================
// SHOW DOCUMENTS
// ==========================================================

function showServiceDocuments(
    serviceName,
    docs
) {

    if (!documentBox) {

        console.error(
            "MBSC ERROR: documentBox not found."
        );

        return;
    }

    documentBox.innerHTML = "";

    // ======================================================
    // HEADING
    // ======================================================

    const heading =
        document.createElement("h3");

    heading.textContent =
        serviceName;

    documentBox.appendChild(
        heading
    );

    // ======================================================
    // LIST
    // ======================================================

    const list =
        document.createElement("ul");

    list.className =
        "requirements-list";

    let documentItems = [];

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
        typeof docs === "string"
    ) {

        documentItems =
            docs
                .split(/\r?\n|,|;/)
                .map(
                    function(item) {

                        return item.trim();

                    }
                )
                .filter(Boolean);

    }

    // ======================================================
    // EMPTY
    // ======================================================

    if (
        documentItems.length === 0
    ) {

        const item =
            document.createElement("li");

        item.className =
            "requirement-item";

        item.innerHTML = `

            <span class="bullet">
                •
            </span>

            <span>
                Contact us for document requirements.
            </span>

        `;

        list.appendChild(
            item
        );

    }

    // ======================================================
    // DOCUMENTS
    // ======================================================

    else {

        documentItems.forEach(
            function(itemText) {

                const item =
                    document.createElement("li");

                item.className =
                    "requirement-item";

                item.innerHTML = `

                    <span class="bullet">
                        •
                    </span>

                    <span>
                        ${escapeHTML(itemText)}
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
    // WHATSAPP
    // ======================================================

    const whatsappButton =
        document.createElement("a");

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

        console.log(
            "Hero video not found."
        );

        return;
    }

    video.muted = true;

    video.setAttribute(
        "muted",
        ""
    );

    video.setAttribute(
        "playsinline",
        ""
    );

    video.play()
        .then(
            function() {

                console.log(
                    "MBSC: Hero video playing."
                );

            }
        )
        .catch(
            function(error) {

                console.log(
                    "MBSC: Hero video autoplay blocked.",
                    error
                );

            }
        );

}

// ==========================================================
// PAGE LOAD
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "================================="
        );

        console.log(
            "MBSC SOLUTIONS PAGE LOADED"
        );

        console.log(
            "================================="
        );

        setupHeroVideo();

        loadServices();

    }
);

// ==========================================================
// PAGE VISIBILITY
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

        const video =
            document.querySelector(
                ".hero-video"
            );

        if (video) {

            video.play()
                .catch(
                    function() {}
                );

        }

    }
);

// ==========================================================
// SCRIPT LOADED
// ==========================================================

console.log(
    "MBSC Solutions script.js loaded."
);
