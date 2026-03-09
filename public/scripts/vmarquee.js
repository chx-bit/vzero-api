/*!
 * vMarquee v1.0.0
 * Flexible, scalable marquee library
 * https://github.com/chx-bit/vmarquee
 * MIT License
 */

(function (global) {
    const DEFAULTS = {
        direction: "left",
        speed: 8000,
        gap: 48,
        pauseOnHover: true,
        rotate: 0
    };

    const ANIMATION_MAP = {
        left: "vmarquee-left",
        right: "vmarquee-right",
        up: "vmarquee-up",
        down: "vmarquee-down"
    };

    function injectStyles() {
        if (document.getElementById("vmarquee-styles")) return;

        const style = document.createElement("style");
        style.id = "vmarquee-styles";
        style.textContent = `
      .vmarquee {
        overflow: hidden;
        display: block;
      }
      .vmarquee__track {
        display: flex;
        width: max-content;
        will-change: transform;
        flex-shrink: 0;
      }
      .vmarquee[data-direction="up"] .vmarquee__track,
      .vmarquee[data-direction="down"] .vmarquee__track {
        flex-direction: column;
        width: auto;
        height: max-content;
      }
      .vmarquee__item {
        flex-shrink: 0;
        display: inline-block;
      }
      @keyframes vmarquee-left  { from { transform: translateX(0); }                         to { transform: translateX(var(--vm-offset)); } }
      @keyframes vmarquee-right { from { transform: translateX(var(--vm-offset)); }           to { transform: translateX(0); } }
      @keyframes vmarquee-up    { from { transform: translateY(0); }                         to { transform: translateY(var(--vm-offset)); } }
      @keyframes vmarquee-down  { from { transform: translateY(var(--vm-offset)); }           to { transform: translateY(0); } }
    `;
        document.head.appendChild(style);
    }

    class VMarquee {
        constructor(el) {
            this.el = el;
            this.options = this._parseOptions();
            this.track = null;
            this.paused = false;
            this._build();
            this._attachEvents();
        }

        _parseOptions() {
            const d = this.el.dataset;
            return {
                direction: d.direction || DEFAULTS.direction,
                speed: parseFloat(d.speed) || DEFAULTS.speed,
                gap: parseFloat(d.gap) || DEFAULTS.gap,
                pauseOnHover: d.pauseOnHover !== "false",
                rotate: parseFloat(d.rotate) || DEFAULTS.rotate
            };
        }

        _build() {
            const { direction, gap, speed, rotate } = this.options;
            const isVertical = direction === "up" || direction === "down";

            this.el.setAttribute("data-direction", direction);

            const track = document.createElement("div");
            track.className = "vmarquee__track";
            this.track = track;

            const originalContent = this.el.innerHTML.trim();
            this.el.innerHTML = "";

            const firstItem = document.createElement("div");
            firstItem.className = "vmarquee__item";
            firstItem.innerHTML = originalContent;

            if (isVertical) {
                firstItem.style.paddingBottom = gap + "px";
            } else {
                firstItem.style.paddingRight = gap + "px";
            }

            if (rotate !== 0) {
                firstItem.style.transform = `rotate(${rotate}deg)`;
            }

            track.appendChild(firstItem);
            this.el.appendChild(track);

            requestAnimationFrame(() => {
                const itemSize = isVertical
                    ? firstItem.offsetHeight
                    : firstItem.offsetWidth;

                const containerSize = isVertical
                    ? this.el.offsetHeight
                    : this.el.offsetWidth;

                const needed = Math.ceil((containerSize * 3) / itemSize) + 1;

                for (let i = 1; i < needed; i++) {
                    const clone = firstItem.cloneNode(true);
                    track.appendChild(clone);
                }

                track.style.setProperty("--vm-offset", `-${itemSize}px`);
                track.style.animation = `${ANIMATION_MAP[direction]} ${speed}ms linear infinite`;
            });
        }

        _attachEvents() {
            if (!this.options.pauseOnHover) return;
            this.el.addEventListener("mouseenter", () => this.pause());
            this.el.addEventListener("mouseleave", () => this.play());
        }

        pause() {
            if (!this.track) return;
            this.track.style.animationPlayState = "paused";
            this.paused = true;
        }

        play() {
            if (!this.track) return;
            this.track.style.animationPlayState = "running";
            this.paused = false;
        }

        destroy() {
            this.el.removeEventListener("mouseenter", this.pause);
            this.el.removeEventListener("mouseleave", this.play);
            if (this.track) this.track.style.animation = "none";
        }

        updateSpeed(ms) {
            this.options.speed = ms;
            if (this.track) {
                const current = this.track.style.animation;
                this.track.style.animation = current.replace(
                    /\d+ms/,
                    ms + "ms"
                );
            }
        }
    }

    function init(selector) {
        injectStyles();
        const els = document.querySelectorAll(selector || ".vmarquee");
        const instances = [];
        els.forEach(el => {
            if (el._vmarquee) return;
            const instance = new VMarquee(el);
            el._vmarquee = instance;
            instances.push(instance);
        });
        return instances;
    }

    function getInstance(el) {
        return el._vmarquee || null;
    }

    const vMarquee = { init, getInstance, VMarquee };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = vMarquee;
    } else {
        global.vMarquee = vMarquee;
    }
})(typeof window !== "undefined" ? window : this);
