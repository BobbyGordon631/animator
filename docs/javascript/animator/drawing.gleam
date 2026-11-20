//// Drawing a program: call its draw function on the shape slider's value and
//// convert the list it returns into the Paths the animator renders.
////
//// The user's integers become the Float fields the geometry needs.

import errors.{type EvalError, BadDrawing, PathLimit}
import evaluator.{type GlobalFrame, type Value, VData, VInt, VList}
import gleam/int
import gleam/list
import gleam/result
import limits
import shape.{
  type Path, type Point, type Point3, type Shape, Arc, Circle, Cube, Line, Line3,
  Path, Point, Point3, Polygon, Sphere, Star,
}

/// Call the program's draw function on shape_slider, returning its list of
/// paths or the evaluation error, so the app can show failures.
pub fn try_draw(
  shape_slider: Int,
  global: GlobalFrame,
) -> Result(List(Path), EvalError) {
  case evaluator.run("draw", [VInt(shape_slider)], global) {
    Ok(VList(items)) ->
      // The step allowance bounds what evaluation can build, but the
      // renderer redraws every path each frame, so a finished drawing is
      // also capped.
      case list.length(items) > limits.path_limit {
        True -> Error(PathLimit)
        False -> list.try_map(items, to_path)
      }
    Ok(_) -> Error(BadDrawing("return value of draw is not a list"))
    Error(err) -> Error(err)
  }
}

fn to_path(v: Value) -> Result(Path, EvalError) {
  case v {
    VData("Path", [shape, VInt(start), VInt(end), VInt(thickness)]) -> {
      use s <- result.try(to_shape(shape))
      Ok(Path(
        s,
        int.to_float(start),
        int.to_float(end),
        int.to_float(thickness),
      ))
    }
    _ -> Error(BadDrawing("some element is not a well-formed path"))
  }
}

fn to_shape(v: Value) -> Result(Shape, EvalError) {
  case v {
    VData("Line", [start, end]) -> {
      use a <- result.try(to_point(start))
      use b <- result.try(to_point(end))
      Ok(Line(a, b))
    }
    VData("Circle", [center, VInt(radius)]) -> {
      use c <- result.try(to_point(center))
      use <- require(radius > 0, "a Circle's radius must be positive")
      Ok(Circle(c, int.to_float(radius)))
    }
    VData("Arc", [center, VInt(radius), VInt(from), VInt(to)]) -> {
      use c <- result.try(to_point(center))
      use <- require(radius > 0, "an Arc's radius must be positive")
      Ok(Arc(c, int.to_float(radius), int.to_float(from), int.to_float(to)))
    }
    VData("Polygon", [center, VInt(radius), VInt(sides), VInt(rotation)]) -> {
      use c <- result.try(to_point(center))
      use <- require(radius > 0, "a Polygon's radius must be positive")
      use <- require(
        sides >= 3 && sides <= max_sides,
        "a Polygon's sides must be from 3 to " <> int.to_string(max_sides),
      )
      Ok(Polygon(c, int.to_float(radius), sides, int.to_float(rotation)))
    }
    VData("Star", [center, VInt(outer), VInt(inner), VInt(points)]) -> {
      use c <- result.try(to_point(center))
      use <- require(inner > 0, "a Star's inner radius must be positive")
      use <- require(
        inner < outer,
        "a Star's inner radius must be less than its outer radius",
      )
      use <- require(
        points >= 2 && points <= max_star_points,
        "a Star's points must be from 2 to " <> int.to_string(max_star_points),
      )
      Ok(Star(c, int.to_float(outer), int.to_float(inner), points))
    }
    VData("Line3", [start, end]) -> {
      use a <- result.try(to_point3(start))
      use b <- result.try(to_point3(end))
      Ok(Line3(a, b))
    }
    VData("Cube", [center, VInt(size)]) -> {
      use c <- result.try(to_point3(center))
      use <- require(size > 0, "a Cube's size must be positive")
      Ok(Cube(c, int.to_float(size)))
    }
    VData("Sphere", [center, VInt(radius)]) -> {
      use c <- result.try(to_point3(center))
      use <- require(radius > 0, "a Sphere's radius must be positive")
      Ok(Sphere(c, int.to_float(radius)))
    }
    // A known shape whose fields have the wrong types.
    VData("Circle", _) -> expected("Circle(center: Point, radius: Int)")
    VData("Arc", _) ->
      expected("Arc(center: Point, radius: Int, from: Int, to: Int)")
    VData("Polygon", _) ->
      expected("Polygon(center: Point, radius: Int, sides: Int, rotation: Int)")
    VData("Star", _) ->
      expected("Star(center: Point, outer: Int, inner: Int, points: Int)")
    VData("Line3", _) -> expected("Line3(start: Point3, end: Point3)")
    VData("Cube", _) -> expected("Cube(center: Point3, size: Int)")
    VData("Sphere", _) -> expected("Sphere(center: Point3, radius: Int)")
    _ -> Error(BadDrawing("a Path's shape must be a recognized shape"))
  }
}

// The most corners a Polygon or Star may have, so that no one shape becomes an
// outline of more than about 400 points (render.gleam samples the curves).
const max_sides = 360

const max_star_points = 180

// Continue with the shape if ok holds; otherwise fail with message.
fn require(
  ok: Bool,
  message: String,
  continue: fn() -> Result(Shape, EvalError),
) -> Result(Shape, EvalError) {
  case ok {
    True -> continue()
    False -> Error(BadDrawing(message))
  }
}

fn expected(signature: String) -> Result(Shape, EvalError) {
  Error(BadDrawing("expected " <> signature))
}

fn to_point(v: Value) -> Result(Point, EvalError) {
  case v {
    VData("Point", [VInt(x), VInt(y)]) ->
      Ok(Point(int.to_float(x), int.to_float(y)))
    VData("Point3", _) ->
      Error(BadDrawing(
        "2D shapes take Point(x, y), not Point3(x, y, z); use Line3, Cube, or Sphere for 3D",
      ))
    _ -> Error(BadDrawing("expected a Point"))
  }
}

fn to_point3(v: Value) -> Result(Point3, EvalError) {
  case v {
    VData("Point3", [VInt(x), VInt(y), VInt(z)]) ->
      Ok(Point3(int.to_float(x), int.to_float(y), int.to_float(z)))
    VData("Point", _) ->
      Error(BadDrawing("3D shapes take Point3(x, y, z), not Point(x, y)"))
    _ -> Error(BadDrawing("expected a Point3"))
  }
}
