export default class LoadMore {
  constructor(selector, hidden = false) {
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};
    refs.btn = document.querySelector(selector);
    refs.label = refs.btn.querySelector('.label');
    refs.spinner = refs.btn.querySelector('.spinner-border-sm.spinner-border');

    return refs;
  }

  enable() {
    this.refs.btn.removeAttribute('disabled');
    this.refs.label.textContent = 'Load more';
    this.refs.spinner.classList.add('is-hidden');
  }

  disable() {
    this.refs.btn.setAttribute('disabled', 'true');
    this.refs.label.textContent = 'Loading...';
    this.refs.spinner.classList.remove('is-hidden');
  }

  show() {
    this.refs.btn.classList.remove('is-hidden');
  }

  hide() {
    this.refs.btn.classList.add('is-hidden');
  }
}
