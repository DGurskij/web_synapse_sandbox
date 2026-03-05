import { IDrawParams, IRenderer } from 'src/render/IRenderer';
import { Shape } from './Shape';

export class RectangleShape extends Shape {
  private _width: number;
  private _height: number;

  constructor(width: number, height?: number) {
    super();

    this._width = width;
    this._height = height || width;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  draw(renderer: IRenderer, params: IDrawParams) {
    renderer.drawRectangle(this, params);
  }
}
