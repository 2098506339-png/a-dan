"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";

const sections = [
  { id: "story", label: "漫剧经历", keywords: "经历 漫剧 人物 风遇画音" },
  { id: "projects", label: "精选项目", keywords: "项目 作品 角色 分镜" },
  { id: "strengths", label: "个人优势", keywords: "优势 能力 编程 创意" },
  { id: "films", label: "作品视频", keywords: "视频 成果 样片" },
  { id: "about", label: "关于豌豆", keywords: "介绍 个人 爱好" },
];

const characters = [
  {
    name: "森川汐",
    role: "声音记录者",
    image: "/assets/morigawa-shio.png",
    description: "在雨声与城市回响里收集生活，用温柔的声音照亮他人的世界。",
    tone: "warm",
  },
  {
    name: "凌渊",
    role: "澜风剑宗首席",
    image: "/assets/lingyuan.png",
    description: "外表温和有礼，内心沉静坚定；一位以水为意、以剑为路的少年。",
    tone: "blue",
  },
  {
    name: "有药",
    role: "苍灵散人",
    image: "/assets/youyao.png",
    description: "散漫、神秘又带一点幽默感，让东方奇幻人物拥有鲜明的记忆点。",
    tone: "gold",
  },
];

const strengths = [
  { no: "01", title: "AI 视觉叙事", text: "从角色设定到画面氛围，把一个想法发展成能被看见的故事。" },
  { no: "02", title: "角色与分镜", text: "关注人物性格、镜头情绪和光影变化，让静态画面也有剧情张力。" },
  { no: "03", title: "编程与交互", text: "喜欢编程，也愿意把技术变成作品表达的一部分。" },
  { no: "04", title: "好奇与行动力", text: "13 岁，热爱乐高、高尔夫与创作；想到就动手，边做边学。" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return sections.slice(0, 4);
    return sections.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(value));
  }, [query]);

  function jumpTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setShowResults(false);
  }

  function onSearch(event: FormEvent) {
    event.preventDefault();
    jumpTo(results[0]?.id ?? "projects");
  }

  return (
    <main>
      <section className="hero" id="top">
        <video className="hero-video" autoPlay muted loop playsInline poster="/assets/storyboard-sunset.png" aria-label="科技城市动态背景">
          <source src="https://videos.pexels.com/video-files/34719182/14717093_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <div className="noise" />

        <header className="nav-shell">
          <a className="brand" href="#top" aria-label="返回首页">
            <span className="brand-mark">W</span>
            <span>豌豆 / WANDOU</span>
          </a>
          <nav className="nav-links" aria-label="主导航">
            <a href="#story">漫剧经历</a>
            <a href="#projects">精选项目</a>
            <a href="#strengths">个人优势</a>
            <a href="#films">作品视频</a>
          </nav>
          <a className="nav-index" href="#about">ABOUT ↗</a>
        </header>

        <div className="hero-content container">
          <div className="hero-kicker"><span /> AI COMIC CREATOR · 2026</div>
          <h1>把想象力，<em>做成一场电影。</em></h1>
          <div className="hero-bottom">
            <p>我是豌豆，一名正在长大的 AI 漫剧创作者。<br />角色、分镜、编程，都是我讲故事的方式。</p>
            <form className="search" onSubmit={onSearch} role="search">
              <label htmlFor="site-search">搜索作品或内容</label>
              <div className="search-control">
                <span aria-hidden="true">⌕</span>
                <input id="site-search" value={query} onChange={(event) => { setQuery(event.target.value); setShowResults(true); }} onFocus={() => setShowResults(true)} placeholder="试试“风遇画音”" autoComplete="off" />
                <button type="submit" aria-label="搜索">↵</button>
              </div>
              {showResults && (
                <div className="search-results">
                  {results.length > 0 ? results.map((item) => (
                    <button type="button" key={item.id} onClick={() => jumpTo(item.id)}><span>{item.label}</span><span>跳转 ↗</span></button>
                  )) : <p>没有完全匹配的内容，按回车看看精选项目。</p>}
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="hero-rail"><span>SCROLL TO EXPLORE</span><a href="#story" aria-label="向下浏览">↓</a></div>
      </section>

      <section className="intro-band" id="about">
        <div className="container intro-grid">
          <p className="eyebrow">ABOUT / 关于我</p>
          <div>
            <h2>活泼、好奇，<br />也认真对待每一个镜头。</h2>
            <p className="intro-copy">我叫豌豆，13 岁，是一名学生。喜欢拼乐高、打高尔夫、编程，也喜欢做漫剧。第一次接触 AI 漫剧后，我和老师一起完成了《风遇画音》——原来技术和故事，可以一起变得很有趣。</p>
          </div>
          <div className="facts">
            <div><strong>13</strong><span>YEARS OLD</span></div>
            <div><strong>01+</strong><span>AI COMIC</span></div>
            <div><strong>∞</strong><span>IDEAS</span></div>
          </div>
        </div>
      </section>

      <section className="section story-section" id="story">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">01 / AI COMIC STORY</p>
            <h2>从第一次尝试，<br />到一个自己的角色宇宙。</h2>
            <p>老师带我打开 AI 漫剧的大门。我们从一段故事开始，做角色、想镜头、调气氛，最后让《风遇画音》真正动起来。</p>
          </div>
          <div className="character-grid">
            {characters.map((character, index) => (
              <article className={`character-card ${character.tone}`} key={character.name}>
                <div className="character-image">
                  <Image src={character.image} alt={`${character.name}人物设定图`} fill sizes="(max-width: 720px) 100vw, (max-width: 1050px) 50vw, 34vw" priority={index === 0} />
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
            <p className="eyebrow">02 / SELECTED PROJECTS</p>
            <h2>精选项目</h2>
            <p>每张设定图、每个分镜，都是世界观的一块拼图。</p>
          </div>
          <article className="project-card project-main">
            <Image src="/assets/storyboard-sunset.png" alt="风遇画音天桥夕阳分镜" fill sizes="100vw" />
            <div className="project-overlay" />
            <div className="project-meta"><span>AI 漫剧 · 2026</span><span>导演 / 分镜 / 视觉</span></div>
            <div className="project-title"><div><p>FIRST AI COMIC</p><h3>风遇画音</h3></div><button onClick={() => jumpTo("films")} aria-label="查看风遇画音视频">↗</button></div>
          </article>
          <div className="project-pair">
            <article className="project-card">
              <Image src="/assets/storyboard-rain.png" alt="风遇画音雨夜分镜" fill sizes="(max-width: 720px) 100vw, 65vw" />
              <div className="project-overlay" />
              <div className="project-title"><div><p>STORYBOARD</p><h3>雨夜 · 分镜实验</h3></div><span>07 SHOTS</span></div>
            </article>
            <article className="project-card vertical-project">
              <Image src="/assets/aureus.png" alt="黄金斩影角色设定" fill sizes="(max-width: 720px) 100vw, 35vw" />
              <div className="project-overlay" />
              <div className="project-title"><div><p>CHARACTER DESIGN</p><h3>黄金斩影</h3></div><span>ROLE STUDY</span></div>
            </article>
          </div>
        </div>
      </section>

      <section className="section strength-section" id="strengths">
        <div className="container strength-layout">
          <div className="strength-sticky">
            <p className="eyebrow">03 / MY STRENGTHS</p>
            <h2>小小年纪，<br />认真创作。</h2>
            <p>把兴趣变成能力，把每次尝试变成下一次进步的起点。</p>
          </div>
          <div className="strength-list">
            {strengths.map((item) => (
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
            <p className="eyebrow">04 / FILMS</p>
            <h2>让画面开始呼吸。</h2>
            <p>从一帧到下一帧，故事有了时间，也有了声音。</p>
          </div>
          <div className="film-stage">
            <video controls playsInline preload="metadata" poster="/assets/storyboard-sunset.png">
              <source src="https://videos.pexels.com/video-files/34719182/14717093_1920_1080_30fps.mp4" type="video/mp4" />
              你的浏览器暂不支持视频播放。
            </video>
            <div className="film-badge">CONCEPT PREVIEW</div>
          </div>
          <div className="film-caption">
            <div><span>001</span><div><h3>《风遇画音》概念预览</h3><p>AI COMIC · COMING SOON</p></div></div>
            <p>当前基础版使用氛围样片作为视频占位。后续提供成片后，可直接替换为正式作品视频。</p>
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-top">
          <p className="eyebrow">THE STORY CONTINUES</p>
          <h2>下一帧，<br /><em>会是什么？</em></h2>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
        <div className="container footer-bottom">
          <div><span>制作人</span><strong>豌豆 · 花花</strong></div>
          <blockquote>“我是豌豆，爱吃豌豆”</blockquote>
          <span>© 2026 WANDOU STUDIO</span>
        </div>
      </footer>
    </main>
  );
}
