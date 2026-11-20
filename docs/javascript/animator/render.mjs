//# sourceMappingURL=render.mjs.map
import * as $float from "../gleam_stdlib/gleam/float.mjs";
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import {
  setDrawing as set_drawing,
  setSpeed as set_speed,
  resetClock as reset_clock,
} from "./canvas.mjs";
import {
  Empty as $Empty,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
  divideFloat,
} from "./gleam.mjs";
import * as $projection from "./projection.mjs";
import * as $shape from "./shape.mjs";
import { Arc, Circle, Cube, Line, Line3, Point, Point3, Polygon, Sphere, Star } from "./shape.mjs";
import * as $trig from "./trig.mjs";

export { reset_clock, set_drawing, set_speed };

export class RenderPath extends $CustomType {
  constructor(points, thickness, color, start, end) {
    super();
    this.points = points;
    this.thickness = thickness;
    this.color = color;
    this.start = start;
    this.end = end;
  }
}
export const RenderPath$RenderPath = (points, thickness, color, start, end) =>
  new RenderPath(points, thickness, color, start, end);
export const RenderPath$isRenderPath = (value) => value instanceof RenderPath;
export const RenderPath$RenderPath$points = (value) => value.points;
export const RenderPath$RenderPath$0 = (value) => value.points;
export const RenderPath$RenderPath$thickness = (value) => value.thickness;
export const RenderPath$RenderPath$1 = (value) => value.thickness;
export const RenderPath$RenderPath$color = (value) => value.color;
export const RenderPath$RenderPath$2 = (value) => value.color;
export const RenderPath$RenderPath$start = (value) => value.start;
export const RenderPath$RenderPath$3 = (value) => value.start;
export const RenderPath$RenderPath$end = (value) => value.end;
export const RenderPath$RenderPath$4 = (value) => value.end;

class Stroke extends $CustomType {
  constructor(points, length, scale) {
    super();
    this.points = points;
    this.length = length;
    this.scale = scale;
  }
}

const max_arc_segments = 399;

function fraction(i, n) {
  return divideFloat($int.to_float(i), $int.to_float(n));
}

function on_circle(center, radius, degrees) {
  return new Point(
    center.x + (radius * $trig.cos_degrees(degrees)),
    center.y - (radius * $trig.sin_degrees(degrees)),
  );
}

function samples(last, f) {
  return $int.range(
    last,
    -1,
    $List$Empty$const,
    (acc, i) => { return listPrepend(f(i), acc); },
  );
}

function closed(points) {
  if (points instanceof $Empty) {
    return points;
  } else {
    let first = points.head;
    return $list.append(points, listPrepend(first, $List$Empty$const));
  }
}

function circle_segments(radius) {
  return $int.clamp($float.round(radius / 4.0), 24, 240);
}

function on_sphere(center, radius, latitude, longitude) {
  let ring = radius * $trig.cos_degrees(latitude);
  return new Point3(
    center.x + (ring * $trig.cos_degrees(longitude)),
    center.y - (radius * $trig.sin_degrees(latitude)),
    center.z + (ring * $trig.sin_degrees(longitude)),
  );
}

function sphere_wires(center, radius) {
  let n = $int.clamp($float.round(radius / 8.0), 16, 40);
  let half = globalThis.Math.trunc(n / 2);
  let rings = $list.map(
    listPrepend(
      -75.0,
      listPrepend(
        -45.0,
        listPrepend(
          -15.0,
          listPrepend(
            15.0,
            listPrepend(45.0, listPrepend(75.0, $List$Empty$const)),
          ),
        ),
      ),
    ),
    (latitude) => {
      return closed(
        samples(
          n - 1,
          (i) => {
            return on_sphere(center, radius, latitude, fraction(i, n) * 360.0);
          },
        ),
      );
    },
  );
  let meridians = $list.map(
    listPrepend(
      0,
      listPrepend(
        1,
        listPrepend(
          2,
          listPrepend(
            3,
            listPrepend(
              4,
              listPrepend(5, listPrepend(6, listPrepend(7, $List$Empty$const))),
            ),
          ),
        ),
      ),
    ),
    (k) => {
      return samples(
        half,
        (i) => {
          return on_sphere(
            center,
            radius,
            90.0 - (180.0 * fraction(i, half)),
            $int.to_float(k) * 45.0,
          );
        },
      );
    },
  );
  return $list.append(rings, meridians);
}

function length3(points) {
  let _pipe = $list.zip(points, $list.drop(points, 1));
  return $list.fold(
    _pipe,
    0.0,
    (sum, segment) => {
      let a = segment[0];
      let b = segment[1];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let dz = b.z - a.z;
      return sum + $result.unwrap(
        $float.square_root(((dx * dx) + (dy * dy)) + (dz * dz)),
        0.0,
      );
    },
  );
}

function project_all(polylines, camera, tilt) {
  return $list.map(
    polylines,
    (points) => {
      let projected = $list.map(
        points,
        (_capture) => {
          return $projection.project_view(_capture, camera, tilt);
        },
      );
      let scales = $list.map(projected, (p) => { return p[1]; });
      return new Stroke(
        $list.map(projected, (p) => { return p[0]; }),
        length3(points),
        divideFloat($float.sum(scales), $int.to_float($list.length(scales))),
      );
    },
  );
}

function cube_edges(center, size) {
  let h = size / 2.0;
  let corner = (dx, dy, dz) => {
    return new Point3(
      center.x + (dx * h),
      center.y + (dy * h),
      center.z + (dz * h),
    );
  };
  let square = (dy) => {
    let corners = listPrepend(
      corner(-1.0, dy, -1.0),
      listPrepend(
        corner(1.0, dy, -1.0),
        listPrepend(
          corner(1.0, dy, 1.0),
          listPrepend(corner(-1.0, dy, 1.0), $List$Empty$const),
        ),
      ),
    );
    let _pipe = $list.zip(
      corners,
      $list.append($list.drop(corners, 1), $list.take(corners, 1)),
    );
    return $list.map(
      _pipe,
      (edge) => {
        return listPrepend(edge[0], listPrepend(edge[1], $List$Empty$const));
      },
    );
  };
  let uprights = $list.map(
    listPrepend(
      [-1.0, -1.0],
      listPrepend(
        [1.0, -1.0],
        listPrepend([1.0, 1.0], listPrepend([-1.0, 1.0], $List$Empty$const)),
      ),
    ),
    (xz) => {
      return listPrepend(
        corner(xz[0], -1.0, xz[1]),
        listPrepend(corner(xz[0], 1.0, xz[1]), $List$Empty$const),
      );
    },
  );
  return $list.flatten(
    listPrepend(
      square(-1.0),
      listPrepend(square(1.0), listPrepend(uprights, $List$Empty$const)),
    ),
  );
}

function strokes(shape, camera, tilt) {
  if (shape instanceof Line) {
    return listPrepend(new Stroke(outline(shape), 1.0, 1.0), $List$Empty$const);
  } else if (shape instanceof Circle) {
    return listPrepend(new Stroke(outline(shape), 1.0, 1.0), $List$Empty$const);
  } else if (shape instanceof Arc) {
    return listPrepend(new Stroke(outline(shape), 1.0, 1.0), $List$Empty$const);
  } else if (shape instanceof Polygon) {
    return listPrepend(new Stroke(outline(shape), 1.0, 1.0), $List$Empty$const);
  } else if (shape instanceof Star) {
    return listPrepend(new Stroke(outline(shape), 1.0, 1.0), $List$Empty$const);
  } else if (shape instanceof Line3) {
    let a = shape.start;
    let b = shape.end;
    return project_all(
      listPrepend(
        listPrepend(a, listPrepend(b, $List$Empty$const)),
        $List$Empty$const,
      ),
      camera,
      tilt,
    );
  } else if (shape instanceof Cube) {
    let center = shape.center;
    let size = shape.size;
    return project_all(cube_edges(center, size), camera, tilt);
  } else {
    let center = shape.center;
    let radius = shape.radius;
    return project_all(sphere_wires(center, radius), camera, tilt);
  }
}

/**
 * The points along a shape's outline, in the order the pen draws them, so
 * that canvas.mjs revealing a growing prefix traces the shape the way a Line
 * grows: a circle draws itself around its edge. A 3D shape's strokes, seen
 * from the default camera, are joined end to end.
 */
export function outline(shape) {
  if (shape instanceof Line) {
    let a = shape.start;
    let b = shape.end;
    return listPrepend(a, listPrepend(b, $List$Empty$const));
  } else if (shape instanceof Circle) {
    let center = shape.center;
    let radius = shape.radius;
    let n = circle_segments(radius);
    return closed(
      samples(
        n - 1,
        (i) => { return on_circle(center, radius, fraction(i, n) * 360.0); },
      ),
    );
  } else if (shape instanceof Arc) {
    let center = shape.center;
    let radius = shape.radius;
    let from = shape.from;
    let to = shape.to;
    let sweep = to - from;
    let _block;
    let _pipe = $float.ceiling(
      (($int.to_float(circle_segments(radius)) * $float.absolute_value(sweep))) / 360.0,
    );
    let _pipe$1 = $float.round(_pipe);
    _block = $int.clamp(_pipe$1, 1, max_arc_segments);
    let n = _block;
    return samples(
      n,
      (i) => {
        return on_circle(center, radius, from + (sweep * fraction(i, n)));
      },
    );
  } else if (shape instanceof Polygon) {
    let center = shape.center;
    let radius = shape.radius;
    let sides = shape.sides;
    let rotation = shape.rotation;
    return closed(
      samples(
        sides - 1,
        (i) => {
          return on_circle(
            center,
            radius,
            rotation + (fraction(i, sides) * 360.0),
          );
        },
      ),
    );
  } else if (shape instanceof Star) {
    let center = shape.center;
    let outer = shape.outer;
    let inner = shape.inner;
    let points = shape.points;
    return closed(
      samples(
        2 * points - 1,
        (i) => {
          let _block;
          let $ = i % 2;
          if ($ === 0) {
            _block = outer;
          } else {
            _block = inner;
          }
          let radius = _block;
          return on_circle(
            center,
            radius,
            90.0 + (fraction(i, 2 * points) * 360.0),
          );
        },
      ),
    );
  } else if (shape instanceof Line3) {
    let _pipe = strokes(
      shape,
      $int.to_float($projection.default_camera),
      $int.to_float($projection.default_tilt),
    );
    return $list.flat_map(_pipe, (s) => { return s.points; });
  } else if (shape instanceof Cube) {
    let _pipe = strokes(
      shape,
      $int.to_float($projection.default_camera),
      $int.to_float($projection.default_tilt),
    );
    return $list.flat_map(_pipe, (s) => { return s.points; });
  } else {
    let _pipe = strokes(
      shape,
      $int.to_float($projection.default_camera),
      $int.to_float($projection.default_tilt),
    );
    return $list.flat_map(_pipe, (s) => { return s.points; });
  }
}

/**
 * One path as a single polyline. A 3D shape is seen from the default camera
 * and its strokes are joined end to end, so render_strokes is the better way to
 * draw one.
 */
export function render_path(path, color) {
  return new RenderPath(
    outline(path.shape),
    path.thickness,
    color,
    path.start,
    path.end,
  );
}

function render_3d(strokes, path, color) {
  let total = $list.fold(strokes, 0.0, (sum, s) => { return sum + s.length; });
  let _block;
  let $1 = total > 0.0;
  if ($1) {
    _block = [strokes, total];
  } else {
    _block = [
      $list.map(strokes, (s) => { return new Stroke(s.points, 1.0, s.scale); }),
      $int.to_float($list.length(strokes)),
    ];
  }
  let $ = _block;
  let strokes$1 = $[0];
  let total$1 = $[1];
  let duration = path.end - path.start;
  let $2 = $list.fold(
    strokes$1,
    [0.0, $List$Empty$const],
    (acc, stroke) => {
      let done = acc[0];
      let render_paths = acc[1];
      let finished = done + stroke.length;
      let _block$1;
      let $4 = duration > 0.0;
      if ($4) {
        _block$1 = [
          path.start + (divideFloat((duration * done), total$1)),
          path.start + (divideFloat((duration * finished), total$1)),
        ];
      } else {
        _block$1 = [path.start, path.start];
      }
      let $3 = _block$1;
      let start = $3[0];
      let end = $3[1];
      let render_path$1 = new RenderPath(
        stroke.points,
        path.thickness * stroke.scale,
        color,
        start,
        end,
      );
      return [finished, listPrepend(render_path$1, render_paths)];
    },
  );
  let render_paths = $2[1];
  return $list.reverse(render_paths);
}

/**
 * Like render_strokes, but with the camera looking down by `tilt` degrees
 * (negative looks up from below), as freehand viewing sets it.
 */
export function render_view(path, color, camera, tilt) {
  let $ = path.shape;
  if ($ instanceof Line) {
    return listPrepend(render_path(path, color), $List$Empty$const);
  } else if ($ instanceof Circle) {
    return listPrepend(render_path(path, color), $List$Empty$const);
  } else if ($ instanceof Arc) {
    return listPrepend(render_path(path, color), $List$Empty$const);
  } else if ($ instanceof Polygon) {
    return listPrepend(render_path(path, color), $List$Empty$const);
  } else if ($ instanceof Star) {
    return listPrepend(render_path(path, color), $List$Empty$const);
  } else if ($ instanceof Line3) {
    return render_3d(strokes(path.shape, camera, tilt), path, color);
  } else if ($ instanceof Cube) {
    return render_3d(strokes(path.shape, camera, tilt), path, color);
  } else {
    return render_3d(strokes(path.shape, camera, tilt), path, color);
  }
}

/**
 * One path as the strokes the canvas draws, with 3D shapes seen from the camera
 * at angle `camera` (in degrees); 2D shapes ignore it. A 2D shape is one
 * stroke. A 3D shape can be several (a cube's 12 edges can't be traced without
 * lifting the pen), so the path's time window is split among them in
 * proportion to their lengths and the whole shape still draws as one trace.
 * Each stroke's thickness is scaled by its perspective, so farther edges are
 * thinner.
 */
export function render_strokes(path, color, camera) {
  return render_view(
    path,
    color,
    camera,
    $int.to_float($projection.default_tilt),
  );
}
