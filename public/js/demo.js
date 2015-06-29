function main () {
  // This demo shows how to create a directional arrow in SVG renderer.
  // Though it might seem wordy it's due to SVG specific operations.
  // The library has minimal SVG manipulation support.
  // Maybe in future some of the following technniques will become part
  // of the library itself...
  var graph = Viva.Graph.graph();

  var graphics = Viva.Graph.View.svgGraphics(),
  nodeSize = 24;


  graph.addNode('Larry', {url : 'https://avatars0.githubusercontent.com/u/1577777?v=3&s=96'});
  graph.addNode('Kev', {url : 'https://avatars0.githubusercontent.com/u/5375994?v=3&s=120'});
  graph.addNode('Sam', {url : 'https://avatars2.githubusercontent.com/u/8481?v=3&s=96'});
  graph.addNode('Herve', {url : 'https://avatars0.githubusercontent.com/u/3836175?v=3&s=96'});
  graph.addNode('Scott', {url : 'https://avatars2.githubusercontent.com/u/1771888?v=3&s=96'});
  graph.addNode('Mediha', {url : 'https://avatars3.githubusercontent.com/u/4931851?v=3&s=96'});

  graph.addNode('Christian', {url : 'https://avatars1.githubusercontent.com/u/97846?v=3&s=96'});
  graph.addNode('Morgan', {url : 'https://avatars0.githubusercontent.com/u/22883?v=3&s=96'});
  graph.addNode('Dane', {url : 'https://avatars3.githubusercontent.com/u/4154804?v=3&s=96'});
  graph.addNode('Nelson', {url : 'https://avatars0.githubusercontent.com/u/447522?v=3&s=96'});

  graph.addNode('Kevin', {url : 'https://avatars1.githubusercontent.com/u/4907540?v=3&s=96'});
  graph.addNode('Sophie', {url : 'https://avatars1.githubusercontent.com/u/1686333?v=3&s=96'});
  graph.addNode('Dalia', {url : 'https://avatars3.githubusercontent.com/u/5923128?v=3&s=96'});
  graph.addNode('Daniel', {url : 'https://avatars2.githubusercontent.com/u/4612283?v=3&s=96'});

  graph.addNode('Chris', {url : 'https://avatars1.githubusercontent.com/u/3695875?v=3&s=96'});
  graph.addNode('Olu', {url : 'https://avatars0.githubusercontent.com/u/3245724?v=3&s=96'});

  graph.addNode('Justin', {url : 'https://avatars0.githubusercontent.com/u/1847304?v=3&s=96'});



  graph.addLink('Kev', 'Scott', {id : ''});
  graph.addLink('Kev', 'Sam', {id : ''});
  graph.addLink('Kev', 'Herve', {id : ''});





  graphics.node(function(node) {
    // This time it's a group of elements: http://www.w3.org/TR/SVG/struct.html#Groups
    var ui = Viva.Graph.svg('g'),
    // Create SVG text element with user id as content
    svgText = Viva.Graph.svg('text').attr('y', '-4px').text(node.id),
    img = Viva.Graph.svg('image')
    .attr('width', nodeSize)
    .attr('height', nodeSize)
    .link(node.data.url);

    ui.append(svgText);
    ui.append(img);
    return ui;
  }).placeNode(function(nodeUI, pos) {
    // 'g' element doesn't have convenient (x,y) attributes, instead
    // we have to deal with transforms: http://www.w3.org/TR/SVG/coords.html#SVGGlobalTransformAttribute
    nodeUI.attr('transform',
    'translate(' +
    (pos.x - nodeSize/2) + ',' + (pos.y - nodeSize/2) +
    ')');
  });



  // To render an arrow we have to address two problems:
  //  1. Links should start/stop at node's bounding box, not at the node center.
  //  2. Render an arrow shape at the end of the link.

  // Rendering arrow shape is achieved by using SVG markers, part of the SVG
  // standard: http://www.w3.org/TR/SVG/painting.html#Markers
  var createMarker = function(id) {
    return Viva.Graph.svg('marker')
    .attr('id', id)
    .attr('viewBox', "0 0 10 10")
    .attr('refX', "10")
    .attr('refY', "5")
    .attr('markerUnits', "strokeWidth")
    .attr('markerWidth', "10")
    .attr('markerHeight', "5")
    .attr('orient', "auto");
  },

  marker = createMarker('Triangle');
  marker.append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z');

  // Marker should be defined only once in <defs> child element of root <svg> element:
  var defs = graphics.getSvgRoot().append('defs');
  defs.append(marker);

  var geom = Viva.Graph.geom();

  graphics.link(function(link){
    // Notice the Triangle marker-end attribe:

    // Create lebel based on id:
    var label = Viva.Graph.svg('text').attr('id','label_'+link.data.id).text(link.data.id);
    graphics.getSvgRoot().childNodes[0].append(label);


    return Viva.Graph.svg('path')
    .attr('stroke', 'gray')
    .attr('marker-end', 'url(#Triangle)')
    .attr('id', link.data.id);
  }).placeLink(function(linkUI, fromPos, toPos) {
    // Here we should take care about
    //  "Links should start/stop at node's bounding box, not at the node center."

    // For rectangular nodes Viva.Graph.geom() provides efficient way to find
    // an intersection point between segment and rectangle
    var toNodeSize = nodeSize,
    fromNodeSize = nodeSize;

    var from = geom.intersectRect(
      // rectangle:
      fromPos.x - fromNodeSize / 2, // left
      fromPos.y - fromNodeSize / 2, // top
      fromPos.x + fromNodeSize / 2, // right
      fromPos.y + fromNodeSize / 2, // bottom
      // segment:
      fromPos.x, fromPos.y, toPos.x, toPos.y)
      || fromPos; // if no intersection found - return center of the node

      var to = geom.intersectRect(
        // rectangle:
        toPos.x - toNodeSize / 2, // left
        toPos.y - toNodeSize / 2, // top
        toPos.x + toNodeSize / 2, // right
        toPos.y + toNodeSize / 2, // bottom
        // segment:
        toPos.x, toPos.y, fromPos.x, fromPos.y)
        || toPos; // if no intersection found - return center of the node

        var data = 'M' + from.x + ',' + from.y +
        'L' + to.x + ',' + to.y;

        linkUI.attr("d", data);

        //display the label
        document.getElementById('label_'+linkUI.attr('id'))
        .attr("x", (from.x + to.x) / 2)
        .attr("y", (from.y + to.y) / 2);
      });

      // All is ready. Render the graph:
      var renderer = Viva.Graph.View.renderer(graph, {
        graphics : graphics
      });

      renderer.run();
    }
