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
        bottom: 50
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
     .extent([[0,0],[chartWidth,chartHeight2+4]])
    .on("brush end", brushed)

    

    const handle = context.selectAll(".custom-handle")
    .data([{ type: "w" }, { type: "e" }])
    .enter().append("path")
    .attr("class", "custom-handle")
    .attr("fill", "#666")
    .attr("fill-opacity", 0.8)
    .attr("stroke", "#000")
    .attr("stroke-width", 1.5)
    .attr("cursor", "ew-resize")
    .attr("d", d3.arc()
        .innerRadius(0)
        .outerRadius(chartHeight2 / 2)
        .startAngle(d => { return d.type === "w" ? Math.PI : 0; })
        .endAngle(d => { return d.type === "w" ?  2 * Math.PI: Math.PI; }))
    .attr("display", "none")
    //set this in css not working, why?
    
    context.append("g")
    .attr("class", "brush")
    .call(brush)

    
    function brushed(event) {
        let s0, s1;
    
        if (event.selection === null) {
            xScale.domain(d3.extent(dataset, xAccessor))
            focus.select(".x-axis")
                .call(d3.axisBottom().scale(xScale))
            line.attr("d", endLineGenerator(dataset))
        } else {
            [s0, s1] = event.selection;
    
            xScale.domain([s0, s1].map(xScale2.invert));
    
            focus.select(".x-axis")
                .call(d3.axisBottom().scale(xScale));
    
            line.attr("d", endLineGenerator(dataset));
        }
    
        // Only set handle positions if they're defined (i.e., if a selection exists)
        if (typeof s0 !== "undefined" && typeof s1 !== "undefined") {
            handle.attr("display", null)
                .attr("transform", (d, i) => `translate(${i === 0 ? s0 : s1},${chartHeight2 / 2 + 2.5})`)
                //+2.5 because I added 5 to the x-axis as well
        }
    }
   
} 

drawChart()