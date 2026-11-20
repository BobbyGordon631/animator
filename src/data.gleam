//// The library of saved drawings. A drawing is a name and the source of its draw
//// function.

import examples
import gleam/int
import gleam/list
import gleam/result
import gleam/string

// ── localStorage (data_ffi.mjs) ───────────────────────────────────────────────

/// The string stored in localStorage under key, or an Error if there isn't one.
@external(javascript, "./data_ffi.mjs", "storageGet")
pub fn storage_get(key: String) -> Result(String, Nil)

/// Store value in localStorage under key, replacing anything already there. If that
/// isn't possible, this logs the reason to the browser console.
@external(javascript, "./data_ffi.mjs", "storageSet")
pub fn storage_set(key: String, value: String) -> Nil

// ── The new-drawing prompt (data_ffi.mjs) ─────────────────────────────────────

/// Prompt the user to name a new drawing; "" (empty string) means they
/// cancelled or left it blank.
@external(javascript, "./data_ffi.mjs", "promptDrawingName")
pub fn prompt_drawing_name() -> String

/// Like prompt_drawing_name, but with suggestion already filled in.
@external(javascript, "./data_ffi.mjs", "promptDrawingNameSuggesting")
pub fn prompt_drawing_name_suggesting(suggestion: String) -> String

/// The name if no drawing has it yet; otherwise the name with the first free
/// suffix: "-2", "-3", ...
pub fn unique_name(library: Library, name: String) -> String {
  unique_name_from(library, name, 1)
}

fn unique_name_from(library: Library, name: String, n: Int) -> String {
  let candidate = case n {
    1 -> name
    _ -> name <> "-" <> int.to_string(n)
  }
  case source_of(library, candidate) {
    Ok(_) -> unique_name_from(library, name, n + 1)
    Error(Nil) -> candidate
  }
}

// ── The library ───────────────────────────────────────────────────────────────

/// Every saved drawing, as (name, source) pairs in menu order, and the name of
/// the one that is open.
pub type Library {
  Library(drawings: List(#(String, String)), current: String)
}

/// The one localStorage key that holds the whole library.
const storage_key = "animator-library"

/// Separates the fields of the stored library. It's the ASCII "unit separator"
/// control character, which can't be typed into the editor, so each drawing's
/// source is stored verbatim (unlike JSON, which would escape quotes and
/// newlines).
const separator = "\u{1F}"

/// The library a browser starts with when nothing is saved: the examples, with
/// the first one open.
pub fn default_library() -> Library {
  let current = case examples.all {
    [#(name, _), ..] -> name
    [] -> ""
  }
  Library(drawings: examples.all, current: current)
}

/// The library saved in localStorage, or the examples if none is saved (or
/// what's saved can't be read).
pub fn load() -> Library {
  case storage_get(storage_key) {
    Ok(text) -> result.unwrap(decode(text), default_library())
    Error(Nil) -> default_library()
  }
}

/// Save the library to localStorage, replacing what was there.
pub fn save(library: Library) -> Nil {
  storage_set(storage_key, encode(library))
}

/// The source of the named drawing.
pub fn source_of(library: Library, name: String) -> Result(String, Nil) {
  list.key_find(library.drawings, name)
}

/// The source of the open drawing ("" if it's somehow missing).
pub fn current_source(library: Library) -> String {
  case source_of(library, library.current) {
    Ok(source) -> source
    Error(Nil) -> ""
  }
}

/// Replace the named drawing's source, or add it to the end of the menu if
/// there is no drawing with that name.
pub fn set_source(library: Library, name: String, source: String) -> Library {
  Library(..library, drawings: list.key_set(library.drawings, name, source))
}

/// Make the named drawing the open one.
pub fn open(library: Library, name: String) -> Library {
  Library(..library, current: name)
}

// Stored as: current, name1, source1, name2, source2, ... joined by separator.
fn encode(library: Library) -> String {
  [
    library.current,
    ..list.flat_map(library.drawings, fn(drawing) { [drawing.0, drawing.1] })
  ]
  |> string.join(separator)
}

fn decode(text: String) -> Result(Library, Nil) {
  case string.split(text, separator) {
    [current, ..fields] -> {
      let drawings = pairs(fields)
      case drawings {
        // A library with no drawings, or a malformed one, isn't usable.
        Ok([]) | Error(Nil) -> Error(Nil)
        Ok(drawings) -> {
          // If the open drawing is missing, open the first one instead.
          let current = case list.key_find(drawings, current) {
            Ok(_) -> current
            Error(Nil) ->
              case drawings {
                [#(first, _), ..] -> first
                [] -> current
              }
          }
          Ok(Library(drawings: drawings, current: current))
        }
      }
    }
    [] -> Error(Nil)
  }
}

fn pairs(fields: List(String)) -> Result(List(#(String, String)), Nil) {
  case fields {
    [] -> Ok([])
    [name, source, ..rest] ->
      pairs(rest) |> result.map(fn(drawings) { [#(name, source), ..drawings] })
    [_] -> Error(Nil)
  }
}
