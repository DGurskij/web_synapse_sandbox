import { Model } from 'src/model/Model';
import { PhysicalObject } from '../physics/PhysicalObject';

export interface ICreateBody {
  physics: PhysicalObject;
  color: string;
}

/**
 * Core body of the organism
 */
export class Body {
  private _physics: PhysicalObject;

  private _color: string;

  constructor(config: ICreateBody) {
    this._physics = config.physics;
    this._color = config.color;
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

  get color(): string {
    return this._color;
  }

  update() {
    this._physics.update();
  }
}
