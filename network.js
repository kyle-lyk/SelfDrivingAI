class NeuralNetwork{
    constructor(neuronCounts){
        // Network configuration
        this.levels = [];
        for(let i=0; i<neuronCounts.length-1; i++){
            this.levels.push(
                new Level(
                    neuronCounts[i], 
                    neuronCounts[i+1]
                    )
            );
        }
    }

    // Feed inputs or activations to network
    static feedForward(sensorInputs, network){
        // Feed inputs to first level
        let outputs = Level.feedForward(
            sensorInputs, network.levels[0]
            );

        // Feed outputs(activations) to next level
        for(let i=1; i<network.levels.length; i++){
            outputs = Level.feedForward(
                outputs, network.levels[i]
                );
        }

        return outputs;
    }

    //// Genetic Algorithm Functions
    // Mutate weights and biases of network
    // gamma: percentage of mutation
    static mutate(network, gamma=1){
        // If gamma = 0
        // Biases and Weights stay the same
        // If gamma = 1
        // Biases and Weights are canceled & randomized
        // If gamma in between 0 and 1
        // Biases and Weights are mutated by amount
        network.levels.forEach( 
            level => {
                for(let i=0; i<level.biases.length; i++){
                    level.biases[i] = lerp(
                        level.biases[i],
                        Math.random()*2-1, // Random between -1 and 1
                        gamma
                    )
                }
                for(let i=0; i<level.weights.length; i++){
                    for(let j=0; j<level.weights[i].length; j++){
                        level.weights[i][j] = lerp(
                            level.weights[i][j],
                            Math.random()*2-1, // Random between -1 and 1
                            gamma
                        )
                    }
                }
            }
        
        )
    }

}

class Level{
    constructor(inputCount, outputCount){
        //// Level configuration
        // Initiate NNs storage
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for(let i=0; i<inputCount; i++){
            this.weights[i] = new Array(outputCount);
        }

        // Initiate NNs with random values
        Level.#randomize(this);
    }

    // Randomize weights and biases on first run
    static #randomize(level){
        // Randomize weights between -1 and 1
        for(let i=0; i<level.inputs.length; i++){
            for(let j=0; j<level.outputs.length; j++){
                // Random between -1 and 1
                level.weights[i][j] = Math.random()*2-1;
            }
        }
        
        // Randomize biases between -1 and 1
        for(let i=0; i<level.biases.length; i++){
            // Random between -1 and 1
            level.biases[i] = Math.random()*2-1;
        }

    }

    // Feed inputs or activations to level
    static feedForward(givenInputs, level){
        // Set inputs to given inputs
        for(let i=0; i<level.inputs.length; i++){
            level.inputs[i] = givenInputs[i];
        }

        // Calculate outputs (Loop through each output neuron)
        for(let i=0; i<level.outputs.length; i++){
            let sum = 0;
            // Loop through inputs
            for(let j=0; j<level.inputs.length; j++){
                // Multiply input by weight between I/O nodes
                sum += level.inputs[j]*level.weights[j][i];
            }
            
            // Trigger output boolean if sum > bias
            // Hyperplane equation: sum = w1*x1 + w2*x2 + ... + wn*xn + b
            if(sum>level.biases[i]){
                level.outputs[i] = 1;
            }
            else{
                level.outputs[i] = 0;
            }

        }

        return level.outputs;
    }

}