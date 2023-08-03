import { drawDonut } from './donut.js';
import { drawHeatmap, applyHeatmapHighlight } from './heatmap.js';

async function main() {
  const dataset = await d3.csv("./data/amsterdam 2022.csv")
  const donutDrawing = await drawDonut(dataset); // Assuming dataset is available for the donut
  const heatmapDrawing = await drawHeatmap(dataset); // Assuming anotherDataset is available for the heatmap
  
  const donutPaths = donutDrawing.getDonutPaths();
  
  
  donutPaths.on("click", function(event,d) {
    console.log(d)
    applyHeatmapHighlight(d.data.icon);
  });

  document.addEventListener("click", function(event) {
    // Check if the clicked element is not a donut path
        if (!event.target.closest(".donut-path")) { 
            // If it's not, clear the highlight
            clearHighlight();
        }
    });         

    function clearHighlight() {
        d3.selectAll(".heatmap-cell.highlighted")
            .classed("highlighted", false)
            .style("stroke", null)
            .style("stroke-width", null);
    }

  
  
}

main();
