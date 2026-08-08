const SUPABASE_URL = "https://whxlatxnqjpccwrmtmph.supabase.co";
const SUPABASE_KEY = "sb_publishable_wlqTaOkM3fML9cuUES54fw_8TlbSi-H";
const WHATSAPP_NUMBER = "917093334820";


// ==========================================
// OLD INDIVIDUAL LOAN SERVICE NAMES
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
// KNOWN DOCUMENT NAMES
// Used when Supabase documents have no commas
// ==========================================

const DOCUMENT_NAMES = [
    "Aadhaar Card",
    "PAN Card",
    "Address Proof",
    "Bank Statement",
    "Business / Agriculture Proof",
    "Income Proof",
    "Land Documents",
    "Tractor Quotation",
    "Gold Loan Documents",
    "Property Documents",
    "ITR Documents",
    "ITR",
    "GST Certificate",
    "Business Proof",
    "Salary Slips",
    "Bank Passbook",
    "Vehicle RC",
    "Driving License",
    "Insurance Documents",
    "Passport Size Photo",
    "Photographs",
    "Employment Proof",
    "Salary Certificate",
    "Form 16",
    "Loan Statement",
    "Vehicle Quotation",
    "Home Documents",
    "Property Proof"
];


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

        console.error(
            `Supabase ${table} Error:`,
            error
        );

        throw new Error(error);
    }

    return await response.json();
}


// ==========================================
// LOAD WEBSITE SERVICES
// ==========================================

async function loadWebsiteServices() {

    const grid =
        document.querySelector(".grid");

    if (!grid) return;

    try {

        // ==================================
        // GET SERVICES
        // ==================================

        const services =
            await supabaseGet(
                "services",
                "?select=*&order=sort_order.asc"
            );


        // ==================================
        // GET SUB SERVICES
        // ==================================

        const subServices =
            await supabaseGet(
                "sub_services",
                "?select=*&order=sort_order.asc"
            );


        // ==================================
        // GET SUB SERVICE ITEMS
        // ==================================

        const subServiceItems =
            await supabaseGet(
                "sub_service_items",
                "?select=*&order=sort_order.asc"
            );


        console.log(
            "SERVICES:",
            services
        );

        console.log(
            "SUB SERVICES:",
            subServices
        );

        console.log(
            "SUB SERVICE ITEMS:",
            subServiceItems
        );


        // ==================================
        // FIND LOANS MAIN SERVICE
        // ==================================

        const loansService =
            services.find(
                service =>
                    String(
                        service.service_name || ""
                    )
                    .trim()
                    .toLowerCase() === "loans"
            );


        // ==================================
        // FILTER MAIN SERVICES
        // Hide old individual loan cards
        // ==================================

        const displayServices =
            services.filter(
                service => {

                    const name =
                        String(
                            service.service_name || ""
                        ).trim();


                    if (
                        LOAN_NAMES.includes(name)
                    ) {
                        return false;
                    }


                    return true;
                }
            );


        // ==================================
        // ADD LOANS MAIN SERVICE
        // ==================================

        if (
            loansService &&
            !displayServices.some(
                service =>
                    Number(service.id) ===
                    Number(loansService.id)
            )
        ) {

            displayServices.push(
                loansService
            );
        }


        // ==================================
        // SORT MAIN SERVICES
        // ==================================

        displayServices.sort(
            (a, b) =>
                Number(a.sort_order || 0) -
                Number(b.sort_order || 0)
        );


        // ==================================
        // CLEAR WEBSITE
        // ==================================

        grid.innerHTML = "";


        // ==================================
        // CREATE MAIN SERVICE CARDS
        // ==================================

        displayServices.forEach(
            service => {

                const serviceId =
                    service.id;


                const serviceName =
                    service.service_name ||
                    "Service";


                // ==================================
                // FIND SUB SERVICES
                // ==================================

                const children =
                    subServices
                        .filter(
                            sub =>
                                Number(
                                    sub.service_id
                                ) ===
                                Number(
                                    serviceId
                                )
                        )
                        .sort(
                            (a, b) =>
                                Number(
                                    a.sort_order || 0
                                ) -
                                Number(
                                    b.sort_order || 0
                                )
                        );


                // ==================================
                // CREATE ARTICLE
                // ==================================

                const article =
                    document.createElement(
                        "article"
                    );

                article.className =
                    "service";


                // ==================================
                // MAIN SERVICE HTML
                // ==================================

                article.innerHTML = `

                    <h3>
                        ${escapeHTML(
                            serviceName
                        )}
                    </h3>

                    <p>
                        Click below to view available services.
                    </p>

                    <button
                        type="button"
                        class="service-button"
                    >
                        ${
                            children.length > 0
                                ? "View Services"
                                : "View & WhatsApp"
                        }
                    </button>

                    <div
                        class="sub-service-list"
                    ></div>

                `;


                grid.appendChild(
                    article
                );


                // ==================================
                // GET BUTTON
                // ==================================

                const button =
                    article.querySelector(
                        ".service-button"
                    );


                // ==================================
                // GET SUB LIST
                // ==================================

                const subList =
                    article.querySelector(
                        ".sub-service-list"
                    );


                // ==================================
                // HAS SUB SERVICES
                // ==================================

                if (
                    children.length > 0
                ) {

                    button.addEventListener(
                        "click",
                        () => {

                            const isOpen =
                                subList.classList.contains(
                                    "show"
                                );


                            // ==================================
                            // CLOSE
                            // ==================================

                            if (isOpen) {

                                subList.classList.remove(
                                    "show"
                                );

                                button.textContent =
                                    "View Services";

                                subList.innerHTML =
                                    "";

                                return;
                            }


                            // ==================================
                            // OPEN
                            // ==================================

                            subList.classList.add(
                                "show"
                            );

                            button.textContent =
                                "Hide Services";


                            // ==================================
                            // FORCE DISPLAY
                            // ==================================

                            subList.style.display =
                                "block";

                            subList.style.height =
                                "auto";

                            subList.style.maxHeight =
                                "none";

                            subList.style.overflow =
                                "visible";

                            subList.style.visibility =
                                "visible";


                            // ==================================
                            // CREATE SUB SERVICES
                            // ==================================

                            subList.innerHTML = `

                                <div
                                    class="loan-sub-services"
                                >

                                    ${children.map(
                                        (sub, index) => `

                                            <button
                                                type="button"
                                                class="sub-service-button"
                                                data-sub-id="${sub.id}"
                                            >

                                                <span
                                                    class="sub-number"
                                                >
                                                    ${index + 1}.
                                                </span>

                                                <span>
                                                    ${escapeHTML(
                                                        sub.sub_service_name ||
                                                        "Sub Service"
                                                    )}
                                                </span>

                                            </button>

                                        `
                                    ).join("")}

                                </div>

                            `;


                            // ==================================
                            // GET SUB BUTTONS
                            // ==================================

                            const subButtons =
                                subList.querySelectorAll(
                                    ".sub-service-button"
                                );


                            // ==================================
                            // SUB SERVICE CLICK
                            // ==================================

                            subButtons.forEach(
                                subButton => {

                                    subButton.addEventListener(
                                        "click",
                                        () => {

                                            const subId =
                                                Number(
                                                    subButton.dataset.subId
                                                );


                                            const selectedSub =
                                                children.find(
                                                    sub =>
                                                        Number(
                                                            sub.id
                                                        ) ===
                                                        subId
                                                );


                                            if (
                                                !selectedSub
                                            ) {
                                                return;
                                            }


                                            showSubService(
                                                service,
                                                selectedSub,
                                                subServiceItems
                                            );

                                        }
                                    );

                                }
                            );

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

            }
        );

    }


    // ==================================
    // ERROR
    // ==================================

    catch (error) {

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


    // ==================================
    // FIND ITEMS
    // ==================================

    const items =
        subServiceItems
            .filter(
                item =>
                    Number(
                        item.sub_service_id
                    ) ===
                    Number(
                        subService.id
                    )
            )
            .sort(
                (a, b) =>
                    Number(
                        a.sort_order || 0
                    ) -
                    Number(
                        b.sort_order || 0
                    )
            );


    // ==================================
    // ITEMS EXIST
    // ==================================

    if (
        items.length > 0
    ) {

        showItems(
            serviceName,
            subService,
            items
        );

        return;
    }


    // ==================================
    // NO ITEMS
    // ==================================

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
            ${escapeHTML(
                serviceName
            )}
        </p>

        <h3>
            ${escapeHTML(
                subName
            )}
        </h3>

        <ul class="item-list">

            ${items.map(
                item => `

                    <li>

                        <button
                            type="button"
                            class="item-button"
                            data-item-id="${item.id}"
                        >

                            ${escapeHTML(
                                item.item_name
                            )}

                        </button>

                    </li>

                `
            ).join("")}

        </ul>

        <p>
            Select an item above to view requirements.
        </p>

    `;


    // ==================================
    // ITEM BUTTONS
    // ==================================

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


                    if (
                        !selectedItem
                    ) {
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


    // ==================================
    // SCROLL
    // ==================================

    box.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// ==========================================
// GET DOCUMENTS
// ==========================================

function getDocuments(
    documents
) {

    // ==================================
    // EMPTY
    // ==================================

    if (
        documents === null ||
        documents === undefined ||
        documents === ""
    ) {

        return [
            "Please contact MBSC SOLUTIONS for requirements"
        ];
    }


    // ==================================
    // ARRAY
    // ==================================

    if (
        Array.isArray(documents)
    ) {

        return documents
            .flatMap(
                item =>
                    String(item)
                        .split(/[,\n]+/)
                        .map(
                            x =>
                                x.trim()
                        )
            )
            .filter(
                Boolean
            );
    }


    // ==================================
    // STRING
    // ==================================

    if (
        typeof documents === "string"
    ) {

        const text =
            documents.trim();


        // ==================================
        // COMMA / NEW LINE
        // ==================================

        if (
            text.includes(",") ||
            text.includes("\n")
        ) {

            return text
                .split(/[,\n]+/)
                .map(
                    item =>
                        item.trim()
                )
                .filter(
                    Boolean
                );
        }


        // ==================================
        // NO COMMA
        // Detect known document names
        // ==================================

        const sortedNames =
            [...DOCUMENT_NAMES]
                .sort(
                    (a, b) =>
                        b.length -
                        a.length
                );


        let result = [];


        let remainingText =
            text;


        // ==================================
        // FIND DOCUMENTS IN ORIGINAL ORDER
        // ==================================

        while (
            remainingText.length > 0
        ) {

            remainingText =
                remainingText.trim();


            if (
                !remainingText
            ) {
                break;
            }


            let foundName =
                null;


            let foundIndex =
                Infinity;


            sortedNames.forEach(
                name => {

                    const index =
                        remainingText
                            .toLowerCase()
                            .indexOf(
                                name.toLowerCase()
                            );


                    if (
                        index !== -1 &&
                        index < foundIndex
                    ) {

                        foundIndex =
                            index;

                        foundName =
                            name;
                    }

                }
            );


            // ==================================
            // FOUND DOCUMENT
            // ==================================

            if (
                foundName !== null
            ) {

                // Text before known document
                if (
                    foundIndex > 0
                ) {

                    const beforeText =
                        remainingText
                            .substring(
                                0,
                                foundIndex
                            )
                            .trim();


                    if (
                        beforeText
                    ) {

                        result.push(
                            beforeText
                        );
                    }
                }


                // Add known document
                result.push(
                    foundName
                );


                // Remove processed part
                remainingText =
                    remainingText.substring(
                        foundIndex +
                        foundName.length
                    );

            }


            // ==================================
            // NO DOCUMENT FOUND
            // ==================================

            else {

                result.push(
                    remainingText.trim()
                );

                break;
            }
        }


        // ==================================
        // REMOVE DUPLICATES
        // ==================================

        result =
            result.filter(
                (item, index, array) =>
                    item &&
                    array.findIndex(
                        x =>
                            x.toLowerCase() ===
                            item.toLowerCase()
                    ) === index
            );


        if (
            result.length > 0
        ) {

            return result;
        }
    }


    // ==================================
    // DEFAULT
    // ==================================

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


    // ==================================
    // MAKE ARRAY
    // ==================================

    const documentList =
        Array.isArray(
            docs
        )
            ? docs
            : getDocuments(
                docs
            );


    // ==================================
    // WHATSAPP MESSAGE
    // ==================================

    const message =
        `*MBSC SOLUTIONS*

*I need this – ${service}*

*Required Documents:*
${documentList
    .map(
        d =>
            `• ${d}`
    )
    .join("\n")}`;


    // ==================================
    // DISPLAY DOCUMENTS
    // ==================================

    box.innerHTML = `

        <p class="eyebrow">
            REQUIREMENTS
        </p>

        <h3>
            ${escapeHTML(
                service
            )}
        </h3>


        <div
            class="requirements-list"
            style="
                margin: 20px 0;
                width: 100%;
            "
        >

            ${documentList.map(
                d => `

                    <div
                        class="requirement-item"
                        style="
                            display: flex;
                            align-items: flex-start;
                            gap: 12px;
                            margin-bottom: 10px;
                            line-height: 1.5;
                        "
                    >

                        <span
                            class="bullet"
                            style="
                                display: block;
                                min-width: 10px;
                                font-size: 20px;
                                line-height: 1.4;
                            "
                        >
                            •
                        </span>

                        <span
                            class="requirement-text"
                            style="
                                display: block;
                                flex: 1;
                            "
                        >
                            ${escapeHTML(
                                d
                            )}
                        </span>

                    </div>

                `
            ).join("")}

        </div>


        <a
            class="primary"
            target="_blank"
            rel="noopener noreferrer"
            href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}"
        >
            WhatsApp for ${escapeHTML(
                service
            )}
        </a>

    `;


    // ==================================
    // SCROLL
    // ==================================

    box.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(
        value
    )
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

        console.log(
            "MBSC NEW SCRIPT LOADED"
        );

        loadWebsiteServices();

    }
);
