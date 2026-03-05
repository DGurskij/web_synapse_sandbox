import { IPoint } from '../math';
import { Shape } from 'src/model/Shape';
import { IPhysicalObjectConfig } from './structure';

/**
 * Базовый класс физических объектов мира.
 * Имеет позицию, скорость, массу и форму (круг) для коллизий и отрисовки.
 */
export abstract class PhysicalObject {
  protected _position: IPoint;
  protected _velocity: IPoint;
  protected _acceleration: IPoint;
  protected _mass: number;
  protected _radius: number;
  protected _shape: Shape | undefined;

  constructor(params: IPhysicalObjectConfig) {
    this._position = params.position ?? { x: 0, y: 0 };
    this._velocity = { x: 0, y: 0 };
    this._acceleration = { x: 0, y: 0 };
    this._mass = params.mass ?? 1;
    this._radius = params.radius ?? 10;
  }

  get position(): IPoint {
    return this._position;
  }

  get velocity(): IPoint {
    return this._velocity;
  }

  get mass(): number {
    return this._mass;
  }

  get radius(): number {
    return this._radius;
  }

  get shape(): Shape | undefined {
    return this._shape;
  }

  applyImpulse(fx: number, fy: number) {
    if (this._mass > 0) {
      this._velocity.x += fx / this._mass;
      this._velocity.y += fy / this._mass;
    }
  }

  translatePosition(dx: number, dy: number) {
    this._position.x += dx;
    this._position.y += dy;
  }

  update() {
    this._velocity.x += this._acceleration.x;
    this._velocity.y += this._acceleration.y;
    this._position.x += this._velocity.x;
    this._position.y += this._velocity.y;

    this._velocity.x *= 0.98;
    this._velocity.y *= 0.98;

    this._acceleration = { x: 0, y: 0 };
  }
}
