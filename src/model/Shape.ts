import { IDrawable } from 'src/render/IDrawable';
import { IDrawParams, IRenderer } from 'src/render/IRenderer';

export abstract class Shape implements IDrawable {
  constructor() {}

  abstract draw(renderer: IRenderer, params: IDrawParams): void;
}
