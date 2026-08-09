// ==========================================================
// MBSC SOLUTIONS - COMPLETE SCRIPT
// SERVICES + DOCUMENTS + WHATSAPP + LOANS VIDEO
// ==========================================================


// ==========================================================
// SUPABASE CONFIG
// ==========================================================

// IMPORTANT:
// YOUR_SUPABASE_PROJECT_URL place lo
// Supabase Project URL pettandi.
//
// Example:
// https://abcdefghijklmnop.supabase.co

const SUPABASE_URL =
  "https://whxlatxnqjpccwrmtmph.supabase.co";


// FRONTEND LO ONLY PUBLISHABLE KEY
// sb_secret_... USE CHEYYAKU

const SUPABASE_ANON_KEY =
  "sb_publishable_wlqTaOkM3fML9cuUES54fw_8TlbSi-H";


// ==========================================================
// SUPABASE CLIENT
// ==========================================================

let supabaseClient = null;

try {

  if (
    window.supabase &&
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes("YOUR_SUPABASE")
  ) {

    supabaseClient =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
      );

    console.log(
      "MBSC: Supabase connected."
    );

  } else {

    console.error(
      "MBSC: Supabase configuration is incomplete."
    );

  }

} catch (error) {

  console.error(
    "MBSC: Supabase initialization error:",
    error
  );

}


// ==========================================================
// GLOBAL ELEMENTS
// ==========================================================

let grid = null;

let documentBox = null;


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
// GET PAGE ELEMENTS
// ==========================================================

function getPageElements() {

  grid =
    document.getElementById(
      "servicesGrid"
    );

  documentBox =
    document.getElementById(
      "documentBox"
    );

}


// ==========================================================
// LOADING MESSAGE
// ==========================================================

function showLoading() {

  if (!grid) return;

  grid.innerHTML = `

    <article class="service loading-service">

      <h3>
        Loading Services...
      </h3>

      <p>
        Please wait while our services are loading.
      </p>

    </article>

  `;

}


// ==========================================================
// CONFIG ERROR
// ==========================================================

function showConfigurationError() {

  if (!grid) return;

  grid.innerHTML = `

    <article class="service">

      <h3>
        Supabase Configuration Required
      </h3>

      <p>
        Please add your Supabase Project URL
        in script.js.
      </p>

    </article>

  `;

}


// ==========================================================
// SUPABASE ERROR
// ==========================================================

function showSupabaseError(error) {

  if (!grid) return;

  const message =
    error &&
    error.message
      ? error.message
      : "Unable to connect to Supabase.";


  grid.innerHTML = `

    <article class="service">

      <h3>
        Unable to Load Services
      </h3>

      <p>
        ${escapeHTML(message)}
      </p>

    </article>

  `;

}


// ==========================================================
// NO SERVICES
// ==========================================================

function showNoServices() {

  if (!grid) return;

  grid.innerHTML = `

    <article class="service">

      <h3>
        No Services Found
      </h3>

      <p>
        Supabase connected successfully,
        but no services were found in the
        services table.
      </p>

    </article>

  `;

}


// ==========================================================
// LOAD SERVICES
// ==========================================================

async function loadServices() {

  console.log(
    "MBSC: Loading services..."
  );


  getPageElements();


  if (!grid) {

    console.error(
      "MBSC: servicesGrid not found."
    );

    return;

  }


  showLoading();


  // --------------------------------------------------------
  // CHECK SUPABASE LIBRARY
  // --------------------------------------------------------

  if (!window.supabase) {

    console.error(
      "MBSC: Supabase library not loaded."
    );

    grid.innerHTML = `

      <article class="service">

        <h3>
          Supabase Library Not Loaded
        </h3>

        <p>
          Please check the Supabase script
          in index.html.
        </p>

      </article>

    `;

    return;

  }


  // --------------------------------------------------------
  // CHECK URL
  // --------------------------------------------------------

  if (
    !SUPABASE_URL ||
    SUPABASE_URL.includes(
      "YOUR_SUPABASE"
    )
  ) {

    console.error(
      "MBSC: Project URL missing."
    );

    showConfigurationError();

    return;

  }


  // --------------------------------------------------------
  // CHECK KEY
  // --------------------------------------------------------

  if (
    !SUPABASE_ANON_KEY ||
    SUPABASE_ANON_KEY ===
      "YOUR_PUBLISHABLE_KEY"
  ) {

    console.error(
      "MBSC: Publishable key missing."
    );

    grid.innerHTML = `

      <article class="service">

        <h3>
          Supabase Key Missing
        </h3>

        <p>
          Please add the Supabase publishable key.
        </p>

      </article>

    `;

    return;

  }


  // --------------------------------------------------------
  // CHECK CLIENT
  // --------------------------------------------------------

  if (!supabaseClient) {

    console.error(
      "MBSC: Supabase client unavailable."
    );

    grid.innerHTML = `

      <article class="service">

        <h3>
          Supabase Connection Failed
        </h3>

        <p>
          Please check your Project URL
          and Publishable Key.
        </p>

      </article>

    `;

    return;

  }


  try {

    // ------------------------------------------------------
    // GET SERVICES
    // ------------------------------------------------------

    const result =
      await supabaseClient

        .from("services")

        .select("*")

        .order(
          "id",
          {
            ascending: true
          }
        );


    const data =
      result.data;

    const error =
      result.error;


    // ------------------------------------------------------
    // ERROR
    // ------------------------------------------------------

    if (error) {

      console.error(
        "MBSC Supabase Error:",
        error
      );

      showSupabaseError(
        error
      );

      return;

    }


    // ------------------------------------------------------
    // EMPTY
    // ------------------------------------------------------

    if (
      !data ||
      data.length === 0
    ) {

      console.warn(
        "MBSC: services table is empty."
      );

      showNoServices();

      return;

    }


    // ------------------------------------------------------
    // CLEAR GRID
    // ------------------------------------------------------

    grid.innerHTML = "";


    // ------------------------------------------------------
    // CREATE SERVICE CARDS
    // ------------------------------------------------------

    data.forEach(
      function(service) {

        createServiceCard(
          service
        );

      }
    );


    console.log(
      "MBSC: Services loaded:",
      data
    );


    // ------------------------------------------------------
    // START LOANS VIDEOS
    // ------------------------------------------------------

    startAllLoansVideos();


  }

  catch (error) {

    console.error(
      "MBSC: Unexpected services error:",
      error
    );

    grid.innerHTML = `

      <article class="service">

        <h3>
          Something Went Wrong
        </h3>

        <p>
          ${escapeHTML(
            error.message ||
            "Please refresh the page and try again."
          )}
        </p>

      </article>

    `;

  }

}


// ==========================================================
// CREATE SERVICE CARD
// ==========================================================

function createServiceCard(
  service
) {

  if (!grid) return;


  const article =
    document.createElement(
      "article"
    );


  article.className =
    "service";


  // --------------------------------------------------------
  // SERVICE NAME
  // --------------------------------------------------------

  const serviceName =
    service.name ||
    service.service_name ||
    service.title ||
    service.service ||
    "Service";


  // --------------------------------------------------------
  // DESCRIPTION
  // --------------------------------------------------------

  const description =
    service.description ||
    service.details ||
    service.desc ||
    "Click below to view service details.";


  // --------------------------------------------------------
  // DOCUMENTS
  // --------------------------------------------------------

  const docs =
    service.documents ||
    service.requirements ||
    service.docs ||
    service.document_list ||
    "";


  // --------------------------------------------------------
  // TITLE
  // --------------------------------------------------------

  const title =
    document.createElement(
      "h3"
    );

  title.textContent =
    serviceName;


  // --------------------------------------------------------
  // DESCRIPTION
  // --------------------------------------------------------

  const desc =
    document.createElement(
      "p"
    );

  desc.textContent =
    description;


  // --------------------------------------------------------
  // BUTTON
  // --------------------------------------------------------

  const button =
    document.createElement(
      "button"
    );


  button.type =
    "button";


  button.className =
    "service-button";


  button.textContent =
    "View & WhatsApp";


  // --------------------------------------------------------
  // BUTTON CLICK
  // --------------------------------------------------------

  button.addEventListener(
    "click",
    function(event) {

      event.preventDefault();


      showServiceDocuments(
        serviceName,
        docs,
        service
      );

    }
  );


  // --------------------------------------------------------
  // ADD CARD CONTENT
  // --------------------------------------------------------

  article.appendChild(
    title
  );

  article.appendChild(
    desc
  );

  article.appendChild(
    button
  );


  // --------------------------------------------------------
  // LOANS VIDEO
  // --------------------------------------------------------

  if (
    isLoanService(
      serviceName
    )
  ) {

    addLoansVideo(
      article
    );

  }


  // --------------------------------------------------------
  // ADD TO GRID
  // --------------------------------------------------------

  grid.appendChild(
    article
  );

}


// ==========================================================
// CHECK LOAN SERVICE
// ==========================================================

function isLoanService(
  serviceName
) {

  const name =
    String(
      serviceName || ""
    )
      .trim()
      .toLowerCase();


  return (
    name === "loan" ||
    name === "loans" ||
    name.includes("loan")
  );

}


// ==========================================================
// ADD LOANS VIDEO
// ==========================================================

function addLoansVideo(
  article
) {

  if (!article) return;


  // --------------------------------------------------------
  // VIDEO
  // --------------------------------------------------------

  const video =
    document.createElement(
      "video"
    );


  video.className =
    "loans-video";


  // --------------------------------------------------------
  // VIDEO FILE
  // --------------------------------------------------------
  //
  // IMPORTANT:
  // loans.mp4 must be in same folder
  // as index.html
  //

  video.src =
    "loans.mp4";


  video.autoplay =
    true;


  video.loop =
    true;


  video.muted =
    true;


  video.playsInline =
    true;


  video.preload =
    "auto";


  video.setAttribute(
    "muted",
    ""
  );


  video.setAttribute(
    "playsinline",
    ""
  );


  video.setAttribute(
    "aria-hidden",
    "true"
  );


  // --------------------------------------------------------
  // VIDEO ERROR
  // --------------------------------------------------------

  video.addEventListener(
    "error",
    function() {

      console.error(
        "MBSC: loans.mp4 could not be loaded."
      );

    }
  );


  // --------------------------------------------------------
  // OVERLAY
  // --------------------------------------------------------

  const overlay =
    document.createElement(
      "div"
    );


  overlay.className =
    "loans-video-overlay";


  // --------------------------------------------------------
  // INSERT VIDEO
  // --------------------------------------------------------

  article.prepend(
    video
  );


  article.prepend(
    overlay
  );


  // --------------------------------------------------------
  // PLAY
  // --------------------------------------------------------

  video.play()
    .catch(
      function() {

        console.log(
          "MBSC: Loans video autoplay waiting."
        );

      }
    );

}


// ==========================================================
// START ALL LOANS VIDEOS
// ==========================================================

function startAllLoansVideos() {

  const videos =
    document.querySelectorAll(
      ".loans-video"
    );


  videos.forEach(
    function(video) {

      video.muted =
        true;

      video.playsInline =
        true;

      video.play()
        .catch(
          function() {}
        );

    }
  );

}


// ==========================================================
// SHOW SERVICE DOCUMENTS
// ==========================================================

function showServiceDocuments(
  serviceName,
  docs,
  service
) {

  if (!documentBox) {

    documentBox =
      document.getElementById(
        "documentBox"
      );

  }


  if (!documentBox) {

    console.error(
      "MBSC: documentBox not found."
    );

    return;

  }


  // --------------------------------------------------------
  // CLEAR
  // --------------------------------------------------------

  documentBox.innerHTML =
    "";


  // --------------------------------------------------------
  // HEADING
  // --------------------------------------------------------

  const heading =
    document.createElement(
      "h3"
    );


  heading.textContent =
    serviceName;


  documentBox.appendChild(
    heading
  );


  // --------------------------------------------------------
  // DESCRIPTION
  // --------------------------------------------------------

  const description =
    service &&
    (
      service.description ||
      service.details
    );


  if (description) {

    const descriptionElement =
      document.createElement(
        "p"
      );


    descriptionElement.textContent =
      description;


    documentBox.appendChild(
      descriptionElement
    );

  }


  // --------------------------------------------------------
  // DOCUMENT LIST
  // --------------------------------------------------------

  const list =
    document.createElement(
      "ul"
    );


  list.className =
    "requirements-list";


  let documentItems =
    [];


  // --------------------------------------------------------
  // ARRAY
  // --------------------------------------------------------

  if (
    Array.isArray(
      docs
    )
  ) {

    documentItems =
      docs;

  }


  // --------------------------------------------------------
  // STRING
  // --------------------------------------------------------

  else if (
    typeof docs ===
    "string"
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

        .filter(
          Boolean
        );

  }


  // --------------------------------------------------------
  // OBJECT
  // --------------------------------------------------------

  else if (
    docs &&
    typeof docs ===
    "object"
  ) {

    documentItems =
      Object.values(
        docs
      )

        .flat()

        .map(
          function(item) {

            return String(
              item
            ).trim();

          }
        )

        .filter(
          Boolean
        );

  }


  // --------------------------------------------------------
  // NO DOCUMENTS
  // --------------------------------------------------------

  if (
    documentItems.length ===
    0
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


  // --------------------------------------------------------
  // DOCUMENTS
  // --------------------------------------------------------

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
            ${escapeHTML(
              itemText
            )}
          </span>

        `;


        list.appendChild(
          item
        );

      }
    );

  }


  // --------------------------------------------------------
  // ADD LIST
  // --------------------------------------------------------

  documentBox.appendChild(
    list
  );


  // --------------------------------------------------------
  // WHATSAPP
  // --------------------------------------------------------

  const whatsappButton =
    document.createElement(
      "a"
    );


  whatsappButton.className =
    "primary";


  whatsappButton.href =
    whatsappLink(
      "Hello MBSC SOLUTIONS, " +
      "I need details about " +
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
  // SCROLL TO DOCUMENTS
  // --------------------------------------------------------

  const documentsSection =
    document.querySelector(
      ".documents"
    );


  if (documentsSection) {

    documentsSection.scrollIntoView({

      behavior:
        "smooth",

      block:
        "start"

    });

  }

}


// ==========================================================
// SUB SERVICE BUTTONS
// ==========================================================

document.addEventListener(
  "click",
  function(event) {

    const button =
      event.target.closest(
        ".sub-service-button"
      );


    if (!button) return;


    const serviceName =
      button.dataset.service ||
      button.textContent.trim();


    const documents =
      button.dataset.documents ||
      "";


    showServiceDocuments(
      serviceName,
      documents,
      {}
    );

  }
);


// ==========================================================
// ESCAPE HTML
// ==========================================================

function escapeHTML(
  value
) {

  return String(
    value
  )

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
// PAGE LOAD
// ==========================================================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    console.log(
      "MBSC: Page loaded."
    );


    getPageElements();


    loadServices();

  }
);


// ==========================================================
// VISIBILITY CHANGE
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


    startAllLoansVideos();

  }
);


// ==========================================================
// PAGE LOAD FALLBACK
// ==========================================================

if (
  document.readyState ===
  "loading"
) {

  // DOMContentLoaded will handle it.

} else {

  getPageElements();

  loadServices();

}


// ==========================================================
// END
// ==========================================================
