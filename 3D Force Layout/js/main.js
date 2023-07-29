async function drawForce() {
    // read data
    const graph = await d3.json("./data/harry_potter.json")
    console.log(graph)
  
    // Add a new column to each item
    for (let i = 0; i < graph.nodes.length; i++) {
      const item = graph.nodes[i]
      
      // Add a new column to each item
      if (item.team == 'Head_Master') {
        item.colorHex = '#F5F5F5'
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
      .nodeColor('colorHex')
      .nodeLabel(node => node.first_name + ' ' + node.last_name)
      .graphData(graph)
      .backgroundColor("rgba(0,0,0,0)")
  
}
    
    drawForce()