// ==========================================================
// MBSC SOLUTIONS
// COMPLETE SERVICES SCRIPT
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

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// ==========================================================
// LOAD SERVICES
// ==========================================================

async function loadServices() {

  console.log("=================================");
  console.log("MBSC SOLUTIONS");
  console.log("Loading services...");
  console.log("=================================");


  if (!departmentsContainer) {

    console.error(
      "departmentsContainer not found"
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

    const result =
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


    const data =
      result.data;

    const error =
      result.error;


    console.log(
      "Supabase data:",
      data
    );


    // ====================================================
    // ERROR
    // ====================================================

    if (error) {

      console.error(
        "Supabase error:",
        error
      );


      departmentsContainer.innerHTML = `

        <div class="error-box">

          <h3>
            Unable to Load Services
          </h3>

          <p>
            ${escapeHTML(error.message)}
          </p>

        </div>

      `;

      return;

    }


    // ====================================================
    // EMPTY
    // ====================================================

    if (!data || data.length === 0) {

      departmentsContainer.innerHTML = `

        <div class="error-box">

          <h3>
            No Services Found
          </h3>

          <p>
            Your Supabase services table is empty.
          </p>

        </div>

      `;

      return;

    }


    // ====================================================
    // BUILD DEPARTMENTS
    // ====================================================

    createDepartments(data);


  }

  catch (error) {

    console.error(
      "MBSC unexpected error:",
      error
    );


    departmentsContainer.innerHTML = `

      <div class="error-box">

        <h3>
          Something Went Wrong
        </h3>

        <p>
          Please refresh the page and try again.
        </p>

      </div>

    `;

  }

}


// ==========================================================
// CREATE DEPARTMENTS
// ==========================================================

function createDepartments(services) {

  departmentsContainer.innerHTML = "";


  // ======================================================
  // FIND LOANS
  // ======================================================

  const loanServices =
    services.filter(function(service) {

      const name =
        getServiceName(service)
          .toLowerCase();

      return (
        name.includes("loan")
      );

    });


  // ======================================================
  // OTHER SERVICES
  // ======================================================

  const otherServices =
    services.filter(function(service) {

      const name =
        getServiceName(service)
          .toLowerCase();

      return !name.includes("loan");

    });


  // ======================================================
  // LOANS DEPARTMENT
  // ======================================================

  if (loanServices.length > 0) {

    createLoanDepartment(
      loanServices
    );

  }


  // ======================================================
  // OTHER SERVICES
  // ======================================================

  otherServices.forEach(function(service) {

    createNormalServiceCard(
      service
    );

  });


  console.log(
    "Loan services:",
    loanServices
  );

  console.log(
    "Other services:",
    otherServices
  );

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
// GET DOCUMENTS
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
// LOANS DEPARTMENT
// ==========================================================

function createLoanDepartment(
  loanServices
) {

  const department =
    document.createElement("div");

  department.className =
    "department loan-department";


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
        Loans
      </h3>

      <p>
        Choose the loan service you need.
      </p>

    </div>

  `;


  department.appendChild(
    header
  );


  // ======================================================
  // LOAN BUTTON
  // ======================================================

  const mainButton =
    document.createElement("button");

  mainButton.className =
    "loan-main-button";

  mainButton.textContent =
    "View Loan Services";


  department.appendChild(
    mainButton
  );


  // ======================================================
  // SUB SERVICES
  // ======================================================

  const subContainer =
    document.createElement("div");

  subContainer.className =
    "loan-sub-services";


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


  // ======================================================
  // WHATSAPP
  // ======================================================

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


  // ======================================================
  // TOGGLE
  // ======================================================

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
    service.description ||
    service.details ||
    "Click below to view service details.";


  const docs =
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

  button.textContent =
    "View & WhatsApp";


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


  departmentsContainer.appendChild(
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

    console.error(
      "documentBox not found"
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


  let documentItems = [];


  // ARRAY

  if (
    Array.isArray(docs)
  ) {

    documentItems =
      docs;

  }


  // STRING

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


  // ======================================================
  // DOCUMENTS
  // ======================================================

  if (
    documentItems.length === 0
  ) {

    const item =
      document.createElement("li");

    item.className =
      "requirement-item";

    item.textContent =
      "Contact us for document requirements.";

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


  // ======================================================
  // SCROLL
  // ======================================================

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
    .catch(function() {

      console.log(
        "Hero video autoplay blocked."
      );

    });

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
        .catch(function() {});

    }

  }
);
