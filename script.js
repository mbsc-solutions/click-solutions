const SUPABASE_URL = "https://whxlatxnqjpccwrmtmph.supabase.co";

const SUPABASE_KEY = "sb_publishable_wlqTaOkM3fML9cuUES54fw_8TlbSi-H";

const WHATSAPP_NUMBER = "917093334820";


// ===============================
// LOAD SERVICES FROM SUPABASE
// ===============================

async function loadServices() {

    try {

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/services?select=*&order=sort_order.asc`,
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

            const errorText = await response.text();

            console.error("Supabase Error:", errorText);

            return [];

        }

        const services = await response.json();

        console.log("Services loaded:", services);

        return services;

    } catch (error) {

        console.error("Connection Error:", error);

        return [];

    }
}


// ===============================
// SHOW REQUIREMENTS
// ===============================

function showDocs(service, docs) {

    const box = document.getElementById("documentBox");

    const documentText = docs
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
            ${service}
        </h3>

        <ul>
            ${docs.map(d => `
                <li>${d}</li>
            `).join("")}
        </ul>

        <a
            class="primary"
            target="_blank"
            rel="noopener noreferrer"
            href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}"
        >
            WhatsApp for ${service}
        </a>
    `;

    box.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// ===============================
// START
// ===============================

loadServices();
