import { IDrawParams, IRenderer } from 'src/render/IRenderer';
import { Shape } from './Shape';

export class CircleShape extends Shape {
  private _radius: number;

  constructor(radius: number) {
    super();

    this._radius = radius;
  }

  get radius(): number {
    return this._radius;
  }

  draw(renderer: IRenderer, params: IDrawParams) {
    renderer.drawCircle(this, params);
  }
}
