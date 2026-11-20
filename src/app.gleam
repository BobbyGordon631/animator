//// Animator -- an application for program-generated drawings.

import builtins
import data.{type Library}
import drawing
import editor
import errors
import gleam/dynamic/decode
import gleam/float
import gleam/int
import gleam/list
import gleam/option.{type Option, None, Some}
import gleam/result
import gleam/string
import lustre
import lustre/attribute as attr
import lustre/effect.{type Effect}
import lustre/element.{type Element}
import lustre/element/html
import lustre/element/keyed
import lustre/event
import parser
import presets
import projection
import render
import settings
import shape.{type Path}

/// Your app's public address, once you've deployed it in Problem 13, such as
/// "https://your-username.github.io/animator/".
pub const public_url = "https://kksolve.com/animator/"

/// Set to True if you would like your app's URL included in the course gallery.
pub const include_app_in_gallery = False

/// A link to your video from Problem 14, which anyone with the link can watch.
pub const video_url = ""

/// Set to True if you would like your video included in the course gallery.
pub const include_video_in_gallery = False

/// The stroke colour of every path drawn on the canvas.
const path_color = "#cfe3ff"

/// The prefix that marks a preset's value in the drawing menu.
const preset_prefix = "preset:"

/// The code a new drawing starts with.
const new_drawing_code =
  "fn draw(shape_slider: Int) -> List(Path) {\n  [Path(Line(Point(0, 0), Point(100, 100)), 0, 10, 2)]\n}\n"

// ── Model ──────────────────────────────────────────────────────────────────────

pub type Model {
  Model(
    // Every saved drawing, and which one is open in the editor.
    library: Library,
    // Bumped to rebuild the drawing menu, so that it shows the open drawing again
    // after the user picks "new drawing…" and then cancels.
    menu_key: Int,
    // Whether the code editor is shown.
    code_open: Bool,
    // The error message from the latest code, or "" if it ran successfully.
    error: String,
    // The value passed to draw, in [0, 100].
    shape_slider: Int,
    // The animation speed in hundredths of normal speed: 100 is normal, 0 is
    // paused, and negative values play backward.
    speed: Int,
    // The camera's angle around the vertical axis, in degrees from 0 to 359,
    // which 3D shapes are seen from.
    camera: Int,
    // How far the camera looks down, in degrees (negative looks up). Only
    // freehand viewing changes it; the camera slider uses the default.
    tilt: Int,
    // Whether the camera is turned by dragging the drawing (freehand) rather
    // than with the camera slider.
    freehand: Bool,
    // A freehand drag under way: where it started and the view at that moment.
    drag: Option(Drag),
    // The paths last drawn, so turning the camera can see them from the new
    // angle without running the code again.
    shown: List(Path),
  )
}

pub type Drag {
  Drag(x: Float, y: Float, camera: Int, tilt: Int)
}

pub type Msg {
  SetCode(String)
  SetShapeSlider(Int)
  SetSpeed(Int)
  SetCamera(Int)
  // Freehand viewing: the switch, a drag on the drawing, and resetting the view.
  SetFreehand(Bool)
  DragStart(x: Float, y: Float)
  DragMove(x: Float, y: Float)
  DragEnd
  ResetView

  // The drawing library
  RestoreLibrary(Library)
  OpenDrawing(String)
  NewDrawing
  NameNewDrawing(String)
  // A preset chosen from the menu, then the name the user gives its copy.
  ChoosePreset(String)
  NamePresetCopy(preset: String, name: String)
  // A settings slider for the setting declared on this line moved.
  SetSetting(line_number: Int, value: Int)

  // Layout controls
  ToggleCode
}

// ── Init ───────────────────────────────────────────────────────────────────────

pub fn init(_flags: Nil) -> #(Model, Effect(Msg)) {
  #(
    Model(
      library: data.default_library(),
      menu_key: 0,
      code_open: True,
      error: "",
      shape_slider: 10,
      speed: 100,
      camera: projection.default_camera,
      tilt: projection.default_tilt,
      freehand: False,
      drag: None,
      shown: [],
    ),
    // Restore the saved library (or start with the examples) and reopen the
    // drawing that was open last time.
    effect.from(fn(dispatch) { dispatch(RestoreLibrary(data.load())) }),
  )
}

// Parse and evaluate a draw function at the given shape-slider value, returning
// the rendered paths on success, or a human-readable message on failure.
fn run_source(shape_slider: Int, source: String) -> Result(List(Path), String) {
  case parser.parse_program(source, builtins.global_frame()) {
    Error(msg) -> Error(msg)
    Ok(program) ->
      drawing.try_draw(shape_slider, program)
      // Convert Error(EvalError) to Error(String) with a useful error message.
      |> result.map_error(errors.error_message)
  }
}

// ── Update ─────────────────────────────────────────────────────────────────────

pub fn update(model: Model, msg: Msg) -> #(Model, Effect(Msg)) {
  case msg {
    ToggleCode -> #(Model(..model, code_open: !model.code_open), effect.none())

    // After each keystroke in the editor, save the code, then redraw and
    // restart the animation.
    SetCode(text) ->
      case text == data.current_source(model.library) {
        // The editor reporting back an edit the app made itself (a settings
        // slider): already saved and drawn, so redrawing would only restart it.
        True -> #(model, effect.none())
        False -> {
          let library =
            data.set_source(model.library, model.library.current, text)
          let #(model, redrawn) = redraw(Model(..model, library: library), True)
          #(model, effect.batch([save(library), redrawn]))
        }
      }

    // Rewrite just that number in the code, save it, and redraw without
    // restarting. The editor is edited in place rather than remounted, so it
    // keeps its cursor and scroll position.
    SetSetting(line_number, value) -> {
      let source = data.current_source(model.library)
      case settings.set_value(source, line_number, value) {
        Ok(#(new_source, new_line)) if new_source != source -> {
          let library =
            data.set_source(model.library, model.library.current, new_source)
          let #(model, redrawn) =
            redraw(Model(..model, library: library), False)
          #(
            model,
            effect.batch([
              save(library),
              editor.replace_line(line_number, new_line),
              redrawn,
            ]),
          )
        }
        _ -> #(model, effect.none())
      }
    }

    ChoosePreset(preset) -> #(model, {
      use dispatch <- effect.from
      dispatch(NamePresetCopy(
        preset,
        data.prompt_drawing_name_suggesting(preset),
      ))
    })

    NamePresetCopy(preset, name) -> {
      // Rebuild the menu either way, so it never stays on the preset.
      let model = Model(..model, menu_key: model.menu_key + 1)
      case string.trim(name), list.key_find(presets.all, preset) {
        "", _ | "preset:" <> _, _ | _, Error(Nil) -> #(model, effect.none())
        name, Ok(source) -> {
          // Never overwrite a drawing: a taken name gets "-2", "-3", ...
          let name = data.unique_name(model.library, name)
          let library = data.set_source(model.library, name, source)
          open_drawing(Model(..model, library: library), name)
        }
      }
    }

    // Redraw at the new value without restarting, so a finished drawing
    // stays complete while the slider is dragged.
    SetShapeSlider(value) -> redraw(Model(..model, shape_slider: value), False)

    // Like the shape slider, turning the camera redraws without restarting.
    SetCamera(camera) -> turn(Model(..model, camera: camera))

    SetFreehand(on) -> {
      let model = Model(..model, freehand: on, drag: None)
      case on {
        True -> #(model, effect.none())
        // The slider only turns the camera, so go back to the default tilt.
        False -> turn(Model(..model, tilt: projection.default_tilt))
      }
    }

    DragStart(x, y) ->
      case model.freehand {
        True -> #(
          Model(..model, drag: Some(Drag(x, y, model.camera, model.tilt))),
          effect.none(),
        )
        False -> #(model, effect.none())
      }

    // Two pixels of drag turn the view a degree. Dragging sideways turns the
    // drawing the way the pointer moves; dragging down tips its top toward you.
    DragMove(x, y) ->
      case model.drag {
        None -> #(model, effect.none())
        Some(drag) -> {
          let camera =
            { drag.camera - float.round({ x -. drag.x } /. 2.0) } % 360
          let camera = { camera + 360 } % 360
          let tilt =
            int.clamp(
              drag.tilt + float.round({ y -. drag.y } /. 2.0),
              0 - projection.max_tilt,
              projection.max_tilt,
            )
          case camera == model.camera && tilt == model.tilt {
            True -> #(model, effect.none())
            False -> turn(Model(..model, camera: camera, tilt: tilt))
          }
        }
      }

    DragEnd -> #(Model(..model, drag: None), effect.none())

    ResetView ->
      turn(
        Model(
          ..model,
          camera: projection.default_camera,
          tilt: projection.default_tilt,
        ),
      )

    SetSpeed(speed) -> #(Model(..model, speed: speed), {
      use _dispatch <- effect.from
      render.set_speed(int.to_float(speed) /. 100.0)
    })

    RestoreLibrary(library) ->
      open_drawing(Model(..model, library: library), library.current)

    OpenDrawing(name) -> open_drawing(model, name)

    // Ask for the new drawing's name. The prompt blocks, so it runs as an
    // effect rather than inside update.
    NewDrawing -> #(model, {
      use dispatch <- effect.from
      dispatch(NameNewDrawing(data.prompt_drawing_name()))
    })

    NameNewDrawing(name) -> {
      // Rebuild the menu either way, so it never stays on "new drawing…".
      let model = Model(..model, menu_key: model.menu_key + 1)
      case string.trim(name) {
        // Cancelled: stay on the open drawing.
        "" -> #(model, effect.none())
        // Reserved for the menu's presets (see view_drawing_menu).
        "preset:" <> _ -> #(model, effect.none())
        name ->
          case data.source_of(model.library, name) {
            // That name is taken: open the existing drawing, not a blank copy.
            Ok(_) -> open_drawing(model, name)
            Error(Nil) -> {
              let library =
                data.set_source(model.library, name, new_drawing_code)
              open_drawing(Model(..model, library: library), name)
            }
          }
      }
    }
  }
}

// Open the named drawing: remember it as the open one, show its code in the
// editor, and animate it from the start. If its code doesn't work, show the
// error and draw nothing.
fn open_drawing(model: Model, name: String) -> #(Model, Effect(Msg)) {
  let library = data.open(model.library, name)
  let source = data.current_source(library)
  let model = Model(..model, library: library)
  let #(model, drawn) = case run_source(model.shape_slider, source) {
    Ok(paths) -> show(Model(..model, error: ""), paths, True)
    Error(msg) -> show(Model(..model, error: msg), [], True)
  }
  #(model, effect.batch([save(library), editor.mount(source, SetCode), drawn]))
}

// Write the library to localStorage.
fn save(library: Library) -> Effect(Msg) {
  use _dispatch <- effect.from
  data.save(library)
}

// Evaluate the model's code at its shape-slider value. On success, replace the
// canvas drawing (from the start if `restart`); on failure, keep the last
// drawing and show the error.
fn redraw(model: Model, restart: Bool) -> #(Model, Effect(Msg)) {
  case run_source(model.shape_slider, data.current_source(model.library)) {
    Ok(paths) -> show(Model(..model, error: ""), paths, restart)
    Error(msg) -> #(Model(..model, error: msg), effect.none())
  }
}

// Draw these paths (remembering them for turning the camera later), restarting
// the animation from the beginning if `restart`.
fn show(
  model: Model,
  paths: List(Path),
  restart: Bool,
) -> #(Model, Effect(Msg)) {
  #(
    Model(..model, shown: paths),
    animate(paths, restart, model.camera, model.tilt),
  )
}

// See the drawing from the model's camera, without running its code again or
// restarting it, so a finished drawing stays finished while it turns.
fn turn(model: Model) -> #(Model, Effect(Msg)) {
  #(model, animate(model.shown, False, model.camera, model.tilt))
}

// Replace the canvas drawing with these paths, seeing 3D shapes from the camera
// angle and tilt, and restart its animation from the beginning if `restart`.
fn animate(
  paths: List(Path),
  restart: Bool,
  camera: Int,
  tilt: Int,
) -> Effect(Msg) {
  use _dispatch <- effect.from
  paths
  |> list.flat_map(render.render_view(
    _,
    path_color,
    int.to_float(camera),
    int.to_float(tilt),
  ))
  |> render.set_drawing
  case restart {
    True -> render.reset_clock()
    False -> Nil
  }
}

// ── View ──────────────────────────────────────────────────────────────────
//
// Two side-by-side panes: the code editor on the left and its rendered output on
// the right. The code column can be hidden to expand the right pane.

pub fn view(model: Model) -> Element(Msg) {
  let app_class = case model.code_open {
    True -> "app"
    False -> "app code-hidden"
  }
  // The code column still exists even when hidden (CSS collapses it) so the
  // mounted CodeMirror editor keeps its state across show/hide.
  html.div([attr.class(app_class)], [
    html.div([attr.class("code-col")], [
      editor.view_panel(ToggleCode),
    ]),
    view_anim(model),
  ])
}

// The right pane: a bar of sliders and, if the drawing has settings, a bar of
// their sliders, above the animation.
fn view_anim(model: Model) -> Element(Msg) {
  html.div([attr.class("anim-col")], [
    view_controls(model),
    view_settings(model),
    html.div([attr.class("canvas-area"), ..freehand_attributes(model)], [
      html.canvas([attr.id("animation-canvas"), attr.class("canvas")]),
      view_error(model),
    ]),
  ])
}

fn view_controls(model: Model) -> Element(Msg) {
  html.div([attr.class("controls")], [
    view_reveal_code(model),
    view_drawing_menu(model),
    view_slider(
      label: "shape",
      test_id: "shape-slider",
      min: 0,
      max: 100,
      step: 1,
      value: model.shape_slider,
      shown: int.to_string(model.shape_slider),
      on_change: SetShapeSlider,
    ),
    view_slider(
      label: "speed",
      test_id: "speed-slider",
      min: -200,
      max: 200,
      step: 10,
      value: model.speed,
      shown: float.to_string(int.to_float(model.speed) /. 100.0) <> "×",
      on_change: SetSpeed,
    ),
    view_camera(model),
  ])
}

// How the camera is turned: a switch between the camera slider and freehand
// viewing, then the slider, or (freehand) the current view and a reset button.
fn view_camera(model: Model) -> Element(Msg) {
  let switch =
    html.button(
      [
        attr.class(case model.freehand {
          True -> "switch on"
          False -> "switch"
        }),
        attr.attribute("role", "switch"),
        attr.attribute("aria-checked", case model.freehand {
          True -> "true"
          False -> "false"
        }),
        attr.attribute("data-test-id", "camera-mode"),
        attr.attribute(
          "title",
          "Turn 3D drawings with the slider, or by dragging",
        ),
        event.on_click(SetFreehand(!model.freehand)),
      ],
      [
        html.span([attr.class("switch-label slider-label")], [
          html.text("slider"),
        ]),
        html.span([attr.class("switch-track")], [
          html.span([attr.class("switch-knob")], []),
        ]),
        html.span([attr.class("switch-label freehand-label")], [
          html.text("freehand"),
        ]),
      ],
    )
  case model.freehand {
    False ->
      html.div([attr.class("camera-control")], [
        switch,
        view_slider(
          label: "camera",
          test_id: "camera-slider",
          min: 0,
          max: 359,
          step: 1,
          value: model.camera,
          shown: int.to_string(model.camera) <> "°",
          on_change: SetCamera,
        ),
      ])
    True ->
      html.div([attr.class("camera-control")], [
        switch,
        html.span([attr.class("control-label")], [html.text("drag the drawing")]),
        html.span([attr.class("control-value view-readout")], [
          html.text(
            int.to_string(model.camera)
            <> "° · tilt "
            <> int.to_string(model.tilt)
            <> "°",
          ),
        ]),
        html.button(
          [
            attr.class("icon-btn"),
            attr.attribute("title", "Reset the view"),
            event.on_click(ResetView),
          ],
          [html.text("⟲")],
        ),
      ])
  }
}

// In freehand viewing, the animation area takes drags: pressing starts one,
// moving turns the view (at most about 60 times a second, and only while
// dragging), and letting go or leaving the area ends it.
fn freehand_attributes(model: Model) -> List(attr.Attribute(Msg)) {
  case model.freehand, model.drag {
    False, _ -> []
    True, drag -> {
      let pointer = fn(to_msg) {
        use x <- decode.field("clientX", decode.float)
        use y <- decode.field("clientY", decode.float)
        decode.success(to_msg(x, y))
      }
      let end = [
        event.on("pointerup", decode.success(DragEnd)),
        event.on("pointerleave", decode.success(DragEnd)),
        event.on("pointercancel", decode.success(DragEnd)),
      ]
      case drag {
        None -> [
          attr.class("freehand"),
          event.on("pointerdown", pointer(DragStart)) |> event.prevent_default,
        ]
        Some(_) -> [
          attr.class("freehand dragging"),
          event.on("pointermove", pointer(DragMove)) |> event.throttle(16),
          ..end
        ]
      }
    }
  }
}

// One slider per setting declared in the open drawing's code (see settings.gleam),
// or nothing if it declares none. Typing in the editor re-parses them, so the
// sliders follow the code.
fn view_settings(model: Model) -> Element(Msg) {
  case settings.parse(data.current_source(model.library)) {
    [] -> element.none()
    found ->
      // Each slider is keyed by its drawing, line, name, and range, so a
      // slider for a different setting is built fresh rather than patched:
      // patching one could set its value while the old range still applies,
      // and the browser would clamp the value to that range.
      keyed.div([attr.class("settings-bar")], [
        #(
          "title",
          html.span([attr.class("settings-title")], [html.text("settings")]),
        ),
        ..list.map(found, fn(setting) {
          #(
            string.join(
              [
                model.library.current,
                int.to_string(setting.line_number),
                setting.name,
                int.to_string(setting.min),
                int.to_string(setting.max),
              ],
              "/",
            ),
            view_slider(
              label: setting.name,
              test_id: "setting-" <> setting.name,
              min: setting.min,
              max: setting.max,
              step: 1,
              value: setting.value,
              shown: int.to_string(setting.value),
              on_change: SetSetting(setting.line_number, _),
            ),
          )
        })
      ])
  }
}

// The menu of saved drawings, ending with an option to create a new one. It's
// keyed on menu_key so that bumping it replaces the <select> outright, resetting
// what it shows to the open drawing.
fn view_drawing_menu(model: Model) -> Element(Msg) {
  let current = model.library.current
  let drawing_options =
    list.map(model.library.drawings, fn(drawing) {
      html.option(
        [attr.value(drawing.0), attr.selected(drawing.0 == current)],
        drawing.0,
      )
    })
  // Drawing names are never empty, so "" can mark the new-drawing option.
  let new_option = html.option([attr.value("")], "new drawing…")
  // Presets are copied into the library under a name the user picks. Their
  // values carry a prefix, which new names can't start with, so they never
  // collide with a drawing's name.
  let preset_group =
    html.optgroup(
      [attr.attribute("label", "presets")],
      list.map(presets.all, fn(preset) {
        html.option([attr.value(preset_prefix <> preset.0)], preset.0)
      }),
    )
  let select =
    html.select(
      [
        attr.class("drawing-select"),
        attr.attribute("data-test-id", "drawing-select"),
        attr.value(current),
        event.on_change(fn(value) {
          case value {
            "" -> NewDrawing
            "preset:" <> preset -> ChoosePreset(preset)
            name -> OpenDrawing(name)
          }
        }),
      ],
      list.append(drawing_options, [new_option, preset_group]),
    )
  keyed.element("label", [attr.class("control")], [
    #(int.to_string(model.menu_key), select),
  ])
}

// A labelled integer range slider, with its current value shown beside it.
fn view_slider(
  label label: String,
  test_id test_id: String,
  min min: Int,
  max max: Int,
  step step: Int,
  value value: Int,
  shown shown: String,
  on_change on_change: fn(Int) -> Msg,
) -> Element(Msg) {
  html.label([attr.class("control")], [
    html.span([attr.class("control-label")], [html.text(label)]),
    html.input([
      attr.type_("range"),
      attr.attribute("data-test-id", test_id),
      attr.min(int.to_string(min)),
      attr.max(int.to_string(max)),
      attr.step(int.to_string(step)),
      attr.value(int.to_string(value)),
      event.on_input(fn(text) {
        on_change(int.parse(text) |> result.unwrap(value))
      }),
    ]),
    html.span([attr.class("control-value")], [html.text(shown)]),
  ])
}

// The latest code's error, overlaid on the bottom of the animation pane.
fn view_error(model: Model) -> Element(Msg) {
  case model.error {
    "" -> element.none()
    msg -> html.pre([attr.class("output error")], [html.text(msg)])
  }
}

// The button that brings the code column back, at the start of the slider bar.
// Nothing is rendered while the column is already showing (its own
// header holds the button that hides it).
fn view_reveal_code(model: Model) -> Element(Msg) {
  case model.code_open {
    True -> element.none()
    False ->
      html.button(
        [
          attr.class("icon-btn reveal-code"),
          attr.attribute("title", "Show code"),
          event.on_click(ToggleCode),
        ],
        [html.text("⟩")],
      )
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────

pub fn main() -> Nil {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", Nil)
  Nil
}
