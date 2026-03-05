import { IPoint } from 'src/core/math';
import { CircleShape } from './CircleShape';
import { PolygonShape } from './PolygonShape';
import { RectangleShape } from './RectangleShape';

export type ShapeType = 'circle' | 'rectangle' | 'polygon';

export interface ICircleShapeParams {
  radius: number;
}

export interface IRectangleShapeParams {
  width: number;
  /**
   * if not provided, width will be used
   */
  height?: number;
}

export interface IPolygonShapeParams {
  vertices: IPoint[];
}

export type ShapeConfig =
  | { type: 'circle'; params: ICircleShapeParams }
  | { type: 'rectangle'; params: IRectangleShapeParams }
  | { type: 'polygon'; params: IPolygonShapeParams };

export class ShapeFactory {
  static createShape(config: ShapeConfig) {
    switch (config.type) {
      case 'circle':
        return new CircleShape(config.params.radius);

      case 'rectangle': {
        const { width, height } = config.params;
        return new RectangleShape(width, height ?? width);
      }

      case 'polygon': {
        return new PolygonShape(config.params.vertices);
      }
    }
  }
}
