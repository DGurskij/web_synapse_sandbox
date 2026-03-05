import { IPoint } from '../math';
import { PhysicalObject } from './PhysicalObject';

/**
 * Камень — неподвижный или слабо подвижный физический объект.
 * Организм может толкать камень при столкновении.
 */
export class Stone extends PhysicalObject {
  constructor(params: { position?: IPoint; mass?: number; radius?: number }) {
    super({
      position: params.position,
      mass: params.mass ?? 50,
      radius: params.radius ?? 12,
    });
  }
}
