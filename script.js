// ==========================================================
// MBSC SOLUTIONS - COMPLETE SCRIPT
// ==========================================================

// ==========================================================
// SUPABASE CONFIG
// ==========================================================

const SUPABASE_URL =
    "https://whxlatxnqjpccwrmtmph.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_wlqTaOkM3fML9cuUES54fw_8TlbSi-H";


// ==========================================================
// CREATE SUPABASE CLIENT
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
// LOAN SERVICES
// ==========================================================

const LOAN_SERVICES = [
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
// GET SERVICE NAME
// ==========================================================

function getServiceName(service) {

    return (
        service.name ||
        service.service_name ||
        service.title ||
        "Service"
    );

}


// ==========================================================
// LOAD SERVICES
// ==========================================================

async function loadServices() {

    console.log(
        "MBSC: Loading services..."
    );


    if (!grid) {

        console.error(
            "MBSC: servicesGrid not found"
        );

        return;
    }


    // Loading message

    grid.innerHTML = `
        <div class="service">
            <h3>Loading Services...</h3>
            <p>Please wait while our services are loading.</p>
        </div>
    `;


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("services")
            .select("*");


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
                            error.message
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
                        Services table lo data ledu.
                    </p>

                </div>
            `;

            return;
        }


        console.log(
            "MBSC SERVICES:",
            data
        );


        // Clear loading

        grid.innerHTML = "";


        // --------------------------------------------------
        // LOANS FIRST
        // --------------------------------------------------

        let loansAdded = false;


        data.forEach(
            function(service) {

                const name =
                    getServiceName(service)
                        .trim()
                        .toLowerCase();


                if (
                    name === "loans" ||
                    name.includes("loan")
                ) {

                    if (!loansAdded) {

                        createLoansDepartment(
                            service
                        );

                        loansAdded = true;
                    }

                }

            }
        );


        // --------------------------------------------------
        // OTHER SERVICES
        // --------------------------------------------------

        data.forEach(
            function(service) {

                const name =
                    getServiceName(service)
                        .trim()
                        .toLowerCase();


                if (
                    name === "loans" ||
                    name.includes("loan")
                ) {

                    return;
                }


                createServiceCard(
                    service
                );

            }
        );


        console.log(
            "MBSC: Services displayed"
        );

    }

    catch (error) {

        console.error(
            "MBSC ERROR:",
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
// LOANS DEPARTMENT
// ==========================================================

function createLoansDepartment(service) {

    const article =
        document.createElement("article");


    article.className =
        "service loans-department";


    // Title

    const title =
        document.createElement("h3");

    title.textContent =
        "Loans";


    // Description

    const description =
        document.createElement("p");

    description.textContent =
        "Choose the loan service you need.";


    // Main button

    const button =
        document.createElement("button");

    button.type =
        "button";

    button.className =
        "service-button";

    button.textContent =
        "View Loan Services";


    // Loan list

    const loanList =
        document.createElement("div");

    loanList.className =
        "loan-sub-services";

    loanList.style.display =
        "none";


    // Create loan buttons

    LOAN_SERVICES.forEach(
        function(
            loanName,
            index
        ) {

            const loanButton =
                document.createElement(
                    "button"
                );


            loanButton.type =
                "button";


            loanButton.className =
                "sub-service-button";


            loanButton.innerHTML = `
                <span class="sub-number">
                    ${index + 1}.
                </span>

                <span>
                    ${escapeHTML(
                        loanName
                    )}
                </span>
            `;


            loanButton.addEventListener(
                "click",
                function() {

                    showServiceDocuments(
                        loanName,
                        "",
                        {}
                    );

                }
            );


            loanList.appendChild(
                loanButton
            );

        }
    );


    // Open / Close

    button.addEventListener(
        "click",
        function() {

            if (
                loanList.style.display ===
                "none"
            ) {

                loanList.style.display =
                    "flex";

                button.textContent =
                    "Hide Loan Services";

            }

            else {

                loanList.style.display =
                    "none";

                button.textContent =
                    "View Loan Services";

            }

        }
    );


    // WhatsApp

    const whatsapp =
        document.createElement("a");

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


    // Add elements

    article.appendChild(
        title
    );

    article.appendChild(
        description
    );

    article.appendChild(
        button
    );

    article.appendChild(
        loanList
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

function createServiceCard(service) {

    const article =
        document.createElement("article");


    article.className =
        "service";


    const serviceName =
        getServiceName(service);


    const description =
        service.description ||
        service.details ||
        "Click below to view service details.";


    const docs =
        service.documents ||
        service.requirements ||
        service.docs ||
        "";


    // Title

    const title =
        document.createElement("h3");

    title.textContent =
        serviceName;


    // Description

    const desc =
        document.createElement("p");

    desc.textContent =
        description;


    // Button

    const button =
        document.createElement("button");

    button.type =
        "button";

    button.className =
        "service-button";

    button.textContent =
        "View & WhatsApp";


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


    // Add

    article.appendChild(
        title
    );

    article.appendChild(
        desc
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
    docs,
    service
) {

    if (!documentBox) {

        return;
    }


    documentBox.innerHTML =
        "";


    // Heading

    const heading =
        document.createElement("h3");

    heading.textContent =
        serviceName;


    documentBox.appendChild(
        heading
    );


    // List

    const list =
        document.createElement("ul");

    list.className =
        "requirements-list";


    let items = [];


    // Array

    if (
        Array.isArray(docs)
    ) {

        items =
            docs;

    }


    // String

    else if (
        typeof docs ===
        "string"
    ) {

        items =
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


    // No documents

    if (
        items.length === 0
    ) {

        const item =
            document.createElement("li");


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


    // Documents

    else {

        items.forEach(
            function(text) {

                const item =
                    document.createElement("li");


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


    // WhatsApp

    const whatsapp =
        document.createElement("a");

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


    // Scroll

    const section =
        document.querySelector(
            ".documents"
        );


    if (section) {

        section.scrollIntoView({
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
            "MBSC: Page loaded"
        );

        loadServices();

    }
);
