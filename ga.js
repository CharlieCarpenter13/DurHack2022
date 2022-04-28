
// this function give me the 
function root_time(path, matrix){
    let tot_dist = 0
    for (var i =0; i < path.length-1; i++){
        tot_dist += matrix[path[i]][path[i+1]]
    }
    return tot_dist
}

function shuffle_paths(path, times){
    for (var i =0; i < times; i++){

        let rand1 = Math.floor(Math.random() * path.length);
        let rand2 = Math.floor(Math.random() * path.length);
        let temp = path[rand1]
        path[rand1] = path[rand2]
        path[rand2] = temp
    }
    return path
}

// make next gen
function next_generation(old_population, data){

    let tot_fitness = 0;
    for (let i=0; i < old_population.length; i++){
        // working out the the totle
        tot_fitness += old_population[i].fittness
    };
    for (let i=0; i<old_population.length; i++){
        old_population[i].fittness_reltive = ((old_population[i].fittness)/tot_fitness)
        
    }

    var new_population = []

    // this is randomly picking them here
    for (let node = 0; node < old_population.length; node++){
        let rand = Math.random(1);
        for (let i = 0; i < old_population.length; i++){
            rand = rand - old_population[i].fittness_reltive
            if (rand < 0){
                new_population.push((old_population[i]))
                break
            }
        }

    }
    
    // this is the code for the cross over.
    tot_fitness = tot_fitness - new_population[0].fittness
    new_population[0].path = cross_over(new_population[0].path, new_population[Math.floor(Math.random() * new_population.length)].path)

    new_population[0].fittness = 1/root_time(new_population[0].path, data);
    tot_fitness = tot_fitness + new_population[0].fittness;

    for (let i=0; i<new_population.length; i++){
        new_population[i].fittness_reltive = ((new_population[i].fittness)/tot_fitness)
    }
    
    return new_population

}

function mutation(population, mutation_rate, data){
    let new_population_paths = [];
    for (let i = 0; i < population.length; i++){
        if (mutation_rate > Math.random(1)){
            let suffled_path = (shuffle_paths((population[i].path).slice(), 1)).slice()
            new_population_paths.push({"path": suffled_path,  "fittness": (1/root_time(suffled_path, data)), fittness_reltive: 0}) // changes one thing
        }else{
            new_population_paths.push(JSON.parse(JSON.stringify(population[i])));
        }
    }

    return new_population_paths
}

function cross_over(lst1, lst2){
    // works out the random start and end of the splice
    let slice_start = Math.floor(Math.random() * lst1.length);
    let slice_end = Math.floor(Math.random(slice_start+1, lst1.length) * (lst1.length - (slice_start +1)) + (slice_start + 1));

    // adds all the random bits in for fun
    let new_lst = lst1.slice(slice_start, slice_end);
    for (let i = 0; i < lst2.length; i++){
        if(!new_lst.includes(lst2[i])){
            new_lst.push(lst2[i]);
        }
    }
    return new_lst
}


// the actaly function being called.
function finding_ga(data){
    const population_size = 7;
    const num_iterations = 20;
    const mutation_rate = 0.1
    var population = []

    // creating the first list in order
    var nodes = []
    for (let i = 0; i < data[0].length; i++){
        nodes.push(i)
    }

    // making the population with a fittness score depending on the distance
    for (let i = 0; i < population_size; i++){
        let suffled_path = (shuffle_paths((nodes).slice(), 10)).slice() // shuffling the path up
        population.push({"path": suffled_path, "fittness": (1/root_time(suffled_path, data)), fittness_reltive: 0})
    }

    // makeing a fitness partion 0-1 this will help with finding what population to bread with.


    for (let ite = 0; ite < num_iterations; ite++){
        population = next_generation(population, data)
        population = mutation(population, mutation_rate, data)
        
    }
    let best_score = Infinity;
    let best_path = []
    for (let i = 0; i < population.length; i++){
        if (1/population[i].fittness < best_score){
            best_score = 1/population[i].fittness;
            best_path = population[i].path;
        }
    }
    return (best_path)
}


let x = (finding_ga([
    [ 0, 400, 63, 113, 548 ],
    [ 400, 0, 341, 391, 456 ],
    [ 63, 341, 0, 49, 506 ],
    [ 113, 391, 49, 0, 564 ],
    [ 548, 456, 506, 564, 0 ]
  ]));

console.log(root_time([0,2,3,1,4],[
    [ 0, 400, 63, 113, 548 ],
    [ 400, 0, 341, 391, 456 ],
    [ 63, 341, 0, 49, 506 ],
    [ 113, 391, 49, 0, 564 ],
    [ 548, 456, 506, 564, 0 ]
  ]))


  console.log(x)