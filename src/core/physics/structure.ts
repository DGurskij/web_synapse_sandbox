import { ShapeConfig } from 'src/model/ShapeFactory';
import { IPoint } from '../math';

export interface IPhysicalObjectConfig {
  position?: IPoint;
  mass?: number;
  radius?: number;
}

export interface IStoneConfig extends IPhysicalObjectConfig {
  shapeCfg?: ShapeConfig;
}
