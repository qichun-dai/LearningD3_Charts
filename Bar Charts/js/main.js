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

    const startLineGenerator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(chartHeight)
    
        
    const endLineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))

    const line = chart.append("path")
        .attr("class","line")
        .attr("d", startLineGenerator(dataset))
        .attr("fill","none")
        .attr("stroke","gray")
        .attr("stroke-width",1.5)
        .transition().duration(1000)
        .attr("d", endLineGenerator(dataset))
        

    chart.append('rect')
    .attr('width', chartWidth)
    .attr('height', chartHeight)
    .style('opacity', 0)
    .on('touchmouse mousemove', function(event){
      const mousePos = d3.pointer(event, this)
      
      // x coordinate stored in mousePos index 0
      const date = xScale.invert(mousePos[0])
      const index = d3.bisect(dataset, date)

      const dateBisector = d3.bisector(xAccessor).left
      const bisectionIndex = dateBisector(dataset, date)
      const hoveredIndexData = dataset[bisectionIndex - 1]

      console.log(hoveredIndexData)
      tooltipDot.style('opacity', 1)
        .attr('cx', xScale(xAccessor(hoveredIndexData)))
        .attr('cy', yScale(yAccessor(hoveredIndexData)))

        tooltip
        .style("display", "block")
        .style("top", `${yScale(yAccessor(hoveredIndexData)) - 60}px`)
        .style("left", `${xScale(xAccessor(hoveredIndexData))+ window.innerWidth * 0.2}px`);

        tooltip.select(".unemployment").text(`${yAccessor(hoveredIndexData)}%`);

        const dateFormatter = d3.timeFormat("%B %-d, %Y");

        tooltip.select(".date").text(`${dateFormatter(xAccessor(hoveredIndexData))}`)
    })
    .on("mouseleave", function () {
      tooltipDot.style("opacity", 0);
      tooltip.style("display", "none");
    });
    
    
    const tooltip = d3.select("#tooltip")

    const tooltipDot = chart
        .append("circle")
        .attr("r", 5)
        .attr("fill", "#fc8781")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .style("opacity", 0)
        .style('pointer-events', 'none')
    

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