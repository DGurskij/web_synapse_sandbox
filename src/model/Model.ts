import { IDrawable } from 'src/render/IDrawable';
import { IDrawParams, IRenderer } from 'src/render/IRenderer';

export abstract class Model implements IDrawable {
  protected _vertices: number[];

  constructor(vertices: number[] = []) {
    this._vertices = vertices;
  }

  get vertices(): readonly Readonly<number>[] {
    return this._vertices;
  }

  abstract draw(renderer: IRenderer, params: IDrawParams): void;

  // /**
  //  * Calculate square of polygone model
  //  */
  // abstract square(): number;
}
