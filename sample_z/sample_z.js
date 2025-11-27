
/*------------------------------ Register plugins ------------------------------*/
// sample3.js
import { Pane } from 'https://cdn.skypack.dev/tweakpane@4.0.4'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

/*------------------------------- 참고_sample2.js -------------------------------*/
// sample2.js
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

const scrollerSmoother = ScrollSmoother.create({
  content: '.wrapper2',
  wrapper: '.wrapper',
  smooth: 1.2,
  effects: false,
  normalizeScroll: true
})

const tl = gsap.timeline({
  scrollTrigger: {
      trigger: 'ul',
      pin: true,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      ease: 'linear',
    }
})
// tl.to('li > .text', {
//   height: 0,
//   paddingBottom: 0,
//   opacity: 0,
//   stagger: 0.5,
// })
// tl.to('li', {
//   marginBottom: -15,
//   stagger: 0.5,
// }, '<')

tl.to('li:not(:last-child) > .text', {
  height: 0,
  paddingBottom: 0,
  opacity: 0,
  stagger: 0.5,
});

tl.to('li:not(:last-child)', {
  marginBottom: -15,
  stagger: 0.5,
}, '<');

/*------------------------------- 참고_sample3.js -------------------------------*/ 
// sample3.js 
const config = {
  theme: 'dark',
  animate: true,
  snap: true,
  start: gsap.utils.random(0, 100, 1),
  end: gsap.utils.random(900, 1000, 1),
  scroll: true,
  debug: false,
}

const ctrl = new Pane({
  title: '추후 추가해야할 부분',
  expanded: false,
})

let items
let scrollerScrub
let dimmerScrub
let chromaEntry
let chromaExit

const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.syncScrollbar = config.scroll
  document.documentElement.dataset.animate = config.animate
  document.documentElement.dataset.snap = config.snap
  document.documentElement.dataset.debug = config.debug
  document.documentElement.style.setProperty('--start', config.start)
  document.documentElement.style.setProperty('--hue', config.start)
  document.documentElement.style.setProperty('--end', config.end)

  if (!config.animate) {
    chromaEntry?.scrollTrigger.disable(true, false)
    chromaExit?.scrollTrigger.disable(true, false)
    dimmerScrub?.disable(true, false)
    scrollerScrub?.disable(true, false)
    gsap.set(items, { opacity: 1 })
    gsap.set(document.documentElement, { '--chroma': 0 })
  } else {
    gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) })
    dimmerScrub.enable(true, true)
    scrollerScrub.enable(true, true)
    chromaEntry.scrollTrigger.enable(true, true)
    chromaExit.scrollTrigger.enable(true, true)
  }
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}
// ctrl.addBinding(config, 'animate', {
//   label: 'Animate',
// })
// ctrl.addBinding(config, 'snap', {
//   label: 'Snap',
// })
// ctrl.addBinding(config, 'start', {
//   label: 'Hue Start',
//   min: 0,
//   max: 1000,
//   step: 1,
// })
// ctrl.addBinding(config, 'end', {
//   label: 'Hue End',
//   min: 0,
//   max: 1000,
//   step: 1,
// })
// ctrl.addBinding(config, 'scroll', {
//   label: 'Scrollbar',
// })
// ctrl.addBinding(config, 'debug', {
//   label: 'Debug',
// })

// ctrl.addBinding(config, 'theme', {
//   label: 'Theme',
//   options: {
//     System: 'system',
//     Light: 'light',
//     Dark: 'dark',
//   },
// })

// ctrl.on('change', sync)

// backfill the scroll functionality with GSAP
if (
  CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')
) {
  gsap.registerPlugin(ScrollTrigger)

  // animate the items with GSAP if there's no CSS support
  items = gsap.utils.toArray('ul li')
  gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) })

const dimmer = gsap.timeline();

items.forEach((item, index) => {
  ScrollTrigger.create({
    trigger: item,
    start: 'center center',
    end: 'center center',
    onEnter: () => {
      items.forEach((el, i) => gsap.to(el, { opacity: i === index ? 1 : 0.2, overwrite: 'auto', duration: 0.3, immediateRender: true}));
      console.log('onEnter', index, item); // 현재 요소 index와 DOM 요소
    },
    onEnterBack: () => {
      items.forEach((el, i) => gsap.to(el, { opacity: i === index ? 1 : 0.2, overwrite: 'auto', duration: 0.3, immediateRender: true}));
      console.log('onEnterBack', index, item); // 뒤로 스크롤했을 때
    },
  });
});

dimmerScrub = ScrollTrigger.create({
  trigger: items[0],
  endTrigger: items[items.length - 1],
  start: 'top center',
  end: 'bottom center',
  animation: dimmer,
  scrub: 0.2,
});

  // register scrollbar changer
  const scroller = gsap.timeline().fromTo(
    document.documentElement,
    {
      '--hue': config.start,
    },
    {
      '--hue': config.end,
      ease: 'none',
    }
  )

  scrollerScrub = ScrollTrigger.create({
    trigger: items[0],
    endTrigger: items[items.length - 1],
    start: 'center center',
    end: 'center center',
    animation: scroller,
    scrub: 0.2,
  })

  chromaEntry = gsap.fromTo(
    document.documentElement,
    {
      '--chroma': 0,
    },
    {
      '--chroma': 0.3,
      ease: 'none',
      scrollTrigger: {
        scrub: 0.2,
        trigger: items[0],
        start: 'center center+=40',
        end: 'center center',
      },
    }
  )
  chromaExit = gsap.fromTo(
    document.documentElement,
    {
      '--chroma': 0.3,
    },
    {
      '--chroma': 0,
      ease: 'none',
      scrollTrigger: {
        scrub: 0.2,
        trigger: items[items.length - 2],
        start: 'center center',
        end: 'center center-=40',
      },
    }
  )
}
// run it
update()