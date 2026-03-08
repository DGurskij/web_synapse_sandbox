import { IPoint3d } from '../math';

export interface ICreateMuscle {
  strength?: number;
  endurance?: number;
  maxEndurance?: number;
  enduranceRestoreKf?: number;
  direction?: IPoint3d;
}

export class Muscle {
  private _strength: number;

  private _endurance: number;
  private _maxEndurance: number;
  private _enduranceRestoreKf: number;

  private _direction: IPoint3d;

  constructor(config: ICreateMuscle) {
    this._strength = config.strength ?? 0;
    this._endurance = config.endurance ?? 0;
    this._maxEndurance = config.maxEndurance ?? 0;
    this._enduranceRestoreKf = config.enduranceRestoreKf ?? 0;

    this._direction = { x: config.direction?.x ?? 0, y: config.direction?.y ?? 0, z: 0 };
  }

  update() {
    this._endurance = Math.min(this._endurance + this._enduranceRestoreKf, this._maxEndurance);
  }

  contraction(impulse: number) {
    const possibleForce = Math.min(impulse * this._strength, this._endurance);

    this._endurance -= possibleForce;

    return [this._direction.x * possibleForce, this._direction.y * possibleForce];
  }
}
