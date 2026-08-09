// ==========================================================
// MBSC SOLUTIONS - SERVICES SCRIPT
// DEPARTMENT + SUB SERVICES
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

let supabaseClient = null;

if (window.supabase) {

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

} else {

    console.error(
        "MBSC: Supabase library not loaded."
    );

}


// ==========================================================
// ELEMENTS
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
// LOAN SUB SERVICES
// ==========================================================

const LOAN_SUB_SERVICES = [

    "Tractor Loans",

    "Agri SME Loans",

    "Construction Equipment Loans",

    "Business Loans",

    "Gold Loans",

    "Commercial Vehicle Loans",

    "Home Loans",

    "Auto & Car Loans",

    "Bike Loans"

];


// ==========================================================
// LOAD SERVICES
// ==========================================================

async function loadServices() {

    console.log(
        "MBSC: Loading services..."
    );


    if (!grid) {

        console.error(
            "MBSC: servicesGrid not found."
        );

        return;
    }


    if (!supabaseClient) {

        grid.innerHTML = `
            <div class="service">
                <h3>Supabase Error</h3>

                <p>
                    Supabase library is not loaded.
                </p>
            </div>
        `;

        return;
    }


    // ------------------------------------------------------
    // LOADING
    // ------------------------------------------------------

    grid.innerHTML = `
        <div class="service">
            <h3>Loading Services...</h3>

            <p>
                Please wait while our services are loading.
            </p>
        </div>
    `;


    try {

        // --------------------------------------------------
        // GET DATA
        // --------------------------------------------------

        const {
            data,
            error
        } = await supabaseClient
            .from("services")
            .select(
                "id, created_at, service_name, documents, sort_order"
            )
            .order(
                "sort_order",
                {
                    ascending: true
                }
            );


        // --------------------------------------------------
        // ERROR
        // --------------------------------------------------

        if (error) {

            console.error(
                "MBSC Supabase Error:",
                error
            );


            grid.innerHTML = `
                <div class="service">

                    <h3>
                        Unable to Load Services
                    </h3>

                    <p>
                        ${escapeHTML(
                            error.message ||
                            "Supabase error"
                        )}
                    </p>

                </div>
            `;

            return;
        }


        // --------------------------------------------------
        // EMPTY
        // --------------------------------------------------

        if (
            !data ||
            data.length === 0
        ) {

            grid.innerHTML = `
                <div class="service">

                    <h3>
                        No Services Found
                    </h3>

                    <p>
                        Services table is empty.
                    </p>

                </div>
            `;

            return;
        }


        console.log(
            "MBSC: Supabase services:",
            data
        );


        // --------------------------------------------------
        // CLEAR
        // --------------------------------------------------

        grid.innerHTML = "";


        // ==================================================
        // FIND LOANS DEPARTMENT
        // ==================================================

        const loansDepartment =
            data.find(
                function(service) {

                    return (
                        String(
                            service.service_name
                        )
                        .trim()
                        .toLowerCase()
                        ===
                        "loans"
                    );

                }
            );


        // ==================================================
        // CREATE LOANS DEPARTMENT FIRST
        // ==================================================

        if (loansDepartment) {

            createLoansDepartment(
                loansDepartment,
                data
            );

        }


        // ==================================================
        // OTHER SERVICES
        // ==================================================

        data.forEach(
            function(service) {

                const name =
                    String(
                        service.service_name ||
                        ""
                    )
                    .trim();


                // ------------------------------------------
                // Skip Loans department
                // ------------------------------------------

                if (
                    name.toLowerCase()
                    ===
                    "loans"
                ) {

                    return;
                }


                // ------------------------------------------
                // Skip Loan Sub Services
                // ------------------------------------------

                const isLoanSubService =
                    LOAN_SUB_SERVICES.some(
                        function(loanName) {

                            return (
                                loanName
                                    .toLowerCase()
                                    ===
                                name.toLowerCase()
                            );

                        }
                    );


                if (isLoanSubService) {

                    return;
                }


                // ------------------------------------------
                // Normal department
                // ------------------------------------------

                createNormalServiceCard(
                    service
                );

            }
        );


        console.log(
            "MBSC: Services displayed successfully."
        );

    }

    catch (error) {

        console.error(
            "MBSC: Unexpected error:",
            error
        );


        grid.innerHTML = `
            <div class="service">

                <h3>
                    Something Went Wrong
                </h3>

                <p>
                    ${escapeHTML(
                        error.message ||
                        "Unknown error"
                    )}
                </p>

            </div>
        `;

    }

}


// ==========================================================
// CREATE LOANS DEPARTMENT
// ==========================================================

function createLoansDepartment(
    loansDepartment,
    allServices
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "service department-card";


    // ======================================================
    // TITLE
    // ======================================================

    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        "Loans";


    // ======================================================
    // DESCRIPTION
    // ======================================================

    const description =
        document.createElement(
            "p"
        );


    description.textContent =
        "Choose the loan service you need.";


    // ======================================================
    // MAIN BUTTON
    // ======================================================

    const mainButton =
        document.createElement(
            "button"
        );


    mainButton.type =
        "button";


    mainButton.className =
        "service-button";


    mainButton.textContent =
        "View Loan Services";


    // ======================================================
    // SUB SERVICES CONTAINER
    // ======================================================

    const subServices =
        document.createElement(
            "div"
        );


    subServices.className =
        "loan-sub-services";


    subServices.style.display =
        "none";


    // ======================================================
    // FIND LOAN SUB SERVICES
    // ======================================================

    const loanServices =
        [];


    LOAN_SUB_SERVICES.forEach(
        function(loanName) {

            const found =
                allServices.find(
                    function(service) {

                        return (
                            String(
                                service.service_name ||
                                ""
                            )
                            .trim()
                            .toLowerCase()
                            ===
                            loanName.toLowerCase()
                        );

                    }
                );


            if (found) {

                loanServices.push(
                    found
                );

            }

        }
    );


    // ======================================================
    // CREATE SUB SERVICE BUTTONS
    // ======================================================

    loanServices.forEach(
        function(
            service,
            index
        ) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "sub-service-button";


            button.innerHTML = `
                <span class="sub-number">
                    ${index + 1}.
                </span>

                <span>
                    ${escapeHTML(
                        service.service_name
                    )}
                </span>
            `;


            button.addEventListener(
                "click",
                function() {

                    showServiceDocuments(
                        service.service_name,
                        service.documents
                    );

                }
            );


            subServices.appendChild(
                button
            );

        }
    );


    // ======================================================
    // OPEN / CLOSE
    // ======================================================

    mainButton.addEventListener(
        "click",
        function() {

            if (
                subServices.style.display
                ===
                "none"
            ) {

                subServices.style.display =
                    "flex";


                mainButton.textContent =
                    "Hide Loan Services";

            }

            else {

                subServices.style.display =
                    "none";


                mainButton.textContent =
                    "View Loan Services";

            }

        }
    );


    // ======================================================
    // WHATSAPP
    // ======================================================

    const whatsapp =
        document.createElement(
            "a"
        );


    whatsapp.className =
        "secondary";


    whatsapp.href =
        whatsappLink(
            "Hello MBSC SOLUTIONS, I need details about Loans."
        );


    whatsapp.target =
        "_blank";


    whatsapp.rel =
        "noopener noreferrer";


    whatsapp.textContent =
        "WhatsApp for Loans";


    // ======================================================
    // ADD
    // ======================================================

    article.appendChild(
        title
    );


    article.appendChild(
        description
    );


    article.appendChild(
        mainButton
    );


    article.appendChild(
        subServices
    );


    article.appendChild(
        whatsapp
    );


    grid.appendChild(
        article
    );

}


// ==========================================================
// NORMAL SERVICE CARD
// ==========================================================

function createNormalServiceCard(
    service
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "service";


    // ======================================================
    // TITLE
    // ======================================================

    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        service.service_name ||
        "Service";


    // ======================================================
    // DESCRIPTION
    // ======================================================

    const description =
        document.createElement(
            "p"
        );


    description.textContent =
        "Click below to view service details.";


    // ======================================================
    // BUTTON
    // ======================================================

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


    // ======================================================
    // CLICK
    // ======================================================

    button.addEventListener(
        "click",
        function() {

            showServiceDocuments(
                service.service_name,
                service.documents
            );

        }
    );


    // ======================================================
    // ADD
    // ======================================================

    article.appendChild(
        title
    );


    article.appendChild(
        description
    );


    article.appendChild(
        button
    );


    grid.appendChild(
        article
    );

}


// ==========================================================
// SHOW DOCUMENTS
// ==========================================================

function showServiceDocuments(
    serviceName,
    documents
) {

    if (!documentBox) {

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


    let items = [];


    // ======================================================
    // STRING
    // ======================================================

    if (
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


    // ======================================================
    // ARRAY
    // ======================================================

    else if (
        Array.isArray(documents)
    ) {

        items =
            documents;

    }


    // ======================================================
    // NO DOCUMENTS
    // ======================================================

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


    // ======================================================
    // DOCUMENTS
    // ======================================================

    else {

        items.forEach(
            function(text) {

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
                        ${escapeHTML(text)}
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

    const whatsapp =
        document.createElement(
            "a"
        );


    whatsapp.className =
        "primary";


    whatsapp.href =
        whatsappLink(
            "Hello MBSC SOLUTIONS, I need details about " +
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
// START
// ==========================================================

function startMBSC() {

    loadServices();

}


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
