class Road{
    constructor(x, width, laneCount=3){
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left= x-width/2;
        this.right = x+width/2;

        const infinity = 1000000;
        this.top = -infinity
        this.bottom = infinity;

        this.lineWidth = 5;
        this.lineColor = 'white';

        // Borders Setting
        const topLeft = {x: this.left, y: this.top};
        const topRight = {x: this.right, y: this.top};
        const bottomLeft = {x: this.left, y: this.bottom};
        const bottomRight = {x: this.right, y: this.bottom};

        this.borders = [
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ];
    }
    
    draw(context){
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;

        // Lane Lines Generation
        for(let i=1; i<=this.laneCount-1; i++){
            // To generate even percentage of lane width 
            // based on lane counts using Linear Interpolation
                // Eg. Left = 15, Right = 285, LaneCount = 1
                // B-A*0 = 0m, A = 15; B-A*1 = 285m, A = 285;
            const x = lerp(
                this.left,
                this.right,
                i/this.laneCount // even percentage of per lanewidth
            );
            
            // Set Line Dash for Lines in the middle
            context.setLineDash([20,20]);

            context.beginPath();
            context.moveTo(x, this.top);
            context.lineTo(x, this.bottom);
            context.stroke();
        }

        // Borders Line Generation
        context.setLineDash([]);
        this.borders.forEach(border => {
            context.beginPath();
            context.moveTo(border[0].x, border[0].y);
            context.lineTo(border[1].x, border[1].y);
            context.stroke();
        });
    }

    // Always get car spawned in the middle lane
    getLaneCenter(laneIndex){
        const laneWidth = this.width/this.laneCount;
        return this.left + laneWidth/2 + 
            Math.min(laneIndex,this.laneCount-1)*laneWidth;
    }
}
