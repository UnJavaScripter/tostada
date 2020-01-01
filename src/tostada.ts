interface Options {
  position: string;
  style?: object;
  displayTime: number;
}

enum PositionYValues {
  top = "top",
  bottom = "bottom" 
}

interface ToastPosition {
  x: string;
  y: string;
}

class DcTostada {
  defaultOptions: Options = { position: 'bottom-center', displayTime: 2500 };
  globalOptions: Options;
  toastsContainer: HTMLElement;
  toastOriginPosition: ToastPosition;

  constructor(customOptions: Options) {
    this.globalOptions = { ...this.defaultOptions, ...customOptions };
    this.toastOriginPosition = this.__getPositionFromString(this.globalOptions.position);
    const containerIdentificator = '--tst--toast-container';
    const styles = document.createElement("style");
    styles.innerHTML = this.__getStyle(this.toastOriginPosition);
    document.head.appendChild(styles);

    this.toastsContainer = document.createElement("section");
    // TODO: Add more attributes. Support A11y
    this.toastsContainer.id = containerIdentificator;
    this.toastsContainer.classList.add(containerIdentificator);
    document.body.appendChild(this.toastsContainer);
  }

  __getFlexPropertyValue(value: string) {
    switch (value) {
      case 'left':
        return 'flex-start';
      case 'center':
        return 'center';
      case 'right':
        return 'flex-end';
      default:
        return 'center';
    }
  }

  __getStyle(position: ToastPosition) {
    return `
      .--tst--toast-container {
        display: flex;
        justify-content: ${this.__getFlexPropertyValue(position.x)}
      }
      .--tst--tostada {
        background-color: #1f1f1f;
        color: #f3f3f3;
        padding: 0.75rem;
        margin-${position.y}: 0.6875rem;
        ${position.y}: 0;
        font-family: sans-serif;
        position: fixed;
        transform: translateY(100%);
        opacity: 0;
        will-change: transform, opacity;
      }
      .--tst--visible {
        transform: translateY(0%);
        opacity: 1;
      }
      .--tst--tostada.--tst--animatable {
        transition: opacity 0.3s cubic-bezier(0,0,0.3,1), transform 0.5s cubic-bezier(0,0,0.3,1);
      }
      .--tst--tostada.--tst--animatable.--tst--visible {
        transition: opacity 0.5s cubic-bezier(0,0,0.3,1), transform 0.3s cubic-bezier(0,0,0.3,1);
      }
    `;
  }

  __getPositionFromString(positionStr: string): ToastPosition {
    const positionRegEx = new RegExp(/[a-zA-Z]+/gui);
    const positionValues = positionStr.match(positionRegEx)!;

    return { x: positionValues[1], y: positionValues[0] }
  }

  // Display a toast
  show(message: string, options: Options): void {
    try {
      if(options.position) {
        throw("can\'t set the position for an individual toast");
      }
    } catch(err) {
      console.warn("Toast options error:", err);
    }
    const customOptions = { ...this.globalOptions, ...options };

    new Tostada(message, customOptions, this.toastOriginPosition, this.toastsContainer)
  }
}

enum MarginKeys {
  top = "marginTop",
  bottom = "marginBottom"
}

class Tostada {
  options: Options;
  position: ToastPosition;
  container: HTMLElement;
  constructor(message: string, options: Options, position: ToastPosition, container: HTMLElement) {
    this.options = options;
    this.position = position;
    this.container = container;

    const toastPack = this.container.childNodes;
    const nextPos = (100 * (toastPack.length - 1)) + (toastPack.length * 10);
    const toast = document.createElement("article");


    Object.assign(toast.style, this.options.style);

    toast.classList.add("--tst--tostada");

    window.requestAnimationFrame(() => {
      setTimeout(() => {
        toast.classList.add("--tst--animatable");
        toast.classList.add("--tst--visible");
      }, 0);
    });
    // If initial position is bottom add positive value to initial y, else, add negative
    if(this.position.y === "bottom") {
      toast.style.transform = `translateY(-${nextPos + 100}%)`;
      toast.style[MarginKeys.bottom] = '0.6875rem';
      toast.style[PositionYValues.bottom] = '0';
    }else {
      toast.style.transform = `translateY(${nextPos + 100}%)`;
      toast.style[MarginKeys.top] = '0.6875rem';
      toast.style[PositionYValues.top] = '0';
      toast.style[PositionYValues.bottom] = 'unset';
    }

    toast.innerText = message;

    toast.addEventListener("transitionend", () => {
      this.__handleToastRemoval(toast);
    });

    this.container.appendChild(toast);

    this.__crunchToast(toast, options.displayTime);
  }

  // Initiate toast removal
  __crunchToast(elem: HTMLElement, displayTime: number) {
    setTimeout(() => {
      this.__hideToast(elem);
    }, displayTime);
  }

  // Hide a toast
  __hideToast(elem: HTMLElement) {
    elem.classList.add("--tst--crunchable");
    elem.classList.remove("--tst--visible");
  }

  // Destroy toast when hidden
  __handleToastRemoval(elem: HTMLElement) {
    const container = elem.parentNode;

    if (elem.classList.contains("--tst--crunchable") && container) {
      const siblings = container.childNodes;
      container.removeChild(elem);
      if (siblings.length) {
        siblings.forEach((toastElem: ChildNode) => {
          const re = /\d+/g;
          let toast = toastElem as HTMLElement;
          let match: RegExpExecArray | null;
          match = re.exec(toast.style.transform);
          if (match !== null) {
            let addToTranslateY = false;
            if(this.position.y === "bottom") {
              addToTranslateY = true;
            }
            toast.style.transform = `translateY(${ addToTranslateY ? '-' : ''}${Number(match) - 110}%)`;
          }
        })
      }
    }
  }
}