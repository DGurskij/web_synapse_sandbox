import { BACKGROUND_COLOR, LIMB_COLOR, ORGANISM_COLOR, STONE_COLOR } from './colors';
import { Organism } from './organism/Organism';
import { PhysicalObject } from './physics/PhysicalObject';
import { Sandbox } from './Sandbox';

export function drawOrganism(sandbox: Sandbox, organism: Organism) {
  sandbox.context.save();

  sandbox.context.translate(organism.position.x, organism.position.y);
  sandbox.context.rotate(organism.angle);

  organism.body.shape.draw(sandbox.renderer, {
    color: ORGANISM_COLOR,
  });

  const drawLimb = (index: number) => {
    const limb = organism.limbs[index];
    sandbox.context.save();
    sandbox.context.translate(limb.attachmentPoint.x, limb.attachmentPoint.y);
    sandbox.context.rotate(-limb.angle);

    limb.shape.draw(sandbox.renderer, {
      color: LIMB_COLOR,
      position: limb.offset,
    });

    for (let i = 0; i < organism.limbs.length; i++) {
      if (organism.limbs[i].parentIndex === index) {
        drawLimb(i);
      }
    }

    sandbox.context.restore();
  };

  for (let i = 0; i < organism.limbs.length; i++) {
    if (organism.limbs[i].parentIndex < 0) {
      sandbox.context.save();

      const pivot = organism.getLimbPivotInBodyFrame(i);
      sandbox.context.translate(pivot.x, pivot.y);
      sandbox.context.rotate(-organism.limbs[i].angle);
      organism.limbs[i].shape.draw(sandbox.renderer, {
        color: LIMB_COLOR,
        position: organism.limbs[i].offset,
      });

      for (let j = 0; j < organism.limbs.length; j++) {
        if (organism.limbs[j].parentIndex === i) {
          drawLimb(j);
        }
      }

      sandbox.context.restore();
    }
  }

  sandbox.context.restore();
}

export function drawPhysicalObject(sandbox: Sandbox, physicalObject: PhysicalObject) {
  if (physicalObject.shape) {
    // console.log('drawPhysicalObject', physicalObject.position);
    sandbox.context.save();

    sandbox.context.translate(physicalObject.position.x, physicalObject.position.y);
    physicalObject.shape.draw(sandbox.renderer, {
      color: STONE_COLOR,
    });

    sandbox.context.restore();
  }
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
