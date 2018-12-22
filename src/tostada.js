class Tostada {
  constructor(options) {
    this.globalOptions = options;
    const styles = document.createElement('style');
    styles.innerHTML = `
      .--tst--tostada {
        background-color: #1f1f1f;
        color: #f3f3f3;
        padding: 0.75rem;
        margin-bottom: 0.6875rem;
        margin-left: 0.3125rem;
        font-family: sans-serif;
        bottom: 0;
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
    document.head.appendChild(styles);

    this.toastsContainer = document.createElement('section');
    this.toastsContainer.id = '--tst--toast-container';
    document.body.appendChild(this.toastsContainer);
  }

  __createToast(message, container, options = {}) {
    const otherToastsAmount = container.childNodes.length;
    const nextPos = (100 * (otherToastsAmount - 1)) + (otherToastsAmount * 10);
    const toast = document.createElement('article');

    toast.addEventListener('transitionend', () => {
      this.__handleToastRemoval(toast);
    });

    toast.classList.add('--tst--tostada');

    if(this.globalOptions) {
      Object.assign(toast.style, this.globalOptions.style);
    }
    
    Object.assign(toast.style, options.style);

    window.requestAnimationFrame(() => {
      setTimeout(() => {
        toast.classList.add('--tst--animatable');
        toast.classList.add('--tst--visible');
      }, 0);
    });

    toast.style.transform = `translateY(-${nextPos + 100}%)`;

    toast.innerHTML = message;

    this.__crunchToast(toast, options.displayTime);

    return toast;
  }

  __crunchToast(elem, displayTime = 1950) {
    setTimeout(() => {
      this.__hideToast(elem);
    }, displayTime);
  }

  __hideToast(elem) {
    elem.classList.add('--tst--crunchable');
    elem.classList.remove('--tst--visible');
  }

  __handleToastRemoval(elem) {
    const container = elem.parentNode;

    if (elem.classList.contains('--tst--crunchable') && container) {
      const siblings = container.childNodes;
      container.removeChild(elem);
      if (siblings.length) {
        siblings.forEach((toast) => {
          if (toast.style.transform) {
            toast.style.transform = `translateY(-${(/\d+/g).exec(toast.style.transform)[0] - 110}%)`;
          }
        })
      }
    }
  }

  show(message, options) {
    this.toastsContainer.appendChild(this.__createToast(message, this.toastsContainer, options));
  }
}
