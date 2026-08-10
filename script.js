// ==========================================================
// MBSC SOLUTIONS
// COMPLETE SCRIPT.JS
// SERVICES + DEPARTMENTS + SUB SERVICES + DOCUMENTS
// ==========================================================

console.log("======================================");
console.log("MBSC Solutions script.js loaded.");
console.log("======================================");


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

const WHATSAPP_NUMBER = "917093334820";


// ==========================================================
// GET ELEMENTS
// ==========================================================

function initializeElements() {

  departmentsContainer =
    document.getElementById(
      "departmentsContainer"
    );

  documentBox =
    document.getElementById(
      "documentBox"
    );

  console.log(
    "MBSC departmentsContainer:",
    departmentsContainer
  );

  console.log(
    "MBSC documentBox:",
    documentBox
  );
}


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

  if (!service) {
    return "Service";
  }

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

  if (!subService) {
    return "Service";
  }

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

  if (!item) {
    return "";
  }

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

  if (!service) {
    return "Click below to view service details.";
  }

  return (
    service.description ||
    service.details ||
    "Click below to view service details."
  );

}


// ==========================================================
// NORMALIZE SERVICE ID
// ==========================================================

function normalizeId(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  return String(value);

}


// ==========================================================
// LOAD SERVICES
// ==========================================================

async function loadServices() {

  console.log("");
  console.log("======================================");
  console.log("MBSC SOLUTIONS");
  console.log("Loading services...");
  console.log("======================================");


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

      showLoadingError(
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


    // ======================================================
    // LOAD SUB SERVICES
    // ======================================================

    const subServicesResult =
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


    if (subServicesResult.error) {

      console.error(
        "MBSC SUB SERVICES ERROR:",
        subServicesResult.error
      );

      showLoadingError(
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


    // ======================================================
    // CREATE SUB SERVICE MAP
    // ======================================================

    const subServiceMap = {};


    subServices.forEach(
      function(subService) {

        const serviceId =
          normalizeId(
            subService.service_id
          );


        if (!serviceId) {
          return;
        }


        if (
          !subServiceMap[serviceId]
        ) {

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
    // CREATE ALL DEPARTMENTS
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


    showLoadingError(
      "Please refresh the page and try again."
    );

  }

}


// ==========================================================
// SHOW LOADING ERROR
// ==========================================================

function showLoadingError(message) {

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
// CREATE DEPARTMENTS
// ==========================================================

function createDepartments(
  services,
  subServiceMap
) {

  console.log("");
  console.log(
    "MBSC: Creating departments..."
  );


  if (!departmentsContainer) {

    console.error(
      "MBSC ERROR: departmentsContainer missing."
    );

    return;
  }


  departmentsContainer.innerHTML = "";


  let departmentCount = 0;
  let normalServiceCount = 0;


  // ========================================================
  // LOOP THROUGH ALL SERVICES
  // ========================================================

  services.forEach(
    function(service) {

      const serviceId =
        normalizeId(
          service.id
        );


      const serviceSubServices =
        serviceId &&
        subServiceMap[serviceId]
          ? subServiceMap[serviceId]
          : [];


      console.log(
        "MBSC SERVICE:",
        getServiceName(service),
        "ID:",
        serviceId,
        "SUB SERVICES:",
        serviceSubServices
      );


      // ====================================================
      // HAS SUB SERVICES
      // ====================================================

      if (
        serviceSubServices.length > 0
      ) {

        createDepartmentCard(
          service,
          serviceSubServices
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


  console.log("");
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
    document.createElement(
      "article"
    );


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
    document.createElement(
      "div"
    );


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
    document.createElement(
      "button"
    );


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
    document.createElement(
      "div"
    );


  subContainer.className =
    "loan-sub-services";


  // ========================================================
  // CREATE SUB SERVICE BUTTONS
  // ========================================================

  subServices.forEach(
    function(
      subService,
      index
    ) {

      const subName =
        getSubServiceName(
          subService
        );


      const documents =
        getDocuments(
          subService
        );


      const subButton =
        document.createElement(
          "button"
        );


      subButton.className =
        "loan-sub-button";


      subButton.type =
        "button";


      subButton.innerHTML = `

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

      subButton.addEventListener(
        "click",
        function(event) {

          event.preventDefault();

          showServiceDocuments(
            subName,
            documents
          );

        }
      );


      subContainer.appendChild(
        subButton
      );

    }
  );


  // ========================================================
  // WHATSAPP
  // ========================================================

  const whatsappButton =
    document.createElement(
      "a"
    );


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
  // ADD SUB SERVICES
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
  // ADD DEPARTMENT TO PAGE
  // ========================================================

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
    document.createElement(
      "article"
    );


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
    document.createElement(
      "button"
    );


  button.className =
    "service-button";


  button.type =
    "button";


  button.textContent =
    "View & WhatsApp";


  button.addEventListener(
    "click",
    function(event) {

      event.preventDefault();

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
      docs
        .map(
          function(item) {

            return String(item)
              .trim();

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
      document.createElement(
        "li"
      );


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
          document.createElement(
            "li"
          );


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
  // WHATSAPP BUTTON
  // ========================================================

  const whatsappButton =
    document.createElement(
      "a"
    );


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
// HERO VIDEO
// ==========================================================

function setupHeroVideo() {

  const video =
    document.querySelector(
      ".hero-video"
    );


  if (!video) {

    console.log(
      "MBSC: Hero video not found."
    );

    return;
  }


  video.muted =
    true;


  video.setAttribute(
    "muted",
    ""
  );


  video.setAttribute(
    "playsinline",
    ""
  );


  video.setAttribute(
    "autoplay",
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

    console.log("");
    console.log(
      "======================================"
    );

    console.log(
      "MBSC SOLUTIONS PAGE LOADED"
    );

    console.log(
      "======================================"
    );


    initializeElements();

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
