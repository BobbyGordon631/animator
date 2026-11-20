//# sourceMappingURL=projection.mjs.map
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import { divideFloat } from "./gleam.mjs";
import * as $shape from "./shape.mjs";
import { Point } from "./shape.mjs";
import * as $trig from "./trig.mjs";

/**
 * How far the camera looks down from above, in degrees, unless freehand
 * viewing has tilted it: enough that the tops of shapes show.
 */
export const default_tilt = 20;

/**
 * The camera's distance from the origin, in canvas units. Larger is flatter.
 * 
 * @ignore
 */
const focal = 1200.0;

/**
 * Keep points that end up level with or behind the camera from dividing by
 * zero or flipping over: the nearest a point may count as is this far in
 * front of it.
 * 
 * @ignore
 */
const nearest = 50.0;

/**
 * The camera angle, in degrees, that the app starts with.
 */
export const default_camera = 30;

/**
 * The steepest the camera may look down (or, negated, up), in degrees. Past
 * straight down the picture would flip over.
 */
export const max_tilt = 89;

/**
 * Like project, but with the camera looking down by `tilt` degrees (negative
 * looks up from below).
 */
export function project_view(p, camera, tilt) {
  let c = $trig.cos_degrees(camera);
  let s = $trig.sin_degrees(camera);
  let x1 = (p.x * c) + (p.z * s);
  let z1 = (p.z * c) - (p.x * s);
  let tc = $trig.cos_degrees(tilt);
  let ts = $trig.sin_degrees(tilt);
  let y2 = (p.y * tc) - (z1 * ts);
  let z2 = (p.y * ts) + (z1 * tc);
  let _block;
  let $ = (focal + z2) < nearest;
  if ($) {
    _block = nearest;
  } else {
    _block = focal + z2;
  }
  let depth = _block;
  let scale = divideFloat(focal, depth);
  return [new Point(x1 * scale, y2 * scale), scale];
}

/**
 * Where the camera at angle `camera` (in degrees) sees the point on the
 * canvas, and the perspective scale there: 1.0 at the origin's depth, less
 * for farther points, more for nearer ones. The camera looks down at the
 * default tilt.
 */
export function project(p, camera) {
  return project_view(p, camera, $int.to_float(default_tilt));
}
