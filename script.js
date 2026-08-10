// ==========================================================
// MBSC SOLUTIONS
// SERVICES + DEPARTMENTS
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

let departmentsContainer;
let documentBox;

const WHATSAPP_NUMBER = "917093334820";

// ==========================================================
// WHATSAPP
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
// LOAD SERVICES
// ==========================================================

async function loadServices() {

  console.log("MBSC: Loading services...");

  departmentsContainer =
    document.getElementById("departmentsContainer");

  documentBox =
    document.getElementById("documentBox");

  if (!departmentsContainer) {
    console.error(
      "MBSC ERROR: departmentsContainer not found."
    );
    return;
  }

  departmentsContainer.innerHTML = `
    <div class="loading-box">
      <div class="loading-spinner"></div>
      <h3>Loading Services...</h3>
      <p>Please wait while our services are loading.</p>
    </div>
  `;

  try {

    const { data, error } =
      await supabaseClient
        .from("services")
        .select("*");

    console.log("MBSC Supabase data:", data);
    console.log("MBSC Supabase error:", error);

    if (error) {

      departmentsContainer.innerHTML = `
        <div class="error-box">
          <h3>Unable to Load Services</h3>
          <p>${escapeHTML(error.message)}</p>
        </div>
      `;

      return;
    }

    if (!data || data.length === 0) {

      departmentsContainer.innerHTML = `
        <div class="error-box">
          <h3>No Services Found</h3>
          <p>
            Supabase connected, but no records
            were found in the services table.
          </p>
        </div>
      `;

      return;
    }

    createDepartments(data);

  } catch (error) {

    console.error(
      "MBSC ERROR:",
      error
    );

    departmentsContainer.innerHTML = `
      <div class="error-box">
        <h3>Something Went Wrong</h3>
        <p>
          ${escapeHTML(error.message)}
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

  // --------------------------------------------------------
  // LOANS
  // --------------------------------------------------------

  const loanServices =
    services.filter(service => {

      const name =
        getServiceName(service)
          .toLowerCase();

      return name.includes("loan");
    });

  // --------------------------------------------------------
  // OTHER SERVICES
  // --------------------------------------------------------

  const otherServices =
    services.filter(service => {

      const name =
        getServiceName(service)
          .toLowerCase();

      return !name.includes("loan");
    });

  // --------------------------------------------------------
  // LOAN DEPARTMENT
  // --------------------------------------------------------

  if (loanServices.length > 0) {
    createLoanDepartment(
      loanServices
    );
  }

  // --------------------------------------------------------
  // OTHER SERVICES
  // --------------------------------------------------------

  otherServices.forEach(service => {

    createNormalServiceCard(
      service
    );

  });

}

// ==========================================================
// LOAN DEPARTMENT
// ==========================================================

function createLoanDepartment(
  loanServices
) {

  const department =
    document.createElement("div");

  department.className =
    "loan-department";

  // --------------------------------------------------------
  // HEADER
  // --------------------------------------------------------

  const header =
    document.createElement("div");

  header.className =
    "department-header";

  header.innerHTML = `
    <span class="department-label">
      DEPARTMENT
    </span>

    <h3>Loans</h3>

    <p>
      Choose the loan service you need.
    </p>
  `;

  department.appendChild(
    header
  );

  // --------------------------------------------------------
  // MAIN BUTTON
  // --------------------------------------------------------

  const mainButton =
    document.createElement("button");

  mainButton.className =
    "loan-main-button";

  mainButton.textContent =
    "View Loan Services";

  department.appendChild(
    mainButton
  );

  // --------------------------------------------------------
  // SUB SERVICES
  // --------------------------------------------------------

  const subContainer =
    document.createElement("div");

  subContainer.className =
    "loan-sub-services";

  loanServices.forEach(
    (service, index) => {

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
        () => {

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

  // --------------------------------------------------------
  // WHATSAPP
  // --------------------------------------------------------

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

  // --------------------------------------------------------
  // TOGGLE
  // --------------------------------------------------------

  mainButton.addEventListener(
    "click",
    () => {

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

      } else {

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

  const button =
    document.createElement("button");

  button.className =
    "service-button";

  button.textContent =
    "View & WhatsApp";

  button.addEventListener(
    "click",
    () => {

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
      "MBSC ERROR: documentBox not found."
    );
    return;
  }

  documentBox.innerHTML = "";

  const heading =
    document.createElement("h3");

  heading.textContent =
    serviceName;

  documentBox.appendChild(
    heading
  );

  const list =
    document.createElement("ul");

  list.className =
    "requirements-list";

  let documentItems = [];

  // --------------------------------------------------------
  // ARRAY
  // --------------------------------------------------------

  if (Array.isArray(docs)) {

    documentItems =
      docs;

  }

  // --------------------------------------------------------
  // STRING
  // --------------------------------------------------------

  else if (
    typeof docs === "string"
  ) {

    documentItems =
      docs
        .split(/\r?\n|,|;/)
        .map(item => item.trim())
        .filter(Boolean);

  }

  // --------------------------------------------------------
  // EMPTY
  // --------------------------------------------------------

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

  // --------------------------------------------------------
  // DOCUMENTS
  // --------------------------------------------------------

  else {

    documentItems.forEach(
      itemText => {

        const item =
          document.createElement("li");

        item.className =
          "requirement-item";

        item.innerHTML = `
          <span class="bullet">•</span>

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

  // --------------------------------------------------------
  // WHATSAPP
  // --------------------------------------------------------

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

  // --------------------------------------------------------
  // SCROLL
  // --------------------------------------------------------

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
    console.warn(
      "MBSC: hero-video not found."
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
    .catch(error => {

      console.warn(
        "Hero video autoplay blocked:",
        error
      );

    });
}

// ==========================================================
// PAGE LOAD
// ==========================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "MBSC: Page loaded."
    );

    setupHeroVideo();

    loadServices();

  }
);

// ==========================================================
// VISIBILITY
// ==========================================================

document.addEventListener(
  "visibilitychange",
  () => {

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
        .catch(() => {});

    }

  }
);
