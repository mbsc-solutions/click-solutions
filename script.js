// ==========================================================
// MBSC SOLUTIONS
// COMPLETE SCRIPT.JS
// ==========================================================


// ==========================================================
// SUPABASE CONFIG
// ==========================================================

const SUPABASE_URL =
  "https://whxlatxnqjpccwrmtmph.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_wlqTaOkM3fML9cuUES54fw_8TlbSi-H";


// ==========================================================
// WHATSAPP
// ==========================================================

const WHATSAPP_NUMBER = "917093334820";


// ==========================================================
// SUPABASE CLIENT
// ==========================================================

let supabaseClient = null;


// ==========================================================
// GLOBAL ELEMENTS
// ==========================================================

let departmentsContainer = null;
let documentBox = null;


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
// GET SERVICE DOCUMENTS
// ==========================================================

function getDocuments(service) {

  return (
    service.documents ||
    service.requirements ||
    service.docs ||
    ""
  );

}


// ==========================================================
// GET SERVICE DESCRIPTION
// ==========================================================

function getDescription(service) {

  return (
    service.description ||
    service.details ||
    "Click below to view service details."
  );

}


// ==========================================================
// INITIALIZE SUPABASE
// ==========================================================

function initializeSupabase() {

  console.log("MBSC: Initializing Supabase...");

  if (!window.supabase) {

    console.error(
      "MBSC ERROR: Supabase JavaScript library not found."
    );

    return false;

  }


  try {

    supabaseClient =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
      );

    console.log(
      "MBSC: Supabase connected."
    );

    return true;

  }

  catch (error) {

    console.error(
      "MBSC: Supabase initialization failed:",
      error
    );

    return false;

  }

}


// ==========================================================
// SHOW LOADING
// ==========================================================

function showLoading() {

  if (!departmentsContainer) {
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

}


// ==========================================================
// SHOW ERROR
// ==========================================================

function showError(title, message) {

  if (!departmentsContainer) {
    return;
  }


  departmentsContainer.innerHTML = `

    <div class="error-box">

      <h3>
        ${escapeHTML(title)}
      </h3>

      <p>
        ${escapeHTML(message)}
      </p>

    </div>

  `;

}


// ==========================================================
// LOAD SERVICES FROM SUPABASE
// ==========================================================

async function loadServices() {

  console.log("--------------------------------");
  console.log("MBSC SOLUTIONS");
  console.log("Loading services...");
  console.log("--------------------------------");


  if (!departmentsContainer) {

    console.error(
      "MBSC ERROR: departmentsContainer not found."
    );

    return;

  }


  showLoading();


  // --------------------------------------------------------
  // Check Supabase
  // --------------------------------------------------------

  if (!supabaseClient) {

    const initialized =
      initializeSupabase();

    if (!initialized) {

      showError(
        "Supabase Not Connected",
        "Supabase JavaScript library was not loaded."
      );

      return;

    }

  }


  try {

    // ------------------------------------------------------
    // Get services
    // ------------------------------------------------------

    const result =
      await supabaseClient
        .from("services")
        .select("*")
        .order(
          "sort_order",
          {
            ascending: true
          }
        );


    const data =
      result.data;

    const error =
      result.error;


    console.log(
      "MBSC: Supabase data:",
      data
    );


    // ------------------------------------------------------
    // Supabase Error
    // ------------------------------------------------------

    if (error) {

      console.error(
        "MBSC: Supabase error:",
        error
      );


      showError(
        "Unable to Load Services",
        error.message ||
        "Unknown Supabase error."
      );

      return;

    }


    // ------------------------------------------------------
    // Empty Table
    // ------------------------------------------------------

    if (
      !data ||
      data.length === 0
    ) {

      showError(
        "No Services Found",
        "The services table does not contain any services."
      );

      return;

    }


    // ------------------------------------------------------
    // Create Services
    // ------------------------------------------------------

    createDepartments(data);


    console.log(
      "MBSC: Services successfully displayed."
    );

  }

  catch (error) {

    console.error(
      "MBSC: Unexpected error:",
      error
    );


    showError(
      "Something Went Wrong",
      "Please refresh the page and try again."
    );

  }

}


// ==========================================================
// CREATE DEPARTMENTS
// ==========================================================

function createDepartments(services) {

  if (!departmentsContainer) {
    return;
  }


  // Clear existing content

  departmentsContainer.innerHTML = "";


  // ========================================================
  // FIND MAIN LOANS ROW
  // ========================================================

  const mainLoansService =
    services.find(function(service) {

      const name =
        getServiceName(service)
          .trim()
          .toLowerCase();

      return name === "loans";

    });


  // ========================================================
  // FIND LOAN SUB SERVICES
  // ========================================================

  const loanServices =
    services.filter(function(service) {

      const name =
        getServiceName(service)
          .trim()
          .toLowerCase();


      // Do NOT include main "Loans" row

      if (name === "loans") {
        return false;
      }


      // Loan related services

      return (
        name.includes("loan")
      );

    });


  // ========================================================
  // FIND OTHER SERVICES
  // ========================================================

  const otherServices =
    services.filter(function(service) {

      const name =
        getServiceName(service)
          .trim()
          .toLowerCase();


      // Do not show main Loans row separately

      if (name === "loans") {
        return false;
      }


      // Do not show loan sub-services separately

      if (name.includes("loan")) {
        return false;
      }


      return true;

    });


  console.log(
    "MBSC: Main Loans:",
    mainLoansService
  );


  console.log(
    "MBSC: Loan sub services:",
    loanServices
  );


  console.log(
    "MBSC: Other services:",
    otherServices
  );


  // ========================================================
  // CREATE LOANS DEPARTMENT
  // ========================================================

  if (
    mainLoansService ||
    loanServices.length > 0
  ) {

    createLoanDepartment(
      loanServices
    );

  }


  // ========================================================
  // CREATE OTHER SERVICE CARDS
  // ========================================================

  otherServices.forEach(
    function(service) {

      createNormalServiceCard(
        service
      );

    }
  );

}


// ==========================================================
// CREATE LOANS DEPARTMENT
// ==========================================================

function createLoanDepartment(
  loanServices
) {

  const department =
    document.createElement("div");


  department.className =
    "loan-department";


  // ========================================================
  // HEADER
  // ========================================================

  const header =
    document.createElement("div");


  header.className =
    "department-header";


  header.innerHTML = `

    <span class="department-label">
      DEPARTMENT
    </span>

    <h3>
      Loans
    </h3>

    <p>
      Choose the loan service you need.
    </p>

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
    "View Loan Services";


  department.appendChild(
    mainButton
  );


  // ========================================================
  // SUB SERVICES CONTAINER
  // ========================================================

  const subContainer =
    document.createElement("div");


  subContainer.className =
    "loan-sub-services";


  // ========================================================
  // ADD LOAN SUB SERVICES
  // ========================================================

  loanServices.forEach(
    function(service, index) {

      const name =
        getServiceName(service);


      const docs =
        getDocuments(service);


      const subButton =
        document.createElement("button");


      subButton.className =
        "loan-sub-button";


      subButton.innerHTML = `

        <span class="loan-number">
          ${index + 1}.
        </span>

        <span>
          ${escapeHTML(name)}
        </span>

      `;


      // ----------------------------------------------------
      // CLICK
      // ----------------------------------------------------

      subButton.addEventListener(
        "click",
        function() {

          showServiceDocuments(
            name,
            docs
          );

        }
      );


      subContainer.appendChild(
        subButton
      );

    }
  );


  // ========================================================
  // WHATSAPP FOR LOANS
  // ========================================================

  const loanWhatsApp =
    document.createElement("a");


  loanWhatsApp.className =
    "loan-whatsapp";


  loanWhatsApp.href =
    whatsappLink(
      "Hello MBSC SOLUTIONS, I need loan details."
    );


  loanWhatsApp.target =
    "_blank";


  loanWhatsApp.rel =
    "noopener noreferrer";


  loanWhatsApp.textContent =
    "WhatsApp for Loans";


  subContainer.appendChild(
    loanWhatsApp
  );


  department.appendChild(
    subContainer
  );


  // ========================================================
  // TOGGLE LOAN SERVICES
  // ========================================================

  mainButton.addEventListener(
    "click",
    function() {

      subContainer.classList.toggle(
        "show"
      );


      if (
        subContainer.classList.contains(
          "show"
        )
      ) {

        mainButton.textContent =
          "Hide Loan Services";

      }

      else {

        mainButton.textContent =
          "View Loan Services";

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


  const docs =
    getDocuments(service);


  // ========================================================
  // CARD CONTENT
  // ========================================================

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


  // ========================================================
  // BUTTON CLICK
  // ========================================================

  button.addEventListener(
    "click",
    function() {

      showServiceDocuments(
        name,
        docs
      );

    }
  );


  article.appendChild(
    button
  );


  // ========================================================
  // ADD CARD
  // ========================================================

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


  // ========================================================
  // CLEAR DOCUMENT BOX
  // ========================================================

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
  // ARRAY DOCUMENTS
  // ========================================================

  if (
    Array.isArray(docs)
  ) {

    documentItems =
      docs
        .map(function(item) {

          return String(item).trim();

        })
        .filter(Boolean);

  }


  // ========================================================
  // STRING DOCUMENTS
  // ========================================================

  else if (
    typeof docs === "string"
  ) {

    documentItems =
      docs
        .split(/\r?\n|,|;/)
        .map(function(item) {

          return item.trim();

        })
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
  // DOCUMENTS AVAILABLE
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


  // ========================================================
  // ADD LIST
  // ========================================================

  documentBox.appendChild(
    list
  );


  // ========================================================
  // WHATSAPP BUTTON
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
      "MBSC: Hero video not found."
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


  video.setAttribute(
    "autoplay",
    ""
  );


  video.setAttribute(
    "loop",
    ""
  );


  // ========================================================
  // PLAY VIDEO
  // ========================================================

  const playVideo =
    function() {

      video.play()
        .then(function() {

          console.log(
            "MBSC: Hero video playing."
          );

        })
        .catch(function(error) {

          console.log(
            "MBSC: Hero video autoplay waiting.",
            error
          );

        });

    };


  playVideo();


  // ========================================================
  // USER INTERACTION
  // ========================================================

  document.addEventListener(
    "click",
    function() {

      if (
        video.paused
      ) {

        playVideo();

      }

    },
    {
      once: true
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
      "================================="
    );

    console.log(
      "MBSC SOLUTIONS PAGE LOADED"
    );

    console.log(
      "================================="
    );


    // ------------------------------------------------------
    // Get HTML elements
    // ------------------------------------------------------

    departmentsContainer =
      document.getElementById(
        "departmentsContainer"
      );


    documentBox =
      document.getElementById(
        "documentBox"
      );


    // ------------------------------------------------------
    // Check elements
    // ------------------------------------------------------

    if (!departmentsContainer) {

      console.error(
        "MBSC ERROR: #departmentsContainer is missing in HTML."
      );

    }


    if (!documentBox) {

      console.warn(
        "MBSC WARNING: #documentBox is missing in HTML."
      );

    }


    // ------------------------------------------------------
    // Hero video
    // ------------------------------------------------------

    setupHeroVideo();


    // ------------------------------------------------------
    // Load services
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
        .catch(function() {});

    }

  }
);


// ==========================================================
// END
// ==========================================================

console.log(
  "MBSC Solutions script.js loaded."
);
