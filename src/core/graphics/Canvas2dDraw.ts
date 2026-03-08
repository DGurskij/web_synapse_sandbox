import { BACKGROUND_COLOR, LIMB_COLOR, ORGANISM_COLOR } from '../colors';
import { Limb } from '../organism/Limb';
import { Organism } from '../organism/Organism';
import { PhysicalObject } from '../physics/PhysicalObject';
import { Sandbox } from '../Sandbox';

export function drawLimb(sandbox: Sandbox, limb: Limb) {
  sandbox.context.save();

  sandbox.context.translate(limb.physics.position.x, limb.physics.position.y);
  sandbox.context.rotate(limb.physics.angle);

  limb.model.draw(sandbox.renderer, {
    color: limb.color,
    position: limb.selfAttachmentPoint,
  });

  if (limb.childLimbs.length > 0) {
    sandbox.context.save();
    sandbox.context.translate(limb.selfAttachmentPoint.x, limb.selfAttachmentPoint.y);

    for (const childLimb of limb.childLimbs) {
      drawLimb(sandbox, childLimb);
    }

    sandbox.context.restore();
  }

  sandbox.context.restore();
}
export function drawOrganism(sandbox: Sandbox, organism: Organism) {
  sandbox.context.save();

  sandbox.context.translate(organism.body.physics.position.x, organism.body.physics.position.y);
  sandbox.context.rotate(organism.body.physics.angle);

  organism.body.model.draw(sandbox.renderer, {
    color: organism.body.color,
  });

  for (const limb of organism.limbs) {
    drawLimb(sandbox, limb);
  }

  sandbox.context.restore();
}

export function drawPhysicalObject(sandbox: Sandbox, physicalObject: PhysicalObject) {
  // sandbox.context.save();
  // sandbox.context.translate(physicalObject.position.x, physicalObject.position.y);
  // physicalObject.model.draw(sandbox.renderer, {
  //   color: STONE_COLOR,
  // });
  // sandbox.context.restore();
}

export function drawScene(this: Sandbox) {
  this.context.fillStyle = BACKGROUND_COLOR;
  this.context.fillRect(0, 0, this.areaWidth, this.areaHeight);

  this.context.save();

  this.context.translate(this.cameraX, this.cameraY);
  this.context.scale(this.scale, this.scale);

  for (const organism of this.organisms) {
    drawOrganism(this, organism);
  }

  for (const obj of this.physicalObjects) {
    drawPhysicalObject(this, obj);
  }

  this.context.restore();
}
