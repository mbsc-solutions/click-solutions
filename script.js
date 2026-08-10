function createDepartments(services) {

    departmentsContainer.innerHTML = "";

    // ======================================================
    // FIND MAIN LOANS DEPARTMENT
    // ======================================================

    const loanDepartment = services.find(function(service) {

        const name = getServiceName(service)
            .trim()
            .toLowerCase();

        return name === "loans";

    });


    // ======================================================
    // FIND LOAN SUB SERVICES
    // ======================================================

    const loanServices = services.filter(function(service) {

        const name = getServiceName(service)
            .trim()
            .toLowerCase();

        return (
            name.includes("loan") &&
            name !== "loans"
        );

    });


    // ======================================================
    // OTHER SERVICES
    // ======================================================

    const otherServices = services.filter(function(service) {

        const name = getServiceName(service)
            .trim()
            .toLowerCase();

        // Remove main Loans department
        if (name === "loans") {
            return false;
        }

        // Remove loan sub services
        if (name.includes("loan")) {
            return false;
        }

        return true;

    });


    // ======================================================
    // CREATE LOANS DEPARTMENT
    // ======================================================

    if (loanDepartment) {

        createLoanDepartment(loanServices);

    }


    // ======================================================
    // CREATE ALL OTHER SERVICES
    // ======================================================

    otherServices.forEach(function(service) {

        createNormalServiceCard(service);

    });


    // ======================================================
    // DEBUG
    // ======================================================

    console.log(
        "MBSC Main Loans Department:",
        loanDepartment
    );

    console.log(
        "MBSC Loan Sub Services:",
        loanServices
    );

    console.log(
        "MBSC Other Services:",
        otherServices
    );

}
