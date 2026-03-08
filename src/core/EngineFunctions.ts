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
    organism.interactWithWorld(this.timer);
  }

  // TODO: world step with calculating collisions, recalculate end acceleration, velocity, position

  this.drawFunction();
}
