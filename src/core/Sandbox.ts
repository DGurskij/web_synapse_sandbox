import { IOrganismConfig, ISandboxStartSettings } from 'src/interfaces';
import { PhysicalObject, Stone } from 'src/core/physics';
import { Organism } from './organism/Organism';
import { IRenderer } from 'src/render/IRenderer';
import { Canvas2dRender } from 'src/render/Canvas2dRenderer';
import { IStoneConfig } from './physics/structure';

export class Sandbox {
  renderer: IRenderer;

  engineFPS: number = 60;
  frameTime: number = 0;
  lastTime: number = 0;
  bindedLoop: () => void;

  /** Sandbox state: 0 - not started, 1 - started, 2 - paused */
  state: 0 | 1 | 2 = 0;

  /** Camera position X */
  cameraX = 0;
  /** Camera position Y */
  cameraY = 0;

  /** Sandbox scale */
  scale = 1;

  areaWidth = 0;
  areaHeight = 0;

  halfW = 0;
  halfH = 0;

  mouseDown = 0;
  mouseDownX = 0;
  mouseDownY = 0;

  engineFunction: (...args: any[]) => void;
  drawFunction: (...args: any[]) => void;
  onStopped: () => void | Promise<void>;
  onPlayPause: (state: 0 | 1) => void;

  context: CanvasRenderingContext2D;

  organisms: Organism[] = [];
  physicalObjects: PhysicalObject[] = [];

  constructor(ctx: CanvasRenderingContext2D) {
    this.context = ctx;

    this.engineFunction = () => {};
    this.drawFunction = () => {};
    this.onStopped = () => {};
    this.onPlayPause = () => {};

    this.bindedLoop = this.loop.bind(this);

    this.renderer = new Canvas2dRender(ctx);
  }

  start(config: ISandboxStartSettings = {}) {
    console.log('start', config);

    this.state = 1;
    this.scale = 1;

    this.cameraX = 0;
    this.cameraY = 0;

    this.lastTime = performance.now();
    this.frameTime = 1000 / this.engineFPS;

    console.log('spawn organisms');

    this.organisms = config.organisms?.map(organism => new Organism(organism)) || [];
    this.physicalObjects = config.stones?.map(c => new Stone(c)) || config.physicalObjects?.map(c => new Stone(c)) || [];

    this.loop();
  }

  private loop() {
    if (this.state !== 1) {
      return;
    }

    const now = performance.now();
    const delta = now - this.lastTime;

    if (delta >= this.frameTime) {
      this.lastTime = now;

      // const t1 = performance.now();
      this.engineFunction();
      // const t2 = performance.now();
      this.drawFunction();
      // const t3 = performance.now();

      // drawTimeSum += t3 - t2;
      // frameCount++;
    }

    setTimeout(this.bindedLoop, 1);

    // const t1 = performance.now();

    // this.engineFunction();
    // const t2 = performance.now();
    // this.drawFunction();

    // const t3 = performance.now();

    // console.log('engine', t2 - t1, 'draw', t3 - t2);
  }

  stop() {
    this.state = 0;

    this.onStopped();
  }

  pause(send = false) {
    this.state = 2;

    if (send) {
      this.onPlayPause(0);
    }
  }

  resume(send = false) {
    this.state = 1;
    this.loop();

    if (send) {
      this.onPlayPause(1);
    }
  }

  /**
   * Move camera
   */
  locationChange(x: number, y: number) {
    this.cameraX += (x - this.mouseDownX) / this.scale;
    this.cameraY += (y - this.mouseDownY) / this.scale;

    this.mouseDownX = x;
    this.mouseDownY = y;

    if (this.state == 2) {
      this.drawFunction();
    }
  }

  spawnOrganism(config: IOrganismConfig) {
    const organism = new Organism(config);
    this.organisms.push(organism);
  }

  spawnStone(config: IStoneConfig) {
    const stone = new Stone(config);
    this.physicalObjects.push(stone);
  }
}
