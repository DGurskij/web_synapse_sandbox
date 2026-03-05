import { Sandbox } from './Sandbox';

const MAX_SCALE = 2;
const MIN_SCALE = 0.6;

export function setAreaSize(sandbox: Sandbox, w: number, h: number) {
  sandbox.context.canvas.width = w;
  sandbox.context.canvas.height = h;

  sandbox.areaWidth = w;
  sandbox.areaHeight = h;

  sandbox.halfW = w / 2;
  sandbox.halfH = h / 2;

  // sandbox.ctx.viewport(0, 0, sandbox.ctx.canvas.width, sandbox.ctx.canvas.height);

  if (sandbox.state === 2) {
    sandbox.drawFunction();
  }
}

/* EVENT HANDLERS */

export function mouseMoveHdl(this: Sandbox, evt: MouseEvent) {
  const x = evt.offsetX;
  const y = evt.offsetY;

  if (this.mouseDown !== 1) {
    if (this.state === 1) {
      // this.searchStarInLocation(x, y);
    }
  } else if (this.state !== 0) {
    this.locationChange(x, y);
  }
}

export function mouseDownHdl(this: Sandbox, evt: MouseEvent) {
  if (evt.which === 1) {
    if (this.state !== 0) {
      this.mouseDown = 1;
      this.mouseDownX = evt.offsetX;
      this.mouseDownY = evt.offsetY;
    }
  }
}

export function mouseUpHdl(this: Sandbox, evt: MouseEvent) {
  if (evt.which === 1) {
    if (this.state !== 0) {
      this.mouseDown = 0;
    }
  }
}

export function mouseWheelHdl(this: Sandbox, evt: WheelEvent) {
  if (evt.deltaY !== 0) {
    let scale = this.scale - Math.sign(evt.deltaY) * 0.01;

    if (scale >= MAX_SCALE) {
      scale = MAX_SCALE;
    } else if (scale <= MIN_SCALE) {
      scale = MIN_SCALE;
    }

    // center affine transformation
    // const mousePosX = (evt.offsetX - this.halfW) / this.scale + this.cameraX;
    // const mousePosY = (evt.offsetY + this.halfH) / this.scale + this.cameraY;

    // const dx = this.cameraX - mousePosX;
    // const dy = this.cameraY - mousePosY;

    // const scaleMultiplier = this.scale / scale;

    // this.cameraX = mousePosX + dx * scaleMultiplier;
    // this.cameraY = mousePosY + dy * scaleMultiplier;

    this.scale = scale;

    if (this.state === 2) {
      this.drawFunction();
    }
  }
}

export function keyPressHdl(this: Sandbox, evt: KeyboardEvent) {
  keyEvent(this, evt.code);
}

const PAUSE_KEY = 'Space';
const STOP_KEY = 'Enter';

/**
 * Do event when key pressed
 */
var keyEvent = (sandbox: Sandbox, keyCode: string) => {
  switch (keyCode) {
    case PAUSE_KEY:
      if (sandbox.state === 1) {
        sandbox.pause(true);
      } else if (sandbox.state === 2) {
        sandbox.resume(true);
      }
      break;
    case STOP_KEY:
      if (sandbox.state === 0) {
        sandbox.start();
      } else {
        sandbox.stop();
      }
      break;
  }
};
