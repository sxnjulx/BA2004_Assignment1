console.log("Radar JS loaded");

// Dimensions
const width = 600;
const height = 600;
const margin = 80;
const radius = Math.min(width, height) / 2 - margin;

// Weather factors
const features = ['tavg','tmin','tmax','prcp','snow','wspd','tsun','pres'];
const angleSlice = (Math.PI * 2) / features.length;

// SVG
const svg = d3.select("#radarChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

// Load normalized CSV
d3.csv("student2024880272_product_weather_normalized.csv").then(function(data) {

    // Convert values to numbers
    data.forEach(d => {
        features.forEach(f => d[f] = +d[f]);
    });

    // Radius scale
    const rScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, radius]);

    // -----------------------------
    // Draw Circular Grid
    // -----------------------------
    const levels = 5;

    for (let i = 1; i <= levels; i++) {
        svg.append("circle")
            .attr("class", "grid-circle")
            .attr("r", radius / levels * i);
    }

    // -----------------------------
    // Axes
    // -----------------------------
    const axis = svg.selectAll(".axis")
        .data(features)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScale(1) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", (d, i) => rScale(1) * Math.sin(angleSlice * i - Math.PI / 2));

    axis.append("text")
        .attr("x", (d, i) => rScale(1.15) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => rScale(1.15) * Math.sin(angleSlice * i - Math.PI / 2))
        .style("text-anchor", "middle")
        .text(d => d);

    // -----------------------------
    // Radar Line Generator
    // -----------------------------
    const radarLine = d3.lineRadial()
        .radius(d => rScale(d.value))
        .angle((d, i) => i * angleSlice)
        .curve(d3.curveLinearClosed);

    // Color scale
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.product))
        .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

    // -----------------------------
    // Draw Radar Areas
    // -----------------------------
    data.forEach(product => {

        const values = features.map(f => ({
            axis: f,
            value: product[f]
        }));

        svg.append("path")
            .datum(values)
            .attr("class", "radar-area")
            .attr("d", radarLine)
            .style("fill", color(product.product))
            .style("stroke", color(product.product))
            .style("stroke-width", 2);
    });

    // -----------------------------
    // Legend
    // -----------------------------
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${-width / 2 + 20}, ${-height / 2 + 20})`);

    data.forEach((d, i) => {
        const row = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);

        row.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", color(d.product));

        row.append("text")
            .attr("x", 18)
            .attr("y", 10)
            .text(d.product);
    });

    // -----------------------------
    // Interpretation Text
    // -----------------------------
    svg.append("text")
        .attr("x", 0)
        .attr("y", radius + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Higher values indicate stronger weather influence on product demand");

});
