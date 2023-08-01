async function drawChart() {

  // 1. Access data

  const dataset = await d3.json("./data/education.json")

  console.log(dataset)


  function generateSankeyData(dataList) {
    const nodes = [];
    const links = [];
    const uniqueNodes = new Set();
    const educationLevels = [
        "<High School", "High School", "Some Post-secondary",
        "Post-secondary", "Associate's", "Bachelor's and up"
    ]
    const aggregatedData = {};

    dataList.forEach(entry => {
        const ses = entry.ses;

        if (!aggregatedData[ses]) {
            aggregatedData[ses] = {};
            educationLevels.forEach(level => {
                aggregatedData[ses][level] = 0
            })
        }

        educationLevels.forEach(level => {
            aggregatedData[ses][level] += entry[level];
        })
    })

    for (const ses in aggregatedData) {
        uniqueNodes.add(ses);
        for (const level in aggregatedData[ses]) {
            uniqueNodes.add(level);
            links.push({
                source: ses,
                target: level,
                value: aggregatedData[ses][level]
            })
        }
    }

    uniqueNodes.forEach(name => {
        nodes.push({ name })
    })

    return { nodes, links }
}

const sankeyData = generateSankeyData(dataset)
console.log(sankeyData)



  // 2. Create chart dimensions

  const width = d3.min([
    window.innerWidth * 0.9,
    1200
  ])
  let dimensions = {
    width: width,
    height: 500,
    margin: {
      top: 10,
      right: 200,
      bottom: 10,
      left: 120,
    },
    pathHeight: 50,
    endsBarWidth: 15,
    endingBarPadding: 3,
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  // 3. Draw canvas

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)

  // generate chart
    const { nodes, links } = d3.sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .extent([[1, 1], [960 - 1, 600 - 5]])
    ({
        nodes: sankeyData.nodes,
        links: sankeyData.links.map(d => ({
            ...d,
            source: sankeyData.nodes.findIndex(node => node.name === d.source),
            target: sankeyData.nodes.findIndex(node => node.name === d.target)
        }))
    })


  // Define node colors based on ses category
  const nodeColors = {
    "low": "#ADE4DB",
    "middle": "#6DA9E4",
    "high": "#F6BA6F"
  };

  bounds.append("g")
    .selectAll("rect")
    .data(nodes)
    .join("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => nodeColors[d.name] || "#D989B5")

  // Define link colors based on class

  bounds.append("g")
    .attr("fill", "none")
    .selectAll("g")
    .data(links)
    .join("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", d => nodeColors[nodes[d.source.index].name])
    .attr("stroke-width", d => Math.max(1, d.width))
    .style("mix-blend-mode", "multiply")
    .attr("opacity",0.5)


  // adding labels
  bounds.append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("x", d => d.x0 < width / 2 ? d.x0 - 6 : d.x1 + 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "end" : "start")
    .text(d => d.name)
    .attr("fill","#666")

    wrapper.append("text")
    .attr("x", dimensions.margin.left)
    .attr("y", 0)
    .style("font-weight", "bold")
    .attr("text-anchor","end")
    .text("Socioeconomic Status")

      wrapper.append("text")
      .attr("x", dimensions.boundedWidth+dimensions.margin.right)
      .attr("y", 0)
      .attr("text-anchor","start")
      .style("font-weight", "bold")
      .text("Education Level")


}

drawChart()