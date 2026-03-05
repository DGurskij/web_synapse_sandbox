import { ShapeFactory } from 'src/model/ShapeFactory';
import { PhysicalObject } from './PhysicalObject';
import { IStoneConfig } from './structure';

/**
 * Stone - stationary or weakly movable physical object.
 * Organism can push the stone on collision.
 */
export class Stone extends PhysicalObject {
  constructor(params: IStoneConfig) {
    const shapeCfg = params.shapeCfg ?? { type: 'circle' as const, params: { radius: 12 } };
    const radius = params.radius ?? (shapeCfg.type === 'circle' ? shapeCfg.params.radius : undefined) ?? 12;
    super({
      position: params.position,
      mass: params.mass ?? 50,
      radius,
    });

    this._shape = ShapeFactory.createShape(shapeCfg);
  }
}
