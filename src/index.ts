import { drawScene } from './core/graphics/Canvas2dDraw';
import { sandboxEngine } from './core/EngineFunctions';
import { Sandbox } from './core/Sandbox';
import { keyPressHdl, mouseDownHdl, mouseMoveHdl, mouseUpHdl, mouseWheelHdl, setAreaSize } from './core/Controller';
import { ISandboxConfig, ISandboxStartSettings } from './interfaces';

let sandbox: Sandbox;

let destroyFn: () => void;

/**
 * Init WebGL, Handlers, Create Game instance
 */
export async function initSandbox(igc: ISandboxConfig) {
  const canvas = igc.canvasElement;

  const ctx = canvas.getContext('2d', { alpha: false });

  if (!ctx) {
    alert(`Browser doesn't support 2d.`);
    return;
  }

  sandbox = new Sandbox(ctx);

  sandbox.engineFunction = sandboxEngine.bind(sandbox);
  sandbox.drawFunction = drawScene.bind(sandbox);

  const mouseMoveHdlBind = mouseMoveHdl.bind(sandbox);
  const mouseDownHdlBind = mouseDownHdl.bind(sandbox);

  canvas.addEventListener('mousemove', mouseMoveHdlBind);
  canvas.addEventListener('mousedown', mouseDownHdlBind);

  const mouseUpHdlBind = mouseUpHdl.bind(sandbox);
  const mouseWheelHdlBind = mouseWheelHdl.bind(sandbox);

  window.addEventListener('mouseup', mouseUpHdlBind);
  window.addEventListener('wheel', mouseWheelHdlBind);

  const keyPressHdlBind = keyPressHdl.bind(sandbox);

  document.body.addEventListener('keydown', keyPressHdlBind);

  destroyFn = () => {
    canvas.removeEventListener('mousemove', mouseMoveHdlBind);
    canvas.removeEventListener('mousedown', mouseDownHdlBind);

    window.removeEventListener('mouseup', mouseUpHdlBind);
    window.removeEventListener('wheel', mouseWheelHdlBind);

    document.body.removeEventListener('keydown', keyPressHdlBind);
  };
}

/**
 * External API
 */
export function destroySandbox() {
  sandbox.stop();
  destroyFn();

  (sandbox as any) = null;
}

/**
 * External API
 */
export function startSandbox(config: ISandboxStartSettings) {
  sandbox.start(config);
}

/**
 * External API
 */
export function playSandbox() {
  if (sandbox.state === 2) {
    sandbox.resume();
  } else if (sandbox.state === 1) {
    sandbox.pause();
  }
}

export function stopGame() {
  sandbox.stop();
}

export function setAreaSizeFn(width: number, height: number) {
  setAreaSize(sandbox, width, height);
}

/**
 * @param cb this callback will call when user stop game and we need hide/remove canvas and show/route
 */
export function setStoppedCb(cb: () => void | Promise<void>) {
  sandbox.onStopped = cb;
}

/**
 * @param cb - 0 - paused, 1 - runned
 */
export function setPauseResumeCb(cb: (state: 0 | 1) => void) {
  sandbox.onPlayPause = cb;
}
