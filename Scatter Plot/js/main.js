async function drawChart() {
    // read data
    const dataset = await d3.csv("./data/iris.csv")
    console.log(dataset)
    console.log(d3.extent(dataset, d => d.PetalLengthCm))

    const xAccessor =  d => d.PetalWidthCm
    const yAccessor = d => d.PetalLengthCm
    const colorAccessor = d => d.Species

    const margin = { left: 100, right: 10, top: 10, bottom: 50 }
    const svgWidth = window.innerWidth * 0.6
    const svgHeight = svgWidth * 0.5
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
        .domain(d3.extent(dataset, xAccessor))
        .range([0,chartWidth])

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([chartHeight, 0])

    const colorScale = d3.scaleOrdinal()
            .domain(d3.extent(dataset, colorAccessor))
            .range(d3.schemeCategory10)

    const dots = chart.selectAll("circle")
        .data(dataset)
        .enter().append("circle")
        .attr("cx", d => xScale( xAccessor(d)))
        .attr("cy", d => yScale( yAccessor(d)))
        .attr("r", 3)
        .attr("fill-opacity",0.6)
        .attr("fill", d => colorScale( colorAccessor(d)))

        

    const xAxis = chart.append("g")
                    .attr("transform", `translate(0,${svgHeight-margin.bottom})`)
                    .call(d3.axisBottom().scale(xScale.nice()))
                    .call(g => g.append("text")
                        .attr("x", chartWidth/2)
                        .attr("y", margin.bottom-12)
                        .attr("fill", "#666")
                        .attr("text-anchor", "end")
                        .text("Petal Width"))

    const yAxis = chart.append("g")
                    .attr("transform", `translate(${-10},0)`)
                    .call(d3.axisLeft().scale(yScale.nice()))
                    .call(g => g.append("text")
                    .attr('transform', `rotate(-90,${-margin.left/2},${chartHeight/2})`)
                        .attr("x", -margin.left/2)
                        .attr("y", chartHeight/2)
                        .attr("fill", "#666")
                        .attr("text-anchor", "middle")
                        .text("Petal Length"))

    
    
} 

drawChart()