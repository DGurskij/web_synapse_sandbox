import { IDrawParams, IRenderer } from './IRenderer';
import { Polygon2dModel } from 'src/model/Polygon2dModel';

export class Canvas2dRender implements IRenderer {
  constructor(private ctx: CanvasRenderingContext2D) {}

  drawPolygon2d(polygon: Polygon2dModel, params: IDrawParams): void {
    this.ctx.save();

    this.ctx.fillStyle = params.color || 'black';
    this.ctx.translate(params.position?.x ?? 0, params.position?.y ?? 0);
    this.ctx.rotate(params.rotation ?? 0);

    this.ctx.beginPath();
    this.ctx.moveTo(polygon.vertices[0], polygon.vertices[1]);

    for (let i = 1; i < polygon.vertices.length; i++) {
      this.ctx.lineTo(polygon.vertices[i * 2], polygon.vertices[i * 2 + 1]);
    }

    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }
}
