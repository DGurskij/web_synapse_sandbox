import { IPoint2d } from 'src/core/math';
import { Polygon2dModel } from '../model/Polygon2dModel';

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
  vertices: IPoint2d[];
}

export type Shape2dConfig =
  | { type: 'circle'; params: ICircleShapeParams }
  | { type: 'rectangle'; params: IRectangleShapeParams }
  | { type: 'polygon'; params: IPolygonShapeParams };

function createCircle(config: ICircleShapeParams) {
  const { radius } = config;
  const polygon = new Polygon2dModel();

  const segments = 360;
  const angleStep = (Math.PI * 2) / segments;

  for (let i = 0; i < segments; i++) {
    const angle = i * angleStep;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    polygon.addVertex({ x, y });
  }

  return polygon;
}

function createRectangle(config: IRectangleShapeParams) {
  const { width } = config;
  const height = config.height ?? width;

  return new Polygon2dModel([0, 0, width, 0, width, height, 0, height]);
}

export class Shape2dFactory {
  static createShape(config: Shape2dConfig): Polygon2dModel {
    switch (config.type) {
      case 'circle':
        return createCircle(config.params);

      case 'rectangle': {
        return createRectangle(config.params);
      }

      case 'polygon': {
        return new Polygon2dModel(config.params.vertices);
      }
    }
  }
}
