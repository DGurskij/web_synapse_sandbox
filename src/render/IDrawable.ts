import { IDrawParams, IRenderer } from './IRenderer';

export interface IDrawable {
  draw(renderer: IRenderer, params: IDrawParams): void;
}
