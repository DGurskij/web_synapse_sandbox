import { IMuscleConfig } from 'src/interfaces';
import { IPoint } from '../math';

export class Muscle {
  private _strength: number;

  private _endurance: number;
  private _maxEndurance: number;
  private _enduranceRestoreKf: number;

  private _direction: IPoint;

  constructor(config: IMuscleConfig) {
    this._strength = config.strength ?? 0;
    this._endurance = config.endurance ?? 0;
    this._maxEndurance = config.maxEndurance ?? 0;
    this._enduranceRestoreKf = config.enduranceRestoreKf ?? 0;

    this._direction = config.direction ?? { x: 0, y: 0 };
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
