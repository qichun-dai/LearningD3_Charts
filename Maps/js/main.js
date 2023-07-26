async function drawMap() {
    const margin = { left: 15, right: 15, top: 15, bottom: 15 }
    const svgWidth = 1000
    const svgHeight = 1000
    const chartWidth = svgWidth - margin.left - margin.right
    const chartHeight = svgHeight - margin.top - margin.bottom

    const svg = d3.select("#chart-area")
                .append("svg")
                .attr("width", svgWidth)  // apply width,height to svg
                .attr("height", svgHeight)
                // .attr("viewBox", [0, 0, svgWidth, svgHeight])
                // .attr("preserveAspectRatio", "xMidYMid meet")
    
    const chart = svg.append("g")
                .style("transform", 
                 `translate(${margin.left}px, ${margin.top}px)`)

    const projection = d3.geoMercator()
    projection
    //.fitExtent([[margin.top, margin.left], [svgWidth - margin.bottom, svgHeight - margin.right]], geojson)
    //.fitSize([chartWidth,chartHeight],geojson)
    //both of these methods do not work
    .scale(3500)
    .center([-99.9018, 33.9686])
    const path = d3.geoPath().projection(projection)

    
    // read data

    const geojson = await d3.json("./data/texas.json")
    

    console.log(geojson)

    // function waterCategory(value) {
    //     if (value < 1000) return "low"   // replace 1000 with your desired threshold
    //     if (value < 5000) return "medium" // replace 5000 with your desired threshold
    //     return "high"
    // }
    
    // geojson.geometries.forEach((geometry, index) => {
    //     if (dataset[index]) {
    //         geometry.properties = geometry.properties || {}
    //         geometry.properties.AWATERCategory = waterCategory(+dataset[index].AWATER)
    //     }
    // })
    
    // const colorScale = d3.scaleOrdinal()
    // .domain(["low", "medium", "high"]) 
    // .range(["#a6cee3", "#1f78b4", "#b2df8a"])
    
    // chart.selectAll("path")
    // .data(geojson.geometries) 
    // .enter().append("path")
    // .attr("d", path)
    // .attr("fill", d => {
    //     if (d.properties && d.properties.AWATERCategory) {
    //         return colorScale(d.properties.AWATERCategory)
    //     } else {
    //         return "#ccc";  // default color if no category is found
    //     }
    // })
    // .attr("stroke", "#666")
    // .attr("stroke-width", "2")
    // .attr("fill-opacity", 0.2)

    // Set up the color scale
    const colorScale = d3.scaleSequential()
        .domain(d3.extent(geojson.features, d => d.properties.AWATER))
        .interpolator(t => d3.interpolateBlues(0.1 + t * 0.9 ))

    const tooltip = d3.select("#tooltip")
    const formatNumber = d3.format(",")
    // Draw the map polygons
    chart.selectAll("path")
        .data(geojson.features)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", d => colorScale(d.properties.AWATER))
        .attr("stroke", "#666")
        .on("mouseover", function(event,d) {
            tooltip
                .style("left", (event.pageX -50) + "px")
                .style("top", (event.pageY-margin.top-50) + "px")
                .style("display", "inline-block")
                .html(`AWATER: ${formatNumber(d.properties.AWATER)}`)
        })
        .on("mousemove", function(event,d) {
            tooltip
                .style("left", (event.pageX -50) + "px")
                .style("top", (event.pageY-margin.top-50 ) + "px")
        })
        .on("mouseout", function() {
            tooltip.style("display", "none")
        })
     
} 

drawMap()