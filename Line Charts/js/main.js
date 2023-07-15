async function drawChart() {
    // read data
    const dataset = await d3.json("./data/unemployment.json")
    console.log(dataset)

    
    console.log(dataset[0].month)

    const dateParse = d3.timeParse("%m/%d/%Y")
    const xAccessor = d => dateParse(d.date)
    const yAccessor =  d => d.unemployment

    console.log(dateParse(dataset[0].date))

    const margin = { left: 100, right: 15, top: 10, bottom: 50 }
    const svgWidth = window.innerWidth * 0.6
    const svgHeight = svgWidth * 0.5
    const chartWidth = svgWidth - margin.left - margin.right
    const chartHeight = svgHeight - margin.top - margin.bottom


    const svg = d3.select("#chart-area")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)

    const chart = svg.append("g")
      .style("transform", 
      `translate(${margin.left}px, ${margin.top}px)`)

    const xScale = d3.scaleTime()
        .domain(d3.extent(dataset, xAccessor))
        .range([0,chartWidth])

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([chartHeight, 0])

    
    const lineGenerator = d3.line()
        .x(d => xScale(xAccessor(d))) 
        .y(d => yScale(yAccessor(d)))

    const line = chart.append("path")
        .attr("class","line")
        .attr("d", lineGenerator(dataset))
        .attr("fill","none")
        .attr("stroke","gray")
        .attr("stroke-width",1.5)

    const xAxis = chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${svgHeight-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale))
        .call(g => g.append("text")
            .attr("x", chartWidth/2)
            .attr("y", margin.bottom-12)
            .attr("fill", "#666")
            .attr("text-anchor", "end")
            .text("Date"))

    const yAxis = chart.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${-10},0)`)
        .call(d3.axisLeft().scale(yScale.nice()))
        .call(g => g.append("text")
        .attr('transform', `rotate(-90,${-margin.left/2},${chartHeight/2})`)
            .attr("x", -margin.left/2)
            .attr("y", chartHeight/2)
            .attr("fill", "#666")
            .attr("text-anchor", "middle")
            .text("Unemployment Rate"))
   
} 

drawChart()