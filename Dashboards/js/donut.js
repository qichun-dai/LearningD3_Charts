export async function drawDonut(dataset) {  
  // Count frequency of each icon value
  const iconFrequency = dataset.reduce((acc, curr) => {
    acc[curr.icon] = (acc[curr.icon] || 0) + 1
    return acc
  }, {})

  // Convert frequency object to an array for D3
  const iconArray = Object.entries(iconFrequency).map(([key, value]) => ({
    icon: key,
    count: value
  }))

  

  // 2. Create chart dimensions

  const width = 500
  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 30,
      right: 60,
      bottom: 60,
      left: 60,
    },
  }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // 3. Draw canvas

  const wrapper = d3.select("#donut")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${dimensions.boundedWidth / 2+ dimensions.margin.left}px, ${dimensions.boundedHeight / 2 + dimensions.margin.top}px)`)

  // 4. Create scales




const radius = Math.min(dimensions.boundedWidth, dimensions.boundedHeight) / 2 -10
const donutWidth = 60

const color = d3.scaleOrdinal(d3.schemeCategory10)


const arc = d3.arc()
  .innerRadius(radius - donutWidth)
  .outerRadius(radius);

  const pie = d3.pie()
  .value(d => d.count)
  .sort((a, b) => b.count - a.count)

const weatherConditions = {
  "clear-day": '#FFF56C',  
  "cloudy": '#D8D9DA',   
  "partly-cloudy-day": '#ADA2FF', 
  "rain": '#CEE6F3',      
  "snow": '#FBA1B7',      
  "fog": '#D7BBF5'       
}

const weatherNames = {
  "clear-day": 'Sunny',  
  "cloudy": 'Cloudy',   
  "partly-cloudy-day": 'Partly Cloudy', 
  "rain": 'Rainy',      
  "snow": 'Snowy',      
  "fog": 'Foggy'       
}

// Function to get color based on condition
function getWeatherColor(condition) {
    return weatherConditions[condition];
}

function getNames(condition) {
  return weatherNames[condition];
}

const path = bounds.selectAll("path")
  .data(pie(iconArray))
  .enter()
  .append("path")
  .attr("d", arc)
  .attr("fill", d => getWeatherColor(d.data.icon))
  .attr("class", "donut-path")

  // 6. Draw peripherals

  bounds.append("text")
      .attr("class", "title")
      .text("2022 Weather")
     

  bounds.append("text")
      .attr("class", "title-small")
      .text("Amsterdam, NL")
      .attr("transform", `translate(0, 40)`)

  // Add labels to the arcs using the centroid function
  const labels = bounds.selectAll(".label")
  .data(pie(iconArray))
  .enter()
  .append("text")
  .attr("transform", function(d) {
      // Use arc.centroid() to get the label's x and y positions
      const [x, y] = arc.centroid(d);
      return `translate(${x * 1},${y * 1})`;  // Multiplying by 1.5 pushes the labels out
  })
  .attr("text-anchor", "middle")
  .each(function(d) {
        // Check if count is above 20
        if (d.data.count <= 20) {
            d3.select(this).remove();  // Remove the text element if the condition isn't met
            return;  // Exit this iteration of the loop
        }

        const label = d3.select(this);
        
        // Add the weather condition
        label.append("tspan")
        .attr("class","legend")
            .attr("x", 0)
            .attr("y", "-0.6em")  // Slightly offset to accommodate for the second line
            .text(getNames(d.data.icon))
      
        
        // Add the count on a new line
        label.append("tspan")
        .attr("class","legend")
            .attr("x", 0)
            .attr("y", "1em")  // Positioning for the second line
            .text(d.data.count)
    });

    function getDonutPaths() {
      return path;  
    }
  
    // Return the getDonutPaths function to expose it
    return {
      getDonutPaths
    };

}

