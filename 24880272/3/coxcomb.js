(() => {
  console.log("Coxcomb JS loaded");

  const width = 400;
  const height = 400;
  const innerRadius = 50;
  const outerRadius = Math.min(width, height) / 2 - 20;

  const svg = d3.select("#coxcomb")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const tooltip = d3.select("#tooltip");
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  d3.csv("../3/EcoWear_Product_Sales.csv").then(data => {
    data.forEach(d => d.Sales = +d.Sales);

    const products = [...new Set(data.map(d => d.Product))];
    const segments = [...new Set(data.map(d => d.CustomerSegment))];

    const dataBySegment = segments.map(seg => {
      const obj = { CustomerSegment: seg };
      data.filter(d => d.CustomerSegment === seg)
          .forEach(d => obj[d.Product] = d.Sales);
      return obj;
    });

    const stack = d3.stack().keys(products);
    const series = stack(dataBySegment);

    const angle = d3.scaleBand()
      .domain(segments)
      .range([0, 2 * Math.PI]);

    const radius = d3.scaleLinear()
      .domain([0, d3.max(series, s => d3.max(s, d => d[1]))])
      .range([innerRadius, outerRadius]);

    const arc = d3.arc()
      .innerRadius(d => radius(d[0]))
      .outerRadius(d => radius(d[1]))
      .startAngle(d => angle(d.data.CustomerSegment))
      .endAngle(d => angle(d.data.CustomerSegment) + angle.bandwidth());

    svg.selectAll("g.layer")
      .data(series)
      .enter()
      .append("g")
      .attr("fill", d => color(d.key))
      .selectAll("path")
      .data(d => d)
      .enter()
      .append("path")
      .attr("d", arc);
  });
})();
