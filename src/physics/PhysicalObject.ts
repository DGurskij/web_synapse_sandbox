import { IPoint } from '../math';
import { CircleShape } from '../../model/CircleShape';
import { IDrawable } from '../../render/IDrawable';
import { IDrawParams, IRenderer } from '../../render/IRenderer';

/**
 * Базовый класс физических объектов мира.
 * Имеет позицию, скорость, массу и форму (круг) для коллизий и отрисовки.
 */
export abstract class PhysicalObject implements IDrawable {
  protected _position: IPoint;
  protected _velocity: IPoint;
  protected _acceleration: IPoint;
  protected _mass: number;
  protected _radius: number;
  protected _shape: CircleShape;

  constructor(params: { position?: IPoint; mass?: number; radius?: number }) {
    this._position = params.position ?? { x: 0, y: 0 };
    this._velocity = { x: 0, y: 0 };
    this._acceleration = { x: 0, y: 0 };
    this._mass = params.mass ?? 1;
    this._radius = params.radius ?? 10;
    this._shape = new CircleShape(this._radius);
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

  draw(renderer: IRenderer, params: IDrawParams): void {
    this._shape.draw(renderer, {
      ...params,
      position: this._position,
    });
  }
}
