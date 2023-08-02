async function drawTable() {
    // load data
    const dateParser = d3.timeParse("%Y-%m-%d")
    const dateAccessor = d => dateParser(d.datetime)
    let dataset = await d3.csv("./data/amsterdam 2022.csv")
    dataset = dataset.sort((a,b) => dateAccessor(a) - dateAccessor(b))

    console.log(dataset)
  
    const table = d3.select("#chart-area")
  
    const dateFormat = d => d3.timeFormat("%m-%d")(dateParser(d))

    const invalidDates = dataset.filter(d => !dateAccessor(d));
    console.log('Invalid Dates:', invalidDates);
    
  
    const numberOfRows= 60
    const colorScale = d3.interpolateHcl("#a5c3e8", "#efa8a1")
    const grayColorScale = d3.interpolateHcl("#fff", "#bdc4ca")
    const tempScaleMin = d3.scaleLinear()
      .domain(d3.extent(dataset, d => +d.tempmin))
      .range([0, 1])

    const tempScaleMax = d3.scaleLinear()
    .domain(d3.extent(dataset, d => +d.tempmax))
    .range([0, 1])
    
    const windScale = d3.scaleLinear()
      .domain(d3.extent(dataset.slice(0, numberOfRows), d => +d.windspeed))
      .range([0, 1])

    const tempMinMax = [
    d3.min(dataset, d => +d.tempmin),
    d3.max(dataset, d => +d.tempmax)
    ];
    const markerScale = d3.scaleLinear()
    .domain(tempMinMax)
    .range([0, 90])

    // const markerScale = d3.scaleLinear()
    //   .domain(d3.extent(dataset, d => +d.tempmax))
    //   .range([0, 80])
  
    console.log((d3.extent(dataset.slice(0, numberOfRows), d => +d.tempmax)))
    function getIconPath(iconType) {
        return `./img/${iconType}.svg`;
    }

    const columns = [
      {label: "Day", type: "date", format: d => dateFormat(d.datetime)},
      {label: "Description", type: "text", format: d => d.description},
      {label: "Min Temp", type: "number", format: d => d3.format(".1f")(d.tempmin), background: d => colorScale(tempScaleMin(+d.tempmin))},
      {label: "Min & Max Temp Marker", type: "marker", format: d => {
        const x1 = markerScale(+d.tempmin) + "%";
        const x2 = markerScale(+d.tempmax) + "%";
        return `
            <svg width="100%" height="20">
                <line x1="${x1}" y1="10" x2="${x2}" y2="10" stroke="#34495e" />
                <line x1="${x1}" y1="0" x2="${x1}" y2="20" stroke="#34495e" />
                <line x1="${x2}" y1="0" x2="${x2}" y2="20" stroke="#34495e" />
            </svg>
        `;
      }},
      {label: "Max Temp", type: "number", format: d => d3.format(".1f")(d.tempmax), background: d => colorScale(tempScaleMax(+d.tempmax))},
      {label: "Wind Speed", type: "number", format: d => d3.format(".2f")(+d.windspeed), background: d => grayColorScale(windScale(+d.windspeed))},
      {
        label: "Weather Icon",
        type: "centered",
        format: d => {
            return `
                <svg width="40" height="40">
                    <image href="${getIconPath(d.icon)}" width="30" height="30" />
                </svg>
            `;
        }
    },
      {label: "UV Index", type: "symbol", format: d => new Array(+d.uvindex).fill("✸").join("")},
    ]

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let dataByMonth = {}

    dataset.forEach(d => {
        let monthName = months[dateAccessor(d).getMonth()]
        console.log(monthName)
        if(!dataByMonth[monthName]) {
            dataByMonth[monthName] = []
        }
        dataByMonth[monthName].push(d)
    });

    const dropdown = d3.select(".container").insert("select", "#chart-area").attr("id", "monthDropdown")

    dropdown.selectAll("option")
        .data(months)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d)

    // Add event listener to update table on dropdown change
    dropdown.on("change", function() {
        updateTable(dataByMonth[this.value])
    })

   // Add table headers and an empty tbody
    table.append("thead").append("tr")
    .selectAll("th")
    .data(columns)
    .join("th")
    .text(d => d.label)
    .attr("class", d => d.type)

    // Append an empty tbody
    table.append("tbody")

    // update the table with value selected in the button

    function updateTable(dataForMonth) {
    const tbody = d3.select("#chart-area tbody");
    tbody.selectAll("tr").remove();

    // Use the actual data rows for the data bind
    tbody.selectAll("tr")
        .data(dataForMonth)
        .join("tr")
        .selectAll("td")
        .data(d => columns.map(column => ({ value: d, column })))
        .join("td")
            .html(d => d.column.format(d.value)) 
            .attr("class", d => d.column.type)
            .style("background", d => d.column.background && d.column.background(d.value))
            .style("transform", d => d.column.transform && d.column.transform(d.value))
    }

    // initiate the table with January data

    updateTable(dataByMonth["January"])
  }
  drawTable()