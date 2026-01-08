 console.log("EcoWear Dashboard Loaded Successfully");
 console.log("D3 available?", typeof d3 !== "undefined");
 console.log("d3.sankey available?", typeof d3?.sankey !== "undefined");

    initializeDashboard();
;

/**
 * Initializes dashboard-level behaviors
 */
function initializeDashboard() {
    displayDashboardInfo();
    prepareGlobalInteractions();
}

/**
 * Displays dashboard metadata (for validation & debugging)
 */
function displayDashboardInfo() {
    const charts = [
        "Radar Chart – Weather Impact Analysis",
        "Sankey Diagram – Customer Flow",
        "Coxcomb Chart – Segment-wise Sales",
        "Stacked Bar Chart – Monthly Sales"
    ];

    console.group("Dashboard Components");
    charts.forEach(chart => console.log(chart));
    console.groupEnd();
}

/**
 * Placeholder for global interactions
 * (filters, cross-highlighting, export, etc.)
 */
function prepareGlobalInteractions() {
    console.log("Global interaction layer initialized");

}
