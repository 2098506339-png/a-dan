"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type RevealSequence = {
  section: string;
  title: string;
  supporting?: string;
  items?: string;
  itemX?: number;
};

const REVEAL_SEQUENCES: RevealSequence[] = [
  {
    section: "#about",
    title: ".intro-grid h2",
    supporting: ".intro-copy",
    items: ".facts > div",
    itemX: 70,
  },
  {
    section: "#story",
    title: ".section-head h2",
    supporting: ".section-head > p:last-child",
    items: ".character-card",
  },
  {
    section: "#projects",
    title: ".section-head h2",
    supporting: ".section-head > p:last-child",
    items: ".project-card",
  },
  {
    section: "#strengths",
    title: ".strength-sticky h2",
    supporting: ".strength-sticky > p:last-child",
    items: ".strength-list article",
    itemX: 90,
  },
  {
    section: "#films",
    title: ".section-head h2",
    supporting: ".section-head > p:last-child",
    items: ".film-stage, .film-caption",
  },
  {
    section: "footer",
    title: ".footer-top h2",
    supporting: ".footer-top > a",
    items: ".footer-bottom > *",
  },
];

export default function MotionDirector() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = document.documentElement;
    const body = document.body;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const originalOverflow = body.style.overflow;
    const shouldPlayOpening = !window.location.hash || window.location.hash === "#top";
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
    gsap.ticker.lagSmoothing(1000, 16);

    const context = gsap.context(() => {
      if (shouldPlayOpening) {
        root.classList.add("motion-opening");
        body.style.overflow = "hidden";

        gsap.set(".opening-screen", { display: "grid", clipPath: "inset(0 0 0% 0)" });
        gsap.set(".hero-video", { scale: 1.12, transformOrigin: "center center" });
        gsap.set(".nav-shell", { y: -90, autoAlpha: 0 });
        gsap.set(".hero-title .title-line > span", { yPercent: 118, rotate: 3.5, transformOrigin: "left bottom" });
        gsap.set(".hero-kicker, .hero-bottom > *", { y: 52, autoAlpha: 0 });
        gsap.set(".hero-rail", { xPercent: 100, autoAlpha: 0 });

        const opening = gsap.timeline({
          defaults: { force3D: true },
          onComplete: () => {
            body.style.overflow = originalOverflow;
            root.classList.remove("motion-opening");
            gsap.set(".opening-screen", { display: "none" });
            ScrollTrigger.refresh();
          },
        });

        opening
          .fromTo(".opening-mark", { scale: 0.58, rotate: -9, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 1.05, ease: "expo.out" }, 0.1)
          .fromTo(".opening-copy-mask > span", { yPercent: 125 }, { yPercent: 0, duration: 0.9, ease: "power4.out" }, 0.32)
          .fromTo(".opening-progress > span", { scaleX: 0 }, { scaleX: 1, duration: 1.35, ease: "power2.inOut" }, 0.3)
          .to(".opening-screen", { clipPath: "inset(0 0 100% 0)", duration: 1.35, ease: "power4.inOut" }, 1.55)
          .to(".hero-video", { scale: 1, duration: 2.3, ease: "power3.out" }, 1.42)
          .to(".nav-shell", { y: 0, autoAlpha: 1, duration: 1.05, ease: "power4.out" }, 1.78)
          .to(".hero-kicker", { y: 0, autoAlpha: 1, duration: 1, ease: "power4.out" }, 1.92)
          .to(".hero-title .title-line > span", { yPercent: 0, rotate: 0, duration: 1.45, stagger: 0.14, ease: "power4.out" }, 1.93)
          .to(".hero-bottom > *", { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.13, ease: "power4.out" }, 2.36)
          .to(".hero-rail", { xPercent: 0, autoAlpha: 1, duration: 1.1, ease: "power4.out" }, 2.5);
      } else {
        gsap.set(".opening-screen", { display: "none" });
      }

      for (const sequence of REVEAL_SEQUENCES) {
        const section = document.querySelector<HTMLElement>(sequence.section);
        if (!section) continue;

        const title = section.querySelectorAll<HTMLElement>(sequence.title);
        const eyebrow = section.querySelectorAll<HTMLElement>(".eyebrow");
        const supporting = sequence.supporting ? section.querySelectorAll<HTMLElement>(sequence.supporting) : [];
        const items = sequence.items ? section.querySelectorAll<HTMLElement>(sequence.items) : [];
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            once: true,
            invalidateOnRefresh: true,
          },
        });

        if (eyebrow.length) {
          timeline.fromTo(eyebrow, { x: -54, clipPath: "inset(0 100% 0 0)" }, { x: 0, clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.out" });
        }

        timeline.fromTo(
          title,
          { y: 145, skewY: 3, clipPath: "inset(0 0 100% 0)" },
          { y: 0, skewY: 0, clipPath: "inset(0 0 0% 0)", duration: 1.55, ease: "power4.out", force3D: true },
          eyebrow.length ? "-=0.54" : 0,
        );

        if (supporting.length) {
          timeline.fromTo(
            supporting,
            { y: 72, clipPath: "inset(0 0 100% 0)" },
            { y: 0, clipPath: "inset(0 0 0% 0)", duration: 1.15, ease: "power4.out", force3D: true },
            "-=0.86",
          );
        }

        if (items.length) {
          timeline.fromTo(
            items,
            {
              x: sequence.itemX ?? 0,
              y: sequence.itemX ? 34 : 138,
              rotationX: sequence.itemX ? 0 : 5,
              clipPath: sequence.itemX ? "inset(0 0 0 100%)" : "inset(15% 0 0 0)",
              transformOrigin: "50% 100%",
            },
            {
              x: 0,
              y: 0,
              rotationX: 0,
              clipPath: "inset(0% 0 0 0)",
              duration: 1.45,
              stagger: 0.17,
              ease: "power4.out",
              force3D: true,
            },
            "-=0.64",
          );
        }
      }

      const mediaQuery = gsap.matchMedia();
      mediaQuery.add("(min-width: 768px)", () => {
        const images = gsap.utils.toArray<HTMLElement>(".character-image img, .project-card img");
        for (const image of images) {
          gsap.fromTo(
            image,
            { yPercent: -4.5, scale: 1.08 },
            {
              yPercent: 4.5,
              scale: 1.08,
              ease: "none",
              scrollTrigger: {
                trigger: image.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.35,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, body);

    return () => {
      body.style.overflow = originalOverflow;
      root.classList.remove("motion-opening");
      context.revert();
    };
  }, []);

  return (
    <div className="opening-screen" aria-hidden="true">
      <div className="opening-grid" />
      <div className="opening-center">
        <div className="opening-mark">W</div>
        <div className="opening-copy-mask"><span>WANDOU / AI COMIC CREATOR</span></div>
      </div>
      <div className="opening-footer">
        <span>PORTFOLIO · 2026</span>
        <div className="opening-progress"><span /></div>
        <span>LOADING IMAGINATION</span>
      </div>
    </div>
  );
}
