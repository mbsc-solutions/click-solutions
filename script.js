// ==========================================================
// MBSC SOLUTIONS
// COMPLETE SCRIPT.JS
// SERVICES
// SUB SERVICES
// SUB SERVICE ITEMS
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
// ITEM NAME
// ==========================================================

function getItemName(item) {

  return (
    item.item_name ||
    item.sub_service_item_name ||
    item.name ||
    item.title ||
    "Service Item"
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
      .map(function (item) {
        return String(item).trim();
      })
      .filter(Boolean);

  }


  if (typeof docs === "string") {

    return docs
      .split(/\r?\n|,|;/)
      .map(function (item) {
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

  console.log("=================================");
  console.log("MBSC SOLUTIONS");
  console.log("Loading services...");
  console.log("=================================");


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
    // 1. GET SERVICES
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
    // 2. GET SUB SERVICES
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
    // 3. GET SUB SERVICE ITEMS
    // ======================================================

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


    let subServiceItems = [];


    if (itemsResult.error) {

      console.warn(
        "MBSC WARNING: sub_service_items error:",
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
    // 4. CREATE SUB SERVICE MAP
    // ======================================================

    const subServiceMap = {};


    subServices.forEach(
      function (subService) {

        const serviceId =
          Number(subService.service_id);


        if (!serviceId) {

          return;

        }


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
    // 5. CREATE SUB SERVICE ITEM MAP
    // ======================================================

    const subServiceItemMap = {};


    subServiceItems.forEach(
      function (item) {

        const subServiceId =
          Number(
            item.sub_service_id ||
            item.subservice_id ||
            item.subServiceId
          );


        if (!subServiceId) {

          console.warn(
            "MBSC: Item has no sub_service_id:",
            item
          );

          return;

        }


        if (!subServiceItemMap[subServiceId]) {

          subServiceItemMap[subServiceId] = [];

        }


        subServiceItemMap[subServiceId].push(
          item
        );

      }
    );


    console.log(
      "MBSC SUB SERVICE ITEM MAP:",
      subServiceItemMap
    );


    // ======================================================
    // 6. CREATE DEPARTMENTS
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
  // FIND ALL SERVICES WHICH ARE CHILD SERVICES
  // ======================================================

  const childServiceIds =
    new Set();


  Object.keys(subServiceMap)
    .forEach(
      function (serviceId) {

        const subServices =
          subServiceMap[serviceId] || [];


        subServices.forEach(
          function (subService) {

            /*
             * IMPORTANT:
             *
             * Here we only identify the parent
             * service IDs.
             *
             * Example:
             *
             * service 16 = Loans
             *
             * sub_services:
             * Tractor Loans
             * Business Loans
             * etc.
             *
             * Those sub-services themselves have
             * service_id = 16.
             *
             * They are NOT removed from services table
             * using their own IDs.
             *
             * We remove only actual child service IDs
             * when their ID is referenced as a parent
             * elsewhere.
             */

          }
        );

      }
    );


  // ======================================================
  // ACTUAL PARENT SERVICE IDS
  // ======================================================

  const parentServiceIds =
    new Set(
      Object.keys(subServiceMap)
        .map(function (id) {
          return Number(id);
        })
        .filter(Boolean)
    );


  console.log(
    "MBSC PARENT SERVICE IDS:",
    [...parentServiceIds]
  );


  // ======================================================
  // BUILD PAGE
  // ======================================================

  services.forEach(
    function (service) {

      const serviceId =
        Number(service.id);


      const subServices =
        subServiceMap[serviceId] || [];


      // ==================================================
      // PARENT DEPARTMENT
      // ==================================================

      if (subServices.length > 0) {

        createDepartmentCard(
          service,
          subServices,
          subServiceItemMap
        );


        departmentCount++;

        return;

      }


      // ==================================================
      // CHILD SERVICE DETECTION
      // ==================================================

      /*
       * If a service has no own sub_services,
       * check whether it belongs to a parent department
       * through the sub_services table.
       *
       * We identify child service names against
       * sub-service names.
       */

      const serviceName =
        getServiceName(service)
          .trim()
          .toLowerCase();


      let isChildService =
        false;


      subServicesLoop:
      for (
        let i = 0;
        i < services.length;
        i++
      ) {

        const possibleParent =
          services[i];


        const possibleParentId =
          Number(possibleParent.id);


        const children =
          subServiceMap[possibleParentId] || [];


        for (
          let j = 0;
          j < children.length;
          j++
        ) {

          const child =
            children[j];


          const childName =
            getSubServiceName(child)
              .trim()
              .toLowerCase();


          if (
            childName === serviceName
          ) {

            isChildService =
              true;

            break subServicesLoop;

          }

        }

      }


      // ==================================================
      // DO NOT SHOW CHILD SERVICE AGAIN
      // ==================================================

      if (isChildService) {

        console.log(
          "MBSC: Hiding duplicate child service:",
          serviceName
        );

        return;

      }


      // ==================================================
      // NORMAL SERVICE
      // ==================================================

      createNormalServiceCard(
        service
      );


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


  mainButton.type =
    "button";


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
  // CREATE SUB SERVICES
  // ======================================================

  subServices.forEach(
    function (subService, index) {

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
      // SUB SERVICE WRAPPER
      // ==================================================

      const subWrapper =
        document.createElement("div");


      subWrapper.className =
        "loan-sub-wrapper";


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
        function () {

          showSubServiceDetails(
            subName,
            documents,
            items
          );

        }
      );


      subWrapper.appendChild(
        button
      );


          subContainer.appendChild(
        subWrapper
      );

    }
  );


  // ======================================================
  // WHATSAPP DEPARTMENT BUTTON
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
    function () {

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
    function () {

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
  // SUB SERVICE ITEMS
  // ======================================================

  if (
    items &&
    items.length > 0
  ) {

    const itemHeading =
      document.createElement("h4");


    itemHeading.textContent =
      "Available Services";


    documentBox.appendChild(
      itemHeading
    );


    const itemList =
      document.createElement("ul");


    itemList.className =
      "requirements-list";


    items.forEach(
      function (item) {

        const itemName =
          getItemName(item);


        const listItem =
          document.createElement("li");


        listItem.className =
          "requirement-item";


        listItem.innerHTML = `

          <span class="bullet">
            •
          </span>

          <span>
            ${escapeHTML(itemName)}
          </span>

        `;


        itemList.appendChild(
          listItem
        );

      }
    );


    documentBox.appendChild(
      itemList
    );

  }


  // ======================================================
  // DOCUMENTS
  // ======================================================

  const documentItems =
    normalizeDocuments(
      documents
    );


  if (
    documentItems.length > 0
  ) {

    const documentHeading =
      document.createElement("h4");


    documentHeading.textContent =
      "Required Documents";


    documentBox.appendChild(
      documentHeading
    );


    const documentList =
      document.createElement("ul");


    documentList.className =
      "requirements-list";


    documentItems.forEach(
      function (itemText) {

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


        documentList.appendChild(
          item
        );

      }
    );


    documentBox.appendChild(
      documentList
    );

  }


  // ======================================================
  // NO DATA
  // ======================================================

  if (
    (!items || items.length === 0) &&
    documentItems.length === 0
  ) {

    const noData =
      document.createElement("p");


    noData.textContent =
      "Contact us for service details and document requirements.";


    documentBox.appendChild(
      noData
    );

  }


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
      function (itemText) {

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
// SCROLL TO DOCUMENTS
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
      function () {

        console.log(
          "Hero video playing."
        );

      }
    )
    .catch(
      function (error) {

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
  function () {

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
  function () {

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
          function () {}
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
