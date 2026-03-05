import { initSandbox, setAreaSizeFn, startSandbox } from '.';
import { getPreset } from './presets/presets';

declare global {
  interface Window {
    initSandbox: () => void;
  }
}

window.initSandbox = async () => {
  const canvasElement = document.getElementById('area') as HTMLCanvasElement;
  const parent = canvasElement.parentElement as HTMLDivElement;

  await initSandbox({
    canvasElement,
  });

  new ResizeObserver(() => {
    setAreaSizeFn(parent.offsetWidth, parent.offsetHeight);
  }).observe(parent);

  setAreaSizeFn(parent.offsetWidth, parent.offsetHeight);

  setTimeout(() => {
    startSandbox(getPreset('default'));
  }, 100);
};
