import { BarChartRace } from "./main.js"

const myChart = new BarChartRace("chart-area")

// if I write
// const myChart = new BarChartRace("chart-area","./data/Bar Chart Race.csv") 
// and pass path in main.js, it's not working
myChart
    .setTitle("Bar Chart Race Title")
    .addDatasets(readData())
    .render()

d3.select("button").on("click", function() {
  if (this.innerHTML === "Stop") {
    this.innerHTML = "Resume";
    myChart.stop();
  } else if (this.innerHTML === "Resume") {
    this.innerHTML = "Stop";
    myChart.start();
  } else {
    this.innerHTML = "Stop";
    myChart.render();
  }
})