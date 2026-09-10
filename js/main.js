// Cursor
const cursor = document.getElementById("cursor");
let mouseX = 0,
  mouseY = 0,
  curX = 0,
  curY = 0;
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
(function animateCursor() {
  curX += (mouseX - curX) * 0.15;
  curY += (mouseY - curY) * 0.15;
  cursor.style.left = curX + "px";
  cursor.style.top = curY + "px";
  requestAnimationFrame(animateCursor);
})();
document
  .querySelectorAll("a,button,.news_card,.collective_card,.crafted_card")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hover");
      playUI("hover");
    });
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });

// --- PROFESSIONAL AUDIO ENGINE ---
let audioContext, masterGain, filterNode, analyser, audioCanvas, canvasCtx;
let isMuted = false,
  audioInitialized = false;
const audio_ambient = document.getElementById("audio_ambient");
const audio_voice_hero = document.getElementById("audio_voice_hero");
const audio_voice_manifesto = document.getElementById("audio_voice_manifesto");
const ui_hover = document.getElementById("ui_hover_audio");
const ui_click = document.getElementById("ui_click_audio");
const ui_open = document.getElementById("ui_open_audio");

function initAudio() {
  if (audioInitialized) return;
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioContext.createGain();
  filterNode = audioContext.createBiquadFilter();
  filterNode.type = "lowpass";
  filterNode.frequency.value = 18000;
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 64;
  masterGain.connect(filterNode);
  filterNode.connect(analyser);
  analyser.connect(audioContext.destination);
  masterGain.gain.value = 0.7;
  // Connect ambient audio element to Web Audio for processing
  try {
    const src = audioContext.createMediaElementSource(audio_ambient);
    src.connect(masterGain);
  } catch (e) {
    console.log("MediaElementSource fallback", e);
    audio_ambient.volume = 0.5;
  }
  // Canvas visualizer
  audioCanvas = document.getElementById("audio_canvas");
  canvasCtx = audioCanvas.getContext("2d");
  audioCanvas.width = 120;
  audioCanvas.height = 40;
  function drawVisualizer() {
    if (!analyser) return;
    requestAnimationFrame(drawVisualizer);
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    canvasCtx.clearRect(0, 0, audioCanvas.width, audioCanvas.height);
    const barW = (audioCanvas.width / data.length) * 2.2;
    data.forEach((v, i) => {
      const h = (v / 255) * audioCanvas.height;
      canvasCtx.fillStyle = `hsl(${55 + i * 3}, 100%, 65%)`;
      canvasCtx.fillRect(i * barW, audioCanvas.height - h, barW - 1, h);
    });
  }
  drawVisualizer();
  audioInitialized = true;
}

function playAmbient() {
  initAudio();
  if (audioContext.state === "suspended") audioContext.resume();
  audio_ambient.play().catch(() => {});
  // Subtle filter movement for professionalism
  if (filterNode) {
    let t = 0;
    setInterval(() => {
      t += 0.01;
      filterNode.frequency.value = 12000 + Math.sin(t) * 4000;
    }, 100);
  }
}
function stopAmbient() {
  audio_ambient.pause();
}

function playUI(type) {
  if (isMuted) return;
  initAudio();
  const el =
    type === "hover" ? ui_hover : type === "click" ? ui_click : ui_open;
  if (el) {
    el.currentTime = 0;
    el.volume = 0.35;
    el.play().catch(() => {});
  }
}
function playVoiceHero() {
  initAudio();
  if (isMuted) return;
  if (audioContext.state === "suspended") audioContext.resume();
  audio_voice_hero.currentTime = 0;
  audio_voice_hero.volume = 0.9;
  audio_voice_hero.play().catch(() => {});
}
function playVoiceManifesto() {
  initAudio();
  if (isMuted) return;
  audio_voice_manifesto.currentTime = 0;
  audio_voice_manifesto.volume = 0.85;
  audio_voice_manifesto.play().catch(() => {});
}

// Sound toggle
const soundToggle = document.getElementById("sound_toggle");
const soundState = document.getElementById("sound_state");
soundToggle.addEventListener("click", () => {
  initAudio();
  if (audioContext && audioContext.state === "suspended") audioContext.resume();
  isMuted = !isMuted;
  soundToggle.classList.toggle("muted", isMuted);
  soundState.textContent = isMuted ? "OFF" : "ON";
  if (isMuted) {
    if (masterGain)
      masterGain.gain.linearRampToValueAtTime(
        0,
        audioContext.currentTime + 0.3,
      );
    audio_ambient.volume = 0;
  } else {
    if (masterGain)
      masterGain.gain.linearRampToValueAtTime(
        0.7,
        audioContext.currentTime + 0.3,
      );
    audio_ambient.volume = 0.5;
    if (audio_ambient.paused) playAmbient();
  }
  playUI("click");
});

// Auto-init audio on first user interaction
document.addEventListener(
  "click",
  function firstClick() {
    initAudio();
    playAmbient();
    document.removeEventListener("click", firstClick);
  },
  { once: true },
);

// Loader with video progress
let pct = 0;
const pctEl = document.querySelector("#loader_percent span");
const bar = document.getElementById("loader_bar");
const loader = document.getElementById("loader");
const heroVideo = document.getElementById("hero_video");
let loaderInterval = setInterval(() => {
  pct += Math.random() * 5 + 1.2;
  if (pct >= 100) {
    pct = 100;
    clearInterval(loaderInterval);
    setTimeout(hideLoader, 600);
  }
  pctEl.innerHTML = Math.floor(pct) + "<i>%</i>";
  bar.style.width = pct + "%";
}, 70);
function hideLoader() {
  loader.style.transform = "translateY(-100%)";
  document.body.style.overflow = "";
  setTimeout(() => (loader.style.display = "none"), 1000);
  // Play hero voice after loader
  setTimeout(() => {
    if (!isMuted) playVoiceHero();
  }, 800);
}
document.getElementById("loader_skip").addEventListener("click", () => {
  clearInterval(loaderInterval);
  pctEl.innerHTML = "100<i>%</i>";
  bar.style.width = "100%";
  hideLoader();
  playUI("open");
});
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    document.getElementById("loader_skip").click();
  }
});
document.body.style.overflow = "hidden";

// Header menu
const ham = document.getElementById("ham");
const menu = document.getElementById("menu");
ham.addEventListener("click", () => {
  ham.classList.toggle("active");
  menu.classList.toggle("open");
  document.body.style.overflow = menu.classList.contains("open")
    ? "hidden"
    : "";
  playUI(menu.classList.contains("open") ? "open" : "click");
});
document.querySelectorAll(".menu_link").forEach((l) => {
  l.addEventListener("click", () => {
    ham.classList.remove("active");
    menu.classList.remove("open");
    document.body.style.overflow = "";
    playUI("click");
  });
});

// Reveal
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("in");
    });
  },
  { threshold: 0.15 },
);
reveals.forEach((r) => io.observe(r));

// Scroll effects with video sync
const tracks = document.querySelectorAll(".vision_media_track");
window.addEventListener("scroll", () => {
  tracks.forEach((track) => {
    const rect = track.parentElement.getBoundingClientRect();
    const progress =
      (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const speed = parseFloat(track.dataset.speed) || 1;
    const x = (progress - 0.5) * 200 * speed;
    track.style.transform = `translateX(${x}px)`;
  });
  document.querySelectorAll(".parallax").forEach((vid) => {
    const rect = vid.parentElement.getBoundingClientRect();
    const p = rect.top / window.innerHeight;
    vid.style.transform = `translateY(${p * -80}px) scale(1.1)`;
    // Video playback rate reacts to scroll for pro feel
    if (vid.tagName === "VIDEO") {
      vid.playbackRate = 0.7 + Math.abs(p) * 0.5;
    }
  });
  const cl = document.getElementById("color_line");
  const cr = cl.getBoundingClientRect();
  if (cr.top < window.innerHeight && cr.bottom > 0) {
    const prog = 1 - cr.top / window.innerHeight;
    [...cl.children].forEach((div, i) => {
      div.style.transform = `scaleY(${0.3 + Math.sin(prog * 3 + i * 0.4) * 0.7 + prog})`;
    });
  }
  const planets = document.getElementById("planets");
  const pr = planets.getBoundingClientRect();
  const prog2 = Math.min(
    Math.max(-pr.top / (pr.height - window.innerHeight), 0),
    1,
  );
  const bgVids = document.querySelectorAll(
    "#planets_bg video, #planets_bg img",
  );
  let idx = Math.floor(prog2 * bgVids.length);
  if (idx >= bgVids.length) idx = bgVids.length - 1;
  bgVids.forEach((im, i) => im.classList.toggle("active", i === idx));
  const hero = document.getElementById("hero");
  const hr = hero.getBoundingClientRect();
  const heroProg = Math.min(Math.max(-hr.top / window.innerHeight, 0), 1);
  document.getElementById("hero_dot").style.transform =
    `translate(-50%,-50%) scale(${1 + heroProg * 0.6})`;
  document.getElementById("hero_dot_inner").style.opacity = 1 - heroProg * 0.8;
  // Audio filter reacts to scroll
  if (filterNode && audioContext) {
    filterNode.frequency.value = 8000 + heroProg * 8000;
  }
});

// System slider
let sysIndex = 0;
const sysTrack = document.getElementById("system_track");
const sysSlides = document.querySelectorAll(".system_slide");
function updateSys() {
  sysTrack.style.transform = `translateX(-${sysIndex * 100}%)`;
  playUI("click");
}
document.getElementById("sys_next").addEventListener("click", () => {
  sysIndex = (sysIndex + 1) % sysSlides.length;
  updateSys();
});
document.getElementById("sys_prev").addEventListener("click", () => {
  sysIndex = (sysIndex - 1 + sysSlides.length) % sysSlides.length;
  updateSys();
});
let sysAuto = setInterval(() => {
  sysIndex = (sysIndex + 1) % sysSlides.length;
  sysTrack.style.transform = `translateX(-${sysIndex * 100}%)`;
}, 6000);

// Realms tabs with video
const realmData = [
  {
    t: "Celestial — Real Dome Video",
    d: "A fully realized cosmos displayed inside a luminous dome — real 16K video capture, no CGI. Spatial audio.",
  },
  {
    t: "Pulse — Concert Video",
    d: "Concert mode: 270° real video that breathes with bass, audience as part of the lighting instrument.",
  },
  {
    t: "Canvas — Art Video",
    d: "Media performance: classical orchestra meets generative real video, storytelling through photons.",
  },
  {
    t: "Arena — Sports Video",
    d: "Live sports in hyper-immersion — real video as if court-side, but inside the ball itself.",
  },
  {
    t: "Atelier — Private Video",
    d: "Private events: brand rituals, launches, and receptions where video itself is the invitation.",
  },
];
const realmVids = document.querySelectorAll("#realms_stage video");
const realmInfo = document.getElementById("realms_info");
document.querySelectorAll(".realm_tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".realm_tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const i = parseInt(tab.dataset.i);
    realmVids.forEach((im, ii) => im.classList.toggle("active", ii === i));
    realmInfo.querySelector("h4").textContent = realmData[i].t;
    realmInfo.querySelector("p").textContent = realmData[i].d;
    playUI("click");
    // Play corresponding video from start
    realmVids[i].currentTime = 0;
    realmVids[i].play().catch(() => {});
  });
});

// News drag
const newsTrack = document.getElementById("news_track");
let isDown = false,
  startX,
  scrollLeft;
newsTrack.addEventListener("mousedown", (e) => {
  isDown = true;
  newsTrack.classList.add("active");
  startX = e.pageX - newsTrack.offsetLeft;
  scrollLeft = newsTrack.scrollLeft;
});
newsTrack.addEventListener("mouseleave", () => {
  isDown = false;
});
newsTrack.addEventListener("mouseup", () => {
  isDown = false;
});
newsTrack.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - newsTrack.offsetLeft;
  const walk = (x - startX) * 1.5;
  newsTrack.scrollLeft = scrollLeft - walk;
});
newsTrack.addEventListener(
  "touchstart",
  (e) => {
    startX = e.touches[0].pageX - newsTrack.offsetLeft;
    scrollLeft = newsTrack.scrollLeft;
  },
  { passive: true },
);
newsTrack.addEventListener(
  "touchmove",
  (e) => {
    const x = e.touches[0].pageX - newsTrack.offsetLeft;
    const walk = (x - startX) * 1.5;
    newsTrack.scrollLeft = scrollLeft - walk;
  },
  { passive: true },
);

// Modal
const modal = document.getElementById("film_modal");
document.querySelectorAll(".open_film").forEach((b) =>
  b.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("open");
    playUI("open");
  }),
);
document.getElementById("film_close").addEventListener("click", () => {
  modal.classList.remove("open");
  playUI("click");
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("open");
    playUI("click");
  }
});

// Manifesto voice button
document.getElementById("play_manifesto").addEventListener("click", () => {
  playVoiceManifesto();
  playUI("click");
});

// Video autoplay fallback for browsers blocking autoplay
document.querySelectorAll("video").forEach((v) => {
  v.muted = true;
  const p = v.play();
  if (p)
    p.catch(() => {
      // Show fallback image if video fails
      const fallback = v.parentElement.querySelector(".fallback");
      if (fallback) fallback.style.display = "block";
    });
});

// Keyboard accessibility for sound
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "m") {
    soundToggle.click();
  }
});
