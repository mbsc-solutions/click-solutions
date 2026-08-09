// ==========================================================
// MBSC SOLUTIONS - COMPLETE SERVICES SCRIPT
// ==========================================================

// ==========================================================
// SUPABASE CONFIG
// ==========================================================

const SUPABASE_URL =
    "https://whxlatxnqjpccwrmtmph.supabase.co";

// IMPORTANT:
// IKKADA SB_SECRET KEY VADAKU.
// Supabase Dashboard lo Project Settings -> API
// nundi Publishable / Anon key pettali.

const SUPABASE_ANON_KEY =
    "PASTE_YOUR_PUBLISHABLE_OR_ANON_KEY_HERE";


// ==========================================================
// SUPABASE CLIENT
// ==========================================================

let supabaseClient = null;

if (
    window.supabase &&
    SUPABASE_URL &&
    !SUPABASE_ANON_KEY.includes("PASTE_YOUR")
) {
    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );
}


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
// LOAN SUB SERVICES
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


    // ------------------------------------------------------
    // Loading
    // ------------------------------------------------------

    grid.innerHTML = `
        <div class="service">
            <h3>Loading Services...</h3>

            <p>
                Please wait while our services are loading.
            </p>
        </div>
    `;


    // ------------------------------------------------------
    // Supabase check
    // ------------------------------------------------------

    if (!supabaseClient) {

        grid.innerHTML = `
            <div class="service">

                <h3>
                    Supabase Connection Required
                </h3>

                <p>
                    Please add your Supabase Publishable /
                    Anon Key in script.js.
                </p>

            </div>
        `;

        console.error(
            "MBSC: Supabase client not created."
        );

        return;

    }


    try {

        // --------------------------------------------------
        // Fetch services
        // --------------------------------------------------

        const {
            data,
            error
        } = await supabaseClient

            .from("services")

            .select("*");


        // --------------------------------------------------
        // Error
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
                            "Supabase error."
                        )}
                    </p>

                </div>
            `;

            return;

        }


        // --------------------------------------------------
        // Empty table
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
                        Services table is empty in Supabase.
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
        // Clear loading
        // --------------------------------------------------

        grid.innerHTML = "";


        // --------------------------------------------------
        // Separate Loans
        // --------------------------------------------------

        const normalServices = [];


        let loansFound = false;


        data.forEach(
            function(service) {

                const name =
                    getServiceName(service);


                if (
                    name
                        .trim()
                        .toLowerCase() ===
                    "loans"
                ) {

                    loansFound = true;

                    createLoansDepartment(
                        service
                    );

                }

                else {

                    normalServices.push(
                        service
                    );

                }

            }
        );


        // --------------------------------------------------
        // If Loans department was not in Supabase
        // create it automatically
        // --------------------------------------------------

        if (!loansFound) {

            createLoansDepartment({

                name: "Loans",

                description:
                    "Multiple loan services available through MBSC SOLUTIONS.",

                documents: ""

            });

        }


        // --------------------------------------------------
        // Create normal services
        // --------------------------------------------------

        normalServices.forEach(
            function(service) {

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
                    Please refresh the website
                    and try again.
                </p>

            </div>
        `;

    }

}


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
// CREATE LOANS DEPARTMENT
// ==========================================================

function createLoansDepartment(service) {

    const article =
        document.createElement("article");


    article.className =
        "service loans-department";


    // ------------------------------------------------------
    // Title
    // ------------------------------------------------------

    const title =
        document.createElement("h3");


    title.textContent =
        "Loans";


    article.appendChild(
        title
    );


    // ------------------------------------------------------
    // Description
    // ------------------------------------------------------

    const description =
        document.createElement("p");


    description.textContent =
        "Choose the loan service you need.";


    article.appendChild(
        description
    );


    // ------------------------------------------------------
    // Main Button
    // ------------------------------------------------------

    const mainButton =
        document.createElement("button");


    mainButton.className =
        "service-button";


    mainButton.textContent =
        "View Loan Services";


    article.appendChild(
        mainButton
    );


    // ------------------------------------------------------
    // Loan List
    // ------------------------------------------------------

    const loanList =
        document.createElement("div");


    loanList.className =
        "loan-sub-services";


    loanList.style.display =
        "none";


    // ------------------------------------------------------
    // Create Loan Buttons
    // ------------------------------------------------------

    LOAN_SERVICES.forEach(
        function(loanName, index) {

            const button =
                document.createElement("button");


            button.type =
                "button";


            button.className =
                "sub-service-button";


            button.innerHTML = `
                <span class="sub-number">
                    ${index + 1}.
                </span>

                <span>
                    ${escapeHTML(loanName)}
                </span>
            `;


            button.addEventListener(
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
                button
            );

        }
    );


    article.appendChild(
        loanList
    );


    // ------------------------------------------------------
    // Open / Close
    // ------------------------------------------------------

    mainButton.addEventListener(
        "click",
        function() {

            const isHidden =
                loanList.style.display ===
                "none";


            if (isHidden) {

                loanList.style.display =
                    "flex";

                mainButton.textContent =
                    "Hide Loan Services";

            }

            else {

                loanList.style.display =
                    "none";

                mainButton.textContent =
                    "View Loan Services";

            }

        }
    );


    // ------------------------------------------------------
    // Loans WhatsApp
    // ------------------------------------------------------

    const whatsappButton =
        document.createElement("a");


    whatsappButton.className =
        "secondary";


    whatsappButton.href =
        whatsappLink(
            "Hello MBSC SOLUTIONS, I need details about Loans."
        );


    whatsappButton.target =
        "_blank";


    whatsappButton.rel =
        "noopener noreferrer";


    whatsappButton.textContent =
        "WhatsApp for Loans";


    whatsappButton.style.marginTop =
        "10px";


    article.appendChild(
        whatsappButton
    );


    // ------------------------------------------------------
    // Add to grid
    // ------------------------------------------------------

    grid.appendChild(
        article
    );

}


// ==========================================================
// CREATE NORMAL SERVICE CARD
// ==========================================================

function createNormalServiceCard(service) {

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


    button.type =
        "button";


    button.textContent =
        "View & WhatsApp";


    // ------------------------------------------------------
    // Click
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
    // Add
    // ------------------------------------------------------

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

        console.error(
            "MBSC: documentBox not found."
        );

        return;

    }


    documentBox.innerHTML =
        "";


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
    // Requirements
    // ------------------------------------------------------

    const list =
        document.createElement("ul");


    list.className =
        "requirements-list";


    let documentItems =
        [];


    // Array
    if (
        Array.isArray(docs)
    ) {

        documentItems =
            docs;

    }


    // String
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
        documentItems.length ===
        0
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


    // ------------------------------------------------------
    // Scroll
    // ------------------------------------------------------

    const documentsSection =
        document.querySelector(
            ".documents"
        );


    if (documentsSection) {

        documentsSection.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

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
