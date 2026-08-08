const SUPABASE_URL = "https://whxlatxnqjpccwrmtmph.supabase.co";

const SUPABASE_KEY = "YOUR_PUBLISHABLE_KEY_HERE";

const WHATSAPP_NUMBER = "917093334820";


async function loadServices() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/services?select=*&order=sort_order.asc`,
            {
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to load services");
        }

        const services = await response.json();

        console.log("Services loaded:", services);

        return services;

    } catch (error) {
        console.error("Supabase error:", error);
        return [];
    }
}


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
        <p class="eyebrow">REQUIREMENTS</p>

        <h3>${service}</h3>

        <ul>
            ${docs.map(d => `<li>${d}</li>`).join("")}
        </ul>

        <a
            class="primary"
            target="_blank"
            rel="noopener noreferrer"
            href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}">
            WhatsApp for ${service}
        </a>
    `;

    box.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


loadServices();
