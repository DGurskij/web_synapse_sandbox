import { IDrawParams, IRenderer } from 'src/render/IRenderer';
import { Shape } from './Shape';
import { IPoint } from 'src/core/math';

export class PolygonShape extends Shape {
  private _vertices: IPoint[];

  constructor(vertices: IPoint[]) {
    super();

    this._vertices = vertices;
  }

  get vertices(): IPoint[] {
    return this._vertices;
  }

  draw(renderer: IRenderer, params: IDrawParams) {
    renderer.drawPolygon(this, params);
  }
}
