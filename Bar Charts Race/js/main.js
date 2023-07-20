export async function BarChartRace(chartID,) {
    // read data
    const dataset = await d3.csv("./data/Bar Chart Race.csv")
    console.log(dataset)

    const xAccessor = d => d.frequency
    const yAccessor =  d => d.location

    const margin = { left: 200, right: 50, top: 10, bottom: 50 }
    const svgWidth = 800
    const svgHeight = 500
    const chartWidth = svgWidth - margin.left - margin.right
    const chartHeight = svgHeight - margin.top - margin.bottom


    const svg = d3.select("#chart-area")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)

    const chart = svg.append("g")
      .style("transform", 
      `translate(${margin.left}px, ${margin.top}px)`)

    const xScale = d3.scaleLinear()
        .domain([0,d3.max(dataset, xAccessor)])
        .range([0,chartWidth])

    const yScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .range([0, chartHeight])
        .round(true)
        .padding(0.25)

    const bar = chart.append("g")
                .attr("fill","#FFC917")
                .selectAll("rect")
                .data(dataset)
                .join("rect")
                .attr("class", yAccessor)
                .attr("x", xScale(0))
                .attr("y", (d, i) => yScale(i))
                .attr("width", d => xScale(xAccessor(d)) - xScale(0))
                .attr("height", yScale.bandwidth())

    chart.append("g")
    .attr("text-anchor", "end")
    .attr("font-family", "sans-serif")
    .attr("font-size", 16)
    .attr('font-weight', 600)
    .selectAll("text")
    .data(dataset)
    .join("text")
    .attr("x", d => xScale(0))
    .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("dx", -4)
    .attr("fill", "#003082")
    .text(d => yAccessor(d))

    chart.append("g")
    .attr("text-anchor", "start")
    .attr("font-family", "sans-serif")
    .attr("font-size", 16)
    .attr('font-weight', 600)
    .selectAll("text")
    .data(dataset)
    .join("text")
    .attr("x", d => xScale(xAccessor(d)))
    .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("dx", +4)
    .attr("fill", "#003082")
    .text(d => xAccessor(d))
    
    



    
                

    

    // const xAxis = chart.append("g")
    //     .attr("class", "x-axis")
    //     .attr("transform", `translate(0,${svgHeight-margin.bottom})`)
    //     .call(d3.axisBottom().scale(xScale))
    //     .call(g => g.append("text")
    //         .attr("x", chartWidth/2)
    //         .attr("y", margin.bottom-12)
    //         .attr("fill", "#666")
    //         .attr("text-anchor", "end")
    //         .text("Date"))

    // const yAxis = chart.append("g")
    //     .attr("class", "y-axis")
    //     .attr("transform", `translate(${-10},0)`)
    //     .call(d3.axisLeft().scale(yScale.nice()))
    //     .call(g => g.append("text")
    //     .attr('transform', `rotate(-90,${-margin.left/2},${chartHeight/2})`)
    //         .attr("x", -margin.left/2)
    //         .attr("y", chartHeight/2)
    //         .attr("fill", "#666")
    //         .attr("text-anchor", "middle")
    //         .text("Unemployment Rate"))
   
} 

drawChart()