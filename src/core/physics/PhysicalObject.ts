import { Model } from 'src/model/Model';
import { IPoint3d } from '../math';

export interface IPhysicalObjectConfig {
  position: IPoint3d;
  velocity: IPoint3d;
  acceleration: IPoint3d;
  angle?: number;

  mass: number;
  model: Model;
}

/**
 * Base class for physical objects in the world.
 * Contain common properties, 2d or 3d must be implemented in the subclass.
 * TODO: add methods for collision detection and resolution.
 */
export abstract class PhysicalObject {
  protected _position: IPoint3d;
  protected _velocity: IPoint3d;
  protected _acceleration: IPoint3d;

  protected _angle: number;
  public _angleVelocity: number;

  protected _mass: number;

  /**
   * Model used for collision resolve, not RENDERING, for rendering use gettter
   */
  protected _model: Model;

  constructor(params: IPhysicalObjectConfig) {
    this._position = params.position;
    this._velocity = params.velocity;
    this._acceleration = params.acceleration;

    this._angle = params.angle ?? 0;
    this._angleVelocity = 0;

    this._mass = params.mass;
    this._model = params.model;
  }

  get model() {
    return this._model;
  }

  get x() {
    return this._position.x;
  }
  get y() {
    return this._position.y;
  }
  get z() {
    return this._position.z;
  }
  get position(): Readonly<IPoint3d> {
    return this._position;
  }

  get vx() {
    return this._velocity.x;
  }
  get vy() {
    return this._velocity.y;
  }
  get vz() {
    return this._velocity.z;
  }
  get velocity(): Readonly<IPoint3d> {
    return this._velocity;
  }

  get angle() {
    return this._angle;
  }

  get mass() {
    return this._mass;
  }

  abstract checkCollision(other: PhysicalObject): boolean;
  abstract applyForce(force: number[]): void;
  abstract translatePosition(delta: number[]): void;
  abstract update(): void;
}
