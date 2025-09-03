export function handleCarousel(
  selector: string,
  carouselTrack: string,
  arrowLeft: string,
  arrowRight: string
) {
  const root = document.querySelector(selector);
  if (!root) return;

  const track = root.querySelector(carouselTrack);
  const btnPrev = root.querySelector(arrowLeft);
  const btnNext = root.querySelector(arrowRight);
  if (!track || !btnPrev || !btnNext) return;

  const cards = () => Array.from(track.children);
  let step = 0;

  function computeStep() {
    const first = cards()[0];
    if (!first) return;
    const rect = first.getBoundingClientRect();
    const styles = getComputedStyle(track);
    let gap = parseFloat(styles.gap || styles.columnGap || "0");
    if (!gap) {
      gap = 0;
    }
    step = rect.width + gap;
  }

  function scrollByStep(dir) {
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  function updateArrows() {
    const max = track.scrollWidth - track.clientWidth - 1;
    btnPrev.toggleAttribute("disabled", track.scrollLeft <= 1);
    btnNext.toggleAttribute("disabled", track.scrollLeft >= max);
  }

  btnPrev.addEventListener("click", () => scrollByStep(-1));
  btnNext.addEventListener("click", () => scrollByStep(1));
  track.addEventListener("scroll", () => {
    clearTimeout(track._t);
    track._t = setTimeout(updateArrows, 60);
  });
  window.addEventListener("resize", () => {
    computeStep();
    updateArrows();
  });

  computeStep();
  updateArrows();
}
