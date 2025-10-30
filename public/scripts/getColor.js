function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h, s, l];
}
function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
function darkenRGB([r, g, b], amount = 0.35) {
  const [h, s, l] = rgbToHsl(r, g, b);
  const l2 = Math.max(0, l - amount);
  return hslToRgb(h, s, l2);
}
function rgbString([r, g, b]) {
  return `rgb(${r}, ${g}, ${b})`;
}

// Color dominante (promedio simple en lienzo pequeño)
function averageColor(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;

    img.onload = () => {
      try {
        const size = 20;
        const c = document.createElement("canvas");
        c.width = c.height = size;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        let r = 0,
          g = 0,
          b = 0,
          n = 0;
        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          if (a < 10) continue; // ignora transparentes
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          n++;
        }
        if (n === 0) return reject(new Error("No pixels"));
        resolve([Math.round(r / n), Math.round(g / n), Math.round(b / n)]);
      } catch (e) {
        reject(e); // canvas tainted, etc.
      }
    };
    img.onerror = reject;
  });
}

export function getColor() {
  (async () => {
    const banner = document.getElementById("banner");
    const avatar = document.getElementById("avatar");
    const fallback = document.getElementById("bg-fallback");
    const url = avatar.currentSrc || avatar.src;

    try {
      const rgb = await averageColor(url);
      const dark = darkenRGB(rgb, 0.4);
      banner.style.setProperty("--dom", rgbString(rgb));
      banner.style.setProperty("--dom-dark", rgbString(dark));
      // asegurar que el fallback quede oculto
      fallback.style.display = "none";
    } catch (err) {
      // Fallback: blur de la misma imagen como fondo
      console.warn("Dominant color failed, using blur fallback:", err);
      fallback.style.display = "block";
      fallback.style.backgroundImage = `url('${url}')`;
    }
  })();
}
