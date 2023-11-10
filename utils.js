// Linear Interpolation
function lerp(A,B,percentage){
    return A + (B-A)*percentage;
}

// Get the intersection point of lines
// using Line Segment Intersection
// Ref: https://www.youtube.com/watch?v=5FkOO1Wwb8w&ab_channel=EngineerNick
function getIntersection(A,B,C,D){
    const tTop = (D.x-C.x)*(A.y-C.y) - (D.y-C.y)*(A.x-C.x);
    const uTop = (C.y-A.y)*(A.x-B.x) - (C.x-A.x)*(A.y-B.y);
    const bottom = (D.y-C.y)*(B.x-A.x) - (D.x-C.x)*(B.y-A.y);

    if(bottom != 0){
        const t = tTop/bottom;
        const u = uTop/bottom;

        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}

// Check intersection of polygon with obstacles
function polysIntersect(poly1,poly2){
    for(let i=0; i<poly1.length; i++){
        for(let j=0; j<poly2.length; j++){
            // Forming segment lines from point to point
            const touch= getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}

//// Cofigurate NetworkCanvas Stroke Color based on weights
function getRGBA(value){
    // Higher opacity for weights closer to 1 or -1
    const alpha=Math.abs(value);
    // Higher Red saturation for weights closer to 1
    const R = value < 0 ? 0 : 255;
    // Color Blending
    const G = 120;
    // Higher Blue saturation for weights closer to -1
    const B = value > 0 ? 0 : 255;

    return `rgba(${R},${G},${B},${alpha})`;
}
