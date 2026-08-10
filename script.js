// ==========================================================
// MBSC SOLUTIONS
// COMPLETE SCRIPT.JS
// SERVICES + SUB SERVICES + SUB SERVICE ITEMS
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
// GLOBAL
// ==========================================================

const departmentsContainer =
  document.getElementById("departmentsContainer");

const documentBox =
  document.getElementById("documentBox");

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
// SERVICE NAME
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
// SUB SERVICE NAME
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
// DOCUMENTS
// ==========================================================

function getDocuments(row) {

  return (
    row.documents ||
    row.requirements ||
    row.docs ||
    ""
  );

}


// ==========================================================
// DESCRIPTION
// ==========================================================

function getDescription(row) {

  return (
    row.description ||
    row.details ||
    "Click below to view service details."
  );

}


// ==========================================================
// NORMALIZE DOCUMENTS
// ==========================================================

function normalizeDocuments(docs) {

  if (Array.isArray(docs)) {

    return docs
      .map(function(item) {
        return String(item).trim();
      })
      .filter(Boolean);

  }


  if (typeof docs === "string") {

    return docs
      .split(/\r?\n|,|;/)
      .map(function(item) {
        return item.trim();
      })
      .filter(Boolean);

  }


  return [];

}


// ==========================================================
// LOAD ALL DATA
// ==========================================================

async function loadServices() {

  console.log(
    "================================="
  );

  console.log(
    "MBSC SOLUTIONS"
  );

  console.log(
    "Loading services..."
  );

  console.log(
    "================================="
  );


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
    // GET SERVICES
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

      throw servicesResult.error;

    }


    const services =
      servicesResult.data || [];


    console.log(
      "MBSC SERVICES:",
      services
    );


    // ======================================================
    // GET SUB SERVICES
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

      throw subServicesResult.error;

    }


    const subServices =
      subServicesResult.data || [];


    console.log(
      "MBSC SUB SERVICES:",
      subServices
    );


    // ======================================================
    // GET SUB SERVICE ITEMS
    // ======================================================

    let subServiceItems = [];


    const itemsResult =
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


    if (itemsResult.error) {

      console.warn(
        "MBSC: sub_service_items could not be loaded:",
        itemsResult.error
      );

    }

    else {

      subServiceItems =
        itemsResult.data || [];

    }


    console.log(
      "MBSC SUB SERVICE ITEMS:",
      subServiceItems
    );


    // ======================================================
    // CREATE MAP
    // ======================================================

    const subServiceMap = {};


    subServices.forEach(
      function(subService) {

        const serviceId =
          Number(subService.service_id);


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
    // CREATE ITEM MAP
    // ======================================================

    const subServiceItemMap = {};


    subServiceItems.forEach(
      function(item) {

        const possibleId =
          Number(
            item.sub_service_id ||
            item.subservice_id
          );


        if (!possibleId) {

          return;

        }


        if (!subServiceItemMap[possibleId]) {

          subServiceItemMap[possibleId] = [];

        }


        subServiceItemMap[possibleId].push(
          item
        );

      }
    );


    console.log(
      "MBSC SUB SERVICE ITEM MAP:",
      subServiceItemMap
    );


    // ======================================================
    // BUILD PAGE
    // ======================================================

    createDepartments(
      services,
      subServiceMap,
      subServiceItemMap
    );


  }

  catch (error) {

    console.error(
      "MBSC ERROR:",
      error
    );


    departmentsContainer.innerHTML = `

      <div class="error-box">

        <h3>
          Unable to Load Services
        </h3>

        <p>
          ${escapeHTML(
            error.message ||
            "Something went wrong."
          )}
        </p>

      </div>

    `;

  }

}


// ==========================================================
// CREATE DEPARTMENTS
// ==========================================================

function createDepartments(
  services,
  subServiceMap,
  subServiceItemMap
) {

  departmentsContainer.innerHTML = "";


  let departmentCount = 0;


  // ======================================================
  // EVERY SERVICE BECOMES A DEPARTMENT
  // ======================================================

  services.forEach(
    function(service) {

      const serviceId =
        Number(service.id);


      const subServices =
        subServiceMap[serviceId] || [];


      // ====================================================
      // IF SUB SERVICES EXIST
      // ====================================================

      if (subServices.length > 0) {

        createDepartmentCard(
          service,
          subServices,
          subServiceItemMap
        );

      }


      // ====================================================
      // NO SUB SERVICES
      // ====================================================

      else {

        createNormalServiceCard(
          service
        );

      }


      departmentCount++;

    }
  );


  console.log(
    "MBSC: Departments created successfully."
  );

  console.log(
    "MBSC Department count:",
    departmentCount
  );

}


// ==========================================================
// CREATE DEPARTMENT CARD
// ==========================================================

function createDepartmentCard(
  service,
  subServices,
  subServiceItemMap
) {

  const department =
    document.createElement("article");


  department.className =
    "loan-department";


  const serviceName =
    getServiceName(service);


  const description =
    getDescription(service);


  // ======================================================
  // HEADER
  // ======================================================

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


  // ======================================================
  // MAIN BUTTON
  // ======================================================

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


  // ======================================================
  // SUB SERVICE CONTAINER
  // ======================================================

  const subContainer =
    document.createElement("div");


  subContainer.className =
    "loan-sub-services";


  // ======================================================
  // SUB SERVICES
  // ======================================================

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


      const subServiceId =
        Number(subService.id);


      const items =
        subServiceItemMap[
          subServiceId
        ] || [];


      // ==================================================
      // SUB SERVICE BUTTON
      // ==================================================

      const button =
        document.createElement("button");


      button.className =
        "loan-sub-button";


      button.type =
        "button";


      button.innerHTML = `

        <span class="loan-number">
          ${index + 1}.
        </span>

        <span>
          ${escapeHTML(subName)}
        </span>

      `;


      // ==================================================
      // CLICK SUB SERVICE
      // ==================================================

      button.addEventListener(
        "click",
        function() {

          showSubServiceDetails(
            subName,
            documents,
            items
          );

        }
      );


      subContainer.appendChild(
        button
      );

    }
  );


  // ======================================================
  // WHATSAPP
  // ======================================================

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


  // ======================================================
  // ADD SUB CONTAINER
  // ======================================================

  department.appendChild(
    subContainer
  );


  // ======================================================
  // TOGGLE
  // ======================================================

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


  // ======================================================
  // ADD TO PAGE
  // ======================================================

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


  // ======================================================
  // BUTTON
  // ======================================================

  const button =
    document.createElement("button");


  button.className =
    "service-button";


  button.type =
    "button";


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
// SHOW SUB SERVICE DETAILS
// ==========================================================

function showSubServiceDetails(
  subName,
  documents,
  items
) {

  if (!documentBox) {

    console.error(
      "MBSC ERROR: documentBox not found."
    );

    return;

  }


  documentBox.innerHTML = "";


  // ======================================================
  // HEADING
  // ======================================================

  const heading =
    document.createElement("h3");


  heading.textContent =
    subName;


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


  let documentItems =
    normalizeDocuments(
      documents
    );


  // ======================================================
  // ADD ITEMS IF AVAILABLE
  // ======================================================

  if (
    items &&
    items.length > 0
  ) {

    items.forEach(
      function(item) {

        const itemName =
          item.item_name ||
          item.name ||
          item.title ||
          item.sub_service_item_name;


        if (itemName) {

          documentItems.push(
            itemName
          );

        }

      }
    );

  }


  // ======================================================
  // REMOVE DUPLICATES
  // ======================================================

  documentItems =
    [...new Set(
      documentItems
    )];


  // ======================================================
  // NO DOCUMENTS
  // ======================================================

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


  // ======================================================
  // DOCUMENTS
  // ======================================================

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


  // ======================================================
  // WHATSAPP
  // ======================================================

  const whatsappButton =
    document.createElement("a");


  whatsappButton.className =
    "primary";


  whatsappButton.href =
    whatsappLink(
      "Hello MBSC SOLUTIONS, I need details about " +
      subName +
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


  // ======================================================
  // SCROLL
  // ======================================================

  scrollToDocuments();

}


// ==========================================================
// SHOW NORMAL SERVICE DOCUMENTS
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


  // ======================================================
  // HEADING
  // ======================================================

  const heading =
    document.createElement("h3");


  heading.textContent =
    serviceName;


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


  const documentItems =
    normalizeDocuments(
      docs
    );


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


  // ======================================================
  // WHATSAPP
  // ======================================================

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


  scrollToDocuments();

}


// ==========================================================
// SCROLL DOCUMENTS
// ==========================================================

function scrollToDocuments() {

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


// ==========================================================
// FINAL LOG
// ==========================================================

console.log(
  "MBSC Solutions script.js loaded."
);
