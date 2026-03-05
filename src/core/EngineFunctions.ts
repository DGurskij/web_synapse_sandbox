import { resolveOrganismPhysicalCollision } from 'src/core/physics';
import { Sandbox } from './Sandbox';

/**
 * Do stars's lifecycle, gravity.
 * Call drawScene after update dynamic properties
 */
export function sandboxEngine(this: Sandbox) {
  for (const organism of this.organisms) {
    organism.update();
  }

  for (const physical of this.physicalObjects) {
    physical.update();
  }

  for (const organism of this.organisms) {
    organism.interactWithWorld();
  }

  const COLLISION_ITERATIONS = 3;
  for (let iter = 0; iter < COLLISION_ITERATIONS; iter++) {
    for (const organism of this.organisms) {
      for (const physical of this.physicalObjects) {
        resolveOrganismPhysicalCollision(organism, physical);
      }
    }
  }

  this.drawFunction();
}
