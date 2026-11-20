//# sourceMappingURL=data.mjs.map
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";
import {
  storageGet as storage_get,
  storageSet as storage_set,
  promptDrawingName as prompt_drawing_name,
  promptDrawingNameSuggesting as prompt_drawing_name_suggesting,
} from "./data_ffi.mjs";
import * as $examples from "./examples.mjs";
import {
  Ok,
  Error,
  Empty as $Empty,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
} from "./gleam.mjs";

export {
  prompt_drawing_name,
  prompt_drawing_name_suggesting,
  storage_get,
  storage_set,
};

export class Library extends $CustomType {
  constructor(drawings, current) {
    super();
    this.drawings = drawings;
    this.current = current;
  }
}
export const Library$Library = (drawings, current) =>
  new Library(drawings, current);
export const Library$isLibrary = (value) => value instanceof Library;
export const Library$Library$drawings = (value) => value.drawings;
export const Library$Library$0 = (value) => value.drawings;
export const Library$Library$current = (value) => value.current;
export const Library$Library$1 = (value) => value.current;

/**
 * Separates the fields of the stored library. It's the ASCII "unit separator"
 * control character, which can't be typed into the editor, so each drawing's
 * source is stored verbatim (unlike JSON, which would escape quotes and
 * newlines).
 * 
 * @ignore
 */
const separator = "\u{1F}";

/**
 * The one localStorage key that holds the whole library.
 * 
 * @ignore
 */
const storage_key = "animator-library";

/**
 * The source of the named drawing.
 */
export function source_of(library, name) {
  return $list.key_find(library.drawings, name);
}

function unique_name_from(loop$library, loop$name, loop$n) {
  while (true) {
    let library = loop$library;
    let name = loop$name;
    let n = loop$n;
    let _block;
    if (n === 1) {
      _block = name;
    } else {
      _block = (name + "-") + $int.to_string(n);
    }
    let candidate = _block;
    let $ = source_of(library, candidate);
    if ($ instanceof Ok) {
      loop$library = library;
      loop$name = name;
      loop$n = n + 1;
    } else {
      return candidate;
    }
  }
}

/**
 * The name if no drawing has it yet; otherwise the name with the first free
 * suffix: "-2", "-3", ...
 */
export function unique_name(library, name) {
  return unique_name_from(library, name, 1);
}

/**
 * The library a browser starts with when nothing is saved: the examples, with
 * the first one open.
 */
export function default_library() {
  let _block;
  let $ = $examples.all;
  if ($ instanceof $Empty) {
    _block = "";
  } else {
    let name = $.head[0];
    _block = name;
  }
  let current = _block;
  return new Library($examples.all, current);
}

function pairs(fields) {
  if (fields instanceof $Empty) {
    return new Ok($List$Empty$const);
  } else {
    let $ = fields.tail;
    if ($ instanceof $Empty) {
      return new Error(undefined);
    } else {
      let name = fields.head;
      let source = $.head;
      let rest = $.tail;
      let _pipe = pairs(rest);
      return $result.map(
        _pipe,
        (drawings) => { return listPrepend([name, source], drawings); },
      );
    }
  }
}

function decode(text) {
  let $ = $string.split(text, separator);
  if ($ instanceof $Empty) {
    return new Error(undefined);
  } else {
    let current = $.head;
    let fields = $.tail;
    let drawings = pairs(fields);
    if (drawings instanceof Ok) {
      let $1 = drawings[0];
      if ($1 instanceof $Empty) {
        return new Error(undefined);
      } else {
        let drawings$1 = $1;
        let _block;
        let $2 = $list.key_find(drawings$1, current);
        if ($2 instanceof Ok) {
          _block = current;
        } else {
          if (drawings$1 instanceof $Empty) {
            _block = current;
          } else {
            let first = drawings$1.head[0];
            _block = first;
          }
        }
        let current$1 = _block;
        return new Ok(new Library(drawings$1, current$1));
      }
    } else {
      return new Error(undefined);
    }
  }
}

/**
 * The library saved in localStorage, or the examples if none is saved (or
 * what's saved can't be read).
 */
export function load() {
  let $ = storage_get(storage_key);
  if ($ instanceof Ok) {
    let text = $[0];
    return $result.unwrap(decode(text), default_library());
  } else {
    return default_library();
  }
}

function encode(library) {
  let _pipe = listPrepend(
    library.current,
    $list.flat_map(
      library.drawings,
      (drawing) => {
        return listPrepend(
          drawing[0],
          listPrepend(drawing[1], $List$Empty$const),
        );
      },
    ),
  );
  return $string.join(_pipe, separator);
}

/**
 * Save the library to localStorage, replacing what was there.
 */
export function save(library) {
  return storage_set(storage_key, encode(library));
}

/**
 * The source of the open drawing ("" if it's somehow missing).
 */
export function current_source(library) {
  let $ = source_of(library, library.current);
  if ($ instanceof Ok) {
    let source = $[0];
    return source;
  } else {
    return "";
  }
}

/**
 * Replace the named drawing's source, or add it to the end of the menu if
 * there is no drawing with that name.
 */
export function set_source(library, name, source) {
  return new Library(
    $list.key_set(library.drawings, name, source),
    library.current,
  );
}

/**
 * Make the named drawing the open one.
 */
export function open(library, name) {
  return new Library(library.drawings, name);
}
