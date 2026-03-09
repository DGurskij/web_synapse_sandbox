import { Body, ICreateBody } from './Body';
import { Brain, IBrainCreate } from './brain/Brain';
import { NeuronType } from './brain/Neuron';
import { Limb, ICreateLimb } from './Limb';
import { IMotorUnit } from './MotorUnit';
import { IReceptor } from './Receptor';

export interface ICreateOrganism {
  body: ICreateBody;
  limbs: ICreateLimb[];
  brain: IBrainCreate;
}

export class Organism {
  private _body: Body;
  private _limbs: Limb[];
  private _brain: Brain;

  private _receptors: IReceptor[];
  private _motorUnits: IMotorUnit[];

  private _totalMass: number;

  constructor(config: ICreateOrganism) {
    this._body = new Body(config.body);
    this._limbs = config.limbs?.map(limb => new Limb(limb)) ?? [];

    this._brain = new Brain(config.brain);

    this._motorUnits = [];
    this._receptors = [];

    this.limbs.forEach(limb => {
      this.linkMotorUnitsToMuscles(limb);
    });

    console.log('Organism connected motor neurons:', this._motorUnits.length);

    // FIXME: this is a temporary solution to add receptors
    for (let i = 0; i < 40; i++) {
      const neuronIds = this._brain.useNeurons(10, NeuronType.SENSOR);

      neuronIds.forEach(neuronId => {
        this._receptors.push({
          neuronId,
          gain: Math.random() * 0.3 + 1.3,
        });
      });
    }

    console.log('Organism connected receptors:', this._receptors.length);

    this._totalMass = this._computeTotalMass();
  }

  get body(): Body {
    return this._body;
  }

  get limbs(): readonly Limb[] {
    return this._limbs;
  }

  private _computeTotalMass(): number {
    return this._body.mass + this._limbs.reduce((sum, limb) => sum + limb.mass, 0);
  }

  interactWithWorld(timeNow: number) {
    // TODO: add receptors logic
    for (const r of this._receptors) {
      // rare spikes
      const shouldFire = Math.random() < 0.5; // 10% chance
      if (!shouldFire) continue;

      const value = Math.random() * r.gain; // amplitude
      this._brain.addExternalInput(r.neuronId, value);
    }

    this._brain.think(timeNow);

    for (const motorUnit of this._motorUnits) {
      const [spiked, amplitude] = this._brain.spikedWithAmplitude(motorUnit.neuronId);

      if (spiked) {
        const connectionForce = motorUnit.muscle.contraction(amplitude);
        motorUnit.limb.physics.applyForce(connectionForce);
        // console.log('applied force', connectionForce);
      }
    }
  }

  update() {
    this._brain.update();
    this._body.update();
    this._limbs.forEach(limb => limb.update());
  }

  private linkMotorUnitsToMuscles(limb: Limb): void {
    limb.muscles.forEach(muscle => {
      const neuronIds = this._brain.useNeurons(10, NeuronType.MOTOR);

      neuronIds.forEach((neuronId, i) => {
        this._motorUnits.push({
          neuronId,
          limb,
          muscle,
          gain: (i + 1) / 10,
        });
      });
    });

    if (limb.childLimbs.length > 0) {
      limb.childLimbs.forEach(childLimb => this.linkMotorUnitsToMuscles(childLimb));
    }
  }
}
