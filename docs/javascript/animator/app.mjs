//# sourceMappingURL=app.mjs.map
import * as $decode from "../gleam_stdlib/gleam/dynamic/decode.mjs";
import * as $float from "../gleam_stdlib/gleam/float.mjs";
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $option from "../gleam_stdlib/gleam/option.mjs";
import { Some, Option$None$const } from "../gleam_stdlib/gleam/option.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";
import * as $lustre from "../lustre/lustre.mjs";
import * as $attr from "../lustre/lustre/attribute.mjs";
import * as $effect from "../lustre/lustre/effect.mjs";
import * as $element from "../lustre/lustre/element.mjs";
import * as $html from "../lustre/lustre/element/html.mjs";
import * as $keyed from "../lustre/lustre/element/keyed.mjs";
import * as $event from "../lustre/lustre/event.mjs";
import * as $builtins from "./builtins.mjs";
import * as $data from "./data.mjs";
import * as $drawing from "./drawing.mjs";
import * as $editor from "./editor.mjs";
import * as $errors from "./errors.mjs";
import {
  Ok,
  Empty as $Empty,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
  makeError,
} from "./gleam.mjs";
import * as $parser from "./parser.mjs";
import * as $presets from "./presets.mjs";
import * as $projection from "./projection.mjs";
import * as $render from "./render.mjs";
import * as $settings from "./settings.mjs";
import * as $shape from "./shape.mjs";

const FILEPATH = "src/app.gleam";

export class Model extends $CustomType {
  constructor(library, menu_key, code_open, error, shape_slider, speed, camera, tilt, freehand, drag, shown) {
    super();
    this.library = library;
    this.menu_key = menu_key;
    this.code_open = code_open;
    this.error = error;
    this.shape_slider = shape_slider;
    this.speed = speed;
    this.camera = camera;
    this.tilt = tilt;
    this.freehand = freehand;
    this.drag = drag;
    this.shown = shown;
  }
}
export const Model$Model = (library, menu_key, code_open, error, shape_slider, speed, camera, tilt, freehand, drag, shown) =>
  new Model(library,
  menu_key,
  code_open,
  error,
  shape_slider,
  speed,
  camera,
  tilt,
  freehand,
  drag,
  shown);
export const Model$isModel = (value) => value instanceof Model;
export const Model$Model$library = (value) => value.library;
export const Model$Model$0 = (value) => value.library;
export const Model$Model$menu_key = (value) => value.menu_key;
export const Model$Model$1 = (value) => value.menu_key;
export const Model$Model$code_open = (value) => value.code_open;
export const Model$Model$2 = (value) => value.code_open;
export const Model$Model$error = (value) => value.error;
export const Model$Model$3 = (value) => value.error;
export const Model$Model$shape_slider = (value) => value.shape_slider;
export const Model$Model$4 = (value) => value.shape_slider;
export const Model$Model$speed = (value) => value.speed;
export const Model$Model$5 = (value) => value.speed;
export const Model$Model$camera = (value) => value.camera;
export const Model$Model$6 = (value) => value.camera;
export const Model$Model$tilt = (value) => value.tilt;
export const Model$Model$7 = (value) => value.tilt;
export const Model$Model$freehand = (value) => value.freehand;
export const Model$Model$8 = (value) => value.freehand;
export const Model$Model$drag = (value) => value.drag;
export const Model$Model$9 = (value) => value.drag;
export const Model$Model$shown = (value) => value.shown;
export const Model$Model$10 = (value) => value.shown;

export class Drag extends $CustomType {
  constructor(x, y, camera, tilt) {
    super();
    this.x = x;
    this.y = y;
    this.camera = camera;
    this.tilt = tilt;
  }
}
export const Drag$Drag = (x, y, camera, tilt) => new Drag(x, y, camera, tilt);
export const Drag$isDrag = (value) => value instanceof Drag;
export const Drag$Drag$x = (value) => value.x;
export const Drag$Drag$0 = (value) => value.x;
export const Drag$Drag$y = (value) => value.y;
export const Drag$Drag$1 = (value) => value.y;
export const Drag$Drag$camera = (value) => value.camera;
export const Drag$Drag$2 = (value) => value.camera;
export const Drag$Drag$tilt = (value) => value.tilt;
export const Drag$Drag$3 = (value) => value.tilt;

export class SetCode extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetCode = ($0) => new SetCode($0);
export const Msg$isSetCode = (value) => value instanceof SetCode;
export const Msg$SetCode$0 = (value) => value[0];

export class SetShapeSlider extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetShapeSlider = ($0) => new SetShapeSlider($0);
export const Msg$isSetShapeSlider = (value) => value instanceof SetShapeSlider;
export const Msg$SetShapeSlider$0 = (value) => value[0];

export class SetSpeed extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetSpeed = ($0) => new SetSpeed($0);
export const Msg$isSetSpeed = (value) => value instanceof SetSpeed;
export const Msg$SetSpeed$0 = (value) => value[0];

export class SetCamera extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetCamera = ($0) => new SetCamera($0);
export const Msg$isSetCamera = (value) => value instanceof SetCamera;
export const Msg$SetCamera$0 = (value) => value[0];

export class SetFreehand extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetFreehand = ($0) => new SetFreehand($0);
export const Msg$isSetFreehand = (value) => value instanceof SetFreehand;
export const Msg$SetFreehand$0 = (value) => value[0];

export class DragStart extends $CustomType {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }
}
export const Msg$DragStart = (x, y) => new DragStart(x, y);
export const Msg$isDragStart = (value) => value instanceof DragStart;
export const Msg$DragStart$x = (value) => value.x;
export const Msg$DragStart$0 = (value) => value.x;
export const Msg$DragStart$y = (value) => value.y;
export const Msg$DragStart$1 = (value) => value.y;

export class DragMove extends $CustomType {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }
}
export const Msg$DragMove = (x, y) => new DragMove(x, y);
export const Msg$isDragMove = (value) => value instanceof DragMove;
export const Msg$DragMove$x = (value) => value.x;
export const Msg$DragMove$0 = (value) => value.x;
export const Msg$DragMove$y = (value) => value.y;
export const Msg$DragMove$1 = (value) => value.y;

export class DragEnd extends $CustomType {}
export const Msg$DragEnd$const = new DragEnd();
export const Msg$DragEnd = () => Msg$DragEnd$const;
export const Msg$isDragEnd = (value) => value instanceof DragEnd;

export class ResetView extends $CustomType {}
export const Msg$ResetView$const = new ResetView();
export const Msg$ResetView = () => Msg$ResetView$const;
export const Msg$isResetView = (value) => value instanceof ResetView;

export class RestoreLibrary extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$RestoreLibrary = ($0) => new RestoreLibrary($0);
export const Msg$isRestoreLibrary = (value) => value instanceof RestoreLibrary;
export const Msg$RestoreLibrary$0 = (value) => value[0];

export class OpenDrawing extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$OpenDrawing = ($0) => new OpenDrawing($0);
export const Msg$isOpenDrawing = (value) => value instanceof OpenDrawing;
export const Msg$OpenDrawing$0 = (value) => value[0];

export class NewDrawing extends $CustomType {}
export const Msg$NewDrawing$const = new NewDrawing();
export const Msg$NewDrawing = () => Msg$NewDrawing$const;
export const Msg$isNewDrawing = (value) => value instanceof NewDrawing;

export class NameNewDrawing extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$NameNewDrawing = ($0) => new NameNewDrawing($0);
export const Msg$isNameNewDrawing = (value) => value instanceof NameNewDrawing;
export const Msg$NameNewDrawing$0 = (value) => value[0];

export class ChoosePreset extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$ChoosePreset = ($0) => new ChoosePreset($0);
export const Msg$isChoosePreset = (value) => value instanceof ChoosePreset;
export const Msg$ChoosePreset$0 = (value) => value[0];

export class NamePresetCopy extends $CustomType {
  constructor(preset, name) {
    super();
    this.preset = preset;
    this.name = name;
  }
}
export const Msg$NamePresetCopy = (preset, name) =>
  new NamePresetCopy(preset, name);
export const Msg$isNamePresetCopy = (value) => value instanceof NamePresetCopy;
export const Msg$NamePresetCopy$preset = (value) => value.preset;
export const Msg$NamePresetCopy$0 = (value) => value.preset;
export const Msg$NamePresetCopy$name = (value) => value.name;
export const Msg$NamePresetCopy$1 = (value) => value.name;

export class SetSetting extends $CustomType {
  constructor(line_number, value) {
    super();
    this.line_number = line_number;
    this.value = value;
  }
}
export const Msg$SetSetting = (line_number, value) =>
  new SetSetting(line_number, value);
export const Msg$isSetSetting = (value) => value instanceof SetSetting;
export const Msg$SetSetting$line_number = (value) => value.line_number;
export const Msg$SetSetting$0 = (value) => value.line_number;
export const Msg$SetSetting$value = (value) => value.value;
export const Msg$SetSetting$1 = (value) => value.value;

export class ToggleCode extends $CustomType {}
export const Msg$ToggleCode$const = new ToggleCode();
export const Msg$ToggleCode = () => Msg$ToggleCode$const;
export const Msg$isToggleCode = (value) => value instanceof ToggleCode;

/**
 * The stroke colour of every path drawn on the canvas.
 * 
 * @ignore
 */
const path_color = "#cfe3ff";

/**
 * The code a new drawing starts with.
 * 
 * @ignore
 */
const new_drawing_code = "fn draw(shape_slider: Int) -> List(Path) {\n  [Path(Line(Point(0, 0), Point(100, 100)), 0, 10, 2)]\n}\n";

/**
 * The prefix that marks a preset's value in the drawing menu.
 * 
 * @ignore
 */
const preset_prefix = "preset:";

/**
 * Your app's public address, once you've deployed it in Problem 13, such as
 * "https://your-username.github.io/animator/".
 */
export const public_url = "https://kksolve.com/animator/";

/**
 * Set to True if you would like your app's URL included in the course gallery.
 */
export const include_app_in_gallery = false;

/**
 * A link to your video from Problem 14, which anyone with the link can watch.
 */
export const video_url = "";

/**
 * Set to True if you would like your video included in the course gallery.
 */
export const include_video_in_gallery = false;

export function init(_) {
  return [
    new Model(
      $data.default_library(),
      0,
      true,
      "",
      10,
      100,
      $projection.default_camera,
      $projection.default_tilt,
      false,
      Option$None$const,
      $List$Empty$const,
    ),
    $effect.from(
      (dispatch) => { return dispatch(new RestoreLibrary($data.load())); },
    ),
  ];
}

function run_source(shape_slider, source) {
  let $ = $parser.parse_program(source, $builtins.global_frame());
  if ($ instanceof Ok) {
    let program = $[0];
    let _pipe = $drawing.try_draw(shape_slider, program);
    return $result.map_error(_pipe, $errors.error_message);
  } else {
    return $;
  }
}

function save(library) {
  return $effect.from((_) => { return $data.save(library); });
}

function animate(paths, restart, camera, tilt) {
  return $effect.from(
    (_) => {
      let _pipe = paths;
      let _pipe$1 = $list.flat_map(
        _pipe,
        (_capture) => {
          return $render.render_view(
            _capture,
            path_color,
            $int.to_float(camera),
            $int.to_float(tilt),
          );
        },
      );
      $render.set_drawing(_pipe$1);
      if (restart) {
        return $render.reset_clock();
      } else {
        return undefined;
      }
    },
  );
}

function show(model, paths, restart) {
  return [
    new Model(
      model.library,
      model.menu_key,
      model.code_open,
      model.error,
      model.shape_slider,
      model.speed,
      model.camera,
      model.tilt,
      model.freehand,
      model.drag,
      paths,
    ),
    animate(paths, restart, model.camera, model.tilt),
  ];
}

function open_drawing(model, name) {
  let library = $data.open(model.library, name);
  let source = $data.current_source(library);
  let model$1 = new Model(
    library,
    model.menu_key,
    model.code_open,
    model.error,
    model.shape_slider,
    model.speed,
    model.camera,
    model.tilt,
    model.freehand,
    model.drag,
    model.shown,
  );
  let _block;
  let $1 = run_source(model$1.shape_slider, source);
  if ($1 instanceof Ok) {
    let paths = $1[0];
    _block = show(
      new Model(
        model$1.library,
        model$1.menu_key,
        model$1.code_open,
        "",
        model$1.shape_slider,
        model$1.speed,
        model$1.camera,
        model$1.tilt,
        model$1.freehand,
        model$1.drag,
        model$1.shown,
      ),
      paths,
      true,
    );
  } else {
    let msg = $1[0];
    _block = show(
      new Model(
        model$1.library,
        model$1.menu_key,
        model$1.code_open,
        msg,
        model$1.shape_slider,
        model$1.speed,
        model$1.camera,
        model$1.tilt,
        model$1.freehand,
        model$1.drag,
        model$1.shown,
      ),
      $List$Empty$const,
      true,
    );
  }
  let $ = _block;
  let model$2 = $[0];
  let drawn = $[1];
  return [
    model$2,
    $effect.batch(
      listPrepend(
        save(library),
        listPrepend(
          $editor.mount(source, (var0) => { return new SetCode(var0); }),
          listPrepend(drawn, $List$Empty$const),
        ),
      ),
    ),
  ];
}

function turn(model) {
  return [model, animate(model.shown, false, model.camera, model.tilt)];
}

function redraw(model, restart) {
  let $ = run_source(model.shape_slider, $data.current_source(model.library));
  if ($ instanceof Ok) {
    let paths = $[0];
    return show(
      new Model(
        model.library,
        model.menu_key,
        model.code_open,
        "",
        model.shape_slider,
        model.speed,
        model.camera,
        model.tilt,
        model.freehand,
        model.drag,
        model.shown,
      ),
      paths,
      restart,
    );
  } else {
    let msg = $[0];
    return [
      new Model(
        model.library,
        model.menu_key,
        model.code_open,
        msg,
        model.shape_slider,
        model.speed,
        model.camera,
        model.tilt,
        model.freehand,
        model.drag,
        model.shown,
      ),
      $effect.none(),
    ];
  }
}

export function update(model, msg) {
  if (msg instanceof SetCode) {
    let text = msg[0];
    let $ = text === $data.current_source(model.library);
    if ($) {
      return [model, $effect.none()];
    } else {
      let library = $data.set_source(model.library, model.library.current, text);
      let $1 = redraw(
        new Model(
          library,
          model.menu_key,
          model.code_open,
          model.error,
          model.shape_slider,
          model.speed,
          model.camera,
          model.tilt,
          model.freehand,
          model.drag,
          model.shown,
        ),
        true,
      );
      let model$1 = $1[0];
      let redrawn = $1[1];
      return [
        model$1,
        $effect.batch(
          listPrepend(save(library), listPrepend(redrawn, $List$Empty$const)),
        ),
      ];
    }
  } else if (msg instanceof SetShapeSlider) {
    let value = msg[0];
    return redraw(
      new Model(
        model.library,
        model.menu_key,
        model.code_open,
        model.error,
        value,
        model.speed,
        model.camera,
        model.tilt,
        model.freehand,
        model.drag,
        model.shown,
      ),
      false,
    );
  } else if (msg instanceof SetSpeed) {
    let speed = msg[0];
    return [
      new Model(
        model.library,
        model.menu_key,
        model.code_open,
        model.error,
        model.shape_slider,
        speed,
        model.camera,
        model.tilt,
        model.freehand,
        model.drag,
        model.shown,
      ),
      $effect.from(
        (_) => { return $render.set_speed($int.to_float(speed) / 100.0); },
      ),
    ];
  } else if (msg instanceof SetCamera) {
    let camera = msg[0];
    return turn(
      new Model(
        model.library,
        model.menu_key,
        model.code_open,
        model.error,
        model.shape_slider,
        model.speed,
        camera,
        model.tilt,
        model.freehand,
        model.drag,
        model.shown,
      ),
    );
  } else if (msg instanceof SetFreehand) {
    let on = msg[0];
    let model$1 = new Model(
      model.library,
      model.menu_key,
      model.code_open,
      model.error,
      model.shape_slider,
      model.speed,
      model.camera,
      model.tilt,
      on,
      Option$None$const,
      model.shown,
    );
    if (on) {
      return [model$1, $effect.none()];
    } else {
      return turn(
        new Model(
          model$1.library,
          model$1.menu_key,
          model$1.code_open,
          model$1.error,
          model$1.shape_slider,
          model$1.speed,
          model$1.camera,
          $projection.default_tilt,
          model$1.freehand,
          model$1.drag,
          model$1.shown,
        ),
      );
    }
  } else if (msg instanceof DragStart) {
    let x = msg.x;
    let y = msg.y;
    let $ = model.freehand;
    if ($) {
      return [
        new Model(
          model.library,
          model.menu_key,
          model.code_open,
          model.error,
          model.shape_slider,
          model.speed,
          model.camera,
          model.tilt,
          model.freehand,
          new Some(new Drag(x, y, model.camera, model.tilt)),
          model.shown,
        ),
        $effect.none(),
      ];
    } else {
      return [model, $effect.none()];
    }
  } else if (msg instanceof DragMove) {
    let x = msg.x;
    let y = msg.y;
    let $ = model.drag;
    if ($ instanceof Some) {
      let drag = $[0];
      let camera = (drag.camera - $float.round((x - drag.x) / 2.0)) % 360;
      let camera$1 = (camera + 360) % 360;
      let tilt = $int.clamp(
        drag.tilt + $float.round((y - drag.y) / 2.0),
        0 - $projection.max_tilt,
        $projection.max_tilt,
      );
      let $1 = (camera$1 === model.camera) && (tilt === model.tilt);
      if ($1) {
        return [model, $effect.none()];
      } else {
        return turn(
          new Model(
            model.library,
            model.menu_key,
            model.code_open,
            model.error,
            model.shape_slider,
            model.speed,
            camera$1,
            tilt,
            model.freehand,
            model.drag,
            model.shown,
          ),
        );
      }
    } else {
      return [model, $effect.none()];
    }
  } else if (msg instanceof DragEnd) {
    return [
      new Model(
        model.library,
        model.menu_key,
        model.code_open,
        model.error,
        model.shape_slider,
        model.speed,
        model.camera,
        model.tilt,
        model.freehand,
        Option$None$const,
        model.shown,
      ),
      $effect.none(),
    ];
  } else if (msg instanceof ResetView) {
    return turn(
      new Model(
        model.library,
        model.menu_key,
        model.code_open,
        model.error,
        model.shape_slider,
        model.speed,
        $projection.default_camera,
        $projection.default_tilt,
        model.freehand,
        model.drag,
        model.shown,
      ),
    );
  } else if (msg instanceof RestoreLibrary) {
    let library = msg[0];
    return open_drawing(
      new Model(
        library,
        model.menu_key,
        model.code_open,
        model.error,
        model.shape_slider,
        model.speed,
        model.camera,
        model.tilt,
        model.freehand,
        model.drag,
        model.shown,
      ),
      library.current,
    );
  } else if (msg instanceof OpenDrawing) {
    let name = msg[0];
    return open_drawing(model, name);
  } else if (msg instanceof NewDrawing) {
    return [
      model,
      $effect.from(
        (dispatch) => {
          return dispatch(new NameNewDrawing($data.prompt_drawing_name()));
        },
      ),
    ];
  } else if (msg instanceof NameNewDrawing) {
    let name = msg[0];
    let model$1 = new Model(
      model.library,
      model.menu_key + 1,
      model.code_open,
      model.error,
      model.shape_slider,
      model.speed,
      model.camera,
      model.tilt,
      model.freehand,
      model.drag,
      model.shown,
    );
    let $ = $string.trim(name);
    if ($ === "") {
      return [model$1, $effect.none()];
    } else if ($.startsWith("preset:")) {
      return [model$1, $effect.none()];
    } else {
      let name$1 = $;
      let $1 = $data.source_of(model$1.library, name$1);
      if ($1 instanceof Ok) {
        return open_drawing(model$1, name$1);
      } else {
        let library = $data.set_source(
          model$1.library,
          name$1,
          new_drawing_code,
        );
        return open_drawing(
          new Model(
            library,
            model$1.menu_key,
            model$1.code_open,
            model$1.error,
            model$1.shape_slider,
            model$1.speed,
            model$1.camera,
            model$1.tilt,
            model$1.freehand,
            model$1.drag,
            model$1.shown,
          ),
          name$1,
        );
      }
    }
  } else if (msg instanceof ChoosePreset) {
    let preset = msg[0];
    return [
      model,
      $effect.from(
        (dispatch) => {
          return dispatch(
            new NamePresetCopy(
              preset,
              $data.prompt_drawing_name_suggesting(preset),
            ),
          );
        },
      ),
    ];
  } else if (msg instanceof NamePresetCopy) {
    let preset = msg.preset;
    let name = msg.name;
    let model$1 = new Model(
      model.library,
      model.menu_key + 1,
      model.code_open,
      model.error,
      model.shape_slider,
      model.speed,
      model.camera,
      model.tilt,
      model.freehand,
      model.drag,
      model.shown,
    );
    let $ = $string.trim(name);
    let $1 = $list.key_find($presets.all, preset);
    if ($ === "") {
      return [model$1, $effect.none()];
    } else if ($.startsWith("preset:")) {
      return [model$1, $effect.none()];
    } else if ($1 instanceof Ok) {
      let name$1 = $;
      let source = $1[0];
      let name$2 = $data.unique_name(model$1.library, name$1);
      let library = $data.set_source(model$1.library, name$2, source);
      return open_drawing(
        new Model(
          library,
          model$1.menu_key,
          model$1.code_open,
          model$1.error,
          model$1.shape_slider,
          model$1.speed,
          model$1.camera,
          model$1.tilt,
          model$1.freehand,
          model$1.drag,
          model$1.shown,
        ),
        name$2,
      );
    } else {
      return [model$1, $effect.none()];
    }
  } else if (msg instanceof SetSetting) {
    let line_number = msg.line_number;
    let value = msg.value;
    let source = $data.current_source(model.library);
    let $ = $settings.set_value(source, line_number, value);
    if ($ instanceof Ok) {
      let new_source = $[0][0];
      if (new_source !== source) {
        let new_line = $[0][1];
        let library = $data.set_source(
          model.library,
          model.library.current,
          new_source,
        );
        let $1 = redraw(
          new Model(
            library,
            model.menu_key,
            model.code_open,
            model.error,
            model.shape_slider,
            model.speed,
            model.camera,
            model.tilt,
            model.freehand,
            model.drag,
            model.shown,
          ),
          false,
        );
        let model$1 = $1[0];
        let redrawn = $1[1];
        return [
          model$1,
          $effect.batch(
            listPrepend(
              save(library),
              listPrepend(
                $editor.replace_line(line_number, new_line),
                listPrepend(redrawn, $List$Empty$const),
              ),
            ),
          ),
        ];
      } else {
        return [model, $effect.none()];
      }
    } else {
      return [model, $effect.none()];
    }
  } else {
    return [
      new Model(
        model.library,
        model.menu_key,
        !model.code_open,
        model.error,
        model.shape_slider,
        model.speed,
        model.camera,
        model.tilt,
        model.freehand,
        model.drag,
        model.shown,
      ),
      $effect.none(),
    ];
  }
}

function view_error(model) {
  let $ = model.error;
  if ($ === "") {
    return $element.none();
  } else {
    let msg = $;
    return $html.pre(
      listPrepend($attr.class$("output error"), $List$Empty$const),
      listPrepend($html.text(msg), $List$Empty$const),
    );
  }
}

function freehand_attributes(model) {
  let $ = model.freehand;
  let $1 = model.drag;
  if ($) {
    let drag = $1;
    let pointer = (to_msg) => {
      return $decode.field(
        "clientX",
        $decode.float,
        (x) => {
          return $decode.field(
            "clientY",
            $decode.float,
            (y) => { return $decode.success(to_msg(x, y)); },
          );
        },
      );
    };
    let end = listPrepend(
      $event.on("pointerup", $decode.success(Msg$DragEnd$const)),
      listPrepend(
        $event.on("pointerleave", $decode.success(Msg$DragEnd$const)),
        listPrepend(
          $event.on("pointercancel", $decode.success(Msg$DragEnd$const)),
          $List$Empty$const,
        ),
      ),
    );
    if (drag instanceof Some) {
      return listPrepend(
        $attr.class$("freehand dragging"),
        listPrepend(
          (() => {
            let _pipe = $event.on(
              "pointermove",
              pointer((var0, var1) => { return new DragMove(var0, var1); }),
            );
            return $event.throttle(_pipe, 16);
          })(),
          end,
        ),
      );
    } else {
      return listPrepend(
        $attr.class$("freehand"),
        listPrepend(
          (() => {
            let _pipe = $event.on(
              "pointerdown",
              pointer((var0, var1) => { return new DragStart(var0, var1); }),
            );
            return $event.prevent_default(_pipe);
          })(),
          $List$Empty$const,
        ),
      );
    }
  } else {
    return $List$Empty$const;
  }
}

function view_slider(label, test_id, min, max, step, value, shown, on_change) {
  return $html.label(
    listPrepend($attr.class$("control"), $List$Empty$const),
    listPrepend(
      $html.span(
        listPrepend($attr.class$("control-label"), $List$Empty$const),
        listPrepend($html.text(label), $List$Empty$const),
      ),
      listPrepend(
        $html.input(
          listPrepend(
            $attr.type_("range"),
            listPrepend(
              $attr.attribute("data-test-id", test_id),
              listPrepend(
                $attr.min($int.to_string(min)),
                listPrepend(
                  $attr.max($int.to_string(max)),
                  listPrepend(
                    $attr.step($int.to_string(step)),
                    listPrepend(
                      $attr.value($int.to_string(value)),
                      listPrepend(
                        $event.on_input(
                          (text) => {
                            return on_change(
                              (() => {
                                let _pipe = $int.parse(text);
                                return $result.unwrap(_pipe, value);
                              })(),
                            );
                          },
                        ),
                        $List$Empty$const,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        listPrepend(
          $html.span(
            listPrepend($attr.class$("control-value"), $List$Empty$const),
            listPrepend($html.text(shown), $List$Empty$const),
          ),
          $List$Empty$const,
        ),
      ),
    ),
  );
}

function view_settings(model) {
  let $ = $settings.parse($data.current_source(model.library));
  if ($ instanceof $Empty) {
    return $element.none();
  } else {
    let found = $;
    return $keyed.div(
      listPrepend($attr.class$("settings-bar"), $List$Empty$const),
      listPrepend(
        [
          "title",
          $html.span(
            listPrepend($attr.class$("settings-title"), $List$Empty$const),
            listPrepend($html.text("settings"), $List$Empty$const),
          ),
        ],
        $list.map(
          found,
          (setting) => {
            return [
              $string.join(
                listPrepend(
                  model.library.current,
                  listPrepend(
                    $int.to_string(setting.line_number),
                    listPrepend(
                      setting.name,
                      listPrepend(
                        $int.to_string(setting.min),
                        listPrepend(
                          $int.to_string(setting.max),
                          $List$Empty$const,
                        ),
                      ),
                    ),
                  ),
                ),
                "/",
              ),
              view_slider(
                setting.name,
                "setting-" + setting.name,
                setting.min,
                setting.max,
                1,
                setting.value,
                $int.to_string(setting.value),
                (_capture) => {
                  return new SetSetting(setting.line_number, _capture);
                },
              ),
            ];
          },
        ),
      ),
    );
  }
}

function view_camera(model) {
  let switch$ = $html.button(
    listPrepend(
      $attr.class$(
        (() => {
          let $ = model.freehand;
          if ($) {
            return "switch on";
          } else {
            return "switch";
          }
        })(),
      ),
      listPrepend(
        $attr.attribute("role", "switch"),
        listPrepend(
          $attr.attribute(
            "aria-checked",
            (() => {
              let $ = model.freehand;
              if ($) {
                return "true";
              } else {
                return "false";
              }
            })(),
          ),
          listPrepend(
            $attr.attribute("data-test-id", "camera-mode"),
            listPrepend(
              $attr.attribute(
                "title",
                "Turn 3D drawings with the slider, or by dragging",
              ),
              listPrepend(
                $event.on_click(new SetFreehand(!model.freehand)),
                $List$Empty$const,
              ),
            ),
          ),
        ),
      ),
    ),
    listPrepend(
      $html.span(
        listPrepend(
          $attr.class$("switch-label slider-label"),
          $List$Empty$const,
        ),
        listPrepend($html.text("slider"), $List$Empty$const),
      ),
      listPrepend(
        $html.span(
          listPrepend($attr.class$("switch-track"), $List$Empty$const),
          listPrepend(
            $html.span(
              listPrepend($attr.class$("switch-knob"), $List$Empty$const),
              $List$Empty$const,
            ),
            $List$Empty$const,
          ),
        ),
        listPrepend(
          $html.span(
            listPrepend(
              $attr.class$("switch-label freehand-label"),
              $List$Empty$const,
            ),
            listPrepend($html.text("freehand"), $List$Empty$const),
          ),
          $List$Empty$const,
        ),
      ),
    ),
  );
  let $ = model.freehand;
  if ($) {
    return $html.div(
      listPrepend($attr.class$("camera-control"), $List$Empty$const),
      listPrepend(
        switch$,
        listPrepend(
          $html.span(
            listPrepend($attr.class$("control-label"), $List$Empty$const),
            listPrepend($html.text("drag the drawing"), $List$Empty$const),
          ),
          listPrepend(
            $html.span(
              listPrepend(
                $attr.class$("control-value view-readout"),
                $List$Empty$const,
              ),
              listPrepend(
                $html.text(
                  (($int.to_string(model.camera) + "° · tilt ") + $int.to_string(
                    model.tilt,
                  )) + "°",
                ),
                $List$Empty$const,
              ),
            ),
            listPrepend(
              $html.button(
                listPrepend(
                  $attr.class$("icon-btn"),
                  listPrepend(
                    $attr.attribute("title", "Reset the view"),
                    listPrepend(
                      $event.on_click(Msg$ResetView$const),
                      $List$Empty$const,
                    ),
                  ),
                ),
                listPrepend($html.text("⟲"), $List$Empty$const),
              ),
              $List$Empty$const,
            ),
          ),
        ),
      ),
    );
  } else {
    return $html.div(
      listPrepend($attr.class$("camera-control"), $List$Empty$const),
      listPrepend(
        switch$,
        listPrepend(
          view_slider(
            "camera",
            "camera-slider",
            0,
            359,
            1,
            model.camera,
            $int.to_string(model.camera) + "°",
            (var0) => { return new SetCamera(var0); },
          ),
          $List$Empty$const,
        ),
      ),
    );
  }
}

function view_drawing_menu(model) {
  let current = model.library.current;
  let drawing_options = $list.map(
    model.library.drawings,
    (drawing) => {
      return $html.option(
        listPrepend(
          $attr.value(drawing[0]),
          listPrepend($attr.selected(drawing[0] === current), $List$Empty$const),
        ),
        drawing[0],
      );
    },
  );
  let new_option = $html.option(
    listPrepend($attr.value(""), $List$Empty$const),
    "new drawing…",
  );
  let preset_group = $html.optgroup(
    listPrepend($attr.attribute("label", "presets"), $List$Empty$const),
    $list.map(
      $presets.all,
      (preset) => {
        return $html.option(
          listPrepend($attr.value(preset_prefix + preset[0]), $List$Empty$const),
          preset[0],
        );
      },
    ),
  );
  let select = $html.select(
    listPrepend(
      $attr.class$("drawing-select"),
      listPrepend(
        $attr.attribute("data-test-id", "drawing-select"),
        listPrepend(
          $attr.value(current),
          listPrepend(
            $event.on_change(
              (value) => {
                if (value === "") {
                  return Msg$NewDrawing$const;
                } else if (value.startsWith("preset:")) {
                  let preset = value.slice(7);
                  return new ChoosePreset(preset);
                } else {
                  let name = value;
                  return new OpenDrawing(name);
                }
              },
            ),
            $List$Empty$const,
          ),
        ),
      ),
    ),
    $list.append(
      drawing_options,
      listPrepend(new_option, listPrepend(preset_group, $List$Empty$const)),
    ),
  );
  return $keyed.element(
    "label",
    listPrepend($attr.class$("control"), $List$Empty$const),
    listPrepend([$int.to_string(model.menu_key), select], $List$Empty$const),
  );
}

function view_reveal_code(model) {
  let $ = model.code_open;
  if ($) {
    return $element.none();
  } else {
    return $html.button(
      listPrepend(
        $attr.class$("icon-btn reveal-code"),
        listPrepend(
          $attr.attribute("title", "Show code"),
          listPrepend($event.on_click(Msg$ToggleCode$const), $List$Empty$const),
        ),
      ),
      listPrepend($html.text("⟩"), $List$Empty$const),
    );
  }
}

function view_controls(model) {
  return $html.div(
    listPrepend($attr.class$("controls"), $List$Empty$const),
    listPrepend(
      view_reveal_code(model),
      listPrepend(
        view_drawing_menu(model),
        listPrepend(
          view_slider(
            "shape",
            "shape-slider",
            0,
            100,
            1,
            model.shape_slider,
            $int.to_string(model.shape_slider),
            (var0) => { return new SetShapeSlider(var0); },
          ),
          listPrepend(
            view_slider(
              "speed",
              "speed-slider",
              -200,
              200,
              10,
              model.speed,
              $float.to_string($int.to_float(model.speed) / 100.0) + "×",
              (var0) => { return new SetSpeed(var0); },
            ),
            listPrepend(view_camera(model), $List$Empty$const),
          ),
        ),
      ),
    ),
  );
}

function view_anim(model) {
  return $html.div(
    listPrepend($attr.class$("anim-col"), $List$Empty$const),
    listPrepend(
      view_controls(model),
      listPrepend(
        view_settings(model),
        listPrepend(
          $html.div(
            listPrepend($attr.class$("canvas-area"), freehand_attributes(model)),
            listPrepend(
              $html.canvas(
                listPrepend(
                  $attr.id("animation-canvas"),
                  listPrepend($attr.class$("canvas"), $List$Empty$const),
                ),
              ),
              listPrepend(view_error(model), $List$Empty$const),
            ),
          ),
          $List$Empty$const,
        ),
      ),
    ),
  );
}

export function view(model) {
  let _block;
  let $ = model.code_open;
  if ($) {
    _block = "app";
  } else {
    _block = "app code-hidden";
  }
  let app_class = _block;
  return $html.div(
    listPrepend($attr.class$(app_class), $List$Empty$const),
    listPrepend(
      $html.div(
        listPrepend($attr.class$("code-col"), $List$Empty$const),
        listPrepend($editor.view_panel(Msg$ToggleCode$const), $List$Empty$const),
      ),
      listPrepend(view_anim(model), $List$Empty$const),
    ),
  );
}

export function main() {
  let app = $lustre.application(init, update, view);
  let $ = $lustre.start(app, "#app", undefined);
  if (!($ instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "app",
      703,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 23696,
        end: 23745,
        pattern_start: 23707,
        pattern_end: 23712
      }
    )
  }
  return undefined;
}
