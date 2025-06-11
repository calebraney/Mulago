import { checkBreakpoints, attr } from '../utilities';

export const clickActive = function (gsapContext) {
  //animation ID
  const ANIMATION_ID = 'clickactive';
  //elements
  const WRAP = '[data-ix-clickactive="wrap"]';
  const TRIGGER = '[data-ix-clickactive="trigger"]'; //the click trigger (will get an active class)
  const TARGET = '[data-ix-clickactive="target"]'; //additional element to activate (needs matching values for the ID attribute)
  const ID = 'data-ix-clickactive-id';
  //option for active class and default class
  const OPTION_START_ACTIVE = 'data-ix-clickactive-start-active'; // applied to triggers
  const OPTION_ACTIVE_CLASS = 'data-ix-clickactive-class'; //aplied to wrap
  const OPTION_FIRST_ACTIVE = 'data-ix-clickactive-first-active'; // applied to wrap
  const OPTION_ONE_ACTIVE = 'data-ix-clickactive-one-active'; // applied to wrap
  const OPTION_KEEP_ONE_ACTIVE = 'data-ix-clickactive-keep-one-active'; // applied to wrap
  //duration of the interaction in MS (for GSAP Scrolltrigger reset)
  const INTERACTION_DURATION = 800;

  const ACTIVE_CLASS = 'is-active';

  // functionality function that handles all of the event listeners and logic
  //is triggered below either on each wrap element or within the document itself if no wrap is found
  const clickActiveList = function (rootElement) {
    //get all the triggers
    const triggers = Array.from(rootElement.querySelectorAll(TRIGGER));

    //set default options
    let activeClass = ACTIVE_CLASS;
    let firstActive = false;
    let oneActive = false;
    let keepOneActive = false;
    //conditional options to check if the root element is a wrap
    if (rootElement !== document) {
      // set up conditions for the function
      activeClass = attr(ACTIVE_CLASS, rootElement.getAttribute(OPTION_ACTIVE_CLASS));
      firstActive = attr(false, rootElement.getAttribute(OPTION_FIRST_ACTIVE));
      oneActive = attr(false, rootElement.getAttribute(OPTION_ONE_ACTIVE));
      keepOneActive = attr(false, rootElement.getAttribute(OPTION_KEEP_ONE_ACTIVE));

      //check breakpoints and quit function if set on specific breakpoints
      let runOnBreakpoint = checkBreakpoints(rootElement, ANIMATION_ID, gsapContext);
      if (runOnBreakpoint === false) return;
    } else {
    }

    //utility function to activate items
    const activateItems = function (item, makeActive = true) {
      if (!item) return;
      //get the id and find the target element that has the same id.
      let hasTarget = true;
      const itemID = item.getAttribute(ID);
      const targetEl = rootElement.querySelector(`${TARGET}[${ID}="${itemID}"]`);
      //if target or id isn't found set hasTarget to false
      if (!itemID || !targetEl) {
        hasTarget = false;
      }
      //make item makeActive
      if (makeActive) {
        item.classList.add(activeClass);
        if (hasTarget) {
          targetEl.classList.add(activeClass);
        }
      } else {
        //make inactive
        item.classList.remove(activeClass);
        if (hasTarget) {
          targetEl.classList.remove(activeClass);
        }
      }
    };

    triggers.forEach((item) => {
      if (!item) return;

      let startActive = attr(false, item.getAttribute(OPTION_START_ACTIVE));
      //if startactive is set to true activate the item right away
      if (startActive) {
        activateItems(item);
      } else {
        //by default start active is false so active classes will be removed right away,
        //if you don't want that remove the line below
        activateItems(item, false);
      }

      //add event listener to item
      item.addEventListener('click', function (e) {
        //check if item is active
        let itemIsActive = item.classList.contains(ACTIVE_CLASS);

        if (!itemIsActive) {
          // check if oneActive is True
          if (oneActive) {
            // if one active is true loop through each item
            triggers.forEach((itemElement) => {
              //if item is the current item activate it.
              if (itemElement === item) {
                activateItems(itemElement);
              }
              //otherwise remove active class and de-activate
              else {
                activateItems(itemElement, false);
              }
            });
          }
          if (!oneActive) {
            // if one active is false just set the current item to active and open it
            activateItems(item);
          }
        }
        // if the current item IS ACTIVE and keep one active is false close it
        if (itemIsActive && !keepOneActive) {
          activateItems(item, false);
        }
        // if the current item IS ACTIVE and keep one active is true check how many items are active
        if (itemIsActive && keepOneActive) {
          const activeItems = triggers.filter(function (item) {
            return item.classList.contains(activeClass);
          });
          //if there are more than 1 items active close the current one
          if (activeItems.length > 1) {
            activateItems(item, false);
          }
        }

        // register gsap plugins if available
        if (gsap.ScrollTrigger !== undefined) {
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, INTERACTION_DURATION);
        }
      });
    });

    //activate first item if firstActive is true
    // Needs to happen After each item is processed
    const firstItem = triggers[0];
    if (firstActive) {
      activateItems(firstItem);
    }
  };

  //get wrap elements
  const clickWraps = gsap.utils.toArray(WRAP);
  //if no wrap elements are found run functionality on document element
  if (clickWraps.length === 0 || clickWraps === undefined) {
    clickActiveList(document);
  } else {
    //otherwise run funcitonality on each wrap element
    clickWraps.forEach((wrap) => {
      clickActiveList(wrap);
    });
  }
};
