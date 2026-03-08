import { IPoint2d } from '../math';
import { Model } from 'src/model/Model';
import { PhysicalObject } from '../physics/PhysicalObject';
import { ICreateMuscle, Muscle } from './Muscle';

export interface ICreateLimb {
  physics: PhysicalObject;
  selfAttachmentPoint?: IPoint2d;
  childLimbs?: ICreateLimb[];
  color: string;
  muscles?: ICreateMuscle[];
}

export class Limb {
  private _physics: PhysicalObject;

  private _color: string;

  private _selfAttachmentPoint: IPoint2d;
  private _childLimbs: Limb[];

  private _muscles: Muscle[];

  constructor(config: ICreateLimb) {
    this._physics = config.physics;
    this._selfAttachmentPoint = config.selfAttachmentPoint ?? { x: 0, y: 0 };
    this._childLimbs = config.childLimbs?.map(childLimb => new Limb(childLimb)) ?? [];
    this._color = config.color;

    this._muscles = config.muscles?.map(muscle => new Muscle(muscle)) ?? [];
  }

  get model(): Model {
    return this._physics.model;
  }

  get physics(): PhysicalObject {
    return this._physics;
  }

  get mass() {
    return this._physics.mass;
  }

  get selfAttachmentPoint(): IPoint2d {
    return this._selfAttachmentPoint;
  }

  get childLimbs(): readonly Limb[] {
    return this._childLimbs;
  }

  get color(): string {
    return this._color;
  }

  get muscles(): readonly Muscle[] {
    return this._muscles;
  }

  update() {
    for (const muscle of this._muscles) {
      muscle.update();
    }

    this._childLimbs.forEach(childLimb => childLimb.update());

    this._physics.update();
  }
}
