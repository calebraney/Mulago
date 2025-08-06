import { attr } from './utilities';
import { hoverActive } from './interactions/hover-active';
import { clickActive } from './interactions/click-active';
import { scrollIn } from './interactions/scroll-in';
import { accordion } from './interactions/accordion';
import { marquee } from './interactions/marquee';
import { countUp } from './interactions/count-up';

document.addEventListener('DOMContentLoaded', function () {
  // Comment out for production
  // console.log('Local Script');
  // register gsap plugins if available
  if (gsap.ScrollTrigger !== undefined) {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (gsap.Flip !== undefined) {
    gsap.registerPlugin(Flip);
  }

  //////////////////////////////
  //Global Variables
  const arrowAnimation = function () {
    const wraps = [...document.querySelectorAll('[data-ix-chart="wrap"]')];
    const LINE_1 = '[data-ix-chart="line-1"]';
    const ARROW_1 = '[data-ix-chart="arrow-1"]';
    const LINE_2 = '[data-ix-chart="line-2-mask"]';
    const ARROW_2 = '[data-ix-chart="arrow-2"]';
    const WORDS = '[data-ix-chart="word"]';

    if (wraps.length === 0) return;
    wraps.forEach((wrap) => {
      const line1 = wrap.querySelector(LINE_1);
      const arrow1 = wrap.querySelector(ARROW_1);
      const line2 = wrap.querySelector(LINE_2);
      const arrow2 = wrap.querySelector(ARROW_2);
      const words = wrap.querySelector(WORDS);

      //hide arrows
      arrow1.style.opacity = 0;
      arrow2.style.opacity = 0;
      let tl = gsap.timeline({
        defaults: {
          duration: 2,
          ease: 'power2.inOut',
        },
        scrollTrigger: {
          trigger: wrap,
          start: '70% 100%',
          end: 'center 50%',
          scrub: true,
        },
      });
      tl.set(arrow1, { opacity: 1 }, '<');
      tl.set(arrow2, { opacity: 1 }, '<');
      tl.fromTo(
        line1,
        {
          opacity: 0,
          scale: 0.75,
        },
        {
          opacity: 1,
          scale: 1,
          transformOrigin: 'center center',
        }
      );
      tl.fromTo(
        line1,
        {
          drawSVG: '0% 0%',
        },
        {
          drawSVG: '100% 0%',
        }
      );
      tl.to(
        arrow1,
        {
          motionPath: {
            path: '#chart-line-1',
            align: '#chart-line-1',
            alignOrigin: [0.5, 0.5],
            autoRotate: 70,
            start: 0,
            end: 1,
          },
        },
        '<'
      );
      tl.fromTo(
        line2,
        {
          drawSVG: '0% 0%',
        },
        {
          drawSVG: '100% 0%',
        },
        '<'
      );
      tl.to(
        arrow2,
        {
          motionPath: {
            path: '#chart-line-2',
            align: '#chart-line-2',
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: 0,
            end: 1,
          },
        },
        '<'
      );
    });
  };
  const updateGeoFilters = function () {
    // Selectors for primary items
    const TAGS = 'data-tag-filter';
    const IDENTIFIER = 'data-tag-filter-identifier';

    const CLASS_DEFAULT = 'filters_identifier';
    const FILTER_DEFAULT = 'geography';

    const tags = [...document.querySelectorAll(`[${TAGS}]`)];

    // Get each work item and create individual tags from the tag text
    tags.forEach((item) => {
      if (!item) return;
      const className = attr(CLASS_DEFAULT, item.getAttribute(TAGS));
      const filterIdentifier = attr(FILTER_DEFAULT, item.getAttribute(IDENTIFIER));

      const tagText = item.textContent;
      const tagArray = tagText.split(',');
      tagArray.forEach((tag) => {
        const tagText = tag.trim();
        item.insertAdjacentHTML(
          'afterend',
          `<div class=${className} fs-list-field="${filterIdentifier}">${tagText}</div>`
        );
      });
      item.remove();
    });

    // progromatically resstart CMS filters
    // window.FinsweetAttributes.load('list');
    // window.FinsweetAttributes ||= [];
    // window.FinsweetAttributes.push([
    //   'list', // 'list', 'copyclip', 'modal', etc.
    //   (result) => {
    //     // window.FinsweetAttributeControls.restart();
    //     window.FinsweetAttributes.modules.list.restart();
    //   },
    // ]);
  };

  const splitTags = function () {
    // Selectors for primary items
    const TAGS = 'data-tag-split';

    // Defaults
    const TAG_WRAP_CLASS_DEFAULT = 'g_tag_list';
    const CLASS_DEFAULT = 'g_tag_wrap';
    const PAGE_TARGET_DEFAULT = 'portfolio';
    const FILTER_CATEGORY_DEFAULT = 'geography';

    // Attribute names
    const CLASS_ATTR = 'data-tag-split-class';
    const PAGE_TARGET_ATTR = 'data-tag-split-page';
    const FILTER_CATEGORY_ATTR = 'data-tag-split-category';

    // Utility function to return fallback if null
    const attr = (defaultVal, attrVal) => attrVal ?? defaultVal;

    // Select elements
    const tags = document.querySelectorAll(`[${TAGS}]`);

    tags.forEach((item) => {
      if (!item) return;

      const className = attr(CLASS_DEFAULT, item.getAttribute(CLASS_ATTR));
      const pageTarget = attr(PAGE_TARGET_DEFAULT, item.getAttribute(PAGE_TARGET_ATTR));
      const filterCategory = attr(FILTER_CATEGORY_DEFAULT, item.getAttribute(FILTER_CATEGORY_ATTR));

      const fullTextString = item.textContent || '';
      const itemTextArray = fullTextString.split(',');

      // Create the wrapper element manually
      const tagWrap = document.createElement('div');
      tagWrap.className = TAG_WRAP_CLASS_DEFAULT;

      // Insert the wrapper after the current item
      item.parentNode.insertBefore(tagWrap, item.nextSibling);

      itemTextArray.forEach((tag) => {
        const tagText = tag.trim();

        // Different link format with the filters extra characters

        let link = `/${pageTarget}?${encodeURIComponent(
          filterCategory
        )}_equal=%5B%22${encodeURIComponent(tagText)}%22%5D`;
        //if filter is a radio button (sector) then use a different link style without additional characters
        // if (filterCategory === 'sector') {
        //   link = `/${pageTarget}?${encodeURIComponent(filterCategory)}_equal=${encodeURIComponent(
        //     tagText
        //   )}`;
        // }
        const anchor = document.createElement('a');
        anchor.href = link;
        anchor.target = '_blank';
        anchor.className = className;
        anchor.textContent = tagText;
        tagWrap.appendChild(anchor);
      });

      // Remove the original element
      item.remove();
    });
  };

  //formate numbers as currency
  function formatNumbers() {
    const ITEM = '[data-ix-formatnumber="item"]';
    const FORMAT_WITH_LETTERS = 'data-ix-formatnumber-letters';

    const items = document.querySelectorAll(ITEM);

    items.forEach((item) => {
      // remove any non number or period character from the string
      let rawText = item.textContent.trim().replace(/[^0-9.]/g, '');
      //convert to a number
      let number = parseFloat(rawText);
      // Exit early if not a valid number
      if (isNaN(number)) return;
      //check for format with letters option
      const formatWithLetters = attr(true, item.getAttribute(FORMAT_WITH_LETTERS));

      let formattedNumber;

      if (formatWithLetters) {
        //if greater than 1 Million
        if (number >= 1_000_000) {
          formattedNumber = (number / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
        } else if (number >= 10_000) {
          formattedNumber = (number / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
        } else {
          formattedNumber = number.toLocaleString(); // fallback to comma formatting
        }
      } else {
        formattedNumber = number.toLocaleString();
      }

      // Add dollar sign and replace text content
      item.textContent = '$' + formattedNumber;
    });
  }
  //////////////////////////////
  //Control Functions on page load
  const gsapInit = function () {
    let mm = gsap.matchMedia();
    mm.add(
      {
        //This is the conditions object
        isMobile: '(max-width: 767px)',
        isTablet: '(min-width: 768px)  and (max-width: 991px)',
        isDesktop: '(min-width: 992px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (gsapContext) => {
        let { isMobile, isTablet, isDesktop, reduceMotion } = gsapContext.conditions;

        updateGeoFilters();
        splitTags();
        formatNumbers();
        accordion(gsapContext);
        clickActive(gsapContext);
        hoverActive(gsapContext);
        countUp(gsapContext);
        marquee(gsapContext);
        arrowAnimation();
        //functional interactions
        // hoverActive(gsapContext);
        //conditional interactions
        if (!reduceMotion) {
          // scrollIn(gsapContext);
        }
      }
    );
  };
  gsapInit();

  //reset gsap on click of reset triggers
  const scrollReset = function () {
    //selector
    const RESET_EL = '[data-ix-reset]';
    //time option
    const RESET_TIME = 'data-ix-reset-time';
    const resetScrollTriggers = document.querySelectorAll(RESET_EL);
    resetScrollTriggers.forEach(function (item) {
      item.addEventListener('click', function (e) {
        //reset scrolltrigger
        ScrollTrigger.refresh();
        //if item has reset timer reset scrolltriggers after timer as well.
        if (item.hasAttribute(RESET_TIME)) {
          let time = attr(1000, item.getAttribute(RESET_TIME));
          //get potential timer reset
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, time);
        }
      });
    });
  };
  scrollReset();
});
