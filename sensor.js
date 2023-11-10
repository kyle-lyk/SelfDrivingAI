class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount = 8;
        this.rayLength = 150;
        this.raySpread = Math.PI/2; // 90 degrees

        this.rays = [];

        // To detect how far away from borders or obstacles
        this.readings= [];
    }

    draw(context){
        for(let i=0; i<this.rayCount; i++){

            // Sensor Rays Readings
            let end= this.rays[i][1];
            if(this.readings[i]){
                end = this.readings[i];
            }

            // Draw Detecting Sensor Rays
            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = 'yellow';
            context.moveTo(
                this.rays[i][0].x, 
                this.rays[i][0].y
                );
            context.lineTo(
                end.x,
                end.y
                );
            context.stroke();

            // Draw Intersecting Sensor Rays
            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = 'red';
            context.moveTo(
                this.rays[i][1].x, 
                this.rays[i][1].y
                );
            context.lineTo(
                end.x,
                end.y
                );
            context.stroke();
        }
    }
    
    update(roadBorders, traffic){
        this.#castRays();
        this.readings = [];
        for(let i=0; i<this.rays.length; i++){
            this.readings.push(
                this.#getReading(
                    this.rays[i], 
                    roadBorders,
                    traffic
                    )
            );
        }
    }

    #getReading(ray, roadBorders, traffic){
        let touches = [];

        // Check offset distance from road borders
        for(let i=0; i<roadBorders.length; i++){
            const touch = getIntersection(
                ray[0], 
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );
            if(touch){
                touches.push(touch);
            }
        }

        // Check offset distance from traffic dummy cars
        for(let i=0; i<traffic.length; i++){
            const dummyPoly = traffic[i].polygon;
            for(let j=0; j<dummyPoly.length; j++){
                const touch = getIntersection(
                    ray[0], 
                    ray[1],
                    dummyPoly[j],
                    dummyPoly[(j+1)%dummyPoly.length]
                );
                if(touch){
                    touches.push(touch);
                }
            }
        }

        // If rays touch nothing, return null
        if(touches.length == 0){
            return null;
        }
        else{
            // If rays touch something, return the closest touch
            const offsets = touches.map(e=>e.offset);
            const minOffset = Math.min(...offsets); // Spread array into individual elements
            return touches.find(e=>e.offset == minOffset);
        }

    }

    #castRays(){
        this.rays = [];
        for(let i=0; i<this.rayCount; i++){
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount == 1 ? 0.5 : i/(this.rayCount-1)
            )+this.car.angle;
            
            // Locate the car position &
            // Rotate the ray angle by the car angle
            const start = { 
                x: this.car.x, 
                y: this.car.y 
            };
            const end = {
                x: this.car.x -
                    Math.sin(rayAngle) * this.rayLength,
                y: this.car.y -
                    Math.cos(rayAngle) * this.rayLength
            };
            this.rays.push([start,end]);
        }
    }
}