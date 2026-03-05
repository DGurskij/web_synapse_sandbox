import { ISandboxStartSettings } from 'src/interfaces';

type TPresetName = 'default';

export const PRESETS: Record<TPresetName, ISandboxStartSettings> = {
  default: {
    stones: [
      { position: { x: 550, y: 380 }, mass: 800, shapeCfg: { type: 'circle', params: { radius: 15 } } },
      { position: { x: 250, y: 310 }, mass: 600, shapeCfg: { type: 'circle', params: { radius: 12 } } },
      { position: { x: 250, y: 270 }, mass: 60, shapeCfg: { type: 'circle', params: { radius: 12 } } },
      { position: { x: 400, y: 400 }, mass: 100, shapeCfg: { type: 'circle', params: { radius: 18 } } },
    ],
    organisms: [
      {
        body: {
          shapeCfg: {
            type: 'circle',
            params: { radius: 14 },
          },
          mass: 100,
        },
        position: {
          x: 300,
          y: 300,
        },
        limbs: [
          {
            attachmentPoint: { x: 14, y: 0 },
            offset: { x: -3, y: -6 / 2 },
            mass: 19,
            attachmentAngle: 0,
            maxAngleDispersion: [Math.PI / 5, Math.PI / 5],
            shapeCfg: {
              type: 'rectangle',
              params: { width: 14, height: 6 },
            },
            muscles: [
              {
                strength: 7,
                endurance: 500,
                maxEndurance: 500,
                enduranceRestoreKf: 0.2,
                direction: {
                  x: 0,
                  y: -10,
                },
              },
              {
                strength: 7,
                endurance: 500,
                maxEndurance: 500,
                enduranceRestoreKf: 0.2,
                direction: {
                  x: 0,
                  y: 10,
                },
              },
            ],
          },
          {
            parentIndex: 0,
            attachmentPoint: { x: 14, y: 0 },
            offset: { x: -2, y: -4 / 2 },
            mass: 8,
            attachmentAngle: 0,
            maxAngleDispersion: [Math.PI / 3.5, Math.PI / 3.5],
            shapeCfg: {
              type: 'rectangle',
              params: { width: 30, height: 4 },
            },
            muscles: [
              {
                strength: 3,
                endurance: 200,
                maxEndurance: 200,
                enduranceRestoreKf: 0.15,
                direction: { x: 0, y: -4 },
              },
              {
                strength: 3,
                endurance: 200,
                maxEndurance: 200,
                enduranceRestoreKf: 0.15,
                direction: { x: 0, y: 4 },
              },
            ],
          },
          {
            parentIndex: 1,
            attachmentPoint: { x: 30, y: 0 },
            offset: { x: -2, y: -2 / 2 },
            mass: 4,
            attachmentAngle: 0,
            maxAngleDispersion: [Math.PI / 3.5, Math.PI / 3.5],
            shapeCfg: {
              type: 'rectangle',
              params: { width: 7, height: 2 },
            },
            muscles: [
              {
                strength: 1,
                endurance: 200,
                maxEndurance: 200,
                enduranceRestoreKf: 0.15,
                direction: { x: 0, y: -2 },
              },
              {
                strength: 1,
                endurance: 200,
                maxEndurance: 200,
                enduranceRestoreKf: 0.15,
                direction: { x: 0, y: 2 },
              },
            ],
          },
          {
            attachmentPoint: { x: -14, y: 0 },
            offset: { x: -2, y: -6 / 2 },
            mass: 19,
            attachmentAngle: Math.PI,
            maxAngleDispersion: [Math.PI / 5, Math.PI / 5],
            shapeCfg: {
              type: 'rectangle',
              params: { width: 14, height: 6 },
            },
            muscles: [
              {
                strength: 7,
                endurance: 200,
                maxEndurance: 200,
                enduranceRestoreKf: 0.15,
                direction: { x: 0, y: 10 },
              },
              {
                strength: 7,
                endurance: 200,
                maxEndurance: 200,
                enduranceRestoreKf: 0.15,
                direction: { x: 0, y: -10 },
              },
            ],
          },
          {
            parentIndex: 3,
            attachmentPoint: { x: 14, y: 0 },
            offset: { x: -2, y: -4 / 2 },
            mass: 8,
            attachmentAngle: 0,
            maxAngleDispersion: [Math.PI / 3.5, Math.PI / 3.5],
            shapeCfg: {
              type: 'rectangle',
              params: { width: 30, height: 4 },
            },
            muscles: [
              {
                strength: 3,
                endurance: 200,
                maxEndurance: 200,
                enduranceRestoreKf: 0.15,
                direction: { x: 0, y: 4 },
              },
              {
                strength: 3,
                endurance: 200,
                maxEndurance: 200,
                enduranceRestoreKf: 0.15,
                direction: { x: 0, y: -4 },
              },
            ],
          },
          {
            parentIndex: 4,
            attachmentPoint: { x: 30, y: 0 },
            offset: { x: -2, y: -2 / 2 },
            mass: 4,
            attachmentAngle: 0,
            maxAngleDispersion: [Math.PI / 3.5, Math.PI / 3.5],
            shapeCfg: {
              type: 'rectangle',
              params: { width: 7, height: 2 },
            },
            muscles: [
              {
                strength: 1,
                endurance: 200,
                maxEndurance: 200,
                enduranceRestoreKf: 0.15,
                direction: { x: 0, y: -2 },
              },
              {
                strength: 1,
                endurance: 200,
                maxEndurance: 200,
                enduranceRestoreKf: 0.15,
                direction: { x: 0, y: 2 },
              },
            ],
          },
        ],
      },
    ],
  },
};

export function getPreset(name: TPresetName) {
  return PRESETS[name];
}
