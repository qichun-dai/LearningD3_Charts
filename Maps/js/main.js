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

    pathGenerator = d3.geoPath().projection(projection)

    
    // read data

    const geojson = await d3.json("./data/texas.json")
    
    chart.append("path")
     .attr("d", pathGenerator(geojson))
     .attr("fill", "none") // This removes the fill color
     .attr("stroke", "#666")
     
} 

drawMap()