//// How the camera sees a 3D point: turn the world around the vertical axis by the
//// camera angle, tilt it so the camera looks slightly down from above, then
//// shrink what's farther away (perspective).

import gleam/int
import shape.{type Point, type Point3, Point}
import trig

/// The camera angle, in degrees, that the app starts with.
pub const default_camera = 30

/// How far the camera looks down from above, in degrees, unless freehand
/// viewing has tilted it: enough that the tops of shapes show.
pub const default_tilt = 20

/// The steepest the camera may look down (or, negated, up), in degrees. Past
/// straight down the picture would flip over.
pub const max_tilt = 89

/// The camera's distance from the origin, in canvas units. Larger is flatter.
const focal = 1200.0

/// Keep points that end up level with or behind the camera from dividing by
/// zero or flipping over: the nearest a point may count as is this far in
/// front of it.
const nearest = 50.0

/// Where the camera at angle `camera` (in degrees) sees the point on the
/// canvas, and the perspective scale there: 1.0 at the origin's depth, less
/// for farther points, more for nearer ones. The camera looks down at the
/// default tilt.
pub fn project(p: Point3, camera: Float) -> #(Point, Float) {
  project_view(p, camera, int.to_float(default_tilt))
}

/// Like project, but with the camera looking down by `tilt` degrees (negative
/// looks up from below).
pub fn project_view(p: Point3, camera: Float, tilt: Float) -> #(Point, Float) {
  // Turn around the vertical (y) axis.
  let c = trig.cos_degrees(camera)
  let s = trig.sin_degrees(camera)
  let x1 = p.x *. c +. p.z *. s
  let z1 = p.z *. c -. p.x *. s
  // Tilt around the x axis. y grows downward, so a positive tilt raises far
  // points on screen and brings the top (negative y) toward the camera.
  let tc = trig.cos_degrees(tilt)
  let ts = trig.sin_degrees(tilt)
  let y2 = p.y *. tc -. z1 *. ts
  let z2 = p.y *. ts +. z1 *. tc
  // Perspective.
  let depth = case focal +. z2 <. nearest {
    True -> nearest
    False -> focal +. z2
  }
  let scale = focal /. depth
  #(Point(x1 *. scale, y2 *. scale), scale)
}
