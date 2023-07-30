async function drawChart() {
    // read data
    const dataset = await d3.csv("./data/amsterdam 2022.csv")
    console.log(dataset)

    const parseDate = d3.timeParse("%Y-%m-%d")
    const dateAccessor = d => parseDate(d.datetime)

    const monthFormat = d3.timeFormat("%m")
    const yAccessor = d => +monthFormat(dateAccessor(d)) - 1 // -1 since months are 0-based

    const dayOfMonthFormat = d3.timeFormat("%d");
    const xAccessor = d => +dayOfMonthFormat(dateAccessor(d)) - 1 // -1 since days start from 1

    const metricAccessor = d => +d.precip

    // Dimensions
    const margin = { left: 50, right: 50, top: 100, bottom: 50 }
    const svgWidth = 900
    const svgHeight = 600
    const chartWidth = svgWidth - margin.left - margin.right
    const chartHeight = svgHeight - margin.top - margin.bottom
    cellSize = chartWidth/31


    const svg = d3.select("#chart-area")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)

    const chart = svg.append("g")
      .style("transform", 
      `translate(${margin.left}px, ${margin.top}px)`)


    const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(dataset, d => metricAccessor(d))]); 

    chart.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", d => xAccessor(d) * cellSize)
    .attr("y", d => yAccessor(d) * cellSize)  
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("fill", d => metricAccessor(d)>=0 ? colorScale(metricAccessor(d)) : "#cccccc")
    // .attr("stroke", "#666")  
    // .attr("stroke-width", 0.5)  
    // .attr("stroke-opacity", 0.15)

    

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Add month on the left
    chart.selectAll("text.month-label")
        .data(monthNames)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", -10)
        .attr("y", (d, i) => (i +0.5)* cellSize ) // Roughly centering the month name for 31 days
        .text(d => d)
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")

    // Add day numbers on top
    for (let i = 1; i <= 31; i++) {
        chart.append("text")
            .attr("x", (i - 0.5) * cellSize)
            .attr("y", -15)
            .text(i)
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "hanging")
   
   
    } 

    //adding legend
    const defs = svg.append("defs");

    const gradient = defs.append("linearGradient")
        .attr("id", "precipitation-gradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "100%")
        .attr("y2", "100%")

    gradient.selectAll(".stop")
        .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: colorScale(t) })))
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color)

    const legendWidth = 230
    const legendHeight = 20
    const marginLegend = 30

    svg.append("rect")
        .attr("x", svgWidth / 2 - legendWidth / 2)
        .attr("y", marginLegend)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#precipitation-gradient)")

    svg.selectAll(".legendText")
        .data(colorScale.ticks())
        .enter().append("text")
        .attr("class", "legendText")
        .attr("x", d => svgWidth / 2 - legendWidth / 2 + legendWidth * (d / d3.max(colorScale.domain())))
        .attr("y", marginLegend-10)
        .style("text-anchor", "middle")
        .text(d => d)
}

drawChart()