import { Target } from './content.types';

const DATA_ATTRIBUTE = 'data-meta-pay';

/**
 * Find parent of an element depending on a callback condition
 */
const findParent = (target: Target, test: (target: Target) => boolean): Target => {
  if (!target) return null;
  if (test(target)) {
    return target;
  } else {
    return findParent(target.parentNode, test);
  }
};

/**
 * Execute the function if the document is fully ready
 */
setTimeout(() => {
  function handleClick(e: MouseEvent) {
    // If no data attribute found, we remove the event listener
    if (!document.querySelector(`[${DATA_ATTRIBUTE}]`)) {
      document.body.removeEventListener('click', handleClick);
      return;
    }

    const linkTag = findParent(e.target, (element) => {
      return element.tagName === 'A';
    });

    if (linkTag && linkTag.hasAttribute(DATA_ATTRIBUTE) && linkTag.hasAttribute('href')) {
      const url = new URL(linkTag.getAttribute('href'));
      // Makes sure that we are connected to a proper ledger
      if (!/meta\.re$/.test(url.origin)) {
        return;
      }

      e.preventDefault();

      chrome.runtime.sendMessage({
        app: 'gem-wallet',
        type: 'transaction-emit',
        parameters: url.search
      });
    }
  }

  // We add an event to clicks on the page
  document.addEventListener('click', handleClick);
}, 0);
