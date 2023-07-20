async function BarChartRace(chartID) {
    
    const dataset = await d3.csv("./data/Bar Chart Race.csv",
    d => {
        d.running_freq = +d.running_freq; // Convert to number
        return d;
      })
    const organizedData = d3.group(dataset, d => d.YearMonth)
    
    console.log(dataset)

    const xAccessor = d => d.running_freq
    const yAccessor =  d => d.station

    const chartSettings = {
        margin: { left: 200, right: 50, top: 10, bottom: 50 },
        width: 800,
        height: 600,
        padding: 40,
        titlePadding: 5,
        columnPadding: 0.4,
        ticksInXAxis: 5,
        duration: 3500
      }

    chartSettings.chartWidth = chartSettings.width - chartSettings.margin.left - chartSettings.margin.right
    chartSettings.chartHeight = chartSettings.height - chartSettings.margin.top - chartSettings.margin.bottom
   

    const chartContainer = d3.select(`#${chartID} .chart-container`)
    const xAxisContainer = d3.select(`#${chartID} .x-axis`)
    const yAxisContainer = d3.select(`#${chartID} .y-axis`)

    const xScale = d3.scaleLinear()
        //.domain([0,d3.max(dataset, xAccessor)])
        .range([0,chartSettings.chartWidth])

    const yScale = d3.scaleBand()
        //.domain(d3.range(dataset.length))
        .range([0, chartSettings.chartHeight])
        .round(true)
        .padding(0.4)


    const svg = d3.select(`#${chartID}`)
    .attr("height", chartSettings.height)
    .attr("width", chartSettings.width)

    chartContainer
      .style("transform", 
      `translate(${chartSettings.margin.left}px, ${chartSettings.margin.top}px)`)

    const textYear = chartContainer
      .select(".current-date")
      .attr(
        "transform",
        `translate(${chartSettings.chartWidth} ${chartSettings.chartHeight})`
      )

    const yAxis = d3.axisLeft(yScale).tickSize(0)

    yAxisContainer.call(yAxis)

    function render(dataset) {
    yScale.domain(dataset.map(d => yAccessor(d)))
    xScale.domain([0, d3.max(dataset, d => xAccessor(d))])
    
    const bars = chartContainer.selectAll(".bar")
            .data(dataset, d => xAccessor(d))
    
    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("y", d => yScale(yAccessor(d)))
        .attr("height", yScale.bandwidth())
        .attr("width", 0) // Start width from 0 for entering bars
        .transition().duration(1000)
        .attr("width", d => xScale(xAccessor(d)))
        .attr("x", 0)

    bars.transition().duration(1000)
        .attr("y", d => yScale(d.station)) // Animate the y position to its new position
        .attr("width", d => xScale(xAccessor(d)))
        .attr("height", yScale.bandwidth())

    bars.exit()
        .transition().duration(1000)
        .attr("width", 0)
        .remove()

    yAxisContainer.transition().duration(1000).call(yAxis)

    const barLabels = chartContainer.selectAll(".bar-label")
        .data(dataset, d => xAccessor(d));

    // For new bars
    barLabels.enter().append("text")
        .attr("class", "bar-label")
        .attr("y", d => yScale(yAccessor(d)) + yScale.bandwidth() / 2 + 1)  // Vertically center the text inside the bar
        .attr("x", d => xScale(xAccessor(d)) + 5)  // Position after the end of the bar. The '5' is a small padding.
        .attr("alignment-baseline", "left")
        .text(d => d.running_freq.toFixed(0))  // To limit the decimal places, you can use toFixed(2)
        .attr("opacity", 0)  // Initially set to 0 to fade them in
        .transition().duration(1000)
        .attr("opacity", 1);  // Fade in the text

    // For updating bars
    barLabels.transition().duration(1000)
        .attr("y", d => yScale(yAccessor(d)) + yScale.bandwidth() / 2 + 1)
        .attr("x", d => xScale(xAccessor(d)) + 5)
        .text(d => d.running_freq.toFixed(0));

    // Remove labels for bars that are no longer there
    barLabels.exit()
        .transition().duration(1000)
        .attr("opacity", 0)
        .remove();
    }
    
    const sortedYearMonths = Array.from(organizedData.keys()).sort()

    let currentYearMonthIndex = 0

    // change the numeric YearMonth to display like 2023 July
    function formatYearMonth(ym) {
        const year = ym.slice(0, 4);
        const monthNum = parseInt(ym.slice(4, 6), 10);
    
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthName = monthNames[monthNum - 1];
    
        return `${year} ${monthName}`;
    }

    setInterval(function() {
        if (currentYearMonthIndex >= sortedYearMonths.length) {
            return;  // exit if we've shown all the data
        }

        const currentYearMonth = sortedYearMonths[currentYearMonthIndex]
        const currentData = organizedData.get(currentYearMonth)
        //filter out the station that doesn't have the visit so far
                            .filter(d => d.running_freq > 0)

        // Assuming 'running_freq' is the value for your bars
        currentData.sort((a, b) => b.running_freq - a.running_freq)
        //const top5station = currentData.slice(0, 5)

        render(currentData)
        
        textYear.text( formatYearMonth(currentYearMonth.toString()))

        currentYearMonthIndex++

    }, 1000)
} 

BarChartRace("chart-area")