async function drawChart() {

    // 1. Access data
  
    let dataset = await d3.csv("./data/photos_2019.csv")
    let df = await d3.csv("./data/df_2019.csv")

    console.log(dataset)

    const dateParser = d3.timeParse("%Y-%m-%d %H:%M:%S")
    const dateAccessor = d => dateParser(d.LastModified)

    const timeFormatter = d3.timeFormat("%H:%M:%S")
    const timeAccessor = d => timeFormatter(dateAccessor(d))

    const hourAccessor = d => dateAccessor(d).getHours() + dateAccessor(d).getMinutes() / 60

    const dateParserLine = d3.timeParse("%m/%d/%Y");
    const dateAccessorLine = d => dateParserLine(d.date)
    const countAccessor = d => +d.numbers



  
    // 2. Create chart dimensions
  
    const width = 900
    let dimensions = {
      width: width,
      height: width,
      radius: width / 2,
      margin: {
        top: 140,
        right: 140,
        bottom: 140,
        left: 140,
      },
    }
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
    dimensions.boundedRadius = dimensions.radius - ((dimensions.margin.left + dimensions.margin.right) / 2)
  
    // 3. Draw canvas
  
    const wrapper = d3.select("#chart-area")
      .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
  
    const bounds = wrapper.append("g")
        .style("transform", `translate(
          ${dimensions.margin.left + dimensions.boundedRadius}px, 
          ${dimensions.margin.top + dimensions.boundedRadius}px)`)
  
  
  
    // 4. Create scales
    const roundedExtent = d3.extent(dataset, dateAccessor).map(d => d3.timeMonth.floor(d))

    if (roundedExtent[1].getMonth() !== 0 || roundedExtent[1].getDate() !== 1) {  
        roundedExtent[1] = new Date(roundedExtent[1].getFullYear() + 1, 0, 1);  // set to January 1st of the next year
    }

    console.log("look here")
    console.log(roundedExtent)

    const angleScale = d3.scaleTime()
    .domain(roundedExtent)
    .range([0, Math.PI * 2])
  

    const radiusScale = d3.scaleLinear()
    .domain([0,24])
    .range([0, dimensions.boundedRadius])
 

    const getXFromDataPoint = (d, offset = 1.4) => {
      getCoordinatesForAngle(angleScale(dateAccessor(d),offset))[0]
    }
  
    const getYFromDataPoint = (d, offset = 1.4) => {
      getCoordinatesForAngle(angleScale(dateAccessor(d),offset))[1]
    }
  
    // 6. Draw peripherals
    const peripherals = bounds.append("g")
    const months = d3.timeMonth.range(...angleScale.domain())

    console.log(months)

    const getCoordinatesForAngle = (angle, offset = 1) => [
      Math.cos(angle - Math.PI/2) * dimensions.boundedRadius * offset,
      Math.sin(angle - Math.PI/2) * dimensions.boundedRadius * offset
    ]
  
    months.forEach(month => {
      const angle = angleScale(month)
      const [x, y] = getCoordinatesForAngle(angle, 1)
  
      peripherals.append("line")
      .attr("x2", x)
      .attr("y2", y)
      .attr("class", "grid-line")
  
      const [labelX, labelY] = getCoordinatesForAngle(angle, 1.05)
  
      peripherals.append("text")
      .text(d3.timeFormat("%b")(month))
      .attr("x", labelX)
      .attr("y", labelY)
      .attr("class", "tick-label")
      .style("text-anchor",
      Math.abs(labelX)< 5 ? "middle":
      labelX > 0          ? "start":
                            "end")
      
    })
  
    const tickValues = [0, 6, 12, 18, 24];

    tickValues.forEach(d => {
        peripherals.append("circle")
            .attr("r", radiusScale(d))
            .attr("class", "grid-line");
    })
  
    const gridLabelsBackgroud = tickValues.map(d => {
      if (d<1) return
      return peripherals.append("rect")
      .attr("y", -radiusScale(d)-10)
      .attr("width", 40)
      .attr("height", 20)
      .attr("fill", "#f8f9fa")
    })
  
    const gridLabels = tickValues.map(d => {
      if (d<1) return
      return peripherals.append("text")
      .attr("x", 4)
      .attr("y", -radiusScale(d)+2)
      .attr("class", "tick-label-hour")
      .html(`${d3.format(".0f")(d)}h`)
    })
  
  
    // 5. Draw data
    dataset.forEach(d => {
        const angle = angleScale(dateAccessor(d));
        const radius = radiusScale(hourAccessor(d));
        const [x, y] = getCoordinatesForAngle(angle, radius / dimensions.boundedRadius)
    
        bounds.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 2)  // radius of the circle. Adjust as needed.
            .attr("fill", "#72B2D9")
            .attr("opacity",0.6)
    })




    const outerRadius = dimensions.boundedRadius + 130;  // Adjust as necessary
    const innerRadius = dimensions.boundedRadius + 50;  // Adjust as necessary


    const radialScale = d3.scaleLinear()
        .domain([0, d3.max(df, countAccessor)])
        .range([innerRadius, outerRadius]);

    const lineGenerator = d3.lineRadial()
        .angle(d => angleScale(dateAccessorLine(d)))
        .radius(d => radialScale(countAccessor(d)))

    // Drawing the radial line chart
    const loopedData = [...df, df[0]]
    bounds.append("path")
        .attr("fill", "none")
        .attr("stroke", "#72B2D9")  
        .attr("d", lineGenerator(loopedData))
  
  
    // 7. Set up interactions
  
  
  }
  drawChart()