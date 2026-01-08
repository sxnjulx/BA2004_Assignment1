(() => {
  console.log("Radar JS loaded");

  const width = 400;
  const height = 400;
  const margin = 70;
  const radius = Math.min(width, height) / 2 - margin;

  const features = ['tavg','tmin','tmax','prcp','snow','wspd','tsun','pres'];
  const angleSlice = (Math.PI * 2) / features.length;

  const svg = d3.select("#radarChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  d3.csv("../../student2024880272_product_weather_normalized.csv").then(data => {

    data.forEach(d => features.forEach(f => d[f] = +d[f]));

    const rScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, radius]);

    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      svg.append("circle")
        .attr("class", "grid-circle")
        .attr("r", (radius / levels) * i);
    }

    const axis = svg.selectAll(".axis")
      .data(features)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis.append("line")
      .attr("x2", (_, i) => rScale(1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (_, i) => rScale(1) * Math.sin(angleSlice * i - Math.PI / 2));

    axis.append("text")
      .attr("x", (_, i) => rScale(1.15) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (_, i) => rScale(1.15) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("text-anchor", "middle")
      .text(d => d);

    const radarLine = d3.lineRadial()
      .radius(d => rScale(d.value))
      .angle((_, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    data.forEach(p => {
      const values = features.map(f => ({ axis: f, value: p[f] }));
      svg.append("path")
        .datum(values)
        .attr("d", radarLine)
        .attr("fill", color(p.product))
        .attr("stroke", color(p.product))
        .attr("fill-opacity", 0.35)
        .attr("stroke-width", 2);
    });

    const legend = svg.append("g")
      .attr("transform", `translate(${-width/2 + 10}, ${-height/2 + 10})`);

    data.forEach((d, i) => {
      const g = legend.append("g").attr("transform", `translate(0, ${i*18})`);
      g.append("rect").attr("width", 12).attr("height", 12).attr("fill", color(d.product));
      g.append("text").attr("x", 18).attr("y", 10).text(d.product);
    });

    svg.append("text")
      .attr("y", radius + 35)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .text("Higher values indicate stronger weather influence on product demand");

  }).catch(err => console.error("Radar CSV error:", err));
})();
