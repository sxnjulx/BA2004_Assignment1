(() => {
  console.log("Sankey JS loaded");

  const width = 600;
  const height = 350;

  const svg = d3.select("#sankey")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  d3.csv("../2/EcoWear_Customer_Flow.csv").then(data => {
    data.forEach(d => d.value = +d.value);

    const nodeNames = [...new Set(data.flatMap(d => [d.source, d.target]))];
    const nodes = nodeNames.map(name => ({ name }));

    const links = data.map(d => ({
      source: nodeNames.indexOf(d.source),
      target: nodeNames.indexOf(d.target),
      value: d.value
    }));

    const sankey = d3.sankey()
      .nodeWidth(20)
      .nodePadding(15)
      .extent([[1, 1], [width - 1, height - 6]]);

    const sankeyData = sankey({
      nodes: nodes.map(d => ({ ...d })),
      links: links.map(d => ({ ...d }))
    });

    svg.append("g")
      .selectAll("path")
      .data(sankeyData.links)
      .enter()
      .append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", d => d.target.name === "Drop-off" ? "#e74c3c" : "#2ecc71")
      .attr("stroke-width", d => Math.max(1, d.width))
      .attr("fill", "none")
      .attr("opacity", 0.7);

    svg.append("g")
      .selectAll("rect")
      .data(sankeyData.nodes)
      .enter()
      .append("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", "#1f77b4");

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

  }).catch(err => console.error(err));
})();
