import { ILimbConfig, IOrganismConfig, ISandboxStartSettings } from 'src/interfaces';
import { PhysicalObject } from 'src/core/physics/PhysicalObject';
import { Organism } from './organism/Organism';
import { IRenderer } from 'src/render/IRenderer';
import { Canvas2dRender } from 'src/render/Canvas2dRenderer';
import { PhysicalObject2d } from './physics/PhysicalObject2d';
import { Shape2dFactory } from 'src/shape/Shape2dFactory';
import { ICreateLimb } from './organism/Limb';

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

  timer: number = 0;

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

    if (config.organisms) {
      config.organisms.forEach(organism => this.spawnOrganism(organism));
    }

    this.timer = 0;

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
      this.timer += 1;
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
    const bodyPhysics = new PhysicalObject2d({
      position: config.body.position,
      mass: config.body.mass,
      model: Shape2dFactory.createShape(config.body.shapeCfg),
    });

    const limbs = config.limbs ? config.limbs.map(limb => this.createLimb(limb)) : [];

    // limbs[1].physics._angleVelocity = 0.03;
    // limbs[1].childLimbs![0]!.physics._angleVelocity = 0.06;

    const organism = new Organism({
      body: { physics: bodyPhysics, color: config.body.color },
      limbs,
      brain: config.brain,
    });

    this.organisms.push(organism);
  }

  private createLimb(config: ILimbConfig): ICreateLimb {
    const physics = new PhysicalObject2d({
      position: config.parentAttachmentPoint,
      mass: config.mass,
      model: Shape2dFactory.createShape(config.shapeCfg),
      angle: config.initialAngle,
    });

    const childLimbs = config.childLimbs?.map(childLimb => this.createLimb(childLimb));

    return { physics, selfAttachmentPoint: config.selfAttachmentPoint, childLimbs, color: config.color };
  }
}
