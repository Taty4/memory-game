export function createElement(options) {
  const element = document.createElement(options.tag);

  if (options.className) element.className = options.className;
  if (options.text) element.textContent = options.text;

  const { tag, className, text, ...attrs } = options;
  Object.assign(element, attrs);

  return element;
}
