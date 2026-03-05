import { CircleShape } from 'src/model/CircleShape';
import { RectangleShape } from 'src/model/RectangleShape';

import { IDrawParams, IRenderer } from './IRenderer';
import { PolygonShape } from 'src/model/PolygonShape';

export class Canvas2dRender implements IRenderer {
  constructor(private ctx: CanvasRenderingContext2D) {}

  drawCircle(circle: CircleShape, params: IDrawParams): void {
    const x = params.position?.x ?? 0;
    const y = params.position?.y ?? 0;

    this.ctx.save();

    this.ctx.translate(x, y);
    this.ctx.beginPath();
    this.ctx.fillStyle = params.color || 'black';

    this.ctx.arc(0, 0, circle.radius, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.closePath();

    this.ctx.restore();
  }

  drawRectangle(rectangle: RectangleShape, params: IDrawParams): void {
    const x = params.position?.x ?? 0;
    const y = params.position?.y ?? 0;
    const rotation = params.rotation ?? 0;

    this.ctx.save();

    this.ctx.fillStyle = params.color || 'black';
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    this.ctx.fillRect(0, 0, rectangle.width, rectangle.height);

    this.ctx.restore();
  }

  drawPolygon(polygon: PolygonShape, params: IDrawParams): void {
    const x = params.position?.x ?? 0;
    const y = params.position?.y ?? 0;
    const rotation = params.rotation ?? 0;

    this.ctx.fillStyle = params.color || 'black';
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    this.ctx.beginPath();
    this.ctx.moveTo(polygon.vertices[0].x, polygon.vertices[0].y);

    for (let i = 1; i < polygon.vertices.length; i++) {
      this.ctx.lineTo(polygon.vertices[i].x, polygon.vertices[i].y);
    }

    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }
}
