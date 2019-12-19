interface Options {
  position: string;
  style?: object;
  displayTime: number;
}

interface ToastPosition {
  x: string;
  y: string;
}

class DcTostada {
  defaultOptions: Options = { position: 'bottom-center', displayTime: 2500 };
  globalOptions: Options;
  toastsContainer: HTMLElement;

  constructor(customOptions: Options) {
    this.globalOptions = { ...this.defaultOptions, ...customOptions };
    const styles = document.createElement('style');
    const containerIdentificator = '--tst--toast-container';
    const position = this.__getOptions().toastPosition;
    styles.innerHTML = this.__getStyle(position);
    document.head.appendChild(styles);

    this.toastsContainer = document.createElement('section');
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
        font-family: sans-serif;
        ${position.y}: 0;
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

  __getOptions() {
    return {
      ...this.globalOptions,
      ...{ toastPosition: this.__getToastsPosition() }
    }
  }

  __getToastsPosition() {
    const positionRegEx = new RegExp(/[a-zA-Z]+/gui);
    const positionValues = this.globalOptions.position.match(positionRegEx)!;

    return { x: positionValues[1], y: positionValues[0] }
  }

  // Initiate toast removal
  __crunchToast(elem: HTMLElement, displayTime: number) {
    setTimeout(() => {
      this.__hideToast(elem);
    }, displayTime);
  }

  // Hide a toast
  __hideToast(elem: HTMLElement) {
    elem.classList.add('--tst--crunchable');
    elem.classList.remove('--tst--visible');
  }

  // Destroy toast when hidden
  __handleToastRemoval(elem: HTMLElement) {
    const container = elem.parentNode;

    if (elem.classList.contains('--tst--crunchable') && container) {
      const toastYPosition = this.__getOptions().toastPosition.y;
      const siblings = container.childNodes;
      container.removeChild(elem);
      if (siblings.length) {
        siblings.forEach((toast: ChildNode) => {
          const re = /\d+/g;
          let t = toast as HTMLElement;
          let match: RegExpExecArray | null;
          match = re.exec(t.style.transform);
          if (match !== null) {
            t.style.transform = `translateY(${toastYPosition === 'bottom' ? '-' : ''}${Number(match) - 110}%)`;
          }
        })
      }
    }
  }

  // Display a toast
  show(message: string, options: Options) {
    this.toastsContainer.appendChild(this.__createToast(message, this.toastsContainer, options));
  }

  // Create a toast
  __createToast(message: string, container: HTMLElement, options: Options) {
    const toastYPosition = this.__getOptions().toastPosition.y;
    const toastPack = container.childNodes;
    const nextPos = (100 * (toastPack.length - 1)) + (toastPack.length * 10);
    const toast = document.createElement('article');

    toast.addEventListener('transitionend', () => {
      this.__handleToastRemoval(toast);
    });

    Object.assign(options, this.globalOptions);
    Object.assign(toast.style, options.style);

    toast.classList.add('--tst--tostada');

    window.requestAnimationFrame(() => {
      setTimeout(() => {
        toast.classList.add('--tst--animatable');
        toast.classList.add('--tst--visible');
      }, 0);
    });

    toast.style.transform = `translateY(${toastYPosition === 'bottom' ? '-' : ''}${nextPos + 100}%)`;

    toast.innerText = message;

    this.__crunchToast(toast, options.displayTime);

    return toast;
  }
}

