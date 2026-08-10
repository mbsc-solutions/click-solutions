// ==========================================================
// MBSC SOLUTIONS
// COMPLETE SCRIPT.JS
// SERVICES + DEPARTMENTS + SUB SERVICES
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

let departmentsContainer = null;
let documentBox = null;

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
// GET DESCRIPTION
// ==========================================================

function getDescription(service) {

  return (
    service.description ||
    service.details ||
    "Click below to view service details."
  );

}


// ==========================================================
// SHOW ERROR
// ==========================================================

function showLoadError(message) {

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
// LOAD SERVICES
// ==========================================================

async function loadServices() {

  console.log("====================================");
  console.log("MBSC SOLUTIONS");
  console.log("Loading services...");
  console.log("====================================");


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

    // ======================================================
    // LOAD MAIN SERVICES
    // ======================================================

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

      showLoadError(
        servicesResult.error.message
      );

      return;
    }


    const services =
      servicesResult.data || [];


    console.log(
      "MBSC SERVICES:",
      services
    );


    console.log(
      "MBSC SERVICES COUNT:",
      services.length
    );


    // ======================================================
    // LOAD SUB SERVICES
    // ======================================================

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

      console.error(
        "MBSC SUB SERVICES ERROR:",
        subServicesResult.error
      );

      showLoadError(
        subServicesResult.error.message
      );

      return;
    }


    const subServices =
      subServicesResult.data || [];


    console.log(
      "MBSC SUB SERVICES:",
      subServices
    );


    console.log(
      "MBSC SUB SERVICES COUNT:",
      subServices.length
    );


    // ======================================================
    // CREATE SUB SERVICE MAP
    // ======================================================

    const subServiceMap = {};


    subServices.forEach(
      function(subService) {

        const serviceId =
          String(subService.service_id);


        if (!subServiceMap[serviceId]) {

          subServiceMap[serviceId] = [];

        }


        subServiceMap[serviceId].push(
          subService
        );

      }
    );


    console.log(
      "MBSC SUB SERVICE MAP:",
      subServiceMap
    );


    // ======================================================
    // CREATE DEPARTMENTS
    // ======================================================

    createDepartments(
      services,
      subServiceMap
    );


  }

  catch (error) {

    console.error(
      "MBSC UNEXPECTED ERROR:",
      error
    );


    showLoadError(
      "Please refresh the page and try again."
    );

  }

}


// ==========================================================
// CREATE DEPARTMENTS
// ==========================================================

function createDepartments(
  services,
  subServiceMap
) {

  console.log(
    "===================================="
  );

  console.log(
    "MBSC: Creating departments..."
  );

  console.log(
    "===================================="
  );


  departmentsContainer.innerHTML = "";


  let departmentCount = 0;
  let normalServiceCount = 0;


  // ========================================================
  // LOOP ALL SERVICES
  // ========================================================

  services.forEach(
    function(service) {

      const serviceId =
        String(service.id);


      const serviceName =
        getServiceName(service);


      const subServices =
        subServiceMap[serviceId] || [];


      console.log(
        "MBSC SERVICE:",
        serviceName,
        "ID:",
        serviceId,
        "SUB SERVICES:",
        subServices.length
      );


      // ====================================================
      // HAS SUB SERVICES
      // ====================================================

      if (
        subServices.length > 0
      ) {

        createDepartmentCard(
          service,
          subServices
        );


        departmentCount++;

      }


      // ====================================================
      // NO SUB SERVICES
      // ====================================================

      else {

        createNormalServiceCard(
          service
        );


        normalServiceCount++;

      }

    }
  );


  console.log(
    "MBSC: Departments created:",
    departmentCount
  );


  console.log(
    "MBSC: Normal services created:",
    normalServiceCount
  );


  console.log(
    "MBSC: Services successfully displayed."
  );

}


// ==========================================================
// CREATE DEPARTMENT CARD
// ==========================================================

function createDepartmentCard(
  service,
  subServices
) {

  const department =
    document.createElement("article");


  department.className =
    "loan-department";


  // ========================================================
  // SERVICE NAME
  // ========================================================

  const serviceName =
    getServiceName(service);


  // ========================================================
  // DESCRIPTION
  // ========================================================

  const description =
    getDescription(service);


  // ========================================================
  // HEADER
  // ========================================================

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


  // ========================================================
  // MAIN BUTTON
  // ========================================================

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


  // ========================================================
  // SUB SERVICE CONTAINER
  // ========================================================

  const subContainer =
    document.createElement("div");


  subContainer.className =
    "loan-sub-services";


  // ========================================================
  // CREATE SUB SERVICE BUTTONS
  // ========================================================

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


      // ====================================================
      // SUB SERVICE CLICK
      // ====================================================

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


  // ========================================================
  // WHATSAPP BUTTON
  // ========================================================

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


  // ========================================================
  // ADD SUB CONTAINER
  // ========================================================

  department.appendChild(
    subContainer
  );


  // ========================================================
  // TOGGLE
  // ========================================================

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


  // ========================================================
  // ADD TO PAGE
  // ========================================================

  departmentsContainer.appendChild(
    department
  );

}


// ==========================================================
// CREATE NORMAL SERVICE CARD
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
    getDescription(service);


  const documents =
    getDocuments(service);


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


  // ========================================================
  // BUTTON
  // ========================================================

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
        documents
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
// SHOW SERVICE DOCUMENTS
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


  // ========================================================
  // HEADING
  // ========================================================

  const heading =
    document.createElement("h3");


  heading.textContent =
    serviceName;


  documentBox.appendChild(
    heading
  );


  // ========================================================
  // DOCUMENT LIST
  // ========================================================

  const list =
    document.createElement("ul");


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
      docs
        .map(
          function(item) {

            return String(item).trim();

          }
        )
        .filter(Boolean);

  }


  // ========================================================
  // STRING
  // ========================================================

  else if (
    typeof docs === "string"
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
        .filter(Boolean);

  }


  // ========================================================
  // NO DOCUMENTS
  // ========================================================

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


  // ========================================================
  // DOCUMENTS
  // ========================================================

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


  // ========================================================
  // WHATSAPP
  // ========================================================

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


  // ========================================================
  // SCROLL TO DOCUMENTS
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
          "Hero video playing."
        );

      }
    )
    .catch(
      function(error) {

        console.log(
          "Hero video autoplay blocked:",
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
      "MBSC page loaded."
    );


    // ------------------------------------------------------
    // GET ELEMENTS AFTER DOM LOAD
    // ------------------------------------------------------

    departmentsContainer =
      document.getElementById(
        "departmentsContainer"
      );


    documentBox =
      document.getElementById(
        "documentBox"
      );


    console.log(
      "departmentsContainer:",
      departmentsContainer
    );


    console.log(
      "documentBox:",
      documentBox
    );


    // ------------------------------------------------------
    // HERO VIDEO
    // ------------------------------------------------------

    setupHeroVideo();


    // ------------------------------------------------------
    // LOAD SERVICES
    // ------------------------------------------------------

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
// END
// ==========================================================

console.log(
  "MBSC Solutions script.js loaded."
);
