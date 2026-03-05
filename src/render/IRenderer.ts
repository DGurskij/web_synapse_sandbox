import { IPoint } from 'src/core/math';
import { CircleShape } from '../model/CircleShape';
import { RectangleShape } from '../model/RectangleShape';
import { PolygonShape } from 'src/model/PolygonShape';

export interface IDrawParams {
  /**
   * default is { x: 0, y: 0 }
   */
  position?: IPoint;
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
  drawCircle(circle: CircleShape, params: IDrawParams): void;
  drawRectangle(rectangle: RectangleShape, params: IDrawParams): void;
  drawPolygon(polygon: PolygonShape, params: IDrawParams): void;
}
