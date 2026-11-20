//// Settings: numbers in a drawing's code that the app shows as sliders. Any line of
//// the form
////
////     let sides = 6 // setting 3..12
////
//// declares one, in any drawing (the presets and ones users write themselves).
//// Dragging its slider rewrites just that number in the code.

import gleam/int
import gleam/list
import gleam/result
import gleam/string

/// A setting: the name its `let` binds, its current value, the slider's range,
/// and the (1-based) line it is declared on.
pub type Setting {
  Setting(name: String, value: Int, min: Int, max: Int, line_number: Int)
}

/// Every well-formed setting line in the source, in order. Lines that don't
/// match the form exactly are ignored.
pub fn parse(source: String) -> List(Setting) {
  string.split(source, "\n")
  |> list.index_map(fn(line, i) {
    parse_line(line)
    |> result.map(fn(parsed) {
      let #(name, value, min, max, _, _) = parsed
      Setting(name, value, min, max, i + 1)
    })
  })
  |> result.values
}

/// The source with the setting on line `line_number` set to `value` (kept
/// within its range), and that line's new text. Only the digits of the value
/// change. An Error if that line doesn't declare a setting.
pub fn set_value(
  source: String,
  line_number: Int,
  value: Int,
) -> Result(#(String, String), Nil) {
  let lines = string.split(source, "\n")
  use line <- result.try(list.first(list.drop(lines, line_number - 1)))
  use #(_, _, min, max, before, after) <- result.map(parse_line(line))
  let new_line = before <> int.to_string(int.clamp(value, min, max)) <> after
  let new_lines =
    list.index_map(lines, fn(l, i) {
      case i + 1 == line_number {
        True -> new_line
        False -> l
      }
    })
  #(string.join(new_lines, "\n"), new_line)
}

// A setting line's name, value, min, and max, and the text before and after the
// value's digits (so the value can be replaced without touching anything else).
fn parse_line(
  line: String,
) -> Result(#(String, Int, Int, Int, String, String), Nil) {
  // "  let sides = 6 // setting 3..12" splits at the first "=" into the
  // declaration and "6 // setting 3..12".
  use #(declaration, rest) <- result.try(string.split_once(line, "="))
  use name <- result.try(binding_name(declaration))
  use #(value_text, comment) <- result.try(string.split_once(rest, "//"))
  use value <- result.try(natural(string.trim(value_text)))
  use #(min, max) <- result.try(setting_range(comment))
  // Keep the spaces around the value where they were.
  let leading =
    string.drop_end(value_text, string.length(string.trim_start(value_text)))
  let trailing =
    string.drop_start(value_text, string.length(string.trim_end(value_text)))
  Ok(#(
    name,
    value,
    min,
    max,
    declaration <> "=" <> leading,
    trailing <> "//" <> comment,
  ))
}

// The name in "  let sides ", which must be a lowercase Gleam name.
fn binding_name(declaration: String) -> Result(String, Nil) {
  case string.trim_start(declaration) {
    "let " <> rest -> {
      let name = string.trim(rest)
      case is_name(name) {
        True -> Ok(name)
        False -> Error(Nil)
      }
    }
    _ -> Error(Nil)
  }
}

// The range in " setting 3..12", with min <= max.
fn setting_range(comment: String) -> Result(#(Int, Int), Nil) {
  case string.trim(comment) {
    "setting " <> range -> {
      use #(low, high) <- result.try(string.split_once(string.trim(range), ".."))
      use min <- result.try(natural(low))
      use max <- result.try(natural(high))
      case min <= max {
        True -> Ok(#(min, max))
        False -> Error(Nil)
      }
    }
    _ -> Error(Nil)
  }
}

// A non-negative integer written only with digits (no sign, spaces, or
// underscores), as the language has no negative literals.
fn natural(text: String) -> Result(Int, Nil) {
  case text != "" && list.all(string.to_graphemes(text), is_digit) {
    True -> int.parse(text)
    False -> Error(Nil)
  }
}

fn is_name(text: String) -> Bool {
  case string.to_graphemes(text) {
    [first, ..rest] ->
      { is_lower(first) || first == "_" }
      && list.all(rest, fn(c) { is_lower(c) || is_digit(c) || c == "_" })
    [] -> False
  }
}

fn is_digit(c: String) -> Bool {
  string.contains("0123456789", c) && string.length(c) == 1
}

fn is_lower(c: String) -> Bool {
  string.contains("abcdefghijklmnopqrstuvwxyz", c) && string.length(c) == 1
}
