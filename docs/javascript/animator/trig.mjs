//# sourceMappingURL=trig.mjs.map
import * as $float from "../gleam_stdlib/gleam/float.mjs";
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import { divideFloat } from "./gleam.mjs";

const pi = 3.141592653589793;

function series_loop(loop$sum, loop$x2, loop$term, loop$n, loop$left) {
  while (true) {
    let sum = loop$sum;
    let x2 = loop$x2;
    let term = loop$term;
    let n = loop$n;
    let left = loop$left;
    if (left === 0) {
      return sum;
    } else {
      let k = $int.to_float(2 * n);
      let next = 0.0 - (divideFloat((term * x2), (k * (k + 1.0))));
      loop$sum = sum + next;
      loop$x2 = x2;
      loop$term = next;
      loop$n = n + 1;
      loop$left = left - 1;
    }
  }
}

function series(d) {
  let x = ((d * pi)) / 180.0;
  return series_loop(x, x * x, x, 1, 12);
}

function sin_0_to_180(d) {
  let $ = d > 90.0;
  if ($) {
    return series(180.0 - d);
  } else {
    return series(d);
  }
}

/**
 * The sine of an angle given in degrees.
 */
export function sin_degrees(degrees) {
  let d = degrees - (360.0 * $float.floor(degrees / 360.0));
  let $ = d >= 180.0;
  if ($) {
    return 0.0 - sin_0_to_180(d - 180.0);
  } else {
    return sin_0_to_180(d);
  }
}

/**
 * The cosine of an angle given in degrees.
 */
export function cos_degrees(degrees) {
  return sin_degrees(degrees + 90.0);
}
