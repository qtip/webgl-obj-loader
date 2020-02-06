import { expect } from 'chai';

import * as Triangulate from '../src/triangulate';

describe('Triangulate', function () {
    describe('Test perp(...)', function () {
        it('should have the right answer for obvious input', function () {
            {
                const result = Triangulate.perp([0, 0]);
                expect(result[0]).to.be.closeTo(0, 0.0001);
                expect(result[1]).to.be.closeTo(0, 0.0001);
            }
            {
                const result = Triangulate.perp([1, 0]);
                expect(result[0]).to.be.closeTo(Math.cos(Math.PI / 2), 0.0001);
                expect(result[1]).to.be.closeTo(Math.sin(Math.PI / 2), 0.0001);
            }
        });
        it('should have the right answer for less obvious input', function () {
            {
                const angle = 293.13;
                const input : Triangulate.Vec2 = [
                    -92.3 * Math.cos(angle),
                    -92.3 * Math.sin(angle)
                ];
                const inputRotated : Triangulate.Vec2 = [
                    -92.3 * Math.cos(angle + Math.PI / 2),
                    -92.3 * Math.sin(angle + Math.PI / 2)
                ];
                const result = Triangulate.perp(input);
                expect(result[0]).to.be.closeTo(inputRotated[0], 0.0001);
                expect(result[1]).to.be.closeTo(inputRotated[1], 0.0001);
            }
        });
    });
    describe('Test perpDot(...)', function () {
        it('should have the right answer for obvious input', function () {
            {
                const result = Triangulate.perpDot(
                    [ 1.0, 0.0 ],
                    [ 0.0, 1.0 ]
                );
                expect(result).to.equal(1.0);
            }
            {
                const result = Triangulate.perpDot(
                    [ 0.0, 1.0 ],
                    [ 1.0, 0.0 ]
                );
                expect(result).to.equal(-1.0);
            }
            {
                const result = Triangulate.perpDot(
                    [ 1.0, 0.0 ],
                    [ -1.0, 0.0 ]
                );
                expect(result).to.equal(-0.0);
            }
            {
                const result = Triangulate.perpDot(
                    [ -1.0, 0.0 ],
                    [ 1.0, 0.0 ]
                );
                expect(result).to.equal(0.0);
            }
        })
        it('should have the right answer for non-obvious input', function () {
            const result = Triangulate.perpDot(
                [ 24.9, -139.4 ],
                [ 14.9, 99.99 ]
            );
            expect(result).to.be.closeTo(4566.811, 0.000001);
        })
    });
    describe('Test pointIsInCCWSweep(...)', function () {
        it('should have the right answers for first quadrant sweep', function () {
            const isInFirstQuadrant = Triangulate.pointIsInCCWSweep.bind(null,
                [0.0, 0.0], // position
                [1.0, 0.0], // fromDirection
                [0.0, 1.0] // toDirection
            );
            expect(isInFirstQuadrant([100.0, 100.0])).to.be.true;
            expect(isInFirstQuadrant([1.0, 1.0])).to.be.true;
            expect(isInFirstQuadrant([1.0, -1.0])).to.be.false;
            expect(isInFirstQuadrant([-1.0, 1.0])).to.be.false;
            expect(isInFirstQuadrant([-1.0, -1.0])).to.be.false;
        });
        it('should have the right answers for obtuse sweep angle', function () {
            const isNotInThirdQuadrant = Triangulate.pointIsInCCWSweep.bind(null,
                [0.0, 0.0], // position
                [0.0, -1.0], // fromDirection
                [-1.0, 0.0] // toDirection
            );
            expect(isNotInThirdQuadrant([100.0, 100.0])).to.be.true;
            expect(isNotInThirdQuadrant([1.0, 1.0])).to.be.true;
            expect(isNotInThirdQuadrant([1.0, -1.0])).to.be.true;
            expect(isNotInThirdQuadrant([-1.0, 1.0])).to.be.true;
            expect(isNotInThirdQuadrant([-1.0, -1.0])).to.be.false;
            expect(isNotInThirdQuadrant([-11.0, -0.03])).to.be.false;
        });
        it('should be false when the sweeping over 0 deg', function () {
            const isInZeroDegSweep = Triangulate.pointIsInCCWSweep.bind(null,
                [2.0, 1.0], // position
                [-2.0, -1.0], // fromDirection
                [-4.0, -2.0] // toDirection
            );
            expect(isInZeroDegSweep([1.0, 1.0])).to.be.false;
            expect(isInZeroDegSweep([0.0, 0.0])).to.be.false;
            expect(isInZeroDegSweep([-1.0, -0.5])).to.be.false;
        });
    });
    describe('Test segmentsIntersect(...)', function () {
        it('should have the right answer for obvious input', function () {
            const segment0: Triangulate.Segment2 = [
                [-1, 0],
                [1, 0]
            ];
            const segment1: Triangulate.Segment2 = [
                [0, -1],
                [0, 1]
            ];
            const segment2: Triangulate.Segment2 = [
                [0.2, 1],
                [0.2, -1]
            ];
            expect(Triangulate.segmentsIntersect(segment0, segment1)).to.be.true;
            expect(Triangulate.segmentsIntersect(segment0, segment2)).to.be.true;
            expect(Triangulate.segmentsIntersect(segment1, segment0)).to.be.true;
            expect(Triangulate.segmentsIntersect(segment1, segment2)).to.be.false;
            expect(Triangulate.segmentsIntersect(segment2, segment0)).to.be.true;
            expect(Triangulate.segmentsIntersect(segment2, segment1)).to.be.false;
        });
        it('shouldn\'t think that parallel lines intersect', function () {
            const segment0: Triangulate.Segment2 = [
                [0, 0],
                [1, 2]
            ];
            const segment1: Triangulate.Segment2 = [
                [3, 0],
                [4, 2]
            ];
            expect(Triangulate.segmentsIntersect(segment0, segment1)).to.be.false;
        });
        it('should recognize collinear segments intersect', function () {
            const segment0: Triangulate.Segment2 = [
                [ 1,  1],
                [-1, -1]
            ];
            const segment1: Triangulate.Segment2 = [
                [-1, -1],
                [ 0,  0]
            ];
            expect(Triangulate.segmentsIntersect(segment0, segment1)).to.be.true;
        });
        it('shouldn\'t think that separated segments intersect', function() {
            const segment0: Triangulate.Segment2 = [
                [0.44, 0.44],
                [0.66, ​1.11]
            ];
            const segment1: Triangulate.Segment2 = [
                [1.55, ​ 0],
                [0, 0]
            ];
            expect(Triangulate.segmentsIntersect(segment0, segment1)).to.be.false;
        });
        it('should detect vertical line intersecting diagonal', function() {
            {
                const segment0: Triangulate.Segment2 = [
                    [3, 6],
                    [1, 1]
                ];
                const segment1: Triangulate.Segment2 = [
                    [2, 2],
                    [2, 5]
                ];
                expect(Triangulate.segmentsIntersect(segment0, segment1)).to.be.true;
            }

            {
                const segment0: Triangulate.Segment2 = [
                    [11, 15],
                    [4, 4]
                ];
                const segment1: Triangulate.Segment2 = [
                    [8, 6],
                    [8, 13]
                ];
                expect(Triangulate.segmentsIntersect(segment0, segment1)).to.be.true;
            }
        });
    });
    describe('Test isDiagonal(...)', function () {
        it('has the right answer for easy convex input', function () {
            const polygon: Triangulate.Polygon2 = [
                [-1, -1],
                [-1, 1],
                [1, 1],
                [1, -1]
            ];
            /*
            v1  o-------o v2
                |       |
                |       |
            v0  o-------o v3
            */
            expect(Triangulate.isDiagonal(polygon, 0, 0)).is.false;
            expect(Triangulate.isDiagonal(polygon, 0, 1)).is.false;
            expect(Triangulate.isDiagonal(polygon, 0, 2)).is.true;
            expect(Triangulate.isDiagonal(polygon, 0, 3)).is.false;
            expect(Triangulate.isDiagonal(polygon, 1, 0)).is.false;
            expect(Triangulate.isDiagonal(polygon, 1, 1)).is.false;
            expect(Triangulate.isDiagonal(polygon, 1, 2)).is.false;
            expect(Triangulate.isDiagonal(polygon, 1, 3)).is.true;
            expect(Triangulate.isDiagonal(polygon, 2, 0)).is.true;
            expect(Triangulate.isDiagonal(polygon, 2, 1)).is.false;
            expect(Triangulate.isDiagonal(polygon, 2, 2)).is.false;
            expect(Triangulate.isDiagonal(polygon, 2, 3)).is.false;
            expect(Triangulate.isDiagonal(polygon, 3, 0)).is.false;
            expect(Triangulate.isDiagonal(polygon, 3, 1)).is.true;
            expect(Triangulate.isDiagonal(polygon, 3, 2)).is.false;
            expect(Triangulate.isDiagonal(polygon, 3, 3)).is.false;
        });
        it('has the right answer for easy concave input', function () {
            const polygon: Triangulate.Polygon2 = [
                [-1, -1],
                [0, 1],
                [1, -1],
                [0, -0.5]
            ];
            /*
                 v1  o
                   /  \
                 / .o. \
             v0 o-'   `-o v2
            */
            expect(Triangulate.isDiagonal(polygon, 0, 0)).is.false; // Same point
            expect(Triangulate.isDiagonal(polygon, 0, 1)).is.false; // Polygon edge
            expect(Triangulate.isDiagonal(polygon, 0, 2)).is.false; // Exterior to polygon
            expect(Triangulate.isDiagonal(polygon, 0, 3)).is.false; // Polygon edge
            expect(Triangulate.isDiagonal(polygon, 1, 0)).is.false; // Polygon edge
            expect(Triangulate.isDiagonal(polygon, 1, 1)).is.false; // Same point
            expect(Triangulate.isDiagonal(polygon, 1, 2)).is.false; // Polygon edge
            expect(Triangulate.isDiagonal(polygon, 1, 3)).is.true;
            expect(Triangulate.isDiagonal(polygon, 2, 0)).is.false; // Exterior to polygon;
            expect(Triangulate.isDiagonal(polygon, 2, 1)).is.false; // Polygon edge
            expect(Triangulate.isDiagonal(polygon, 2, 2)).is.false; // Same point
            expect(Triangulate.isDiagonal(polygon, 2, 3)).is.false; // Polygon edge
            expect(Triangulate.isDiagonal(polygon, 3, 0)).is.false; // Polygon edge
            expect(Triangulate.isDiagonal(polygon, 3, 1)).is.true;
            expect(Triangulate.isDiagonal(polygon, 3, 2)).is.false; // Polygon edge
            expect(Triangulate.isDiagonal(polygon, 3, 3)).is.false; // Same point
        });
    });
    describe('Test triangulate(...)', function () {
        it("works?", function () {
            const polygon: Triangulate.Polygon3 = [
                [0, 3, 0],
                [3, 3, 0],
                [2, 3, 0],
                [1, 1, 0],
                [0, 0, 0]
            ];
            /*
            0
            |`
            |  `
            | .3.`
            4'   2-1
            */
            return;
        });
    });
});