//# sourceMappingURL=drawing.mjs.map
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import * as $errors from "./errors.mjs";
import { BadDrawing, EvalError$PathLimit$const } from "./errors.mjs";
import * as $evaluator from "./evaluator.mjs";
import { VData, VInt, VList } from "./evaluator.mjs";
import {
  Ok,
  Error,
  Empty as $Empty,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
} from "./gleam.mjs";
import * as $limits from "./limits.mjs";
import * as $shape from "./shape.mjs";
import {
  Arc,
  Circle,
  Cube,
  Line,
  Line3,
  Path,
  Point,
  Point3,
  Polygon,
  Sphere,
  Star,
} from "./shape.mjs";

const max_star_points = 180;

const max_sides = 360;

function expected(signature) {
  return new Error(new BadDrawing("expected " + signature));
}

function require(ok, message, continue$) {
  if (ok) {
    return continue$();
  } else {
    return new Error(new BadDrawing(message));
  }
}

function to_point3(v) {
  if (v instanceof VData) {
    let $ = v.fields;
    if ($ instanceof $Empty) {
      if (v.tag === "Point") {
        return new Error(
          new BadDrawing("3D shapes take Point3(x, y, z), not Point(x, y)"),
        );
      } else {
        return new Error(new BadDrawing("expected a Point3"));
      }
    } else {
      let $1 = $.tail;
      if ($1 instanceof $Empty) {
        if (v.tag === "Point") {
          return new Error(
            new BadDrawing("3D shapes take Point3(x, y, z), not Point(x, y)"),
          );
        } else {
          return new Error(new BadDrawing("expected a Point3"));
        }
      } else {
        let $2 = $1.tail;
        if ($2 instanceof $Empty) {
          if (v.tag === "Point") {
            return new Error(
              new BadDrawing("3D shapes take Point3(x, y, z), not Point(x, y)"),
            );
          } else {
            return new Error(new BadDrawing("expected a Point3"));
          }
        } else if ($2.tail instanceof $Empty) {
          let $3 = $.head;
          if ($3 instanceof VInt) {
            let $4 = $1.head;
            if ($4 instanceof VInt) {
              let $5 = $2.head;
              if ($5 instanceof VInt) {
                let $6 = v.tag;
                if ($6 === "Point3") {
                  let x = $3[0];
                  let y = $4[0];
                  let z = $5[0];
                  return new Ok(
                    new Point3(
                      $int.to_float(x),
                      $int.to_float(y),
                      $int.to_float(z),
                    ),
                  );
                } else if ($6 === "Point") {
                  return new Error(
                    new BadDrawing(
                      "3D shapes take Point3(x, y, z), not Point(x, y)",
                    ),
                  );
                } else {
                  return new Error(new BadDrawing("expected a Point3"));
                }
              } else if (v.tag === "Point") {
                return new Error(
                  new BadDrawing(
                    "3D shapes take Point3(x, y, z), not Point(x, y)",
                  ),
                );
              } else {
                return new Error(new BadDrawing("expected a Point3"));
              }
            } else if (v.tag === "Point") {
              return new Error(
                new BadDrawing(
                  "3D shapes take Point3(x, y, z), not Point(x, y)",
                ),
              );
            } else {
              return new Error(new BadDrawing("expected a Point3"));
            }
          } else if (v.tag === "Point") {
            return new Error(
              new BadDrawing("3D shapes take Point3(x, y, z), not Point(x, y)"),
            );
          } else {
            return new Error(new BadDrawing("expected a Point3"));
          }
        } else if (v.tag === "Point") {
          return new Error(
            new BadDrawing("3D shapes take Point3(x, y, z), not Point(x, y)"),
          );
        } else {
          return new Error(new BadDrawing("expected a Point3"));
        }
      }
    }
  } else {
    return new Error(new BadDrawing("expected a Point3"));
  }
}

function to_point(v) {
  if (v instanceof VData) {
    let $ = v.fields;
    if ($ instanceof $Empty) {
      if (v.tag === "Point3") {
        return new Error(
          new BadDrawing(
            "2D shapes take Point(x, y), not Point3(x, y, z); use Line3, Cube, or Sphere for 3D",
          ),
        );
      } else {
        return new Error(new BadDrawing("expected a Point"));
      }
    } else {
      let $1 = $.tail;
      if ($1 instanceof $Empty) {
        if (v.tag === "Point3") {
          return new Error(
            new BadDrawing(
              "2D shapes take Point(x, y), not Point3(x, y, z); use Line3, Cube, or Sphere for 3D",
            ),
          );
        } else {
          return new Error(new BadDrawing("expected a Point"));
        }
      } else if ($1.tail instanceof $Empty) {
        let $2 = $.head;
        if ($2 instanceof VInt) {
          let $3 = $1.head;
          if ($3 instanceof VInt) {
            let $4 = v.tag;
            if ($4 === "Point") {
              let x = $2[0];
              let y = $3[0];
              return new Ok(new Point($int.to_float(x), $int.to_float(y)));
            } else if ($4 === "Point3") {
              return new Error(
                new BadDrawing(
                  "2D shapes take Point(x, y), not Point3(x, y, z); use Line3, Cube, or Sphere for 3D",
                ),
              );
            } else {
              return new Error(new BadDrawing("expected a Point"));
            }
          } else if (v.tag === "Point3") {
            return new Error(
              new BadDrawing(
                "2D shapes take Point(x, y), not Point3(x, y, z); use Line3, Cube, or Sphere for 3D",
              ),
            );
          } else {
            return new Error(new BadDrawing("expected a Point"));
          }
        } else if (v.tag === "Point3") {
          return new Error(
            new BadDrawing(
              "2D shapes take Point(x, y), not Point3(x, y, z); use Line3, Cube, or Sphere for 3D",
            ),
          );
        } else {
          return new Error(new BadDrawing("expected a Point"));
        }
      } else if (v.tag === "Point3") {
        return new Error(
          new BadDrawing(
            "2D shapes take Point(x, y), not Point3(x, y, z); use Line3, Cube, or Sphere for 3D",
          ),
        );
      } else {
        return new Error(new BadDrawing("expected a Point"));
      }
    }
  } else {
    return new Error(new BadDrawing("expected a Point"));
  }
}

function to_shape(v) {
  if (v instanceof VData) {
    let $ = v.fields;
    if ($ instanceof $Empty) {
      let $1 = v.tag;
      if ($1 === "Circle") {
        return expected("Circle(center: Point, radius: Int)");
      } else if ($1 === "Arc") {
        return expected("Arc(center: Point, radius: Int, from: Int, to: Int)");
      } else if ($1 === "Polygon") {
        return expected(
          "Polygon(center: Point, radius: Int, sides: Int, rotation: Int)",
        );
      } else if ($1 === "Star") {
        return expected(
          "Star(center: Point, outer: Int, inner: Int, points: Int)",
        );
      } else if ($1 === "Line3") {
        return expected("Line3(start: Point3, end: Point3)");
      } else if ($1 === "Cube") {
        return expected("Cube(center: Point3, size: Int)");
      } else if ($1 === "Sphere") {
        return expected("Sphere(center: Point3, radius: Int)");
      } else {
        return new Error(
          new BadDrawing("a Path's shape must be a recognized shape"),
        );
      }
    } else {
      let $1 = $.tail;
      if ($1 instanceof $Empty) {
        let $2 = v.tag;
        if ($2 === "Circle") {
          return expected("Circle(center: Point, radius: Int)");
        } else if ($2 === "Arc") {
          return expected("Arc(center: Point, radius: Int, from: Int, to: Int)");
        } else if ($2 === "Polygon") {
          return expected(
            "Polygon(center: Point, radius: Int, sides: Int, rotation: Int)",
          );
        } else if ($2 === "Star") {
          return expected(
            "Star(center: Point, outer: Int, inner: Int, points: Int)",
          );
        } else if ($2 === "Line3") {
          return expected("Line3(start: Point3, end: Point3)");
        } else if ($2 === "Cube") {
          return expected("Cube(center: Point3, size: Int)");
        } else if ($2 === "Sphere") {
          return expected("Sphere(center: Point3, radius: Int)");
        } else {
          return new Error(
            new BadDrawing("a Path's shape must be a recognized shape"),
          );
        }
      } else {
        let $2 = $1.tail;
        if ($2 instanceof $Empty) {
          let $3 = v.tag;
          if ($3 === "Line") {
            let start = $.head;
            let end = $1.head;
            return $result.try$(
              to_point(start),
              (a) => {
                return $result.try$(
                  to_point(end),
                  (b) => { return new Ok(new Line(a, b)); },
                );
              },
            );
          } else if ($3 === "Circle") {
            let $4 = $1.head;
            if ($4 instanceof VInt) {
              let center = $.head;
              let radius = $4[0];
              return $result.try$(
                to_point(center),
                (c) => {
                  return require(
                    radius > 0,
                    "a Circle's radius must be positive",
                    () => {
                      return new Ok(new Circle(c, $int.to_float(radius)));
                    },
                  );
                },
              );
            } else {
              return expected("Circle(center: Point, radius: Int)");
            }
          } else if ($3 === "Line3") {
            let start = $.head;
            let end = $1.head;
            return $result.try$(
              to_point3(start),
              (a) => {
                return $result.try$(
                  to_point3(end),
                  (b) => { return new Ok(new Line3(a, b)); },
                );
              },
            );
          } else if ($3 === "Cube") {
            let $4 = $1.head;
            if ($4 instanceof VInt) {
              let center = $.head;
              let size = $4[0];
              return $result.try$(
                to_point3(center),
                (c) => {
                  return require(
                    size > 0,
                    "a Cube's size must be positive",
                    () => { return new Ok(new Cube(c, $int.to_float(size))); },
                  );
                },
              );
            } else {
              return expected("Cube(center: Point3, size: Int)");
            }
          } else if ($3 === "Sphere") {
            let $4 = $1.head;
            if ($4 instanceof VInt) {
              let center = $.head;
              let radius = $4[0];
              return $result.try$(
                to_point3(center),
                (c) => {
                  return require(
                    radius > 0,
                    "a Sphere's radius must be positive",
                    () => {
                      return new Ok(new Sphere(c, $int.to_float(radius)));
                    },
                  );
                },
              );
            } else {
              return expected("Sphere(center: Point3, radius: Int)");
            }
          } else if ($3 === "Arc") {
            return expected(
              "Arc(center: Point, radius: Int, from: Int, to: Int)",
            );
          } else if ($3 === "Polygon") {
            return expected(
              "Polygon(center: Point, radius: Int, sides: Int, rotation: Int)",
            );
          } else if ($3 === "Star") {
            return expected(
              "Star(center: Point, outer: Int, inner: Int, points: Int)",
            );
          } else {
            return new Error(
              new BadDrawing("a Path's shape must be a recognized shape"),
            );
          }
        } else {
          let $3 = $2.tail;
          if ($3 instanceof $Empty) {
            let $4 = v.tag;
            if ($4 === "Circle") {
              return expected("Circle(center: Point, radius: Int)");
            } else if ($4 === "Arc") {
              return expected(
                "Arc(center: Point, radius: Int, from: Int, to: Int)",
              );
            } else if ($4 === "Polygon") {
              return expected(
                "Polygon(center: Point, radius: Int, sides: Int, rotation: Int)",
              );
            } else if ($4 === "Star") {
              return expected(
                "Star(center: Point, outer: Int, inner: Int, points: Int)",
              );
            } else if ($4 === "Line3") {
              return expected("Line3(start: Point3, end: Point3)");
            } else if ($4 === "Cube") {
              return expected("Cube(center: Point3, size: Int)");
            } else if ($4 === "Sphere") {
              return expected("Sphere(center: Point3, radius: Int)");
            } else {
              return new Error(
                new BadDrawing("a Path's shape must be a recognized shape"),
              );
            }
          } else if ($3.tail instanceof $Empty) {
            let $4 = $1.head;
            if ($4 instanceof VInt) {
              let $5 = $2.head;
              if ($5 instanceof VInt) {
                let $6 = $3.head;
                if ($6 instanceof VInt) {
                  let $7 = v.tag;
                  if ($7 === "Arc") {
                    let center = $.head;
                    let radius = $4[0];
                    let from = $5[0];
                    let to = $6[0];
                    return $result.try$(
                      to_point(center),
                      (c) => {
                        return require(
                          radius > 0,
                          "an Arc's radius must be positive",
                          () => {
                            return new Ok(
                              new Arc(
                                c,
                                $int.to_float(radius),
                                $int.to_float(from),
                                $int.to_float(to),
                              ),
                            );
                          },
                        );
                      },
                    );
                  } else if ($7 === "Polygon") {
                    let center = $.head;
                    let radius = $4[0];
                    let sides = $5[0];
                    let rotation = $6[0];
                    return $result.try$(
                      to_point(center),
                      (c) => {
                        return require(
                          radius > 0,
                          "a Polygon's radius must be positive",
                          () => {
                            return require(
                              (sides >= 3) && (sides <= max_sides),
                              "a Polygon's sides must be from 3 to " + $int.to_string(
                                max_sides,
                              ),
                              () => {
                                return new Ok(
                                  new Polygon(
                                    c,
                                    $int.to_float(radius),
                                    sides,
                                    $int.to_float(rotation),
                                  ),
                                );
                              },
                            );
                          },
                        );
                      },
                    );
                  } else if ($7 === "Star") {
                    let center = $.head;
                    let outer = $4[0];
                    let inner = $5[0];
                    let points = $6[0];
                    return $result.try$(
                      to_point(center),
                      (c) => {
                        return require(
                          inner > 0,
                          "a Star's inner radius must be positive",
                          () => {
                            return require(
                              inner < outer,
                              "a Star's inner radius must be less than its outer radius",
                              () => {
                                return require(
                                  (points >= 2) && (points <= max_star_points),
                                  "a Star's points must be from 2 to " + $int.to_string(
                                    max_star_points,
                                  ),
                                  () => {
                                    return new Ok(
                                      new Star(
                                        c,
                                        $int.to_float(outer),
                                        $int.to_float(inner),
                                        points,
                                      ),
                                    );
                                  },
                                );
                              },
                            );
                          },
                        );
                      },
                    );
                  } else if ($7 === "Circle") {
                    return expected("Circle(center: Point, radius: Int)");
                  } else if ($7 === "Line3") {
                    return expected("Line3(start: Point3, end: Point3)");
                  } else if ($7 === "Cube") {
                    return expected("Cube(center: Point3, size: Int)");
                  } else if ($7 === "Sphere") {
                    return expected("Sphere(center: Point3, radius: Int)");
                  } else {
                    return new Error(
                      new BadDrawing(
                        "a Path's shape must be a recognized shape",
                      ),
                    );
                  }
                } else {
                  let $7 = v.tag;
                  if ($7 === "Circle") {
                    return expected("Circle(center: Point, radius: Int)");
                  } else if ($7 === "Arc") {
                    return expected(
                      "Arc(center: Point, radius: Int, from: Int, to: Int)",
                    );
                  } else if ($7 === "Polygon") {
                    return expected(
                      "Polygon(center: Point, radius: Int, sides: Int, rotation: Int)",
                    );
                  } else if ($7 === "Star") {
                    return expected(
                      "Star(center: Point, outer: Int, inner: Int, points: Int)",
                    );
                  } else if ($7 === "Line3") {
                    return expected("Line3(start: Point3, end: Point3)");
                  } else if ($7 === "Cube") {
                    return expected("Cube(center: Point3, size: Int)");
                  } else if ($7 === "Sphere") {
                    return expected("Sphere(center: Point3, radius: Int)");
                  } else {
                    return new Error(
                      new BadDrawing(
                        "a Path's shape must be a recognized shape",
                      ),
                    );
                  }
                }
              } else {
                let $6 = v.tag;
                if ($6 === "Circle") {
                  return expected("Circle(center: Point, radius: Int)");
                } else if ($6 === "Arc") {
                  return expected(
                    "Arc(center: Point, radius: Int, from: Int, to: Int)",
                  );
                } else if ($6 === "Polygon") {
                  return expected(
                    "Polygon(center: Point, radius: Int, sides: Int, rotation: Int)",
                  );
                } else if ($6 === "Star") {
                  return expected(
                    "Star(center: Point, outer: Int, inner: Int, points: Int)",
                  );
                } else if ($6 === "Line3") {
                  return expected("Line3(start: Point3, end: Point3)");
                } else if ($6 === "Cube") {
                  return expected("Cube(center: Point3, size: Int)");
                } else if ($6 === "Sphere") {
                  return expected("Sphere(center: Point3, radius: Int)");
                } else {
                  return new Error(
                    new BadDrawing("a Path's shape must be a recognized shape"),
                  );
                }
              }
            } else {
              let $5 = v.tag;
              if ($5 === "Circle") {
                return expected("Circle(center: Point, radius: Int)");
              } else if ($5 === "Arc") {
                return expected(
                  "Arc(center: Point, radius: Int, from: Int, to: Int)",
                );
              } else if ($5 === "Polygon") {
                return expected(
                  "Polygon(center: Point, radius: Int, sides: Int, rotation: Int)",
                );
              } else if ($5 === "Star") {
                return expected(
                  "Star(center: Point, outer: Int, inner: Int, points: Int)",
                );
              } else if ($5 === "Line3") {
                return expected("Line3(start: Point3, end: Point3)");
              } else if ($5 === "Cube") {
                return expected("Cube(center: Point3, size: Int)");
              } else if ($5 === "Sphere") {
                return expected("Sphere(center: Point3, radius: Int)");
              } else {
                return new Error(
                  new BadDrawing("a Path's shape must be a recognized shape"),
                );
              }
            }
          } else {
            let $4 = v.tag;
            if ($4 === "Circle") {
              return expected("Circle(center: Point, radius: Int)");
            } else if ($4 === "Arc") {
              return expected(
                "Arc(center: Point, radius: Int, from: Int, to: Int)",
              );
            } else if ($4 === "Polygon") {
              return expected(
                "Polygon(center: Point, radius: Int, sides: Int, rotation: Int)",
              );
            } else if ($4 === "Star") {
              return expected(
                "Star(center: Point, outer: Int, inner: Int, points: Int)",
              );
            } else if ($4 === "Line3") {
              return expected("Line3(start: Point3, end: Point3)");
            } else if ($4 === "Cube") {
              return expected("Cube(center: Point3, size: Int)");
            } else if ($4 === "Sphere") {
              return expected("Sphere(center: Point3, radius: Int)");
            } else {
              return new Error(
                new BadDrawing("a Path's shape must be a recognized shape"),
              );
            }
          }
        }
      }
    }
  } else {
    return new Error(
      new BadDrawing("a Path's shape must be a recognized shape"),
    );
  }
}

function to_path(v) {
  if (v instanceof VData) {
    let $ = v.fields;
    if ($ instanceof $Empty) {
      return new Error(new BadDrawing("some element is not a well-formed path"));
    } else {
      let $1 = $.tail;
      if ($1 instanceof $Empty) {
        return new Error(
          new BadDrawing("some element is not a well-formed path"),
        );
      } else {
        let $2 = $1.tail;
        if ($2 instanceof $Empty) {
          return new Error(
            new BadDrawing("some element is not a well-formed path"),
          );
        } else {
          let $3 = $2.tail;
          if ($3 instanceof $Empty) {
            return new Error(
              new BadDrawing("some element is not a well-formed path"),
            );
          } else if ($3.tail instanceof $Empty) {
            let $4 = $1.head;
            if ($4 instanceof VInt) {
              let $5 = $2.head;
              if ($5 instanceof VInt) {
                let $6 = $3.head;
                if ($6 instanceof VInt && v.tag === "Path") {
                  let shape = $.head;
                  let start = $4[0];
                  let end = $5[0];
                  let thickness = $6[0];
                  return $result.try$(
                    to_shape(shape),
                    (s) => {
                      return new Ok(
                        new Path(
                          s,
                          $int.to_float(start),
                          $int.to_float(end),
                          $int.to_float(thickness),
                        ),
                      );
                    },
                  );
                } else {
                  return new Error(
                    new BadDrawing("some element is not a well-formed path"),
                  );
                }
              } else {
                return new Error(
                  new BadDrawing("some element is not a well-formed path"),
                );
              }
            } else {
              return new Error(
                new BadDrawing("some element is not a well-formed path"),
              );
            }
          } else {
            return new Error(
              new BadDrawing("some element is not a well-formed path"),
            );
          }
        }
      }
    }
  } else {
    return new Error(new BadDrawing("some element is not a well-formed path"));
  }
}

/**
 * Call the program's draw function on shape_slider, returning its list of
 * paths or the evaluation error, so the app can show failures.
 */
export function try_draw(shape_slider, global) {
  let $ = $evaluator.run(
    "draw",
    listPrepend(new VInt(shape_slider), $List$Empty$const),
    global,
  );
  if ($ instanceof Ok) {
    let $1 = $[0];
    if ($1 instanceof VList) {
      let items = $1[0];
      let $2 = $list.length(items) > $limits.path_limit;
      if ($2) {
        return new Error(EvalError$PathLimit$const);
      } else {
        return $list.try_map(items, to_path);
      }
    } else {
      return new Error(new BadDrawing("return value of draw is not a list"));
    }
  } else {
    return $;
  }
}
