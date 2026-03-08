import { IPoint2d } from 'src/core/math';
import { Polygon2dModel } from 'src/model/Polygon2dModel';

export interface IDrawParams {
  /**
   * default is { x: 0, y: 0 }
   */
  position?: IPoint2d;
  /**
   * default is black
   */
  color?: string;
  /**
   * Rotation in radians (around position)
   */
  rotation?: number;
}

export interface IRenderer {
  drawPolygon2d(polygon: Polygon2dModel, params: IDrawParams): void;
}
