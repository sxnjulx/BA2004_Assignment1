console.log("Coxcomb JS loaded");

// Dimensions
const width = 500;
const height = 500;
const innerRadius = 50;
const outerRadius = Math.min(width, height) / 2 - 50;

// Color scale for Products
const color = d3.scaleOrdinal(d3.schemeCategory10);

// SVG
const svg = d3.select("#coxcomb")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`);

// Tooltip
const tooltip = d3.select("#tooltip");

// Load CSV
d3.csv("EcoWear_Product_Sales.csv").then(data => {
    // Convert sales to numbers
    data.forEach(d => d.Sales = +d.Sales);

    // Extract products and segments
    const products = Array.from(new Set(data.map(d => d.Product)));
    const segments = Array.from(new Set(data.map(d => d.CustomerSegment)));

    // Nest data by segment
    const dataBySegment = segments.map(segment => {
        const segmentData = data.filter(d => d.CustomerSegment === segment);
        const obj = { CustomerSegment: segment };
        segmentData.forEach(d => obj[d.Product] = d.Sales);
        return obj;
    });

    // Stack data
    const stack = d3.stack()
        .keys(products);

    const series = stack(dataBySegment);

    // Angle scale (each segment gets equal angle)
    const angle = d3.scaleBand()
        .domain(segments)
        .range([0, 2 * Math.PI])
        .padding(0.05);

    // Radius scale (max stacked value)
    const maxSales = d3.max(series, s => d3.max(s, d => d[1]));
    const radius = d3.scaleLinear()
        .domain([0, maxSales])
        .range([innerRadius, outerRadius]);

    // Arc generator
    const arc = d3.arc()
        .innerRadius(d => radius(d[0]))
        .outerRadius(d => radius(d[1]))
        .startAngle(d => angle(d.data.CustomerSegment))
        .endAngle(d => angle(d.data.CustomerSegment) + angle.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius);

    // Draw arcs
    svg.selectAll("g.layer")
        .data(series)
        .enter()
        .append("g")
        .attr("class", "layer")
        .attr("fill", d => color(d.key))
        .selectAll("path")
        .data(d => d)
        .enter()
        .append("path")
        .attr("d", arc)
        .on("mouseover", function(event, d) {
            const product = this.parentNode.__data__.key;
            tooltip.style("opacity", 1)
                .html(`<strong>Segment:</strong> ${d.data.CustomerSegment}<br>
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

    // Legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${-(width/2)+10}, ${-(height/2)+10})`);

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
