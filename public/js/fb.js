function main () {

  var graph = Viva.Graph.graph();

  var graphics = Viva.Graph.View.svgGraphics(),
  nodeSize = 24;

  //TODO: FB friends list api call:  http://graph.facebook.com/v2.3/me/friends
  //ref: https://developers.facebook.com/docs/graph-api/reference/v2.3/user/friends

  //Then, while(friendList.next)
  graph.addNode('Kev', {url : 'https://avatars0.githubusercontent.com/u/5375994?v=3&s=120'});

  //Then, Define relation
  //graph.addLink('Kev', 'friend', {id : ''});  //change id to tag? (non-unique)

  graphics.node(function(node) {
    var ui = Viva.Graph.svg('g'),
    svgText = Viva.Graph.svg('text').attr('y', '-4px').text(node.id),
    img = Viva.Graph.svg('image')
    .attr('width', nodeSize)
    .attr('height', nodeSize)
    .link(node.data.url);

    ui.append(svgText);
    ui.append(img);
    return ui;
  }).placeNode(function(nodeUI, pos) {
    nodeUI.attr('transform',
    'translate(' +
    (pos.x - nodeSize/2) + ',' + (pos.y - nodeSize/2) +
    ')');
  });



  // To render an arrow
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

  var defs = graphics.getSvgRoot().append('defs');
  defs.append(marker);

  var geom = Viva.Graph.geom();

  graphics.link(function(link){
    var label = Viva.Graph.svg('text').attr('id','label_'+link.data.id).text(link.data.id);
    graphics.getSvgRoot().childNodes[0].append(label);


    return Viva.Graph.svg('path')
    .attr('stroke', 'gray')
    .attr('marker-end', 'url(#Triangle)')
    .attr('id', link.data.id);
  }).placeLink(function(linkUI, fromPos, toPos) {
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
