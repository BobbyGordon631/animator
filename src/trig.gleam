//// Sine and cosine of angles in degrees, in pure Gleam (gleam/float has no
//// trigonometry). The shapes in render.gleam and the sin/cos built-ins share them.

import gleam/float
import gleam/int

const pi = 3.141592653589793

/// The sine of an angle given in degrees.
pub fn sin_degrees(degrees: Float) -> Float {
  // Fold the angle into [0, 90] using sin's symmetries, where the Taylor series
  // below converges quickly and accurately.
  let d = degrees -. 360.0 *. float.floor(degrees /. 360.0)
  case d >=. 180.0 {
    True -> 0.0 -. sin_0_to_180(d -. 180.0)
    False -> sin_0_to_180(d)
  }
}

/// The cosine of an angle given in degrees.
pub fn cos_degrees(degrees: Float) -> Float {
  sin_degrees(degrees +. 90.0)
}

fn sin_0_to_180(d: Float) -> Float {
  case d >. 90.0 {
    True -> series(180.0 -. d)
    False -> series(d)
  }
}

// sin x = x - x³/3! + x⁵/5! - ..., for x in [0, π/2]. Twelve terms after the
// first are well past double precision there.
fn series(d: Float) -> Float {
  let x = d *. pi /. 180.0
  series_loop(x, x *. x, x, 1, 12)
}

fn series_loop(sum: Float, x2: Float, term: Float, n: Int, left: Int) -> Float {
  case left {
    0 -> sum
    _ -> {
      // Each term is the previous one times -x² / ((2n)(2n + 1)).
      let k = int.to_float(2 * n)
      let next = 0.0 -. term *. x2 /. { k *. { k +. 1.0 } }
      series_loop(sum +. next, x2, next, n + 1, left - 1)
    }
  }
}
