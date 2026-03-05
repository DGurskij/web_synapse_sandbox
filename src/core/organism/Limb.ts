import { ILimbConfig } from 'src/interfaces';
import { IPoint, clamp } from '../math';
import { Muscle } from './Muscle';
import { ShapeFactory } from 'src/model/ShapeFactory';
import { Shape } from 'src/model/Shape';
import { RectangleShape } from 'src/model/RectangleShape';

export class Limb {
  private _shape: Shape;
  private _attachmentPoint: IPoint;
  private _parentIndex: number;

  private _offset: IPoint;
  private _mass: number;

  private _attachmentAngle: number;
  private _maxAngleDispersion: [number, number];

  private _angle: number;
  private _angularVelocity: number;
  private _angularAcceleration: number;
  private _muscles: Muscle[];

  constructor(config: ILimbConfig) {
    this._shape = ShapeFactory.createShape(config.shapeCfg ?? { type: 'rectangle', params: { width: 0, height: 0 } });
    this._attachmentPoint = config.attachmentPoint ?? { x: 0, y: 0 };
    this._parentIndex = config.parentIndex ?? -1;

    this._offset = config.offset ?? { x: 0, y: 0 };

    this._mass = config.mass ?? 0.5;
    this._maxAngleDispersion = config.maxAngleDispersion ?? [0.1, 0.1];
    this._attachmentAngle = config.attachmentAngle ?? 0;

    this._angle = 0;
    this._angularVelocity = 0;
    this._angularAcceleration = 0;
    this._muscles = config.muscles?.map(m => new Muscle(m)) ?? [];
  }

  get attachmentPoint(): IPoint {
    return this._attachmentPoint;
  }

  get parentIndex(): number {
    return this._parentIndex;
  }

  get angle(): number {
    return this._attachmentAngle + this._angle;
  }

  /** Offset from attachment to rect origin in limb-local coords (for rotation pivot) */
  get offset(): IPoint {
    return this._offset;
  }

  get mass(): number {
    return this._mass;
  }

  get shape(): Shape {
    return this._shape;
  }

  addMuscle(muscle: Muscle) {
    this._muscles.push(muscle);
  }

  addTorqueFromChild(torque: number) {
    if (this._shape instanceof RectangleShape && this._mass > 0) {
      const I = (1 / 3) * this._mass * this._shape.width * this._shape.width;
      this._angularAcceleration += torque / I;
    }
  }

  update() {
    for (const muscle of this._muscles) {
      muscle.update();
    }

    this._angularVelocity += this._angularAcceleration;
    // this._angularVelocity *= 0.92;

    this._angle += this._angularVelocity;
    this._angle = clamp(this._angle, -this._maxAngleDispersion[0], this._maxAngleDispersion[1]);
    this._angularAcceleration = 0;
  }

  interactWithWorld(): [number, number] {
    let fx = 0;
    let fy = 0;

    for (const muscle of this._muscles) {
      if (Math.random() > 0.9) {
        const [forceX, forceY] = muscle.contraction(Math.random());
        // const [forceX, forceY] = muscle.contraction(1);
        fx += forceX;
        fy += forceY;
      }
    }

    if (this._shape instanceof RectangleShape && this._mass > 0) {
      const leverArm = this._shape.width / 2;
      const torque = leverArm * fy;
      const I = (1 / 3) * this._mass * this._shape.width * this._shape.width;

      const atLimitAndPushingOut =
        (this._angle >= this._maxAngleDispersion[0] - 1e-6 && torque > 0) ||
        (this._angle <= -this._maxAngleDispersion[1] + 1e-6 && torque < 0);

      if (atLimitAndPushingOut) {
        return [0, 0];
      }

      this._angularAcceleration = torque / I;
    }

    return [fx, fy];
  }
}
