import { Shape } from 'src/model/Shape';
import { IBodyConfig } from './structure';
import { ShapeFactory } from 'src/model/ShapeFactory';

/**
 * Core body of the organism
 */
export class Body {
  private _shape: Shape;
  private _mass: number;

  constructor(config: IBodyConfig) {
    this._shape = ShapeFactory.createShape(config.shapeCfg || { type: 'circle', params: { radius: 0 } });
    this._mass = config.mass ?? 0;
  }

  get shape(): Shape {
    return this._shape;
  }

  get mass(): number {
    return this._mass;
  }
}
