import { TimelineMax as Timeline, Power1 } from 'gsap';

declare global {
  interface Window {
      loadPromise:any;
  }
}
const getDefaultTimeline = (node:HTMLElement, delay:number) => {
  const timeline = new Timeline({ paused: true });
  const content = node.querySelector('div');
  const contentInner = node.querySelector('div > div');
  const contentInnerInner = node.querySelector('div > div > *');

  timeline
    .from(node, 0.3, { display: 'none', autoAlpha: 0,scale:1, delay, ease: Power1.easeIn })
    .from({content}, 0.15, { autoAlpha: 0, y: 25, ease: Power1.easeInOut })
    .from({contentInner}, 0.15, { autoAlpha: 0, delay: 0.15, ease: Power1.easeIn })
    .from({contentInnerInner}, 0.15, { autoAlpha: 0, delay: 0.30, ease: Power1.easeIn });

  return timeline;
}

const getHomeTimeline = (node:HTMLElement, delay:number) => {
  const timeline = new Timeline({ paused: true });
  const texts = node.querySelectorAll('h1 > div');

  timeline
    .from(node, 0, { display: 'none', autoAlpha: 0, delay })
    .staggerFrom(texts, 0.375, { autoAlpha: 0, x: -25, ease: Power1.easeOut }, 0.125);

  return timeline;
}

export const play = (pathname:string, node:HTMLElement, appears:boolean) => {
  const delay = appears ? 0 : 0.5;
  let timeline:any;

  if (pathname === '/church/413/dashboard')
    timeline = getHomeTimeline(node, delay);
  else
    timeline = getDefaultTimeline(node, delay);

  window
    .loadPromise
    .then(() => requestAnimationFrame(() => timeline.play()))
}

export const exit = (node:HTMLElement) => {
  const timeline = new Timeline({ paused: true });

  timeline.to(node, 0.15, { autoAlpha: 0, ease: Power1.easeOut,scale:0 });
  timeline.play();
}
