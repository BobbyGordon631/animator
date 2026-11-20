//# sourceMappingURL=shape.mjs.map
import { CustomType as $CustomType } from "./gleam.mjs";

export class Point extends $CustomType {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }
}
export const Point$Point = (x, y) => new Point(x, y);
export const Point$isPoint = (value) => value instanceof Point;
export const Point$Point$x = (value) => value.x;
export const Point$Point$0 = (value) => value.x;
export const Point$Point$y = (value) => value.y;
export const Point$Point$1 = (value) => value.y;

export class Point3 extends $CustomType {
  constructor(x, y, z) {
    super();
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
export const Point3$Point3 = (x, y, z) => new Point3(x, y, z);
export const Point3$isPoint3 = (value) => value instanceof Point3;
export const Point3$Point3$x = (value) => value.x;
export const Point3$Point3$0 = (value) => value.x;
export const Point3$Point3$y = (value) => value.y;
export const Point3$Point3$1 = (value) => value.y;
export const Point3$Point3$z = (value) => value.z;
export const Point3$Point3$2 = (value) => value.z;

export class Line extends $CustomType {
  constructor(start, end) {
    super();
    this.start = start;
    this.end = end;
  }
}
export const Shape$Line = (start, end) => new Line(start, end);
export const Shape$isLine = (value) => value instanceof Line;
export const Shape$Line$start = (value) => value.start;
export const Shape$Line$0 = (value) => value.start;
export const Shape$Line$end = (value) => value.end;
export const Shape$Line$1 = (value) => value.end;

export class Circle extends $CustomType {
  constructor(center, radius) {
    super();
    this.center = center;
    this.radius = radius;
  }
}
export const Shape$Circle = (center, radius) => new Circle(center, radius);
export const Shape$isCircle = (value) => value instanceof Circle;
export const Shape$Circle$center = (value) => value.center;
export const Shape$Circle$0 = (value) => value.center;
export const Shape$Circle$radius = (value) => value.radius;
export const Shape$Circle$1 = (value) => value.radius;

export class Arc extends $CustomType {
  constructor(center, radius, from, to) {
    super();
    this.center = center;
    this.radius = radius;
    this.from = from;
    this.to = to;
  }
}
export const Shape$Arc = (center, radius, from, to) =>
  new Arc(center, radius, from, to);
export const Shape$isArc = (value) => value instanceof Arc;
export const Shape$Arc$center = (value) => value.center;
export const Shape$Arc$0 = (value) => value.center;
export const Shape$Arc$radius = (value) => value.radius;
export const Shape$Arc$1 = (value) => value.radius;
export const Shape$Arc$from = (value) => value.from;
export const Shape$Arc$2 = (value) => value.from;
export const Shape$Arc$to = (value) => value.to;
export const Shape$Arc$3 = (value) => value.to;

export class Polygon extends $CustomType {
  constructor(center, radius, sides, rotation) {
    super();
    this.center = center;
    this.radius = radius;
    this.sides = sides;
    this.rotation = rotation;
  }
}
export const Shape$Polygon = (center, radius, sides, rotation) =>
  new Polygon(center, radius, sides, rotation);
export const Shape$isPolygon = (value) => value instanceof Polygon;
export const Shape$Polygon$center = (value) => value.center;
export const Shape$Polygon$0 = (value) => value.center;
export const Shape$Polygon$radius = (value) => value.radius;
export const Shape$Polygon$1 = (value) => value.radius;
export const Shape$Polygon$sides = (value) => value.sides;
export const Shape$Polygon$2 = (value) => value.sides;
export const Shape$Polygon$rotation = (value) => value.rotation;
export const Shape$Polygon$3 = (value) => value.rotation;

export class Star extends $CustomType {
  constructor(center, outer, inner, points) {
    super();
    this.center = center;
    this.outer = outer;
    this.inner = inner;
    this.points = points;
  }
}
export const Shape$Star = (center, outer, inner, points) =>
  new Star(center, outer, inner, points);
export const Shape$isStar = (value) => value instanceof Star;
export const Shape$Star$center = (value) => value.center;
export const Shape$Star$0 = (value) => value.center;
export const Shape$Star$outer = (value) => value.outer;
export const Shape$Star$1 = (value) => value.outer;
export const Shape$Star$inner = (value) => value.inner;
export const Shape$Star$2 = (value) => value.inner;
export const Shape$Star$points = (value) => value.points;
export const Shape$Star$3 = (value) => value.points;

export class Line3 extends $CustomType {
  constructor(start, end) {
    super();
    this.start = start;
    this.end = end;
  }
}
export const Shape$Line3 = (start, end) => new Line3(start, end);
export const Shape$isLine3 = (value) => value instanceof Line3;
export const Shape$Line3$start = (value) => value.start;
export const Shape$Line3$0 = (value) => value.start;
export const Shape$Line3$end = (value) => value.end;
export const Shape$Line3$1 = (value) => value.end;

export class Cube extends $CustomType {
  constructor(center, size) {
    super();
    this.center = center;
    this.size = size;
  }
}
export const Shape$Cube = (center, size) => new Cube(center, size);
export const Shape$isCube = (value) => value instanceof Cube;
export const Shape$Cube$center = (value) => value.center;
export const Shape$Cube$0 = (value) => value.center;
export const Shape$Cube$size = (value) => value.size;
export const Shape$Cube$1 = (value) => value.size;

export class Sphere extends $CustomType {
  constructor(center, radius) {
    super();
    this.center = center;
    this.radius = radius;
  }
}
export const Shape$Sphere = (center, radius) => new Sphere(center, radius);
export const Shape$isSphere = (value) => value instanceof Sphere;
export const Shape$Sphere$center = (value) => value.center;
export const Shape$Sphere$0 = (value) => value.center;
export const Shape$Sphere$radius = (value) => value.radius;
export const Shape$Sphere$1 = (value) => value.radius;

export class Path extends $CustomType {
  constructor(shape, start, end, thickness) {
    super();
    this.shape = shape;
    this.start = start;
    this.end = end;
    this.thickness = thickness;
  }
}
export const Path$Path = (shape, start, end, thickness) =>
  new Path(shape, start, end, thickness);
export const Path$isPath = (value) => value instanceof Path;
export const Path$Path$shape = (value) => value.shape;
export const Path$Path$0 = (value) => value.shape;
export const Path$Path$start = (value) => value.start;
export const Path$Path$1 = (value) => value.start;
export const Path$Path$end = (value) => value.end;
export const Path$Path$2 = (value) => value.end;
export const Path$Path$thickness = (value) => value.thickness;
export const Path$Path$3 = (value) => value.thickness;
