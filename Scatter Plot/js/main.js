async function drawChart() {
    // read data
    const dataset = await d3.csv("./data/iris.csv")
    console.log(dataset)

    console.log(d3.extent(dataset, d => d.PetalLengthCm))

    const margin = { left: 100, right: 10, top: 10, bottom: 50 }
    const svgWidth = window.innerWidth * 0.8
    const svgHeight = svgWidth * 0.6
    const chartWidth = svgWidth - margin.left - margin.right
    const chartHeight = svgHeight - margin.top - margin.bottom
    console.log(chartWidth)

    const svg = d3.select("#chart-area")
    .attr("height", svgHeight)
    .attr("width", svgWidth)

    const chart = svg.append("g")
      .style("transform", 
      `translate(${margin.left}px, ${margin.top}px)`)

    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, d => d.PetalWidthCm))
        .range([0,chartWidth])

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, d => d.PetalLengthCm))
        .range([chartHeight, 0])

    const dots = chart.selectAll("circle")
        .data(dataset)
        .enter().append("circle")
        .attr("cx", d => xScale( d.PetalWidthCm))
        .attr("cy", d => yScale( d.PetalLengthCm))
        .attr("r", 4)
        .attr("fill", "black")

    const xAxis = chart.append("g")
                    .attr("transform", `translate(0,${svgHeight-margin.bottom})`)
                    .call(d3.axisBottom().scale(xScale))
                    .call(g => g.append("text")
                        .attr("x", chartWidth/2)
                        .attr("y", margin.bottom-12)
                        .attr("fill", "#666")
                        .attr("text-anchor", "end")
                        .text("Patal Width"))

    const yAxis = chart.append("g")
                    .attr("transform", `translate(${-10},0)`)
                    .call(d3.axisLeft().scale(yScale))
                    .call(g => g.append("text")
                    .attr('transform', `rotate(-90,${-margin.left/2},${chartHeight/2})`)
                        .attr("x", -margin.left/2)
                        .attr("y", chartHeight/2)
                        .attr("fill", "#666")
                        .attr("text-anchor", "middle")
                        .text("Patal Length"))

    
    
} 

drawChart()