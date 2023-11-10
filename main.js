// Main Canvas from HTML
const mainCanvas = document.getElementById('mainCanvas');
mainCanvas.height = window.innerHeight;
mainCanvas.width = 300;

// Netowrk Canvas from HTML
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.height = window.innerHeight;
networkCanvas.width = 400;

// Get Main Canvas Context
const mainContext = mainCanvas.getContext('2d');

// Get Network Canvas Context
const networkContext = networkCanvas.getContext('2d');


// Call Road Class
const road = new Road(mainCanvas.width/2, mainCanvas.width*0.9, 3);

// Training Car Class
const N = 1000;
const cars = generateTrainingCars(N);
let bestCar = cars[0];

//// Load Saved Model from Local Storage (JSON)
// If there is a saved best car model in Local Storage
if(localStorage.getItem("bestBrain")){
    // Load the model into the first parallel car
    for(let i=0; i<cars.length; i++){
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain"));
        // Mutate the models of all parallel cars 
        // that is not first car
        if(i!=0){
            // mutate(network, gamma="percentage")
            NeuralNetwork.mutate(cars[i].brain, 0.2);
        }
    }
}

// Call Traffic Class for Dummy Cars
// Car(x,y,width,height,controlType, maxSpeed=[default:6])
const traffic = [
    new Car(road.getLaneCenter(0),-330,30,50,"DUMMY",4),
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",4),
    new Car(road.getLaneCenter(2),-270,30,50,"DUMMY",4),

    new Car(road.getLaneCenter(0),-730,30,50,"DUMMY",4),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",4),
    new Car(road.getLaneCenter(2),-770,30,50,"DUMMY",4),
]

// Animate the Canvas
animate();

//// Local Storage (JSON) Functions
// Save the best car model into Local Storage (JSON)
function save(){
    localStorage.setItem("bestBrain", 
    JSON.stringify(bestCar.brain));
}

// Discard the best car model from Local Storage (JSON)
function discard(){
    localStorage.removeItem("bestBrain");
}

// Debugger in console
// localStorage

// Generate Multiple Training Cars to speed up training
// (Parallelization)
function generateTrainingCars(N){
    const cars = [];
    for(let i=0; i<N; i++){
        cars.push(new Car(road.getLaneCenter(1),150,30,50,"AI"));
    }
    return cars;
}

// Animation Function from the Canvas
function animate(time){
    // Dummy Cars Generation
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders,[]);
    }

    // All Training Cars Generation
    for(let i=0; i<cars.length; i++){
        cars[i].update(road.borders, traffic);
    }

    // Find the best training car
    const bestCar = cars.find(
        // Find the car with minimum y value
        // among the parallel cars
        c => c.y == Math.min(
            // Create new array with only the y values
            ...cars.map(c => c.y)
        )
    );

    // Canvas Refresh
    mainCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    // Locate Training Car Position on the Road
    mainContext.save();
    mainContext.translate(0,-bestCar.y+(mainCanvas.height*0.7));

    // Draw Road
    road.draw(mainContext);

    //// Draw Dummy Cars
    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(mainContext);
    }
    // Make other parallel cars half transparent
    mainContext.globalAlpha = 0.2;

    //// Draw Training Cars
    for(let i=0; i<cars.length; i++){
        cars[i].draw(mainContext);
    }
    // Make the best car fully opaque
    mainContext.globalAlpha = 1;
    bestCar.draw(mainContext, true); // True = Show Sensor

    mainContext.restore();

    // Animate Dashes in Network Canvas
    networkContext.lineDashOffset = -time/60;

    // Draw Network
    Visualizer.drawNetwork(networkContext, bestCar.brain);

    // Animation Func callbacks for multiple times per second
    requestAnimationFrame(animate);
}

