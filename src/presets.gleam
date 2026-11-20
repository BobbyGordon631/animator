//// Ready-made drawings the menu offers to copy into the library, each name and
//// source. Each one declares its adjustable numbers as settings at the top of
//// draw (see settings.gleam), which the app shows as sliders.

pub const all = [
  #(
    "circle",
    "fn draw(shape_slider: Int) -> List(Path) {
  let rings = 5 // setting 1..12
  let radius = 400 // setting 50..480
  let thickness = 3 // setting 1..12
  // At 50 the rings share a center; the shape slider slides them apart.
  let shift = { shape_slider - 50 } * 2
  rings_from(0, rings, radius, thickness, shift)
}

fn rings_from(i: Int, n: Int, radius: Int, thickness: Int, shift: Int) -> List(Path) {
  case i == n {
    True -> []
    False -> {
      let r = radius - i * radius / n
      let center = Point(i * shift / n, 0)
      [
        Path(Circle(center, r), i * 8, i * 8 + 20, thickness),
        ..rings_from(i + 1, n, radius, thickness, shift)
      ]
    }
  }
}
",
  ),
  #(
    "star",
    "fn draw(shape_slider: Int) -> List(Path) {
  let points = 5 // setting 2..12
  let outer = 420 // setting 100..480
  let depth = 45 // setting 10..90
  let layers = 3 // setting 1..6
  layer(0, layers, points, outer, depth, shape_slider)
}

// Stars nested inside each other. depth is how far in the inner corners reach,
// as a percent of the outer radius; the shape slider sharpens the points.
fn layer(i: Int, n: Int, points: Int, outer: Int, depth: Int, shape_slider: Int) -> List(Path) {
  case i == n {
    True -> []
    False -> {
      let r = outer * { n - i } / n
      let inner = r * depth * { 50 + shape_slider / 2 } / 10000
      [
        Path(Star(Point(0, 0), r, inner + 1, points), i * 15, i * 15 + 30, 3),
        ..layer(i + 1, n, points, outer, depth, shape_slider)
      ]
    }
  }
}
",
  ),
  #(
    "flower",
    "fn draw(shape_slider: Int) -> List(Path) {
  let petals = 8 // setting 3..24
  let ring = 170 // setting 0..300
  let petal = 150 // setting 20..200
  // The shape slider turns the whole flower.
  let turn = shape_slider * 36 / 10 / petals
  [
    Path(Circle(Point(0, 0), petal / 2), 0, 10, 4),
    ..petal_ring(0, petals, ring, petal, turn)
  ]
}

// Circles evenly spaced around a ring, placed with cos and sin.
fn petal_ring(i: Int, n: Int, ring: Int, petal: Int, turn: Int) -> List(Path) {
  case i == n {
    True -> []
    False -> {
      let angle = 90 + i * 360 / n + turn
      let center = Point(cos(angle, ring), 0 - sin(angle, ring))
      [
        Path(Circle(center, petal), 10 + i * 4, 30 + i * 4, 2),
        ..petal_ring(i + 1, n, ring, petal, turn)
      ]
    }
  }
}
",
  ),
  #(
    "spiral",
    "fn draw(shape_slider: Int) -> List(Path) {
  let turns = 8 // setting 1..12
  let growth = 18 // setting 2..20
  let thickness = 4 // setting 1..10
  // The shape slider turns the spiral.
  let start = shape_slider * 36 / 10
  half_turns(0, turns * 2, growth, start, thickness)
}

// Half-circle arcs, each one step wider than the last. Their centers take
// turns between two points one step apart, so each arc starts where the last
// one ended and together they make a smooth spiral.
fn half_turns(i: Int, n: Int, growth: Int, start: Int, thickness: Int) -> List(Path) {
  case i == n {
    True -> []
    False -> {
      let center = case i % 2 {
        0 -> Point(0, 0)
        _ -> Point(cos(start, growth), 0 - sin(start, growth))
      }
      let from = start + i * 180
      [
        Path(Arc(center, growth * { i + 1 }, from, from + 180), i * 5, i * 5 + 5, thickness),
        ..half_turns(i + 1, n, growth, start, thickness)
      ]
    }
  }
}
",
  ),
  #(
    "cube",
    "fn draw(shape_slider: Int) -> List(Path) {
  let size = 320 // setting 50..400
  let cubes = 3 // setting 1..6
  let thickness = 3 // setting 1..8
  // Turn the camera slider to look around. The shape slider grows the sphere.
  let radius = 1 + size * shape_slider / 220
  list.append(
    nested(0, cubes, size, thickness),
    [Path(Sphere(Point3(0, 0, 0), radius), cubes * 20, cubes * 20 + 40, 2)],
  )
}

// Cubes inside each other, each drawn after the last.
fn nested(i: Int, n: Int, size: Int, thickness: Int) -> List(Path) {
  case i == n {
    True -> []
    False -> [
      Path(Cube(Point3(0, 0, 0), size * { n - i } / n), i * 20, i * 20 + 20, thickness),
      ..nested(i + 1, n, size, thickness)
    ]
  }
}
",
  ),
  #(
    "solar system",
    "fn draw(shape_slider: Int) -> List(Path) {
  let planets = 5 // setting 1..8
  let sun = 50 // setting 10..80
  let spacing = 50 // setting 20..50
  [
    Path(Circle(Point(0, 0), sun), 0, 10, 6),
    ..planet(1, planets, sun, spacing, shape_slider)
  ]
}

// Each planet's orbit, then the planet on it. The shape slider moves the planets
// around their orbits, the inner ones faster, using cos and sin to place them.
fn planet(i: Int, n: Int, sun: Int, spacing: Int, shape_slider: Int) -> List(Path) {
  case i > n {
    True -> []
    False -> {
      let orbit = sun + i * spacing
      let angle = i * 50 + shape_slider * 36 / { i + 1 }
      let center = Point(cos(angle, orbit), 0 - sin(angle, orbit))
      let size = 6 + { i * 7 } % 12
      [
        Path(Circle(Point(0, 0), orbit), 10 + i * 6, 20 + i * 6, 1),
        Path(Circle(center, size), 20 + i * 6, 24 + i * 6, 4),
        ..planet(i + 1, n, sun, spacing, shape_slider)
      ]
    }
  }
}
",
  ),
  #(
    "kolam",
    "fn draw(shape_slider: Int) -> List(Path) {
  let rings = 2 // setting 1..3
  let spacing = 110 // setting 70..120
  let petal = 60 // setting 30..80
  let thickness = 3 // setting 1..6
  // In the style of a kolam, South Indian art drawn around a grid of dots.
  // The shape slider opens the leaves wider and spins the swirls.
  let bulge = 35 + shape_slider / 4
  let spin = shape_slider * 36 / 10
  let steps = count(0 - rings - 1, rings + 1)
  let cells =
    list.flatten(list.map(steps, fn(i) { list.map(steps, fn(j) { Point(i, j) }) }))
  list.flatten(
    list.map(cells, fn(cell) { tile(cell, rings, spacing, petal, thickness, bulge, spin) }),
  )
}

// What goes in one grid cell: a swirl framed by a square at the center, a motif
// in every cell of the diamond around it, and swirls just outside its edges.
// Each ring of the diamond draws after the one inside it.
fn tile(cell: Point, rings: Int, spacing: Int, petal: Int, thickness: Int, bulge: Int, spin: Int) -> List(Path) {
  let ring = abs(cell.x) + abs(cell.y)
  let center = Point(cell.x * spacing, cell.y * spacing)
  case ring == 0 {
    True ->
      list.append(
        swirl(center, spacing / 4, thickness, spin, 0),
        [Path(Polygon(center, spacing * 7 / 10, 4, 45), 0, 20, thickness)],
      )
    False ->
      case ring <= rings {
        True -> motif(center, spacing, petal, thickness, bulge, ring * 20)
        False ->
          case ring == rings + 1 && cell.x != 0 && cell.y != 0 {
            True -> swirl(center, spacing / 4, thickness, spin, ring * 20)
            False -> []
          }
      }
  }
}

// Four leaves crossing in an X, with a dot in the middle and one in each gap.
fn motif(center: Point, spacing: Int, petal: Int, thickness: Int, bulge: Int, t: Int) -> List(Path) {
  let gap = spacing * 12 / 100
  let length = spacing * petal / 100
  let reach = gap + length / 2
  list.flatten([
    leaf(center, 45, gap, length, bulge, thickness, t),
    leaf(center, 135, gap, length, bulge, thickness, t),
    leaf(center, 225, gap, length, bulge, thickness, t),
    leaf(center, 315, gap, length, bulge, thickness, t),
    [
      dot(center, t),
      dot(toward(center, 0, reach), t),
      dot(toward(center, 90, reach), t),
      dot(toward(center, 180, reach), t),
      dot(toward(center, 270, reach), t),
    ],
  ])
}

// A pointed leaf from gap to gap + length out from center, at angle degrees: two
// arcs of the same circle size, bowing out on either side, that meet at both
// tips. bulge is the angle each arc turns through on either side of its middle,
// so a bigger bulge makes a rounder leaf. The language has only integers, so
// sin and cos are scaled by 1000 to work out the arcs' radius.
fn leaf(center: Point, angle: Int, gap: Int, length: Int, bulge: Int, thickness: Int, t: Int) -> List(Path) {
  let p = toward(center, angle, gap)
  let q = toward(center, angle, gap + length)
  let middle = Point({ p.x + q.x } / 2, { p.y + q.y } / 2)
  let r = length * 1000 / { 2 * sin(bulge, 1000) }
  let d = cos(bulge, r)
  [
    Path(Arc(toward(middle, angle + 90, d), r, angle - 90 - bulge, angle - 90 + bulge), t, t + 20, thickness),
    Path(Arc(toward(middle, angle - 90, d), r, angle + 90 + bulge, angle + 90 - bulge), t, t + 20, thickness),
  ]
}

// Four half circles turning the same way around center, like a pinwheel.
fn swirl(center: Point, r: Int, thickness: Int, spin: Int, t: Int) -> List(Path) {
  list.map([0, 90, 180, 270], fn(k) {
    let a = k + spin
    Path(Arc(toward(center, a, r), r, a, a + 180), t, t + 20, thickness)
  })
}

// A small dot, drawn all at once.
fn dot(p: Point, t: Int) -> Path {
  Path(Circle(p, 3), t, t, 4)
}

// The point r away from p in the direction angle (0 is right, 90 is up).
fn toward(p: Point, angle: Int, r: Int) -> Point {
  Point(p.x + cos(angle, r), p.y - sin(angle, r))
}

// [from, from + 1, ..., to].
fn count(from: Int, to: Int) -> List(Int) {
  case from > to {
    True -> []
    False -> [from, ..count(from + 1, to)]
  }
}
",
  ),
]
