class Car{
    constructor(x,y,width,height,controlType, maxSpeed=6){
        // Position
        this.x = x;
        this.y = y;

        // Size
        this.width = width;
        this.height = height;

        // Speed
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;

        // Angle
        this.angle = 0;
        this.rotateSpeed = 0.03;

        // Car Collision
        this.damaged = false;

        // Car Control Type
        this.controlType = controlType;

        // if controlType is AI, useBrain is true
        this.useBrain = (controlType == "AI");

        // Player Car's Sensor
        if(controlType != "DUMMY"){
            // Sensors Creation
            this.sensor = new Sensor(this);
            // NNs Creation
            this.brain = new NeuralNetwork(
                [
                    // Input Layer
                    this.sensor.rayCount,
                    // Hidden Layer
                    8,
                    // Output Layer
                    4
                ]
            );
        }

        this.controls = new Controls(controlType);
    }

    draw(context, showSensors=false){
        // Car Color Settings
        let color;
        if (this.controlType == "DUMMY"){
            color = "green";
        }
        else{
            color = "black";
        }
                

        // Change PLayer Car's color when damaged
        if(this.damaged){
            context.fillStyle = 'red';
        }
        else{
            context.fillStyle = color;
        }

        // Draw Car
        context.beginPath();
        context.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i=1; i<this.polygon.length; i++){
            context.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        context.fill();

        // Draw Sensors && Only show sensors for bestCar
        if(this.sensor && showSensors){
            this.sensor.draw(context);
        }
    }

    update(roadBorders,traffic){
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#accessDamage(roadBorders, traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders, traffic);
            // Reading is 0 if rays are not intersecting
            // Reading is 1-offset if rays are intersecting
            const offsets = this.sensor.readings.map(
                r => r==null ? 0 : 1-r.offset
            );
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            
            // AI Car's Controls
            if(this.useBrain){
                this.controls.up = outputs[0];
                this.controls.down = outputs[1];
                this.controls.left = outputs[2];
                this.controls.right = outputs[3];
            }

            //// Debugger
            // console.log(outputs);
        }
    }

    #move(){
        //// Up & Down Movement
        // Acceleration
        if(this.controls.up){
            this.speed += this.acceleration;
        }
        if(this.controls.down){
            this.speed -= this.acceleration;
        }

        // Speed Cap
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if(this.speed < -this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }

        // Friction
        if(this.speed > 0){
            this.speed -= this.friction;
        }
        if(this.speed < 0){
            this.speed += this.friction;
        }
        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }


        //// Angle Rotation
        // Left & Right
        if(this.speed!='0'){ // Only rotate if moving
            // Flip the rotation if car goes backwards
            const flip = this.speed > 0 ? 1 : -1;
            if(this.controls.left){
                this.angle += this.rotateSpeed * flip;
            }
            if(this.controls.right){
                this.angle -= this.rotateSpeed * flip;
            }
        }

        //// Update & Move the Car
        // Update Car Position
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    // Create a car polygon for collision detection
    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width, this.height)/2; //Hypothenuse
        const alpha = Math.atan2(this.width,this.height); // Using Tangent to find Angle of center to corner

        // Top Right Corner
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });

        // Top Left Corner
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });

        // Bottom Left Corner
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });

        // Bottom Right Corner
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });
        
        return points;
    }

    #accessDamage(roadBorders, traffic){
        for(let i=0; i<roadBorders.length; i++){
            if(polysIntersect(this.polygon, roadBorders[i])){
                return true;
            }
        }
        for(let i=0; i<traffic.length; i++){
            if(polysIntersect(this.polygon, traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

}