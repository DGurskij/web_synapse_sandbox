import { ISandboxStartSettings } from 'src/interfaces';

type TPresetName = 'default';

export const PRESETS: Record<TPresetName, ISandboxStartSettings> = {
  default: {
    organisms: [
      {
        body: {
          position: { x: 300, y: 300 },
          mass: 100,
          shapeCfg: {
            type: 'circle',
            params: { radius: 14 },
          },
          color: 'green',
        },
        limbs: [
          {
            parentAttachmentPoint: { x: 14, y: 0 },
            selfAttachmentPoint: { x: -2, y: -3 },
            mass: 19,
            initialAngle: 0,
            maxAngleDispersion: [Math.PI / 5, Math.PI / 5],
            shapeCfg: {
              type: 'rectangle',
              params: { width: 16, height: 6 },
            },
            color: 'pink',
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
            childLimbs: [
              {
                parentAttachmentPoint: { x: 15, y: 3 },
                selfAttachmentPoint: { x: -1, y: -2 },
                mass: 19,
                initialAngle: 0,
                maxAngleDispersion: [Math.PI / 5, Math.PI / 5],
                shapeCfg: {
                  type: 'rectangle',
                  params: { width: 20, height: 4 },
                },
                color: 'red',
                muscles: [
                  {
                    strength: 4,
                    endurance: 500,
                    maxEndurance: 500,
                    enduranceRestoreKf: 0.2,
                    direction: {
                      x: 0,
                      y: -6,
                    },
                  },
                  {
                    strength: 4,
                    endurance: 500,
                    maxEndurance: 500,
                    enduranceRestoreKf: 0.2,
                    direction: {
                      x: 0,
                      y: 6,
                    },
                  },
                ],
              },
            ],
          },
          {
            parentAttachmentPoint: { x: -14, y: 0 },
            selfAttachmentPoint: { x: -2, y: -3 },
            mass: 19,
            initialAngle: Math.PI,
            maxAngleDispersion: [Math.PI / 5, Math.PI / 5],
            shapeCfg: {
              type: 'rectangle',
              params: { width: 16, height: 6 },
            },
            color: 'pink',
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
            childLimbs: [
              {
                parentAttachmentPoint: { x: 15, y: 3 },
                selfAttachmentPoint: { x: -1, y: -2 },
                mass: 19,
                initialAngle: 0,
                maxAngleDispersion: [Math.PI / 5, Math.PI / 5],
                shapeCfg: {
                  type: 'rectangle',
                  params: { width: 20, height: 4 },
                },
                color: 'red',
                muscles: [
                  {
                    strength: 4,
                    endurance: 500,
                    maxEndurance: 500,
                    enduranceRestoreKf: 0.2,
                    direction: {
                      x: 0,
                      y: -6,
                    },
                  },
                  {
                    strength: 4,
                    endurance: 500,
                    maxEndurance: 500,
                    enduranceRestoreKf: 0.2,
                    direction: {
                      x: 0,
                      y: 6,
                    },
                  },
                ],
              },
            ],
          },
        ],
        brain: {
          neuronCapacity: 5000,
          neuronMaxOutgoingSynapses: 400,
          spikeStrongerThreshold: 5,

          motorNeuronCount: 500,
          sensorNeuronCount: 1000,
          interneuronCount: 3000,

          motorNeuronConfig: {
            v: 0,
            thresh: 2,
            refractoryPeriod: 5,
            outAmplitude: 1,
          },
          interneuronConfig: {
            v: 0,
            thresh: 2,
            refractoryPeriod: 5,
            outAmplitude: 1,
          },
          sensorNeuronConfig: {
            v: 0,
            thresh: 2,
            refractoryPeriod: 5,
            outAmplitude: 1,
          },
          connectionConfig: {
            nearestCount: 200,
            middleCount: 100,
            farthestCount: 50,
          },
          connectionRangeProfile: {
            nearestRange: 1,
            middleRange: 3,
            farthestRange: 6,
          },
        },
      },
    ],
  },
};

export function getPreset(name: TPresetName) {
  return PRESETS[name];
}
