async function drawChart() {
    // read data
    const dataset = await d3.json("./data/unemployment.json")
    console.log(dataset)

    
    console.log(dataset[0].month)

    const dateParse = d3.timeParse("%m/%d/%Y")
    const xAccessor = d => dateParse(d.date)
    const yAccessor =  d => d.unemployment

    console.log(dateParse(dataset[0].date))

    const margin = { 
        left: 45, 
        right: 50, 
        top: 10, 
        bottom: 150 }
    const margin2 = {
        left: 45, 
        right: 50, 
        top: 490, 
        bottom: 60
      }
    const svgWidth = 900
    const svgHeight = 600
    const chartWidth = svgWidth - margin.left - margin.right
    const chartHeight = svgHeight - margin.top - margin.bottom
    const chartHeight2 = svgHeight - margin2.top - margin2.bottom


   



    

    const xScale = d3.scaleTime()
        .domain(d3.extent(dataset, xAccessor))
        .range([0,chartWidth])

    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)

    const xScale2 = d3.scaleTime()
        .domain(d3.extent(dataset, xAccessor))
        .range([0,chartWidth])

    const xAxisGenerator2 = d3.axisBottom()
        .scale(xScale2)

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([chartHeight, 0])
    
    const yScale2 = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([chartHeight2, 0])
    
    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)
    
    const svg = d3.select("#chart-area")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth)
    
    const chart = svg.append("g")
          .style("transform", 
          `translate(${margin.left}px, ${margin.top}px)`)
    
    const focus = chart.append("g")
      .attr("class", "focus")
      .style("transform",`translate(
        ${margin.left}px,
        ${margin.top}px
      )`)
    
      console.log(focus)
    
      const context = chart.append("g")
      .attr("class", "context")
      .style("transform", `translate(
        ${margin2.left}px,
        ${margin2.top}px
      )`)
    
      console.log(context)

    const startLineGenerator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(chartHeight)
    
    const endLineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))



    const LineGenerator2 = d3.line()
        .x(d => xScale2(xAccessor(d)))
        .y(d => yScale2(yAccessor(d)))

    focus.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", chartWidth)
        .attr("height", chartHeight)

    const line = focus.append("path")
        .attr("class","line")
        .attr("d", endLineGenerator(dataset))
        .attr("fill","none")
        .attr("stroke","gray")
        .attr("stroke-width",1.5)
        .attr("clip-path","url(#clip)")
        // .transition().duration(1000)
        // .attr("d", endLineGenerator(dataset))
        // adding animation doesn't work with brush
    
    const line2 = context.append("path")
        .attr("class","line")
        .attr("d", LineGenerator2(dataset))
        .attr("fill","none")
        .attr("stroke","gray")
        .attr("stroke-width",1)
    

    const xAxis = focus.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${svgHeight-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale))
        

    const xAxis2 = context.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${chartHeight2+5})`)
        .call(d3.axisBottom().scale(xScale2))
        .call(g => g.append("text")
            .attr("x", chartWidth/2)
            .attr("y", 30)
            .attr("fill", "#666")
            .attr("text-anchor", "end")
            .text("Date"))
        

    const yAxis = focus.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${-10},0)`)
        .call(d3.axisLeft().scale(yScale.nice()))
        .call(g => g.append("text")
        .attr('transform', `rotate(-90,${-margin.left/2},${chartHeight/2})`)
            .attr("x", -margin.left)
            .attr("y", chartHeight/2)
            .attr("fill", "#666")
            .attr("text-anchor", "middle")
            .text("Unemployment Rate"))

    const brush = d3.brushX()
    .handleSize(10)
     .extent([[0,0],[chartWidth,chartHeight]])
    .on("brush", brushed)
    
    context.append("g")
    .attr("class", "brush")
    .call(brush)

    function brushed(event) {
        xScale.domain(event.selection.map(xScale2.invert))
      
        focus.select(".x-axis")
        .call(d3.axisBottom().scale(xScale))
    
        line.attr("d", endLineGenerator(dataset))
    
      }
   
} 

drawChart()