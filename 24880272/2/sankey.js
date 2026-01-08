// console.log("Sankey JS loaded");

// const width = 700;
// const height = 400;

// const svg = d3.select("#sankey")
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height);

// // Hardcoded data (NO CSV)
// const graph = {
//     nodes: [
//         { name: "Website" },
//         { name: "Product View" },
//         { name: "Add to Cart" },
//         { name: "Checkout" },
//         { name: "Purchase" },
//         { name: "Drop-off" }
//     ],
//     links: [
//         { source: 0, target: 1, value: 120 },
//         { source: 1, target: 2, value: 80 },
//         { source: 2, target: 3, value: 60 },
//         { source: 3, target: 4, value: 45 },
//         { source: 1, target: 5, value: 40 },
//         { source: 2, target: 5, value: 20 },
//         { source: 3, target: 5, value: 15 }
//     ]
// };

// // Sankey layout
// const sankey = d3.sankey()
//     .nodeWidth(20)
//     .nodePadding(15)
//     .extent([[1, 1], [width - 1, height - 6]]);

// const sankeyData = sankey({
//     nodes: graph.nodes.map(d => Object.assign({}, d)),
//     links: graph.links.map(d => Object.assign({}, d))
// });

// // Links
// svg.append("g")
//     .selectAll("path")
//     .data(sankeyData.links)
//     .enter()
//     .append("path")
//     .attr("d", d3.sankeyLinkHorizontal())
//     .attr("stroke", d => d.target.name === "Drop-off" ? "red" : "green")
//     .attr("stroke-width", d => Math.max(1, d.width))
//     .attr("fill", "none")
//     .attr("opacity", 0.7);

// // Nodes
// svg.append("g")
//     .selectAll("rect")
//     .data(sankeyData.nodes)
//     .enter()
//     .append("rect")
//     .attr("x", d => d.x0)
//     .attr("y", d => d.y0)
//     .attr("width", d => d.x1 - d.x0)
//     .attr("height", d => d.y1 - d.y0)
//     .attr("fill", "#1f77b4")
//     .attr("stroke", "#000");

// // Labels
// svg.append("g")
//     .selectAll("text")
//     .data(sankeyData.nodes)
//     .enter()
//     .append("text")
//     .attr("x", d => d.x0 - 6)
//     .attr("y", d => (d.y0 + d.y1) / 2)
//     .attr("dy", "0.35em")
//     .attr("text-anchor", "end")
//     .text(d => d.name)
//     .filter(d => d.x0 < width / 2)
//     .attr("x", d => d.x1 + 6)
//     .attr("text-anchor", "start");

console.log("Sankey JS loaded");

const width = 700;
const height = 400;

const svg = d3.select("#sankey")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Load CSV
d3.csv("EcoWear_Customer_Flow.csv").then(data => {
    // Parse values as numbers
    data.forEach(d => d.value = +d.value);

    // Generate unique nodes from the CSV
    const nodeNames = Array.from(new Set(data.flatMap(d => [d.source, d.target])));
    const nodes = nodeNames.map(name => ({ name }));

    // Convert source/target names to indices
    const links = data.map(d => ({
        source: nodeNames.indexOf(d.source),
        target: nodeNames.indexOf(d.target),
        value: d.value
    }));

    const graph = { nodes, links };

    // Sankey layout
    const sankey = d3.sankey()
        .nodeWidth(20)
        .nodePadding(15)
        .extent([[1, 1], [width - 1, height - 6]]);

    const sankeyData = sankey({
        nodes: graph.nodes.map(d => Object.assign({}, d)),
        links: graph.links.map(d => Object.assign({}, d))
    });

    // Links
    svg.append("g")
        .selectAll("path")
        .data(sankeyData.links)
        .enter()
        .append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", d => d.target.name === "Drop-off" ? "red" : "green")
        .attr("stroke-width", d => Math.max(1, d.width))
        .attr("fill", "none")
        .attr("opacity", 0.7);

    // Nodes
    svg.append("g")
        .selectAll("rect")
        .data(sankeyData.nodes)
        .enter()
        .append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", "#1f77b4")
        .attr("stroke", "#000");

    // Labels
    svg.append("g")
        .selectAll("text")
        .data(sankeyData.nodes)
        .enter()
        .append("text")
        .attr("x", d => d.x0 - 6)
        .attr("y", d => (d.y0 + d.y1) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(d => d.name)
        .filter(d => d.x0 < width / 2)
        .attr("x", d => d.x1 + 6)
        .attr("text-anchor", "start");
}).catch(err => {
    console.error("Error loading CSV:", err);
});
