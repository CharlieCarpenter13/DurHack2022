
function shortest(data){
    // we are jumping to the closest node
    let current_node = 0
    let next_node = 0
    let sorted = []
    let visted_nodes = [0]

    while (visted_nodes.length < data[0].length){
        sorted = data[current_node].map((x) => x)
        sorted.sort(function(a, b) {
            return a - b;
          });

        for (i in sorted){


            if (visted_nodes.includes(parseInt(data[current_node].indexOf(sorted[i])))){
            }else{
                visted_nodes.push(parseInt(data[current_node].indexOf(sorted[i])))
                current_node = parseInt(data[current_node].indexOf(sorted[i]))
                break 
            };}
        


    };
    


    // i need to return a list that has the order of the bars that is the quickest
    return (visted_nodes.map((x) => x+1))
}

function bruit_force(data){
    // Make an array that goes has all the numbers
    var nodes = []
    for (let i = 0; i < data[0].length; i++){
        nodes.push(i)
    }
    var best_order = nodes.slice();
    var best_time = root_time(best_order, data); // no point working it out becouse we are going to have to do that in a bit anyways
    
    // now use lexicographic ordering
    // step 1

    while (true){
        // working out if it is the best root.
        let time = root_time(nodes, data);
        if (time < best_time){
            best_order = nodes.slice();
            best_time = time;
        }


        var bigI = -1;
        for (var i =0; i < nodes.length - 1; i++){
            if (nodes[i] < nodes[i +1 ]){
                bigI = i;
            }
        }
        
        if (bigI == -1){
            break // Breaks the loop as all values are found
        }

        // step 2
        var bigJ = -1
        for (let j = 0; j < nodes.length; j++){
            if (nodes[j] > nodes[bigI]){
                bigJ = j;
            }
        }

        // step 3 swaping arouns the indexes
        let tempJ = nodes[bigJ]
        nodes[bigJ] = nodes[bigI]
        nodes[bigI] = tempJ


        // step 4 reverse all the elements after i
        var afterI = nodes.splice(bigI+1)
        afterI.reverse()
        nodes = nodes.concat(afterI)



    }

    return best_order.map((x) => x+1)
}

function root_time(path, matrix){
    let tot_dist = 0
    for (var i =0; i < path.length - 1; i++){
        tot_dist += matrix[path[i]][path[i+1]]
    }
    return tot_dist
}


// console.log(bruit_force([[ 0, 400, 63, 113, 548 ],[ 400, 0, 341, 391, 456 ],[ 63, 341, 0, 49, 506 ],[ 113, 391, 49, 0, 564 ],[ 548, 456, 506, 564, 0 ]]))

console.log(shortest([[ 0, 400, 63, 113, 548 ],[ 400, 0, 341, 391, 456 ],[ 63, 341, 0, 49, 506 ],[ 113, 391, 49, 0, 564 ],[ 548, 456, 506, 564, 0 ]]))

module.exports = {
    bruit_force,
    shortest,
  };
