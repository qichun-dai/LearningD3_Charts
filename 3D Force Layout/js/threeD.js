async function drawNetwork() {

  const graph = await d3.json("../data/harry_potter.json")

  console.log(graph.nodes)
  console.log(graph.nodes.length)

  for (let i = 0; i < graph.nodes.length; i++) {
    const item = graph.nodes[i]
    console.log(item)
    
  // Add a new column to each item
  for (let i = 0; i < dataset.nodes.length; i++) {
    const item = dataset.nodes[i]
    console.log(item)
    
    // Add a new column to each item
    if (item.team == 'Head_Master') {
      item.colorHex = '#000'
    } else if(item.team == 'Gryffindor'){
      item.colorHex = '#DC143C'
    }else if(item.team == 'Hufflepuff'){
      item.colorHex ='#FFFF00'
    }
    else if(item.team == 'Ravenclaw'){
      item.colorHex = '#0000CD'
    }else {
      item.colorHex = '#228B22'
    }
  }

const Graph = ForceGraph3D()
  (document.getElementById('chart-area'))
    //.nodeAutoColorBy('colorHex')
    .nodeColor('colorHex')
    //.nodeColor(["#8C0014", "#F59B00", "#262626", "#1A936F", "#2374AB"])
    .nodeLabel('first_name')
    //.nodeVal(d => d.nodes.group*10)
    //try to change size
    .graphData(graph)
    .backgroundColor("#C5DFF8")

    

}
}


  drawNetwork()