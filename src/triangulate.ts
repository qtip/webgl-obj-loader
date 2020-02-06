export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type Mat3 = [
    number, number, number,
    number, number, number,
    number, number, number
];
export type Polygon2 = Vec2[];
export type Polygon3 = Vec3[];
export type PolygonIndex = number;
export type Segment2 = [Vec2, Vec2];

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

// Vec2

export function perpDot(a: Vec2, b: Vec2): number {
    // Same as dot(perp(a), b)
    // Same as cross(a, b).z
    return a[X] * b[Y] - a[Y] * b[X];
}

export function perp(v: Vec2): Vec2 {
    return [-v[Y], v[X]];
}

function subtract2(a: Vec2, b: Vec2): Vec2 {
    return [
        a[X] - b[X],
        a[Y] - b[Y]
    ];
}

function pointsAreCollinear2(v0: Vec2, v1: Vec2, v2: Vec2) {
    return Math.abs(perpDot(
        subtract2(v0, v1),
        subtract2(v2, v1)
    )) < EPSILON;
}


export function pointIsInCCWSweep(
    position: Vec2,
    fromDirection: Vec2,
    toDirection: Vec2,
    segmentPoint: Vec2
): boolean {
    const diff: Vec2 = subtract2(segmentPoint, position);
    if (perpDot(fromDirection, toDirection) >= 0) {
        // Sweep angle is acute
        return (perpDot(toDirection, diff) < 0 && perpDot(fromDirection, diff) > 0);
    } else {
        // Sweep angle is obtuse
        return (perpDot(toDirection, diff) < 0 || perpDot(fromDirection, diff) > 0);
    }

    return false;
}

// Vec3

function subtract3(a: Vec3, b: Vec3): Vec3 {
    return [
        a[X] - b[X],
        a[Y] - b[Y],
        a[Z] - b[Z]
    ];
}

function normalize3(v: Vec3): Vec3 {
    const mag = Math.sqrt(dot3(v, v));
    return [
        v[X] / mag,
        v[Y] / mag,
        v[Z] / mag
    ];
}

function scale3(v: Vec3, s: number): Vec3 {
    return [
        v[X] * s,
        v[Y] * s,
        v[Z] * s
    ];
}

function dot3(a: Vec3, b: Vec3): number {
    return a[X] * b[X] +
           a[Y] * b[Y] +
           a[Z] * b[Z];
        
}

function sqrMag3(a: Vec3) {
    return a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
}

function cross(a: Vec3, b: Vec3) : Vec3 {
    return [
        a[Y] * b[Z] - a[Z] * b[Y], // X
        a[Z] * b[X] - a[X] * b[Z], // Y
        a[X] * b[Y] - a[Y] * b[X]  // Z
    ];
}

// Segment2

export function segmentsIntersect(a: Segment2, b: Segment2): boolean {
    const va: Vec2 = subtract2(a[1], a[0]);
    const vb: Vec2 = subtract2(b[1], b[0]);
    if (Math.abs(perpDot(vb, va)) < EPSILON) {
        return Math.abs(perpDot(va, subtract2(b[1], a[0]))) < EPSILON;
    }
    const t = -perpDot(vb, subtract2(b[0], a[1])) / perpDot(vb, va);
    const u = -perpDot(va, subtract2(a[0], b[1])) / perpDot(va, vb);
    if (b[0][1] === -1 && b[0][0] === -1) {
        console.log({a, b, t, u});
    }
    return (0 <= t && t <= 1) && (0 <= u && u <= 1);
}

export function wrap(i: PolygonIndex, n: PolygonIndex) {
    return (i + n) % n;
}

// Polygon2

export function isDiagonal(polygon: Polygon2, idx0: PolygonIndex, idx1: PolygonIndex): boolean {
    if (idx0 === idx1) {
        return false;
    }

    const isPolygonEdge = Math.abs(idx1 - idx0) === 1
        || idx0 === 0 && idx1 === polygon.length - 1
        || idx1 === 0 && idx0 === polygon.length - 1;
    if (isPolygonEdge) {
        return false;
    }

    const idxStart = wrap(idx0 - 1, polygon.length);
    const idxEnd = (idx0 + 1) % polygon.length;

    const isInsideThePolygon = pointIsInCCWSweep(
        polygon[idx0],
        subtract2(polygon[idxStart], polygon[idx0]),
        subtract2(polygon[idxEnd], polygon[idx0]),
        polygon[idx1]
    );
    if (!isInsideThePolygon) {
        return false;
    }
    const seg : Segment2 = [polygon[idx0], polygon[idx1]];
    for (let idxA = 0; idxA < polygon.length; idxA++) {
        const idxB = (idxA + 1) % polygon.length;
        const isRedunantTest = idxB == idx0 || idxB == idx1 || idxA == idx0 || idxA == idx1;
        if (isRedunantTest) {
            continue;
        }
        if (segmentsIntersect(
            seg,
            [polygon[idxA], polygon[idxB]]
        )) {
            return false;
        }
    }
    return true;
};

function transpose(m: Mat3) : Mat3 {
    return [
        m[R1_C1], m[R1_C2], m[R1_C3], // col 1
        m[R2_C1], m[R2_C2], m[R2_C3], // col 2
        m[R3_C1], m[R3_C2], m[R3_C3]  // col 3
    ];
}

function transform3(m: Mat3, v: Vec3) : Vec3 {
    return [
        m[R1_C1] * v[0] + m[R1_C2] * v[1] + m[R1_C3] * v[2], // X
        m[R2_C1] * v[0] + m[R2_C2] * v[1] + m[R2_C3] * v[2], // Y
        m[R3_C1] * v[0] + m[R3_C2] * v[1] + m[R3_C3] * v[2]  // Z
    ];
}

function pointsAreCollinear3(v0: Vec3, v1: Vec3, v2: Vec3) : boolean {
    return Math.abs(sqrMag3(cross(
        subtract3(v0, v1),
        subtract3(v2, v1)
    ))) < EPSILON;
}

function convertPolygonTo2D(polygon: Polygon3): Polygon2 {

        // Rotate all the points onto the x-y plane. This assumes that all the polygon
        // points are (nearly) coplanar

        // Find coplanar triangle
        let coplanarTriangleFound = false;
        let idx0: PolygonIndex = 0;
        let idx1: PolygonIndex = 0;
        let idx2: PolygonIndex = 0;
        for (idx1 = 0; idx1 < polygon.length; idx1++) {
            idx0 = wrap(idx1 - 1, polygon.length);
            idx2 = wrap(idx1 + 1, polygon.length);
            // idx0, idx1, idx2 form a triangle.
            if (!pointsAreCollinear3(polygon[idx0], polygon[idx1], polygon[idx2])) {
                coplanarTriangleFound = true;
                break;
            }
        }

        if (!coplanarTriangleFound) {
            throw new Error("No coplanar triangles found");
        }

        // Create two vectors out of them
        const v0 = subtract3(polygon[idx0], polygon[idx1]);
        const v1 = subtract3(polygon[idx2], polygon[idx1]);

        // Normalize one of them
        const u0 = normalize3(v0);

        // Remove projected from v1 to find a vector orthogonal to u0
        const u1 = normalize3(subtract3(v1, scale3(u0, dot3(u0, v1))));

            // Now build a third orthonormal vector out of u0 and u1
        const u2 = cross(u0, u1);

        // Create an matrix out of the orthonormal basis vectors {u0, u1, u2}
        const rot = [
            ...u0, // col 1
            ...u1, // col 2
            ...u2  // col 3
        ] as Mat3;

        // Transpose an orthonormal basis to invert it
        const invRot = transpose(rot);

        // Rotate each point onto the x/y plane
        const projectedVerts = polygon.map((v) => {
            return transform3(invRot, v).slice(0, 2) as Vec2;
        });

        return projectedVerts;
}

export function* triangulate(polygon3: Polygon3) {
    if (polygon3.length <= 3) {
        yield [0, 1, 2];
    }

    try {
        const polygon = convertPolygonTo2D(polygon3);
        const indices: PolygonIndex[] = polygon.map((_, i) => i);

        function remove(idx: PolygonIndex) {
            polygon.splice(idx, 1);
            indices.splice(idx, 1);
        }

        // (idx0, idx1, idx2) form a triangle
        // now we must look through all edges to see if
        // the line between idx0 and idx2
        let counter = 2000;
        while (polygon.length > 3) {
            if (--counter <= 0) {
                return;
            };
            for (let idx1 = 0; idx1 < polygon.length; idx1++) {
                const idx0 = wrap(idx1 - 1, polygon.length);
                const idx2 = (idx1 + 1) % polygon.length;
                if (pointsAreCollinear2(polygon[idx0], polygon[idx1], polygon[idx2])) {
                    // continue;
                }
                if (isDiagonal(polygon, idx0, idx2)) {
                    yield [indices[idx0], indices[idx1], indices[idx2]];
                    remove(idx1);
                    break;
                }
            }
        }
        yield indices;
    } catch (e) {
        console.error(e);
        for (let i = 1; i < polygon3.length; i++) {
            yield [0, wrap(i+1, polygon3.length), wrap(i+2, polygon3.length)];
        }
    }
}