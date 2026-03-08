import { IDrawParams, IRenderer } from 'src/render/IRenderer';
import { Model } from './Model';
import { IPoint2d } from 'src/core/math';

export class Polygon2dModel extends Model {
  constructor(vertices: number[] | IPoint2d[] = []) {
    const vertices2d = typeof vertices[0] === 'number' ? (vertices as number[]) : (vertices as IPoint2d[]).flatMap(v => [v.x, v.y]);

    if (vertices2d.length % 2 !== 0) {
      throw new Error('Vertices must be an even number');
    }

    super(vertices2d);
  }

  draw(renderer: IRenderer, params: IDrawParams) {
    renderer.drawPolygon2d(this, params);
  }

  addVertex(vertex: IPoint2d) {
    this._vertices.push(vertex.x, vertex.y);
  }
}
