(() => {
  "use strict";

  // ---------- Photo data ----------
  // Add or remove items here. The grid, filters and lightbox update automatically.
  const PHOTO_IDS = [
    { id: "photo-1501785888041-af3ef285b470", category: "nature", title: "Mountain lake",      alt: "Mountain lake surrounded by pine trees" },
    { id: "photo-1469474968028-56623f02e42e", category: "nature", title: "Open road",          alt: "Sunlit road winding through green hills" },
    { id: "photo-1506905925346-21bda4d32df4", category: "nature", title: "Snow peak",          alt: "Snow covered mountain peak under blue sky" },
    { id: "photo-1441974231531-c6227db76b6e", category: "nature", title: "Forest path",        alt: "Forest path with sunlight through the trees" },
    { id: "photo-1470071459604-3b5ec3a7fe05", category: "nature", title: "Misty valley",       alt: "Misty valley with rolling hills at sunrise" },
    { id: "photo-1433086966358-54859d0ed716", category: "nature", title: "Waterfall",          alt: "Waterfall falling over rocks into a pool" },
    { id: "photo-1477959858617-67f85cf4f1df", category: "city",   title: "Night city",         alt: "City skyline lit up at night" },
    { id: "photo-1449824913935-59a10b8d2000", category: "city",   title: "City street",        alt: "Busy street between tall buildings" },
    { id: "photo-1480714378408-67cf0d13bc1b", category: "city",   title: "Glass towers",       alt: "Modern glass buildings against a clear sky" },
    { id: "photo-1482938289607-e9573fc25ebb", category: "coast",  title: "Quiet shore",        alt: "Calm sea meeting a sandy beach" },
    { id: "photo-1507525428034-b723cf961d3e", category: "coast",  title: "Turquoise bay",      alt: "Turquoise water along a tropical beach" },
    { id: "photo-1505142468610-359e7d316be0", category: "coast",  title: "Ocean waves",        alt: "Waves rolling onto the shore at dusk" }
  ].map((p, index) => ({
    ...p,
    index,
    thumb: `https://images.unsplash.com/${p.id}?w=800&q=80`,
    full: `https://images.unsplash.com/${p.id}?w=1600&q=85`,
    fallback: `https://picsum.photos/seed/gallery-${index}/800/600`
  }));

  const PAGE_SIZE = 6;

  // ---------- Elements ----------
  const gallery = document.getElementById("gallery");
  const loadMoreBtn = document.getElementById("loadMore");
  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbTitle = document.getElementById("lbTitle");
  const lbCount = document.getElementById("lbCount");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  // ---------- State ----------
  let activeFilter = "all";
  let visibleCount = PAGE_SIZE;
  let filtered = [];
  let currentIndex = 0;

  // ---------- Rendering ----------
  function getFiltered() {
    return activeFilter === "all"
      ? PHOTO_IDS
      : PHOTO_IDS.filter((p) => p.category === activeFilter);
  }

  function cardTemplate(photo, position) {
    const delay = `${(position % PAGE_SIZE) * 0.08}s`;
    return `
      <figure class="gallery-item" style="--delay: ${delay}">
        <button class="thumb" type="button" data-position="${position}" aria-label="Open photo: ${photo.title}">
          <img src="${photo.thumb}" alt="${photo.alt}" loading="lazy" data-fallback="${photo.fallback}">
        </button>
        <figcaption>${photo.title}</figcaption>
      </figure>
    `;
  }

  function render() {
    filtered = getFiltered();
    const shown = filtered.slice(0, visibleCount);

    gallery.innerHTML = shown.map((photo, i) => cardTemplate(photo, i)).join("");

    loadMoreBtn.hidden = visibleCount >= filtered.length;

    if (filtered.length === 0) {
      gallery.innerHTML = `<p class="empty">No photos in this category yet.</p>`;
    }
  }

  // ---------- Filters ----------
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      visibleCount = PAGE_SIZE;

      filterButtons.forEach((btn) => {
        btn.setAttribute("aria-pressed", String(btn === button));
      });

      render();
    });
  });

  // ---------- Load more ----------
  loadMoreBtn.addEventListener("click", () => {
    visibleCount += PAGE_SIZE;
    const previousCount = gallery.children.length;
    render();

    // Move focus to the first newly added photo for keyboard users
    const newThumb = gallery.querySelectorAll(".thumb")[previousCount];
    if (newThumb) newThumb.focus({ preventScroll: true });
  });

  // ---------- Image fallback when an Unsplash link fails ----------
  gallery.addEventListener(
    "error",
    (event) => {
      const img = event.target;
      if (img.tagName !== "IMG" || img.dataset.usedFallback) return;
      img.dataset.usedFallback = "true";
      img.src = img.dataset.fallback;
    },
    true // capture: image errors do not bubble
  );

  // ---------- Lightbox ----------
  function showPhoto(position) {
    const count = filtered.length;
    currentIndex = (position + count) % count;
    const photo = filtered[currentIndex];

    lbImg.src = photo.full;
    lbImg.alt = photo.alt;
    lbTitle.textContent = photo.title;
    lbCount.textContent = `${currentIndex + 1} / ${count}`;
  }

  function openLightbox(position) {
    showPhoto(position);
    lightbox.showModal();
  }

  gallery.addEventListener("click", (event) => {
    const thumb = event.target.closest(".thumb");
    if (!thumb) return;
    openLightbox(Number(thumb.dataset.position));
  });

  lbPrev.addEventListener("click", () => showPhoto(currentIndex - 1));
  lbNext.addEventListener("click", () => showPhoto(currentIndex + 1));
  lbClose.addEventListener("click", () => lightbox.close());

  // Click on the dark backdrop closes the lightbox
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  // Arrow keys move between photos (Escape is handled by the <dialog> element)
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showPhoto(currentIndex - 1);
    if (event.key === "ArrowRight") showPhoto(currentIndex + 1);
  });

  // Return focus to the thumbnail that opened the lightbox
  let lastFocused = null;
  gallery.addEventListener("click", (event) => {
    lastFocused = event.target.closest(".thumb");
  });

  lightbox.addEventListener("close", () => {
    if (lastFocused) lastFocused.focus({ preventScroll: true });
  });

  // ---------- Start ----------
  render();
})();