type Vec2 = [number, number];
type Polygon2 = Vec2[];
type PolygonIndex = number;
type Segment2 = [Vec2, Vec2];

const X = 0;
const Y = 1;
const Z = 2;
const R1_C1 = 0;
const R2_C1 = 1;
const R3_C1 = 2;
const R1_C2 = 3;
const R2_C2 = 4;
const R3_C2 = 5;
const R1_C3 = 6;
const R2_C3 = 7;
const R3_C3 = 8;
const EPSILON = 0.0001;

export function cone(a : Vec2, b : Vec2, c : Vec2) : Vec2[] {
    return [a, b, c];
}

export function polygon(...ps : Vec2[]) : Polygon2 {
    return ps as Polygon2;
}

export function segment(v0 : Vec2, v1 : Vec2) : Segment2 {
    return [v0, v1];
}

export function perpDot(a : Vec2, b : Vec2) : number {
    return a[X] * b[Y] - a[Y] * b[X];
}

export function perp(v : Vec2) : Vec2 {
    return [-v[Y], v[X]];
}

function subtract2(a : Vec2, b : Vec2) : Vec2 {
    return [
        a[X] - b[X],
        a[Y] - b[Y]
    ];
}

export function areVectorsCollinear(a : Vec2, b : Vec2) : boolean {
    return Math.abs(perpDot(a, b)) < EPSILON;
}

function areSegmentsCollinear(a : Segment2, b : Segment2) : boolean {
    return areVectorsCollinear(subtract2(a[1], a[0]), subtract2(b[1], b[0])) &&
        areVectorsCollinear(subtract2(a[0], b[0]), subtract2(a[1], b[1]));
}
export function doSegmentsIntersect(a : Segment2, b : Segment2) : boolean {
    const v : Vec2 = subtract2(a[1], a[0]);
    const t = perpDot(v, subtract2(a[0], b[0])) / perpDot(v, subtract2(b[1], b[0]));
    return 0 <= t && t <= 1;
}

export function isSegmentInCone(cone : Vec2[], segmentPoint : Vec2) : boolean {
    // cone[0], cone[1], and cone[2] should *not* be collinear
    // TODO: add a console.assert about it?

    const diff : Vec2 = subtract2(segmentPoint, cone[1]);
    const edgeL : Vec2 = subtract2(cone[2], cone[1]);
    const edgeR : Vec2 = subtract2(cone[0], cone[1]);
    if (perpDot(edgeR, edgeL) > 0) {
        // vertex is convex
        return  (perpDot(diff, edgeR) < 0 && perpDot(diff, edgeL) > 0);
    } else {
        // vertex is reflex
        return  (perpDot(diff, edgeR) > 0 && perpDot(diff, edgeL) < 0);
    }

    return false;
}

export function isDiagonal(polygon : Polygon2, idx0: PolygonIndex, idx1 : PolygonIndex) : boolean {
    const iM = (idx0 - 1) % polygon.length;
    const iP = (idx0 + 1) % polygon.length;
    const cone = [];
    //if (!isSegmentInCone())
    return false;
};