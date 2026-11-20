//// The drawings that a browser with no saved library starts with: each one's
//// name and source.

pub const all = [
  #(
    "fan",
    "fn draw(shape_slider: Int) -> List(Path) {
  fan(30, Point(-200, -200))
}

fn fan(n: Int, start: Point) -> List(Path) {
  case n > 0 {
    True -> [Path(Line(start, Point(n * 10, 200)), 0, 30, 3), ..fan(n - 1, start)]
    False -> []
  }
}
",
  ),
  #(
    "square_spiral",
    "fn draw(shape_slider: Int) -> List(Path) {
  let turns = 20 + shape_slider / 4
  spiral(Point(0, 0), Point(1, 0), 0, turns)
}

fn spiral(p: Point, d: Point, i: Int, n: Int) -> List(Path) {
  case i == n {
    True -> []
    False -> {
      let len = { i / 2 + 1 } * 24
      let q = Point(p.x + d.x * len, p.y + d.y * len)
      [
        Path(Line(p, q), i * 3, i * 3 + 3, 3),
        ..spiral(q, Point(0 - d.y, d.x), i + 1, n)
      ]
    }
  }
}
",
  ),
  #(
    "string_art",
    "fn draw(shape_slider: Int) -> List(Path) {
  let n = 8 + shape_slider / 10
  list.flatten([
    quadrant(1, 1, n, 0),
    quadrant(-1, 1, n, n + 1),
    quadrant(-1, -1, n, { n + 1 } * 2),
    quadrant(1, -1, n, { n + 1 } * 3),
  ])
}

fn quadrant(sx: Int, sy: Int, n: Int, base: Int) -> List(Path) {
  strings(0, sx, sy, n, base)
}

fn strings(i: Int, sx: Int, sy: Int, n: Int, base: Int) -> List(Path) {
  case i > n {
    True -> []
    False -> {
      let a = Point(sx * 420 * i / n, 0)
      let b = Point(0, sy * 420 * { n - i } / n)
      let t = { base + i } * 2
      [Path(Line(a, b), t, t + 8, 2), ..strings(i + 1, sx, sy, n, base)]
    }
  }
}
",
  ),
  #(
    "tree",
    "fn draw(shape_slider: Int) -> List(Path) {
  let depth = 4 + shape_slider / 20
  branch(Point(0, 420), Point(0, -220), 0, depth)
}

fn branch(p: Point, d: Point, level: Int, depth: Int) -> List(Path) {
  case level == depth {
    True -> []
    False -> {
      let q = Point(p.x + d.x, p.y + d.y)
      let left = Point({ d.x - d.y } / 2, { d.y + d.x } / 2)
      let right = Point({ d.x + d.y } / 2, { d.y - d.x } / 2)
      [
        Path(Line(p, q), level * 4, level * 4 + 4, depth - level),
        ..list.append(
          branch(q, left, level + 1, depth),
          branch(q, right, level + 1, depth),
        )
      ]
    }
  }
}
",
  ),
  #(
    "shapes",
    "fn draw(shape_slider: Int) -> List(Path) {
  let points = 5 + shape_slider / 20
  let turn = shape_slider * 36 / 10
  list.flatten([
    [Path(Circle(Point(0, 0), 430), 0, 20, 3)],
    ring(0, 6, turn),
    [Path(Arc(Point(0, 0), 225, 90, 150 + turn * 5 / 6), 50, 70, 6)],
    [Path(Star(Point(0, 0), 170, 70, points), 70, 90, 4)],
  ])
}

// Six polygons, from a triangle to an octagon, evenly spaced around a circle
// using cos and sin. Each one turns with the slider.
fn ring(i: Int, n: Int, turn: Int) -> List(Path) {
  case i == n {
    True -> []
    False -> {
      let angle = 90 + i * 360 / n + turn / 6
      let center = Point(cos(angle, 330), 0 - sin(angle, 330))
      [
        Path(Polygon(center, 70, i + 3, angle + turn), 20 + i * 5, 30 + i * 5, 3),
        ..ring(i + 1, n, turn)
      ]
    }
  }
}
",
  ),
  #(
    "cube_sphere",
    "fn draw(shape_slider: Int) -> List(Path) {
  let size = 200 + shape_slider * 3
  let center = Point3(0, 0, 0)
  let reach = size * 3 / 4
  [
    Path(Cube(center, size), 0, 40, 3),
    Path(Sphere(center, size * 45 / 100), 40, 90, 2),
    // An axis through the poles, sticking out of the cube.
    Path(Line3(Point3(0, 0 - reach, 0), Point3(0, reach, 0)), 90, 100, 2),
  ]
}
",
  ),
]
