import { Body, ICreateBody } from './Body';
import { Brain, IBrainCreate } from './brain/Brain';
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

    // for (const limb of this._limbs) {
    //   for (const muscle of limb.muscles) {
    //     const neuronId = this._brain.addNeuron();

    //     this._motorUnits.push({
    //       neuronId,
    //       limb,
    //       muscle,
    //     });
    //   }
    // }

    // // FIXME: this is a temporary solution to add receptors
    // for (let i = 0; i < 10; i++) {
    //   const neuronId = this._brain.addNeuron({
    //     v: 0,
    //     thresh: 0.5,
    //     refractoryPeriod: 1,
    //     outAmplitude: 1,
    //   });

    //   this._receptors.push({
    //     neuronId,
    //     gain: 1.0,
    //   });
    // }

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
      const shouldFire = Math.random() < 0.1; // 10% chance
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
      }
    }
  }

  update() {
    this._brain.update();
    this._body.update();
    this._limbs.forEach(limb => limb.update());
  }
}
