//// Convert each shape into lists of points called RenderPaths: one for a 2D
//// shape, and one per stroke for a 3D wireframe seen through the camera.

import gleam/float
import gleam/int
import gleam/list
import gleam/result
import projection
import shape.{
  type Path, type Point, type Point3, type Shape, Arc, Circle, Cube, Line, Line3,
  Point, Point3, Polygon, Sphere, Star,
}
import trig

/// One path as canvas.mjs setDrawing consumes it (field by field): the
/// polyline, stroke colour/width, and the start and end times (in tenths of a second)
/// between which the reveal runs — so the renderer's clock needs no shape
/// knowledge.
pub type RenderPath {
  RenderPath(
    points: List(Point),
    thickness: Float,
    color: String,
    start: Float,
    end: Float,
  )
}

// ── The canvas (canvas.mjs) ───────────────────────────────────────────────────

/// Replace the drawing being animated in the page's
/// `<canvas id="animation-canvas">` element. If that element doesn't appear within
/// about 10 seconds, this logs an error to the browser console. This keeps the
/// current time, so a drawing that replaces a finished one appears complete. To
/// animate it from the start, also call reset_clock.
@external(javascript, "./canvas.mjs", "setDrawing")
pub fn set_drawing(paths: List(RenderPath)) -> Nil

/// Set the animation's speed, as a multiple of its normal speed: 1.0 is normal and
/// is where it starts, 0.0 pauses, and a negative rate plays it backward.
/// Time stops at the start of the drawing and when its last path finishes, so
/// playing a finished drawing again takes a call to reset_clock.
@external(javascript, "./canvas.mjs", "setSpeed")
pub fn set_speed(rate: Float) -> Nil

/// Jump the animation back to its start, where the canvas is empty.
@external(javascript, "./canvas.mjs", "resetClock")
pub fn reset_clock() -> Nil

/// One path as a single polyline. A 3D shape is seen from the default camera
/// and its strokes are joined end to end, so render_strokes is the better way to
/// draw one.
pub fn render_path(path: Path, color: String) -> RenderPath {
  RenderPath(outline(path.shape), path.thickness, color, path.start, path.end)
}

/// One path as the strokes the canvas draws, with 3D shapes seen from the camera
/// at angle `camera` (in degrees); 2D shapes ignore it. A 2D shape is one
/// stroke. A 3D shape can be several (a cube's 12 edges can't be traced without
/// lifting the pen), so the path's time window is split among them in
/// proportion to their lengths and the whole shape still draws as one trace.
/// Each stroke's thickness is scaled by its perspective, so farther edges are
/// thinner.
pub fn render_strokes(
  path: Path,
  color: String,
  camera: Float,
) -> List(RenderPath) {
  render_view(path, color, camera, int.to_float(projection.default_tilt))
}

/// Like render_strokes, but with the camera looking down by `tilt` degrees
/// (negative looks up from below), as freehand viewing sets it.
pub fn render_view(
  path: Path,
  color: String,
  camera: Float,
  tilt: Float,
) -> List(RenderPath) {
  case path.shape {
    // Exactly what render_path makes, so 2D drawings are unchanged.
    Line(..) | Circle(..) | Arc(..) | Polygon(..) | Star(..) -> [
      render_path(path, color),
    ]
    Line3(..) | Cube(..) | Sphere(..) ->
      render_3d(strokes(path.shape, camera, tilt), path, color)
  }
}

// Split the path's time window among its strokes, in proportion to length.
fn render_3d(
  strokes: List(Stroke),
  path: Path,
  color: String,
) -> List(RenderPath) {
  let total = list.fold(strokes, 0.0, fn(sum, s) { sum +. s.length })
  // Strokes of no length (a Line3 from a point to itself) share time equally.
  let #(strokes, total) = case total >. 0.0 {
    True -> #(strokes, total)
    False -> #(
      list.map(strokes, fn(s) { Stroke(..s, length: 1.0) }),
      int.to_float(list.length(strokes)),
    )
  }
  let duration = path.end -. path.start
  let #(_, render_paths) =
    list.fold(strokes, #(0.0, []), fn(acc, stroke) {
      let #(done, render_paths) = acc
      let finished = done +. stroke.length
      let #(start, end) = case duration >. 0.0 {
        True -> #(
          path.start +. duration *. done /. total,
          path.start +. duration *. finished /. total,
        )
        // An instant path shows every stroke complete at its start.
        False -> #(path.start, path.start)
      }
      let render_path =
        RenderPath(
          stroke.points,
          path.thickness *. stroke.scale,
          color,
          start,
          end,
        )
      #(finished, [render_path, ..render_paths])
    })
  list.reverse(render_paths)
}

// One polyline of a shape: its points on the canvas, its length (in 3D for a
// 3D shape, so turning the camera doesn't change its timing), and its average
// perspective scale.
type Stroke {
  Stroke(points: List(Point), length: Float, scale: Float)
}

fn strokes(shape: Shape, camera: Float, tilt: Float) -> List(Stroke) {
  case shape {
    Line(..) | Circle(..) | Arc(..) | Polygon(..) | Star(..) -> [
      Stroke(outline(shape), 1.0, 1.0),
    ]
    Line3(a, b) -> project_all([[a, b]], camera, tilt)
    Cube(center, size) -> project_all(cube_edges(center, size), camera, tilt)
    Sphere(center, radius) ->
      project_all(sphere_wires(center, radius), camera, tilt)
  }
}

/// The points along a shape's outline, in the order the pen draws them, so
/// that canvas.mjs revealing a growing prefix traces the shape the way a Line
/// grows: a circle draws itself around its edge. A 3D shape's strokes, seen
/// from the default camera, are joined end to end.
pub fn outline(shape: Shape) -> List(Point) {
  case shape {
    Line3(..) | Cube(..) | Sphere(..) ->
      strokes(
        shape,
        int.to_float(projection.default_camera),
        int.to_float(projection.default_tilt),
      )
      |> list.flat_map(fn(s) { s.points })
    Line(a, b) -> [a, b]
    Circle(center, radius) -> {
      let n = circle_segments(radius)
      // The last point repeats the first exactly, so the circle closes.
      closed(
        samples(n - 1, fn(i) {
          on_circle(center, radius, fraction(i, n) *. 360.0)
        }),
      )
    }
    Arc(center, radius, from, to) -> {
      let sweep = to -. from
      let n =
        float.ceiling(
          int.to_float(circle_segments(radius))
          *. float.absolute_value(sweep)
          /. 360.0,
        )
        |> float.round
        |> int.clamp(1, max_arc_segments)
      samples(n, fn(i) {
        on_circle(center, radius, from +. sweep *. fraction(i, n))
      })
    }
    Polygon(center, radius, sides, rotation) ->
      closed(
        samples(sides - 1, fn(i) {
          on_circle(center, radius, rotation +. fraction(i, sides) *. 360.0)
        }),
      )
    Star(center, outer, inner, points) ->
      // Tips (even i) alternate with inner corners (odd i), starting with a tip
      // straight up at 90°.
      closed(
        samples(2 * points - 1, fn(i) {
          let radius = case i % 2 {
            0 -> outer
            _ -> inner
          }
          on_circle(center, radius, 90.0 +. fraction(i, 2 * points) *. 360.0)
        }),
      )
  }
}

// How many straight segments approximate a full circle of this radius: about
// one per 4 units of radius, so big circles stay smooth and small ones cheap.
fn circle_segments(radius: Float) -> Int {
  int.clamp(float.round(radius /. 4.0), 24, 240)
}

// An arc may sweep several turns, but stays within the same ~400-point budget as
// every other shape.
const max_arc_segments = 399

// The point at angle `degrees` on the circle around center. Angles turn
// counterclockwise as seen on screen, and y grows downward, so sin is
// subtracted.
fn on_circle(center: Point, radius: Float, degrees: Float) -> Point {
  Point(
    center.x +. radius *. trig.cos_degrees(degrees),
    center.y -. radius *. trig.sin_degrees(degrees),
  )
}

fn fraction(i: Int, n: Int) -> Float {
  int.to_float(i) /. int.to_float(n)
}

// ── 3D wireframes ─────────────────────────────────────────────────────────────

// Each 3D polyline as the camera sees it.
fn project_all(
  polylines: List(List(Point3)),
  camera: Float,
  tilt: Float,
) -> List(Stroke) {
  list.map(polylines, fn(points) {
    let projected = list.map(points, projection.project_view(_, camera, tilt))
    let scales = list.map(projected, fn(p) { p.1 })
    Stroke(
      points: list.map(projected, fn(p) { p.0 }),
      length: length3(points),
      scale: float.sum(scales) /. int.to_float(list.length(scales)),
    )
  })
}

// The 12 edges of an axis-aligned cube, each its own stroke so each can have its
// own depth: the top square, the bottom square, then the four uprights. The top
// is at -y, since y grows downward.
fn cube_edges(center: Point3, size: Float) -> List(List(Point3)) {
  let h = size /. 2.0
  let corner = fn(dx, dy, dz) {
    Point3(center.x +. dx *. h, center.y +. dy *. h, center.z +. dz *. h)
  }
  let square = fn(dy) {
    let corners = [
      corner(-1.0, dy, -1.0),
      corner(1.0, dy, -1.0),
      corner(1.0, dy, 1.0),
      corner(-1.0, dy, 1.0),
    ]
    list.zip(corners, list.append(list.drop(corners, 1), list.take(corners, 1)))
    |> list.map(fn(edge) { [edge.0, edge.1] })
  }
  let uprights =
    list.map([#(-1.0, -1.0), #(1.0, -1.0), #(1.0, 1.0), #(-1.0, 1.0)], fn(xz) {
      [corner(xz.0, -1.0, xz.1), corner(xz.0, 1.0, xz.1)]
    })
  list.flatten([square(-1.0), square(1.0), uprights])
}

// A sphere's wireframe: six rings of latitude, then eight meridians from the
// north pole (up, at -y) to the south pole.
fn sphere_wires(center: Point3, radius: Float) -> List(List(Point3)) {
  let n = int.clamp(float.round(radius /. 8.0), 16, 40)
  let half = n / 2
  let rings =
    list.map([-75.0, -45.0, -15.0, 15.0, 45.0, 75.0], fn(latitude) {
      closed(
        samples(n - 1, fn(i) {
          on_sphere(center, radius, latitude, fraction(i, n) *. 360.0)
        }),
      )
    })
  let meridians =
    list.map([0, 1, 2, 3, 4, 5, 6, 7], fn(k) {
      samples(half, fn(i) {
        on_sphere(
          center,
          radius,
          90.0 -. 180.0 *. fraction(i, half),
          int.to_float(k) *. 45.0,
        )
      })
    })
  list.append(rings, meridians)
}

// The point at a latitude and longitude (in degrees) on a sphere.
fn on_sphere(
  center: Point3,
  radius: Float,
  latitude: Float,
  longitude: Float,
) -> Point3 {
  let ring = radius *. trig.cos_degrees(latitude)
  Point3(
    center.x +. ring *. trig.cos_degrees(longitude),
    center.y -. radius *. trig.sin_degrees(latitude),
    center.z +. ring *. trig.sin_degrees(longitude),
  )
}

// The total length of a 3D polyline.
fn length3(points: List(Point3)) -> Float {
  list.zip(points, list.drop(points, 1))
  |> list.fold(0.0, fn(sum, segment) {
    let #(a, b) = segment
    let dx = b.x -. a.x
    let dy = b.y -. a.y
    let dz = b.z -. a.z
    sum
    +. result.unwrap(float.square_root(dx *. dx +. dy *. dy +. dz *. dz), 0.0)
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// [f(0), f(1), ..., f(last)].
fn samples(last: Int, f: fn(Int) -> a) -> List(a) {
  int.range(from: last, to: -1, with: [], run: fn(acc, i) { [f(i), ..acc] })
}

// The points with the first repeated at the end, closing the outline.
fn closed(points: List(a)) -> List(a) {
  case points {
    [first, ..] -> list.append(points, [first])
    [] -> []
  }
}
