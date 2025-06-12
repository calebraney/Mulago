import { attr } from './utilities';
import { hoverActive } from './interactions/hover-active';
import { clickActive } from './interactions/click-active';
import { scrollIn } from './interactions/scroll-in';
import { accordion } from './interactions/accordion';
import { marquee } from './interactions/marquee';
import { countUp } from './interactions/count-up';

document.addEventListener('DOMContentLoaded', function () {
  // Comment out for production
  console.log('Local Script');
  // register gsap plugins if available
  if (gsap.ScrollTrigger !== undefined) {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (gsap.Flip !== undefined) {
    gsap.registerPlugin(Flip);
  }

  //////////////////////////////
  //Global Variables

  const updateGeoFilters = function () {
    // Selectors for primary items
    const TAGS = 'cr-filter-tag';
    const CLASS_DEFAULT = 'filters_identifier';

    const tags = document.querySelectorAll(`${TAGS}`);

    // Get each work item and create individual tags from the tag text
    tags.forEach((item) => {
      if (!item) return;
      const className = attr(CLASS_DEFAULT, item.getAttribute(TAGS));
      const tagText = item.textContent;
      const tagArray = tagText.split(',');
      tagArray.forEach((tag) => {
        item.insertAdjacentHTML(
          'afterend',
          `<div class=${className} fs-list-field="geography">${tag}</div>`
        );
      });
      item.remove();
      //progromatically resstart CMS filters
    });

    // create the filters instance
    // window.fsAttributes = window.fsAttributes || [];
    // window.fsAttributes.push([
    //   'cmsfilter',
    //   (filterInstances) => {
    //     console.log('cmsfilter Successfully loaded!');

    //     // The callback passes a `filterInstances` array with all the `CMSFilters` instances on the page.
    // 		// this line will get the first instance from the array and save it in a variable called filterInstance
    //     const [filterInstance] = filterInstances;

    //     // The `renderitems` event runs whenever the list renders items after filtering.
    //     filterInstance.listInstance.on('renderitems', (renderedItems) => {
    //       console.log(renderedItems);
    //     });

    // 		// method to apply the filters
    // 		filterInstance.applyFilters();
    //   },
    // ]);

    //     window.fsAttributes.destroy();
    //     window.fsAttributes.init();
  };

  const updateGeoTags = function () {
    // Selectors for primary items
    const TAGS = 'data-tag-split';
    const CLASS_DEFAULT = 'g_tag_wrap';
    const tags = document.querySelectorAll(`${TAGS}`);

    // Get each work item and create individual tags from the tag text
    tags.forEach((item) => {
      if (!item) return;
      const className = attr(CLASS_DEFAULT, item.getAttribute(TAGS));
      const tagText = item.textContent;
      const tagArray = tagText.split(',');
      tagArray.forEach((tag) => {
        item.insertAdjacentHTML('afterend', `<div class=${className}>${tag}</div>`);
      });
      item.remove();
    });
  };
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
        updateGeoTags();
        accordion(gsapContext);
        clickActive(gsapContext);
        hoverActive(gsapContext);
        countUp(gsapContext);
        marquee(gsapContext);
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
