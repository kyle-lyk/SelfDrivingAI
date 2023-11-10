class Visualizer{
    static drawNetwork(context, network){
        // Styling
        const margin = 50; 
        const width = context.canvas.width - margin*2;
        const height = context.canvas.height - margin*2;
        const left = margin;
        const top = margin;

        const nodeRadius = 10;
        const nodeStrokeWidth = 2;

        const levelHeight = height/(network.levels.length);

        // Draw all levels by looping through the levels
        // Draw from Reverse:
        for(let i=network.levels.length-1; i>=0; i--){
            const levelTop = top +
            // Using Interpolation to find even y-spacing
            // between levels
                lerp(
                    height-levelHeight,
                    0,
                    network.levels.length == 1
                        ? 0.5 // If there is only one level, center it
                        : i/(network.levels.length-1)
                );
            
            // Connection Dashes 
            context.setLineDash([7,2]);

            // Draw Level [input visualize error]
            Visualizer.drawLevel(
                context, network.levels[i],
                width, levelHeight, left, levelTop,
                nodeRadius, nodeStrokeWidth,
                // If it is last output level,
                // Draw the Output Labels
                i == network.levels.length-1
                    // Up, Down, Left, Right Symbols
                    ? ["↑","↓","←","→"]
                    :[]
                );
        }
        // Visualizer.drawLevel(
        //     context, network.levels[0],
        //     width, height, left, top, right, bottom,
        //     nodeRadius, nodeColor, nodeStrokeWidth);

    }

    static drawLevel(
        context, level, 
        width, height, left, top,
        nodeRadius, nodeStrokeWidth,
        outputLabels){
        
        // Redefine the right and bottom position for each Node
        const right = left + width;
        const bottom = top + height;
        
        const {inputs, outputs, weights, biases} = level;

        //// Draw Connections
        
        for(let i=0; i<inputs.length; i++){
            for(let j=0; j<outputs.length; j++){
                context.beginPath();
                context.moveTo(
                    Visualizer.#getNodeX(inputs, i, left, right),
                    bottom
                );
                context.lineTo(
                    Visualizer.#getNodeX(outputs, j, left, right),
                    top
                );
                context.lineWidth = nodeStrokeWidth;

                // Draw Connection
                context.strokeStyle = getRGBA(weights[i][j]);
                context.stroke();
            }
        }

        //// Find x-coordinates of the input nodes
        // using Interpolation
        for(let i=0; i<inputs.length; i++){
            const x = Visualizer.#getNodeX(inputs, i, left, right);
            
            // Draw Input Nodes
            context.beginPath();
            context.arc(x, bottom, nodeRadius*1.6, 0, Math.PI*2);
            context.fillStyle = "black";
            context.fill();

            // Draw Input Nodes
            context.beginPath();
            context.arc(x, bottom, nodeRadius, 0, Math.PI*2);
            context.fillStyle = getRGBA(inputs[i]);
            context.fill();
        }

        //// Find x-coordinates of the output nodes
        // using Interpolation
        for(let i=0; i<outputs.length; i++){
            const x = Visualizer.#getNodeX(outputs, i, left, right)
            
            // Draw Output Nodes
            context.beginPath();
            context.arc(x, top, nodeRadius*1.6, 0, Math.PI*2);
            context.fillStyle = "black";
            context.fill();

            // Draw Output Nodes
            context.beginPath();
            context.arc(x, top, nodeRadius, 0, Math.PI*2);
            context.fillStyle = getRGBA(outputs[i]);
            context.fill();
            
            // Draw Biases Circle Arc
            context.beginPath();
            context.linewidth = nodeStrokeWidth;
            context.arc(x, top, nodeRadius*1.5, 0, Math.PI*2);
            context.strokeStyle = getRGBA(biases[i]);
            context.setLineDash([3, 3]);
            context.stroke();
            context.setLineDash([]);

            // Draw Output Labels
            if(outputLabels[i]){
                context.beginPath();
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.strokeStyle = "silver";
                context.font = (nodeRadius*1.5)+"px Arial";
                context.fillText(outputLabels[i], x, top);
                context.strokeText(outputLabels[i], x, top);
            }

            // Debugger in console to check biases
            // console.table(car.brain.levels[0])
        }

    }

    // Find x-coordinates of the nodes
    // using Interpolation
    static #getNodeX(nodes, index, left, right){
        return lerp(
            left, 
            right,
            // Input Node goes to middle of only 1
            (nodes.length == 1) 
                ? 0.5 
                : index/(nodes.length-1)
        );
    }

}