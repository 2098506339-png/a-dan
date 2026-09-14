"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import CursorEffects from "@/components/CursorEffects";
import MotionDirector from "@/components/MotionDirector";
import Particles from "@/components/Particles";

type Language = "zh" | "en";

const content = {
  zh: {
    nav: { story: "漫剧经历", projects: "精选项目", strengths: "个人优势", films: "作品视频" },
    sections: [
      { id: "story", label: "漫剧经历", keywords: "经历 漫剧 人物 风遇画音" },
      { id: "projects", label: "精选项目", keywords: "项目 作品 角色 分镜" },
      { id: "strengths", label: "个人优势", keywords: "优势 能力 编程 创意" },
      { id: "films", label: "作品视频", keywords: "视频 成果 样片" },
      { id: "about", label: "关于豌豆", keywords: "介绍 个人 爱好" },
    ],
    accessibility: {
      home: "返回首页",
      nav: "主导航",
      videoBackground: "科技城市动态背景",
      search: "搜索",
      scroll: "向下浏览",
      projectVideo: "查看风遇画音视频",
      characterImage: "人物设定图",
    },
    hero: {
      title: ["把想象力，", "做成一场电影。"],
      intro: ["我是豌豆，一名正在长大的 AI 漫剧创作者。", "角色、分镜、编程，都是我讲故事的方式。"],
      searchLabel: "搜索作品或内容",
      searchPlaceholder: "试试“风遇画音”",
      jump: "跳转 ↗",
      empty: "没有完全匹配的内容，按回车看看精选项目。",
    },
    about: {
      eyebrow: "ABOUT / 关于我",
      title: ["活泼、好奇，", "也认真对待每一个镜头。"],
      copy: "我叫豌豆，13 岁，是一名学生。喜欢拼乐高、打高尔夫、编程，也喜欢做漫剧。第一次接触 AI 漫剧后，我和老师一起完成了《风遇画音》——原来技术和故事，可以一起变得很有趣。",
      facts: [{ value: "13", label: "岁" }, { value: "01+", label: "AI 漫剧" }, { value: "∞", label: "创意" }],
    },
    story: {
      eyebrow: "01 / AI 漫剧经历",
      title: ["从第一次尝试，", "到一个自己的角色宇宙。"],
      copy: "老师带我打开 AI 漫剧的大门。我们从一段故事开始，做角色、想镜头、调气氛，最后让《风遇画音》真正动起来。",
      characters: [
        { name: "森川汐", role: "声音记录者", image: "/assets/morigawa-shio.jpg", description: "在雨声与城市回响里收集生活，用温柔的声音照亮他人的世界。", tone: "warm" },
        { name: "凌渊", role: "澜风剑宗首席", image: "/assets/lingyuan.jpg", description: "外表温和有礼，内心沉静坚定；一位以水为意、以剑为路的少年。", tone: "blue" },
        { name: "有药", role: "苍灵散人", image: "/assets/youyao.jpg", description: "散漫、神秘又带一点幽默感，让东方奇幻人物拥有鲜明的记忆点。", tone: "gold" },
      ],
    },
    projects: {
      eyebrow: "02 / 精选项目",
      title: "精选项目",
      copy: "每张设定图、每个分镜，都是世界观的一块拼图。",
      main: { tag: "第一部 AI 漫剧", title: "风遇画音", year: "AI 漫剧 · 2026", roles: "导演 / 分镜 / 视觉" },
      rain: { tag: "分镜设计", title: "雨夜 · 分镜实验", meta: "07 镜头" },
      aureus: { tag: "角色设计", title: "黄金斩影", meta: "角色研究" },
    },
    strengths: {
      eyebrow: "03 / 个人优势",
      title: ["小小年纪，", "认真创作。"],
      copy: "把兴趣变成能力，把每次尝试变成下一次进步的起点。",
      items: [
        { no: "01", title: "AI 视觉叙事", text: "从角色设定到画面氛围，把一个想法发展成能被看见的故事。" },
        { no: "02", title: "角色与分镜", text: "关注人物性格、镜头情绪和光影变化，让静态画面也有剧情张力。" },
        { no: "03", title: "编程与交互", text: "喜欢编程，也愿意把技术变成作品表达的一部分。" },
        { no: "04", title: "好奇与行动力", text: "13 岁，热爱乐高、高尔夫与创作；想到就动手，边做边学。" },
      ],
    },
    films: {
      eyebrow: "04 / 作品视频",
      title: "让画面开始呼吸。",
      copy: "从一帧到下一帧，故事有了时间，也有了声音。",
      badge: "概念预览",
      name: "《风遇画音》概念预览",
      status: "AI 漫剧 · 即将上线",
      note: "当前基础版使用氛围样片作为视频占位。后续提供成片后，可直接替换为正式作品视频。",
      fallback: "你的浏览器暂不支持视频播放。",
    },
    footer: {
      eyebrow: "故事还在继续",
      title: ["下一帧，", "会是什么？"],
      back: "返回顶部 ↑",
      producer: "制作人",
      names: "豌豆 · 花花",
      quote: "“我是豌豆，爱吃豌豆”",
    },
  },
  en: {
    nav: { story: "Journey", projects: "Projects", strengths: "Strengths", films: "Films" },
    sections: [
      { id: "story", label: "AI Comic Journey", keywords: "journey comic character wind meets painted sound" },
      { id: "projects", label: "Selected Projects", keywords: "project work character storyboard" },
      { id: "strengths", label: "My Strengths", keywords: "strength skills coding creative" },
      { id: "films", label: "Films", keywords: "video film result preview" },
      { id: "about", label: "About Wandou", keywords: "about profile hobbies" },
    ],
    accessibility: {
      home: "Back to home",
      nav: "Main navigation",
      videoBackground: "Futuristic city video background",
      search: "Search",
      scroll: "Scroll down",
      projectVideo: "View the Wind Meets Painted Sound video",
      characterImage: "character design sheet",
    },
    hero: {
      title: ["Imagination,", "made cinematic."],
      intro: ["I’m Wandou, a young AI comic creator in the making.", "Characters, storyboards and code are how I tell stories."],
      searchLabel: "Search projects or stories",
      searchPlaceholder: "Try “storyboard”",
      jump: "VIEW ↗",
      empty: "No exact match. Press Enter to explore selected projects.",
    },
    about: {
      eyebrow: "ABOUT / PROFILE",
      title: ["Curious and energetic,", "serious about every frame."],
      copy: "I’m Wandou, a 13-year-old student. I love building LEGO, playing golf, coding and creating AI comics. After discovering AI storytelling, my teacher and I made our first comic, Wind Meets Painted Sound—and I learned that technology and stories can be fun together.",
      facts: [{ value: "13", label: "YEARS OLD" }, { value: "01+", label: "AI COMIC" }, { value: "∞", label: "IDEAS" }],
    },
    story: {
      eyebrow: "01 / AI COMIC JOURNEY",
      title: ["From a first experiment", "to a universe of characters."],
      copy: "My teacher opened the door to AI comics. We began with a story, shaped the characters, planned each shot and tuned the atmosphere—until Wind Meets Painted Sound came alive.",
      characters: [
        { name: "Morikawa Shio", role: "SOUND COLLECTOR", image: "/assets/morigawa-shio.jpg", description: "She gathers rain, voices and echoes from the city, using gentle sound to brighten another person’s world.", tone: "warm" },
        { name: "Ling Yuan", role: "MASTER SWORDSMAN", image: "/assets/lingyuan.jpg", description: "Warm and courteous on the surface, calm and steadfast within—a young swordsman guided by the flow of water.", tone: "blue" },
        { name: "Youyao", role: "WANDERING HEALER", image: "/assets/youyao.jpg", description: "Laid-back, mysterious and quietly funny, bringing a memorable edge to an Eastern fantasy world.", tone: "gold" },
      ],
    },
    projects: {
      eyebrow: "02 / SELECTED PROJECTS",
      title: "Selected work",
      copy: "Every character sheet and storyboard is one more piece of a growing universe.",
      main: { tag: "FIRST AI COMIC", title: "Wind Meets Painted Sound", year: "AI COMIC · 2026", roles: "DIRECTING / STORYBOARD / VISUALS" },
      rain: { tag: "STORYBOARD", title: "Rain Study", meta: "07 SHOTS" },
      aureus: { tag: "CHARACTER DESIGN", title: "Aureus Noctis", meta: "ROLE STUDY" },
    },
    strengths: {
      eyebrow: "03 / MY STRENGTHS",
      title: ["Young creator.", "Serious craft."],
      copy: "Turning interests into skills, and every experiment into the start of something better.",
      items: [
        { no: "01", title: "AI visual storytelling", text: "I turn an idea into a visible story, from character design to atmosphere and light." },
        { no: "02", title: "Characters & storyboards", text: "I focus on personality, emotion and lighting so that even a still frame carries dramatic energy." },
        { no: "03", title: "Code & interaction", text: "I enjoy programming and finding ways for technology to become part of the creative work." },
        { no: "04", title: "Curiosity & momentum", text: "At 13, I explore LEGO, golf and storytelling—learning by making and improving as I go." },
      ],
    },
    films: {
      eyebrow: "04 / FILMS",
      title: "Frames begin to breathe.",
      copy: "From one frame to the next, the story gains time—and a voice.",
      badge: "CONCEPT PREVIEW",
      name: "Wind Meets Painted Sound — Concept",
      status: "AI COMIC · COMING SOON",
      note: "This first version uses an atmospheric sample as a placeholder. The finished film can be dropped in as soon as it is ready.",
      fallback: "Your browser does not support video playback.",
    },
    footer: {
      eyebrow: "THE STORY CONTINUES",
      title: ["What will", "the next frame be?"],
      back: "BACK TO TOP ↑",
      producer: "PRODUCERS",
      names: "WANDOU · HUAHUA",
      quote: "“I’m Wandou, and I love peas.”",
    },
  },
} as const;

export default function Home() {
  const [language, setLanguage] = useState<Language>("zh");
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const t = content[language];

  useEffect(() => {
    const saved = window.localStorage.getItem("wandou-language");
    if (saved === "zh" || saved === "en") setLanguage(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return t.sections.slice(0, 4);
    return t.sections.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(value));
  }, [query, t.sections]);

  function changeLanguage(next: Language) {
    setLanguage(next);
    setQuery("");
    setShowResults(false);
    window.localStorage.setItem("wandou-language", next);
  }

  function jumpTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setShowResults(false);
  }

  function onSearch(event: FormEvent) {
    event.preventDefault();
    jumpTo(results[0]?.id ?? "projects");
  }

  return (
    <main className={language === "en" ? "lang-en" : "lang-zh"}>
      <MotionDirector />
      <CursorEffects />
      <section className="hero" id="top">
        <video className="hero-video" autoPlay muted loop playsInline poster="/assets/storyboard-sunset.jpg" aria-label={t.accessibility.videoBackground}>
          <source src="/assets/wandou-homepage-0914.mp4" type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <div className="noise" />

        <header className="nav-shell">
          <a className="brand" href="#top" aria-label={t.accessibility.home}>
            <span className="brand-mark">W</span>
            <span>{language === "zh" ? "豌豆 / WANDOU" : "WANDOU / 豌豆"}</span>
          </a>
          <nav className="nav-links" aria-label={t.accessibility.nav}>
            <a href="#story">{t.nav.story}</a>
            <a href="#projects">{t.nav.projects}</a>
            <a href="#strengths">{t.nav.strengths}</a>
            <a href="#films">{t.nav.films}</a>
          </nav>
          <div className="nav-actions">
            <a className="nav-index" href="#about">ABOUT ↗</a>
            <div className="language-switch" role="group" aria-label="Language / 语言">
              <button type="button" className={language === "zh" ? "active" : ""} onClick={() => changeLanguage("zh")} aria-pressed={language === "zh"}>中文</button>
              <span>/</span>
              <button type="button" className={language === "en" ? "active" : ""} onClick={() => changeLanguage("en")} aria-pressed={language === "en"}>EN</button>
            </div>
          </div>
        </header>

        <div className="hero-content container">
          <div className="hero-kicker"><span /> AI COMIC CREATOR · 2026</div>
          <h1 className="hero-title">
            <span className="title-line"><span>{t.hero.title[0]}</span></span>
            <em className="title-line"><span>{t.hero.title[1]}</span></em>
          </h1>
          <div className="hero-bottom">
            <p>{t.hero.intro[0]}<br />{t.hero.intro[1]}</p>
            <form className="search" onSubmit={onSearch} role="search">
              <label htmlFor="site-search">{t.hero.searchLabel}</label>
              <div className="search-control">
                <span aria-hidden="true">⌕</span>
                <input id="site-search" value={query} onChange={(event) => { setQuery(event.target.value); setShowResults(true); }} onFocus={() => setShowResults(true)} placeholder={t.hero.searchPlaceholder} autoComplete="off" />
                <button type="submit" aria-label={t.accessibility.search}>↵</button>
              </div>
              {showResults && (
                <div className="search-results">
                  {results.length > 0 ? results.map((item) => (
                    <button type="button" key={item.id} onClick={() => jumpTo(item.id)}><span>{item.label}</span><span>{t.hero.jump}</span></button>
                  )) : <p>{t.hero.empty}</p>}
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="hero-rail"><span>SCROLL TO EXPLORE</span><a href="#story" aria-label={t.accessibility.scroll}>↓</a></div>
      </section>

      <div className="post-hero-shell">
        <div className="post-hero-particles"><Particles /></div>
        <div className="post-hero-content">
      <section className="intro-band" id="about">
        <div className="container intro-grid">
          <p className="eyebrow">{t.about.eyebrow}</p>
          <div>
            <h2>{t.about.title[0]}<br />{t.about.title[1]}</h2>
            <p className="intro-copy">{t.about.copy}</p>
          </div>
          <div className="facts">
            {t.about.facts.map((fact) => <div key={fact.label}><strong>{fact.value}</strong><span>{fact.label}</span></div>)}
          </div>
        </div>
      </section>

      <section className="section story-section" id="story">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">{t.story.eyebrow}</p>
            <h2>{t.story.title[0]}<br />{t.story.title[1]}</h2>
            <p>{t.story.copy}</p>
          </div>
          <div className="character-grid">
            {t.story.characters.map((character, index) => (
              <article className={`character-card ${character.tone}`} key={character.name}>
                <div className="character-image">
                  <Image src={character.image} alt={`${character.name} ${t.accessibility.characterImage}`} fill sizes="(max-width: 720px) 100vw, (max-width: 1050px) 50vw, 34vw" priority={index === 0} />
                  <span>0{index + 1}</span>
                </div>
                <div className="character-info">
                  <div><p>{character.role}</p><h3>{character.name}</h3></div>
                  <p>{character.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section project-section" id="projects">
        <div className="container">
          <div className="section-head project-heading">
            <p className="eyebrow">{t.projects.eyebrow}</p>
            <h2>{t.projects.title}</h2>
            <p>{t.projects.copy}</p>
          </div>
          <article className="project-card project-main">
            <Image src="/assets/storyboard-sunset.jpg" alt={t.projects.main.title} fill sizes="100vw" />
            <div className="project-overlay" />
            <div className="project-meta"><span>{t.projects.main.year}</span><span>{t.projects.main.roles}</span></div>
            <div className="project-title"><div><p>{t.projects.main.tag}</p><h3>{t.projects.main.title}</h3></div><button onClick={() => jumpTo("films")} aria-label={t.accessibility.projectVideo}>↗</button></div>
          </article>
          <div className="project-pair">
            <article className="project-card">
              <Image src="/assets/storyboard-rain.jpg" alt={t.projects.rain.title} fill sizes="(max-width: 720px) 100vw, 65vw" />
              <div className="project-overlay" />
              <div className="project-title"><div><p>{t.projects.rain.tag}</p><h3>{t.projects.rain.title}</h3></div><span>{t.projects.rain.meta}</span></div>
            </article>
            <article className="project-card vertical-project">
              <Image src="/assets/aureus.jpg" alt={t.projects.aureus.title} fill sizes="(max-width: 720px) 100vw, 35vw" />
              <div className="project-overlay" />
              <div className="project-title"><div><p>{t.projects.aureus.tag}</p><h3>{t.projects.aureus.title}</h3></div><span>{t.projects.aureus.meta}</span></div>
            </article>
          </div>
        </div>
      </section>

      <section className="section strength-section" id="strengths">
        <div className="container strength-layout">
          <div className="strength-sticky">
            <p className="eyebrow">{t.strengths.eyebrow}</p>
            <h2>{t.strengths.title[0]}<br />{t.strengths.title[1]}</h2>
            <p>{t.strengths.copy}</p>
          </div>
          <div className="strength-list">
            {t.strengths.items.map((item) => (
              <article key={item.no}>
                <span>{item.no}</span>
                <div><h3>{item.title}</h3><p>{item.text}</p></div>
                <span className="strength-arrow">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section film-section" id="films">
        <div className="container">
          <div className="section-head film-heading">
            <p className="eyebrow">{t.films.eyebrow}</p>
            <h2>{t.films.title}</h2>
            <p>{t.films.copy}</p>
          </div>
          <div className="film-stage">
            <video controls playsInline preload="metadata" poster="/assets/storyboard-sunset.jpg">
              <source src="/assets/wandou-homepage-0914.mp4" type="video/mp4" />
              {t.films.fallback}
            </video>
            <div className="film-badge">{t.films.badge}</div>
          </div>
          <div className="film-caption">
            <div><span>001</span><div><h3>{t.films.name}</h3><p>{t.films.status}</p></div></div>
            <p>{t.films.note}</p>
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-top">
          <p className="eyebrow">{t.footer.eyebrow}</p>
          <h2>{t.footer.title[0]}<br /><em>{t.footer.title[1]}</em></h2>
          <a href="#top">{t.footer.back}</a>
        </div>
        <div className="container footer-bottom">
          <div><span>{t.footer.producer}</span><strong>{t.footer.names}</strong></div>
          <blockquote>{t.footer.quote}</blockquote>
          <span>© 2026 WANDOU STUDIO</span>
        </div>
      </footer>
        </div>
      </div>
    </main>
  );
}
