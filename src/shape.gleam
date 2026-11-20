//// The drawing Path types produced by the evaluator and rendered by the
//// animator.
////
//// The canvas maps a 1000-wide box centred on the origin onto its full size, and
//// x, y, and thickness are all in those units.

/// A point in world coordinates.
pub type Point {
  Point(x: Float, y: Float)
}

/// A point in 3D world coordinates. x and y run as they do for Point (y grows
/// downward), and z grows away from the viewer.
pub type Point3 {
  Point3(x: Float, y: Float, z: Float)
}

/// A shape's outline. Angles are in degrees, measured the way they look on
/// screen: 0° points right, 90° points up, and increasing angles turn
/// counterclockwise (even though y grows downward).
pub type Shape {
  Line(start: Point, end: Point)
  // A full circle, traced counterclockwise from its rightmost point.
  Circle(center: Point, radius: Float)
  // Part of a circle, from angle `from` to angle `to`: counterclockwise when
  // to > from, clockwise when to < from.
  Arc(center: Point, radius: Float, from: Float, to: Float)
  // A regular polygon inscribed in the circle of `radius`, with its first
  // vertex at angle `rotation`.
  Polygon(center: Point, radius: Float, sides: Int, rotation: Float)
  // A star whose `points` tips lie on the circle of `outer` and whose inner
  // corners lie on the circle of `inner`, with its first tip pointing up.
  Star(center: Point, outer: Float, inner: Float, points: Int)
  // 3D wireframes, drawn as the camera sees them (see projection.gleam).
  Line3(start: Point3, end: Point3)
  // An axis-aligned cube with sides of length `size`: its 12 edges.
  Cube(center: Point3, size: Float)
  // A sphere: rings of latitude and meridians from pole to pole.
  Sphere(center: Point3, radius: Float)
}

pub type Path {
  // start and end are the times (in tenths of a second) between which the path is
  // drawn: the reveal runs linearly from nothing at start to the complete shape at
  // end. A path with end <= start appears complete the moment it starts.
  Path(shape: Shape, start: Float, end: Float, thickness: Float)
}
