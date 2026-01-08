console.log("Bar Chart JS loaded");

// Dimensions and margins
const margin = { top: 50, right: 20, bottom: 50, left: 60 },
      width = 700 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

// SVG
const svg = d3.select("#barChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Tooltip
const tooltip = d3.select("#tooltip");

// Load CSV
d3.csv("EcoWear_Monthly_Sales.csv").then(data => {
    data.forEach(d => d.Sales = +d.Sales);

    // Group by Month & Product
    const nested = d3.rollups(
        data,
        v => d3.sum(v, d => d.Sales),
        d => d.Month,
        d => d.Product
    );

    // Prepare data in stacked format
    const months = nested.map(d => d[0]);
    const products = Array.from(new Set(data.map(d => d.Product)));

    const stackedData = nested.map(([month, prodArray]) => {
        const obj = { Month: month };
        prodArray.forEach(([prod, value]) => {
            obj[prod] = value;
        });
        // Fill missing products with 0
        products.forEach(p => { if(!obj[p]) obj[p] = 0; });
        return obj;
    });

    // Stack
    const stack = d3.stack().keys(products);
    const series = stack(stackedData);

    // X scale
    const x = d3.scaleBand()
        .domain(months)
        .range([0, width])
        .padding(0.2);

    // Y scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(series, s => d3.max(s, d => d[1]))])
        .nice()
        .range([height, 0]);

    // Color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(products);

    // Draw bars
    svg.selectAll("g.layer")
        .data(series)
        .enter()
        .append("g")
        .attr("class", "layer")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", d => x(d.data.Month))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .on("mouseover", function(event, d) {
            const product = this.parentNode.__data__.key;
            tooltip.style("opacity", 1)
                .html(`<strong>Month:</strong> ${d.data.Month}<br>
                       <strong>Product:</strong> ${product}<br>
                       <strong>Sales:</strong> ${d.data[product]}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 25) + "px");
            d3.select(this).attr("opacity", 0.7);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 25) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
            d3.select(this).attr("opacity", 1);
        });

    // X-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Y-axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 100}, 0)`);

    products.forEach((product, i) => {
        const g = legend.append("g").attr("transform", `translate(0, ${i*20})`);
        g.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color(product));
        g.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .text(product);
    });
}).catch(err => console.error(err));
