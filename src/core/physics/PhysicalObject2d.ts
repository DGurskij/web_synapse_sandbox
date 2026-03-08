import { PhysicalObject } from './PhysicalObject';
import { IPoint2d } from '../math';
import { Model } from 'src/model/Model';

export interface ICreatePhysicalObject2d {
  position: IPoint2d;
  mass: number;
  model: Model;
  angle?: number;
}

/**
 * Implement 2d physical object.
 */
export class PhysicalObject2d extends PhysicalObject {
  constructor(params: ICreatePhysicalObject2d) {
    super({
      position: { x: params.position.x, y: params.position.y, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      acceleration: { x: 0, y: 0, z: 0 },
      mass: params.mass,
      model: params.model,
      angle: params.angle,
    });
  }

  checkCollision(other: PhysicalObject) {
    // TODO: implement collision detection for 2d
    return false;
  }

  applyForce(force: number[]) {
    if (this._mass > 0) {
      this._acceleration.x += force[0] / this._mass;
      this._acceleration.y += force[1] / this._mass;
    }
  }

  translatePosition(delta: number[]) {
    this._position.x += delta[0];
    this._position.y += delta[1];
  }

  update() {
    // update angle by velocity
    this._angle += this._angleVelocity;

    // update velocity by acceleration
    this._velocity.x += this._acceleration.x;
    this._velocity.y += this._acceleration.y;

    // update position by velocity
    this._position.x += this._velocity.x;
    this._position.y += this._velocity.y;

    // apply friction, TODO: make it outside of the class
    this._velocity.x *= 0.98;
    this._velocity.y *= 0.98;

    this._acceleration.x = 0;
    this._acceleration.y = 0;
  }
}
