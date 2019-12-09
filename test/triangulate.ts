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
    });
    describe('Test perpDot(...)', function () {
        it('should have the right answer for obvious input', function () {
            const result = Triangulate.perpDot(
                [ 1.0, 0.0 ],
                [ 0.0, 1.0 ]
            );
            expect(result).to.equal(1.0);
        })
        it('should have the right answer for non-obvious input', function () {
            const result = Triangulate.perpDot(
                [ 24.9, -139.4 ],
                [ 14.9, 99.99 ]
            );
            expect(result).to.be.closeTo(4566.811, 0.000001);
        })
    });
    describe('Test areVectorsCollinear(...)', function () {
        it('should have the right answers for obvious input', function() {
            {
                const result = Triangulate.areVectorsCollinear(
                    [1, 2],
                    [-1, -2]
                )
                expect(result).to.be.true;
            }
            {
                const result = Triangulate.areVectorsCollinear(
                    [1, 2],
                    [-20, 0]
                )
                expect(result).to.be.false;
            }
        });
        it('should alway count zero vector as collinear', function() {
            {
                const result = Triangulate.areVectorsCollinear(
                    [0, 0],
                    [-320398, 234.234]
                )
                expect(result).to.be.true;
            }
            {
                const result = Triangulate.areVectorsCollinear(
                    [0, 0],
                    [0, 0]
                )
                expect(result).to.be.true;
            }
        });
    });
    describe('Test isSegmentInCone(...)', function () {
        it('should have the right answers for obvious input', function () {
            const cone = Triangulate.cone(
                [1.0, 0.0],
                [0.0, 0.0],
                [0.0, 1.0]
            );
            expect(Triangulate.isSegmentInCone(cone, [100.0, 100.0])).to.be.true;
            expect(Triangulate.isSegmentInCone(cone, [1.0, 1.0])).to.be.true;
            expect(Triangulate.isSegmentInCone(cone, [1.0, -1.0])).to.be.false;
            expect(Triangulate.isSegmentInCone(cone, [-1.0, 1.0])).to.be.false;
            expect(Triangulate.isSegmentInCone(cone, [-1.0, -1.0])).to.be.false;
        });
        it('should have the right answers for a reflex cone', function () {
            const cone = Triangulate.cone(
                [0.0, 1.0],
                [0.0, 0.0],
                [1.0, 0.0]
            );
            expect(Triangulate.isSegmentInCone(cone, [100.0, 100.0])).to.be.true;
            expect(Triangulate.isSegmentInCone(cone, [1.0, 1.0])).to.be.true;
            expect(Triangulate.isSegmentInCone(cone, [1.0, -1.0])).to.be.false;
            expect(Triangulate.isSegmentInCone(cone, [-1.0, 1.0])).to.be.false;
            expect(Triangulate.isSegmentInCone(cone, [-1.0, -1.0])).to.be.false;
        });
        it('should be false when the cone points are collinear', function () {
            const cone = Triangulate.cone(
                [2.0, 1.0],
                [0.0, 0.0],
                [4.0, 2.0]
            );
            expect(Triangulate.isSegmentInCone(cone, [1.0, 1.0])).to.be.false;
            const coneReflex = Triangulate.cone(
                [0.0, 0.0],
                [4.0, 2.0],
                [2.0, 1.0]
            );
            expect(Triangulate.isSegmentInCone(coneReflex, [1.0, 1.0])).to.be.false;
        });
    });
    describe('Test doSegmentsIntersect(...)', function () {
        it('should have the right answer for obvious input', function () {
            const segment0 = Triangulate.segment(
                [-1, 0],
                [1, 0]
            );
            const segment1 = Triangulate.segment(
                [0, -1],
                [0, 1]
            );
            const segment2 = Triangulate.segment(
                [0.2, 1],
                [0.2, -1]
            );
            expect(Triangulate.doSegmentsIntersect(segment0, segment1)).to.be.true;
            expect(Triangulate.doSegmentsIntersect(segment0, segment2)).to.be.true;
            expect(Triangulate.doSegmentsIntersect(segment1, segment0)).to.be.true;
            expect(Triangulate.doSegmentsIntersect(segment1, segment2)).to.be.false;
            expect(Triangulate.doSegmentsIntersect(segment2, segment0)).to.be.true;
            expect(Triangulate.doSegmentsIntersect(segment2, segment1)).to.be.false;
        });
        it('shouldn\'t think that parallel lines intersect', function () {
            const segment0 = Triangulate.segment(
                [0, 0],
                [1, 2]
            );
            const segment1 = Triangulate.segment(
                [3, 0],
                [4, 2]
            );
            //expect(Triangulate.doSegmentsIntersect(segment0, segment1)).to.be.false;
        });
        it('should recognize collinear segments intersect', function () {
            const segment0 = Triangulate.segment(
                [0, 0],
                [1, 1]
            );
            const segment1 = Triangulate.segment(
                [0, 0],
                [2, 2]
            );
            //expect(Triangulate.doSegmentsIntersect(segment0, segment1)).to.be.true;
        });
    });
    describe('Test areSegmentsCollinear(...)', function () {
        it('shouldn\'t think that parallel segments are necessarily collinear', function () {
            const segment0 = Triangulate.segment(
                [0, 0],
                [1, 1]
            );
            const segment1 = Triangulate.segment(
                [100, 0],
                [101, 1]
            );
            //expect(Triangulate.areSegmentsCollinear(segment0, segment1)).to.be.false;
        });
    });
    /*
    describe('Test isDiagonal', function () {
        it('has the right answer for easy convex input', function () {
            const polygon = Triangulate.polygon(
                [-1, -1],
                [-1, 1],
                [1, 1],
                [1, -1]
            );
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
            const polygon = Triangulate.polygon(
                [-1, -1],
                [0, 1],
                [1, -1],
                [0, -0.5]
            );
            expect(Triangulate.isDiagonal(polygon, 0, 0)).is.false;
            expect(Triangulate.isDiagonal(polygon, 0, 1)).is.false;
            expect(Triangulate.isDiagonal(polygon, 0, 2)).is.false;
            expect(Triangulate.isDiagonal(polygon, 0, 3)).is.false;
            expect(Triangulate.isDiagonal(polygon, 1, 0)).is.false;
            expect(Triangulate.isDiagonal(polygon, 1, 1)).is.false;
            expect(Triangulate.isDiagonal(polygon, 1, 2)).is.false;
            expect(Triangulate.isDiagonal(polygon, 1, 3)).is.true;
            expect(Triangulate.isDiagonal(polygon, 2, 0)).is.false;
            expect(Triangulate.isDiagonal(polygon, 2, 1)).is.false;
            expect(Triangulate.isDiagonal(polygon, 2, 2)).is.false;
            expect(Triangulate.isDiagonal(polygon, 2, 3)).is.false;
            expect(Triangulate.isDiagonal(polygon, 3, 0)).is.false;
            expect(Triangulate.isDiagonal(polygon, 3, 1)).is.true;
            expect(Triangulate.isDiagonal(polygon, 3, 2)).is.false;
            expect(Triangulate.isDiagonal(polygon, 3, 3)).is.false;
        });
    });
    */
});