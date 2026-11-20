//# sourceMappingURL=settings.mjs.map
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";
import { Ok, Error, Empty as $Empty, CustomType as $CustomType } from "./gleam.mjs";

export class Setting extends $CustomType {
  constructor(name, value, min, max, line_number) {
    super();
    this.name = name;
    this.value = value;
    this.min = min;
    this.max = max;
    this.line_number = line_number;
  }
}
export const Setting$Setting = (name, value, min, max, line_number) =>
  new Setting(name, value, min, max, line_number);
export const Setting$isSetting = (value) => value instanceof Setting;
export const Setting$Setting$name = (value) => value.name;
export const Setting$Setting$0 = (value) => value.name;
export const Setting$Setting$value = (value) => value.value;
export const Setting$Setting$1 = (value) => value.value;
export const Setting$Setting$min = (value) => value.min;
export const Setting$Setting$2 = (value) => value.min;
export const Setting$Setting$max = (value) => value.max;
export const Setting$Setting$3 = (value) => value.max;
export const Setting$Setting$line_number = (value) => value.line_number;
export const Setting$Setting$4 = (value) => value.line_number;

function is_digit(c) {
  return $string.contains("0123456789", c) && ($string.length(c) === 1);
}

function natural(text) {
  let $ = (text !== "") && $list.all($string.to_graphemes(text), is_digit);
  if ($) {
    return $int.parse(text);
  } else {
    return new Error(undefined);
  }
}

function setting_range(comment) {
  let $ = $string.trim(comment);
  if ($.startsWith("setting ")) {
    let range = $.slice(8);
    return $result.try$(
      $string.split_once($string.trim(range), ".."),
      (_use0) => {
        let low = _use0[0];
        let high = _use0[1];
        return $result.try$(
          natural(low),
          (min) => {
            return $result.try$(
              natural(high),
              (max) => {
                let $1 = min <= max;
                if ($1) {
                  return new Ok([min, max]);
                } else {
                  return new Error(undefined);
                }
              },
            );
          },
        );
      },
    );
  } else {
    return new Error(undefined);
  }
}

function is_lower(c) {
  return $string.contains("abcdefghijklmnopqrstuvwxyz", c) && ($string.length(c) === 1);
}

function is_name(text) {
  let $ = $string.to_graphemes(text);
  if ($ instanceof $Empty) {
    return false;
  } else {
    let first = $.head;
    let rest = $.tail;
    return (is_lower(first) || (first === "_")) && $list.all(
      rest,
      (c) => { return (is_lower(c) || is_digit(c)) || (c === "_"); },
    );
  }
}

function binding_name(declaration) {
  let $ = $string.trim_start(declaration);
  if ($.startsWith("let ")) {
    let rest = $.slice(4);
    let name = $string.trim(rest);
    let $1 = is_name(name);
    if ($1) {
      return new Ok(name);
    } else {
      return new Error(undefined);
    }
  } else {
    return new Error(undefined);
  }
}

function parse_line(line) {
  return $result.try$(
    $string.split_once(line, "="),
    (_use0) => {
      let declaration = _use0[0];
      let rest = _use0[1];
      return $result.try$(
        binding_name(declaration),
        (name) => {
          return $result.try$(
            $string.split_once(rest, "//"),
            (_use0) => {
              let value_text = _use0[0];
              let comment = _use0[1];
              return $result.try$(
                natural($string.trim(value_text)),
                (value) => {
                  return $result.try$(
                    setting_range(comment),
                    (_use0) => {
                      let min = _use0[0];
                      let max = _use0[1];
                      let leading = $string.drop_end(
                        value_text,
                        $string.length($string.trim_start(value_text)),
                      );
                      let trailing = $string.drop_start(
                        value_text,
                        $string.length($string.trim_end(value_text)),
                      );
                      return new Ok(
                        [
                          name,
                          value,
                          min,
                          max,
                          (declaration + "=") + leading,
                          (trailing + "//") + comment,
                        ],
                      );
                    },
                  );
                },
              );
            },
          );
        },
      );
    },
  );
}

/**
 * Every well-formed setting line in the source, in order. Lines that don't
 * match the form exactly are ignored.
 */
export function parse(source) {
  let _pipe = $string.split(source, "\n");
  let _pipe$1 = $list.index_map(
    _pipe,
    (line, i) => {
      let _pipe$1 = parse_line(line);
      return $result.map(
        _pipe$1,
        (parsed) => {
          let name = parsed[0];
          let value = parsed[1];
          let min = parsed[2];
          let max = parsed[3];
          return new Setting(name, value, min, max, i + 1);
        },
      );
    },
  );
  return $result.values(_pipe$1);
}

/**
 * The source with the setting on line `line_number` set to `value` (kept
 * within its range), and that line's new text. Only the digits of the value
 * change. An Error if that line doesn't declare a setting.
 */
export function set_value(source, line_number, value) {
  let lines = $string.split(source, "\n");
  return $result.try$(
    $list.first($list.drop(lines, line_number - 1)),
    (line) => {
      return $result.map(
        parse_line(line),
        (_use0) => {
          let min = _use0[2];
          let max = _use0[3];
          let before = _use0[4];
          let after = _use0[5];
          let new_line = (before + $int.to_string($int.clamp(value, min, max))) + after;
          let new_lines = $list.index_map(
            lines,
            (l, i) => {
              let $ = (i + 1) === line_number;
              if ($) {
                return new_line;
              } else {
                return l;
              }
            },
          );
          return [$string.join(new_lines, "\n"), new_line];
        },
      );
    },
  );
}
