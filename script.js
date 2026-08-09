// ==========================================================
// MBSC SOLUTIONS - SERVICES SCRIPT
// ==========================================================


// ==========================================================
// SUPABASE CONFIG
// ==========================================================

const SUPABASE_URL = "YOUR_SUPABASE_URL";

const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";


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
// LOAD SERVICES
// ==========================================================

async function loadServices() {

  if (!grid) {

    console.error(
      "servicesGrid not found in index.html"
    );

    return;

  }


  grid.innerHTML = `
    
    <div class="service">

      <h3>
        Loading Services...
      </h3>

      <p>
        Please wait...
      </p>

    </div>

  `;


  try {

    const result =
      await supabaseClient
        .from("services")
        .select("*")
        .order("id", {
          ascending: true
        });


    const data =
      result.data;

    const error =
      result.error;


    // ======================================================
    // ERROR
    // ======================================================

    if (error) {

      console.error(
        "SUPABASE ERROR:",
        error
      );


      grid.innerHTML = `

        <div class="service">

          <h3>
            Services could not be loaded
          </h3>

          <p>
            Supabase connection error.
            Please check your Supabase URL and key.
          </p>

        </div>

      `;

      return;

    }


    // ======================================================
    // NO DATA
    // ======================================================

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
            Please add services to the Supabase
            services table.
          </p>

        </div>

      `;

      return;

    }


    // ======================================================
    // CLEAR LOADING
    // ======================================================

    grid.innerHTML = "";


    // ======================================================
    // CREATE CARDS
    // ======================================================

    data.forEach(
      function(service) {

        createServiceCard(
          service
        );

      }
    );


  }

  catch (error) {

    console.error(
      "Unexpected error:",
      error
    );


    grid.innerHTML = `

      <div class="service">

        <h3>
          Error Loading Services
        </h3>

        <p>
          Please check your website settings.
        </p>

      </div>

    `;

  }

}


// ==========================================================
// CREATE SERVICE CARD
// ==========================================================

function createServiceCard(service) {


  const article =
    document.createElement(
      "article"
    );


  article.className =
    "service";


  // ========================================================
  // SERVICE NAME
  // ========================================================

  const serviceName =

    service.name ||

    service.service_name ||

    service.title ||

    "Service";


  // ========================================================
  // DESCRIPTION
  // ========================================================

  const description =

    service.description ||

    service.details ||

    "Click below for service details.";


  // ========================================================
  // DOCUMENTS
  // ========================================================

  const documents =

    service.documents ||

    service.requirements ||

    service.docs ||

    "";


  // ========================================================
  // TITLE
  // ========================================================

  const title =
    document.createElement(
      "h3"
    );


  title.textContent =
    serviceName;


  // ========================================================
  // DESCRIPTION
  // ========================================================

  const desc =
    document.createElement(
      "p"
    );


  desc.textContent =
    description;


  // ========================================================
  // BUTTON
  // ========================================================

  const button =
    document.createElement(
      "button"
    );


  button.className =
    "service-button";


  button.textContent =
    "View & WhatsApp";


  // ========================================================
  // BUTTON CLICK
  // ========================================================

  button.addEventListener(
    "click",
    function() {

      showServiceDocuments(
        serviceName,
        documents
      );

    }
  );


  // ========================================================
  // ADD TO CARD
  // ========================================================

  article.appendChild(
    title
  );


  article.appendChild(
    desc
  );


  article.appendChild(
    button
  );


  // ========================================================
  // ADD CARD TO GRID
  // ========================================================

  grid.appendChild(
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
    return;
  }


  documentBox.innerHTML = "";


  // ========================================================
  // HEADING
  // ========================================================

  const heading =
    document.createElement(
      "h3"
    );


  heading.textContent =
    serviceName;


  documentBox.appendChild(
    heading
  );


  // ========================================================
  // DOCUMENT LIST
  // ========================================================

  const list =
    document.createElement(
      "ul"
    );


  list.className =
    "requirements-list";


  let documentItems = [];


  // ========================================================
  // ARRAY
  // ========================================================

  if (
    Array.isArray(docs)
  ) {

    documentItems =
      docs;

  }


  // ========================================================
  // STRING
  // ========================================================

  else if (
    typeof docs === "string"
  ) {

    documentItems =
      docs
        .split(/\r?\n|,|;/)
        .map(
          item =>
            item.trim()
        )
        .filter(Boolean);

  }


  // ========================================================
  // EMPTY DOCUMENTS
  // ========================================================

  if (
    documentItems.length === 0
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


  // ========================================================
  // DOCUMENTS
  // ========================================================

  else {

    documentItems.forEach(
      function(itemText) {

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


  // ========================================================
  // WHATSAPP
  // ========================================================

  const button =
    document.createElement(
      "a"
    );


  button.className =
    "primary";


  button.href =
    whatsappLink(
      "Hello MBSC SOLUTIONS, I need details about " +
      serviceName +
      "."
    );


  button.target =
    "_blank";


  button.rel =
    "noopener noreferrer";


  button.textContent =
    "Message on WhatsApp";


  documentBox.appendChild(
    button
  );


  // ========================================================
  // SCROLL
  // ========================================================

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

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadServices();

  }
);
