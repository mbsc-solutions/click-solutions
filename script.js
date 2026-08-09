// ==========================================================
// MBSC SOLUTIONS - DEPARTMENT + SUB SERVICES
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
// ELEMENTS
// ==========================================================

const grid =
    document.getElementById("servicesGrid");

const documentBox =
    document.getElementById("documentBox");


// ==========================================================
// WHATSAPP
// ==========================================================

const WHATSAPP_NUMBER = "917093334820";

function whatsappLink(message) {
    return (
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message)
    );
}


// ==========================================================
// SERVICE NAME
// ==========================================================

function serviceName(service) {

    return (
        service.name ||
        service.service_name ||
        service.title ||
        service.service ||
        "Service"
    );

}


// ==========================================================
// DESCRIPTION
// ==========================================================

function serviceDescription(service) {

    return (
        service.description ||
        service.details ||
        service.content ||
        "Click below to view service details."
    );

}


// ==========================================================
// DOCUMENTS
// ==========================================================

function serviceDocuments(service) {

    return (
        service.documents ||
        service.requirements ||
        service.docs ||
        ""
    );

}


// ==========================================================
// FIND PARENT / DEPARTMENT
// ==========================================================

function getParentName(service) {

    return (
        service.parent_name ||
        service.parent_service ||
        service.department ||
        service.category ||
        service.parent ||
        service.department_name ||
        ""
    );

}


// ==========================================================
// CHECK WHETHER ROW IS A SUB-SERVICE
// ==========================================================

function isSubService(service) {

    const parent =
        getParentName(service);

    return (
        parent !== null &&
        String(parent).trim() !== ""
    );

}


// ==========================================================
// LOAD SERVICES
// ==========================================================

async function loadServices() {

    if (!grid) {
        console.error(
            "MBSC: servicesGrid not found."
        );
        return;
    }


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
            .select("*")
            .order("id", {
                ascending: true
            });


        // ==================================================
        // ERROR
        // ==================================================

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
                            "Supabase error"
                        )}
                    </p>
                </div>
            `;

            return;
        }


        // ==================================================
        // EMPTY
        // ==================================================

        if (!data || data.length === 0) {

            grid.innerHTML = `
                <div class="service">
                    <h3>No Services Found</h3>

                    <p>
                        Services table lo data ledu.
                    </p>
                </div>
            `;

            return;
        }


        console.log(
            "MBSC: Services from Supabase",
            data
        );


        grid.innerHTML = "";


        // ==================================================
        // GROUP SERVICES
        // ==================================================

        const departments = [];
        const departmentMap = new Map();


        data.forEach(function(service) {

            const name =
                serviceName(service).trim();


            const parent =
                getParentName(service).trim();


            // ----------------------------------------------
            // SUB SERVICE
            // ----------------------------------------------

            if (parent !== "") {

                if (!departmentMap.has(parent)) {

                    const department = {
                        name: parent,
                        service: null,
                        children: []
                    };

                    departmentMap.set(
                        parent,
                        department
                    );

                    departments.push(
                        department
                    );
                }


                departmentMap
                    .get(parent)
                    .children
                    .push(service);


                return;
            }


            // ----------------------------------------------
            // MAIN DEPARTMENT
            // ----------------------------------------------

            if (!departmentMap.has(name)) {

                const department = {
                    name: name,
                    service: service,
                    children: []
                };

                departmentMap.set(
                    name,
                    department
                );

                departments.push(
                    department
                );

            }

            else {

                departmentMap
                    .get(name)
                    .service = service;

            }

        });


        // ==================================================
        // CREATE DEPARTMENT CARDS
        // ==================================================

        departments.forEach(
            function(department) {

                createDepartmentCard(
                    department
                );

            }
        );


        console.log(
            "MBSC: Departments displayed",
            departments
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
// CREATE DEPARTMENT CARD
// ==========================================================

function createDepartmentCard(department) {

    const article =
        document.createElement("article");

    article.className =
        "service department-card";


    // ======================================================
    // TITLE
    // ======================================================

    const title =
        document.createElement("h3");

    title.textContent =
        department.name;


    // ======================================================
    // DESCRIPTION
    // ======================================================

    const description =
        document.createElement("p");

    if (department.service) {

        description.textContent =
            serviceDescription(
                department.service
            );

    }

    else {

        description.textContent =
            "Choose a service below.";

    }


    // ======================================================
    // MAIN BUTTON
    // ======================================================

    const mainButton =
        document.createElement("button");

    mainButton.type =
        "button";

    mainButton.className =
        "service-button";


    // ======================================================
    // HAS SUB SERVICES
    // ======================================================

    if (
        department.children &&
        department.children.length > 0
    ) {

        mainButton.textContent =
            "View Services";

    }

    else {

        mainButton.textContent =
            "View & WhatsApp";

    }


    // ======================================================
    // SUB SERVICE LIST
    // ======================================================

    const subList =
        document.createElement("div");

    subList.className =
        "loan-sub-services";


    subList.style.display =
        "none";


    // ======================================================
    // CREATE SUB SERVICES
    // ======================================================

    if (
        department.children &&
        department.children.length > 0
    ) {

        department.children.forEach(
            function(child, index) {

                const childButton =
                    document.createElement("button");


                childButton.type =
                    "button";


                childButton.className =
                    "sub-service-button";


                childButton.innerHTML = `
                    <span class="sub-number">
                        ${index + 1}.
                    </span>

                    <span>
                        ${escapeHTML(
                            serviceName(child)
                        )}
                    </span>
                `;


                childButton.addEventListener(
                    "click",
                    function() {

                        showServiceDocuments(
                            serviceName(child),
                            serviceDocuments(child),
                            child
                        );

                    }
                );


                subList.appendChild(
                    childButton
                );

            }
        );


        // ----------------------------------------------
        // OPEN / CLOSE SUB SERVICES
        // ----------------------------------------------

        mainButton.addEventListener(
            "click",
            function() {

                if (
                    subList.style.display ===
                    "none"
                ) {

                    subList.style.display =
                        "flex";

                    mainButton.textContent =
                        "Hide Services";

                }

                else {

                    subList.style.display =
                        "none";

                    mainButton.textContent =
                        "View Services";

                }

            }
        );

    }

    else {

        // ==================================================
        // NORMAL DEPARTMENT
        // ==================================================

        mainButton.addEventListener(
            "click",
            function() {

                if (department.service) {

                    showServiceDocuments(
                        department.name,
                        serviceDocuments(
                            department.service
                        ),
                        department.service
                    );

                }

                else {

                    showServiceDocuments(
                        department.name,
                        "",
                        {}
                    );

                }

            }
        );

    }


    // ======================================================
    // ADD ELEMENTS
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
        subList
    );


    // ======================================================
    // ADD CARD
    // ======================================================

    grid.appendChild(
        article
    );

}


// ==========================================================
// SHOW DOCUMENTS
// ==========================================================

function showServiceDocuments(
    name,
    docs,
    service
) {

    if (!documentBox) {
        return;
    }


    documentBox.innerHTML =
        "";


    // ======================================================
    // HEADING
    // ======================================================

    const heading =
        document.createElement("h3");

    heading.textContent =
        name;


    documentBox.appendChild(
        heading
    );


    // ======================================================
    // DOCUMENT LIST
    // ======================================================

    const list =
        document.createElement("ul");

    list.className =
        "requirements-list";


    let items = [];


    // ARRAY

    if (
        Array.isArray(docs)
    ) {

        items = docs;

    }


    // STRING

    else if (
        typeof docs === "string"
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


    // ======================================================
    // NO DOCUMENTS
    // ======================================================

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


    // ======================================================
    // DOCUMENTS
    // ======================================================

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


    // ======================================================
    // WHATSAPP
    // ======================================================

    const whatsapp =
        document.createElement("a");

    whatsapp.className =
        "primary";

    whatsapp.href =
        whatsappLink(
            "Hello MBSC SOLUTIONS, I need details about " +
            name +
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

    const documents =
        document.querySelector(
            ".documents"
        );


    if (documents) {

        documents.scrollIntoView({
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

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        loadServices
    );

}

else {

    loadServices();

}
