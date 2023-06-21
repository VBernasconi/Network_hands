// initialize global variables.

    // initialize global variables.
    var edges;
    var nodes;
    var network;
    var container;
    var options, data;

    var edges_icon;

    class Iconetwork{

      constructor(nodes, edges, edges_icon, centralGravity, network_id, clusterimage_id){
        this.nodes = nodes;
        this.edges = edges;
        this.edges_icon = edges_icon;
        this.centralGravity = centralGravity;
        this.network_id = network_id;
        this.clusterimage_id = clusterimage_id;
      }

      drawGraph(centralgravity = this.centralGravity, nodes_=this.nodes, edges_=this.edges) {
          var container = document.getElementById(this.network_id);
          console.log(container);
          console.log(this.clusterimage_id);
          // adding nodes and edges to the graph
          data = {nodes: nodes_, edges: edges_};

          var options = {
            "configure": {
                "enabled": false},
            "edges": {
                "color": {"inherit": true,"opacity": 0.2,},
                "smooth": {"enabled": false,"type": "continuous"}},
            "interaction": {"dragNodes": true,"hideEdgesOnDrag": false,"hideNodesOnDrag": false},
            "physics": {
                "barnesHut": {
                    "avoidOverlap": 0,
                    "centralGravity": this.centralGravity,
                    "damping": 0.09,
                    "gravitationalConstant": -80000,
                    "springConstant": 0.001,
                    "springLength": 250},
                "enabled": true,
                "stabilization": {
                    "enabled": true,
                    "fit": true,
                    "iterations": 1000,
                    "onlyDynamicEdges": false,
                    "updateInterval": 50}}
                  };

        network = new vis.Network(container, data, options);

        var clusterimage_id_ = this.clusterimage_id; //you have to re-assign variable because cannot access object variable in DOM

        network.on( 'click', function(properties) {
            var ids = properties.nodes;

            try{
              var clickedNodes = nodes_.get(ids);
              var node_id = clickedNodes[0].id;
              console.log('clicked node:', node_id);
              var element = document.getElementById(clusterimage_id_);
              console.log(element);
              document.getElementById(clusterimage_id_).style.display = "block";
              document.getElementById(clusterimage_id_).src = "SPECTRAL_kmeans_clustering/tSNE-grid-allimages_"+node_id+".jpg";
            }catch(err){
              console.log("No node selected");
            }
        });

        network.on( 'release', function(properties) {

          var element = document.getElementById(clusterimage_id_);

          document.getElementById(clusterimage_id_).style.display = "none";
          document.getElementById(clusterimage_id_).src = "";
        });

        network.on('doubleClick', function(properties){

          var ids_edge = properties.edges; //display all images with the hands pair
          var ids_node = properties.nodes; //display all images with the node

          try{
            var clickedEdges = edges_.get(ids_edge);
            var edge_id = clickedEdges[0].id;
            console.log('DOUBLE clicked edge:', edge_id);

            let my_edge = edges_.get({
              filter: function (item) {return String(item.id) === String(edge_id);}
            });
            edge_img = my_edge[0].image.slice( 1, -1).split(",")

            window.open(
              "img_edges.html?img="+edge_img,
              '_blank' // <- This is what makes it open in a new window.
            );

          }catch(err){
            console.log(err);
          }

          try{
            var clickedNodes = nodes_.get(ids_node);
            var node_id = clickedNodes[0].id;
            console.log('DOUBLE clicked:', node_id);

            let my_edge = edges_.get({
              filter: function (item) {return (String(item.from) === String(node_id)) || (String(item.to) === String(node_id));}
            });

            console.log(my_edge);
            edge_img = [clickedNodes[0].image];

            for (var i=0; i< my_edge.length; i++){
              img_name = my_edge[i].image.slice( 1, -1).split(",")
              edge_img.push(...img_name);
              //edge_img.push(img_name);
              //edge_img.add(img_name)
            }
            console.log(edge_img);

            let unique_img = edge_img.filter((element, index) => {
                return edge_img.indexOf(element.trim()) === index;
            });
            /*for (const edge of edge_img) {
              console.log(edge);
            }*/
            console.log(unique_img);
            window.open(
              "img_edges.html?img="+unique_img,
              '_blank' // <- This is what makes it open in a new window.
            );
            //window.location.href = "img_edges.html?img="+edge_img;
          }catch(err){
            console.log(err);
          }
        });
        return network;
      }

      hideEdges(node_id){
        let hide_edges = this.edges_icon.get({
          filter: function (item) {
            from_ = item.from
            to_ = item.to
            my_label = String(item.title);
            if (item.from === node_id) {
              return false;
            } else if (item.to === node_id) {
              return false;
            } else {
              return true;
            }
          }
        });
        return hide_edges;
      }

      iconographyUpdate(values){
        let nodes_show = new Set();

        let keep_edges = this.edges_icon.get({
          filter: function (item) {
            var my_label = String(item.title);
            console.log(my_label);
            for (const checked of values){
              if (my_label === checked) {
                return my_label === checked;
              }
            }
            return false;
          }
        });

        for (const edge of keep_edges){
          nodes_show.add(edge.from);
          nodes_show.add(edge.to);
        };

        let keep_nodes = this.nodes.get({
          filter: function (item) {
            return nodes_show.has(item.id);
          }
        });

        let gravity = 1;

        this.drawGraph(gravity, new vis.DataSet(keep_nodes), new vis.DataSet(keep_edges));
      }
      /*
      handleEdges(nodes, edges){
        var edge_name = [];

        var edge_names_ =  edges.get({fields: ['title']})

        for (const edge of edge_names_) {
          edge_name.indexOf(edge.title) === -1 ? edge_name.push(edge.title) : null;
        }

        // generate the radio groups
        const group = document.querySelector("#group");

        group.innerHTML = edge_name.map((edge) => `<div>
                <input type="checkbox" name="edge" value="${edge}" id="${edge}">
                 <label for="${edge}">${edge}</label>
            </div>`).join(' ');

        group.innerHTML += '<div> <input type="checkbox" name="edge" value="all" id="all"><label for="all">all</label> </div>';
        // add an event listener for the change event
        const radioButtons = document.querySelectorAll('input[name="edge"]');

        for(const radioButton of radioButtons){
            radioButton.addEventListener('change', this.showSelected);
        }
        return 0;
      }

      showSelected(e) {

          let checkboxes = document.querySelectorAll('input[name="edge"]:checked');
          let values = [];
          checkboxes.forEach((checkbox) => {
              values.push(String(checkbox.value));
          });
          console.log(values);
          let check_value = String(this.value);
          //allNodes = this.nodes.get({ returnType: "Object" });

          if (check_value === 'all') {
            this.drawGraph(0.3);
          }else{

            let nodes_show = new Set();
            console.log(this.edges_icon)

            let keep_edges = this.edges_icon.get({
              filter: function (item) {
                my_label = String(item.title);
                console.log(my_label);
                for (const checked of values){
                  if (my_label === checked) {
                    return my_label === checked;
                  }
                }
                return false;
              }
            });

            console.log(keep_edges);

            for (const edge of keep_edges){
              nodes_show.add(edge.from);
              nodes_show.add(edge.to);
            };

            let keep_nodes = nodes.get({
              filter: function (item) {
                return nodes_show.has(item.id);
              }
            });

            let gravity = 1;

            this.drawGraph(gravity, new vis.DataSet(keep_nodes), new vis.DataSet(keep_edges));

            this.handleEdges(nodes, edges);
        }
      }*/
    }
