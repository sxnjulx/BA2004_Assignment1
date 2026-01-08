(() => {
  console.log("Bar Chart JS loaded");

  const margin = { top: 30, right: 20, bottom: 40, left: 50 };
  const width = 500 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const svg = d3.select("#barChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const tooltip = d3.select("#tooltip");

  d3.csv("../4/EcoWear_Monthly_Sales.csv").then(data => {
    data.forEach(d => d.Sales = +d.Sales);

    const months = [...new Set(data.map(d => d.Month))];
    const products = [...new Set(data.map(d => d.Product))];

    const stackedData = months.map(m => {
      const obj = { Month: m };
      products.forEach(p => obj[p] = 0);
      data.filter(d => d.Month === m)
          .forEach(d => obj[d.Product] = d.Sales);
      return obj;
    });

    const stack = d3.stack().keys(products);
    const series = stack(stackedData);

    const x = d3.scaleBand().domain(months).range([0, width]).padding(0.2);
    const y = d3.scaleLinear()
      .domain([0, d3.max(series, s => d3.max(s, d => d[1]))])
      .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg.selectAll("g")
      .data(series)
      .enter()
      .append("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .enter()
      .append("rect")
      .attr("x", d => x(d.data.Month))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth());

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));
  });
})();
