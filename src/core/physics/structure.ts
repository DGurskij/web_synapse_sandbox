import { Shape2dConfig } from 'src/shape/Shape2dFactory';
import { IPoint2d } from '../math';

export interface IPhysicalObject2dConfig {
  position?: IPoint2d;
  mass?: number;
  shapeCfg?: Shape2dConfig;
}
