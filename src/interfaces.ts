import { IMuscleConfig, ILimbConfig, IOrganismConfig } from './core/organism/structure';
// import { IPhysicalObjectConfig, IStoneConfig } from './core/physics/structure';

export interface ISandboxConfig {
  /**
   * Canvas element for render game
   */
  canvasElement: HTMLCanvasElement;
  /**
   * Text language, 0=en, 1=ru
   */
  lang?: number;
}

export interface ISandboxStartSettings {
  organisms?: IOrganismConfig[];
}

export type { IMuscleConfig, ILimbConfig, IOrganismConfig };
