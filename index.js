gsap.registerPlugin(ScrollTrigger);

const squares = document.querySelectorAll(".square");
const contactForm = document.querySelector(".contact-form");
const navListItems = document.querySelectorAll(".nav-menu .list-item");
const backgroundImages = document.querySelectorAll(".image");
const hamburgerMenu = document.querySelector(".hamburger-menu");
let shouldDropdown = 1;
let dropdownIsThrottled = false;
let intervalId = null;
let allAnimatedLetters = [];
let isTransitioning = false;
let isThrottled = false;
let posNumber = 0;

const mainAppear = gsap.timeline({
  scrollTrigger: {
    trigger: ".container1",
    start: "+=120% top",
  },
});
ScrollTrigger.create({
  trigger: ".last",
  start: "150% 200px",
  onEnter: () => {
    navScrollSpy("contact");
    if (window.innerWidth > 900) {
      setTimeout(() => {
        if (!intervalId) {
          intervalId = setInterval(() => createAnimatedTriangles(), 200);
        } else return;
      }, 1500);
    }
  },
  onLeaveBack: () => {
    navScrollSpy("about");
    clearInterval(intervalId);
    intervalId = null;
  },
});

//scroll spy
const navScrollSpy = (enteringSection) => {
  navListItems.forEach((navListItem) => {
    navListItem.classList.remove("active");
  });
  const activeNavLink = document.getElementById(enteringSection);
  activeNavLink.classList.add("active");
};

//welcome animations
const pageEnterAnimations = () => {
  const header = document.querySelector(".welcome-header");

  const allWords = document.querySelectorAll(".welcome-header span");
  //split each word into letters in order to animate its reveal
  allWords.forEach((word) => {
    const splittedWord = word.innerText.split("");
    word.innerText = "";
    splittedWord.forEach((letter) => {
      const animatedLetter = document.createElement("div");
      animatedLetter.classList.add("animated-letter");
      animatedLetter.innerText = letter;
      word.appendChild(animatedLetter);
      allAnimatedLetters.push(animatedLetter);
    });
  });

  header.style.opacity = "1";
  const timeline = gsap.timeline();

  timeline
    .fromTo(
      backgroundImages,
      { opacity: 0, y: "5%", duration: 1 },
      { opacity: 1, y: 0, stagger: 0.5 }
    )
    .fromTo(
      allAnimatedLetters,
      {
        y: "100px",
        opacity: 0,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.5,
        delay: 1,
        ease: "back",
      },
      "-=1"
    )
    .fromTo(
      ".sub-welcome-header",
      { opacity: 0, y: -300 },
      { opacity: 0.8, y: 0, ease: "back" }
    )
    .fromTo(
      ".nav",
      { y: "-100%" },
      { opacity: 1, y: 0, duration: 1.5, ease: Power3.easeOut },
      "-=1"
    );
};

//dropdown menu

const onClickDropdownMenu = (dropdown) => {
  if (!dropdownIsThrottled) {
    const toggleHamburgerIcon = gsap.timeline({
      onStart: () => {
        dropdownIsThrottled = true;
      },
      onComplete: () => {
        dropdownIsThrottled = false;
      },
    });
    if (dropdown > 0) {
      toggleHamburgerIcon
        .to(".nav-menu", {
          yPercent: "+=100",
          duration: 1,
          ease: Power2.easeOut,
        })
        .to(
          ".hamburger-line.first",
          {
            rotate: "45deg",
            yPercent: 100,
            ease: "back",
          },
          "-=0.5"
        )
        .to(
          ".hamburger-line.second",
          {
            rotate: "-45deg",
            yPercent: -100,
            ease: "back",
          },
          "-=0.4"
        );
    } else {
      toggleHamburgerIcon
        .to(".nav-menu", {
          yPercent: "-=100",
          duration: 1,
          ease: Power2.easeIn,
        })
        .to(
          ".hamburger-line.second",
          {
            rotate: 0,
            yPercent: 0,
            ease: "back",
          },
          "-=0.5"
        )
        .to(
          ".hamburger-line.first",
          { rotate: 0, yPercent: 0, ease: "back" },
          "-=0.4"
        );
    }
    shouldDropdown = -shouldDropdown;
  }
};

//scroll to section

const onClickScrollToSection = (e) => {
  if (!e.target.classList.contains("active")) {
    const destination = e.target.id;
    let scrollOffset;

    let scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );

    switch (destination) {
      case "home":
        scrollOffset = 0;
        break;
      case "about":
        scrollOffset = scrollHeight / 5;
        break;
      case "contact":
        scrollOffset = scrollHeight;
        break;
      default:
        break;
    }
    window.scrollTo(0, scrollOffset);
    gsap.to("main", { opacity: 0, duration: 0 });
    gsap.to("main", { opacity: 1, delay: 0.7 });
  }
};

//event listeners:

navListItems.forEach((listItem) => {
  listItem.addEventListener("click", (e) => onClickScrollToSection(e));
});

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

hamburgerMenu.addEventListener("click", () => {
  onClickDropdownMenu(shouldDropdown);
});

//animate animals parallax

const animalsReveal = gsap.timeline({
  scrollTrigger: {
    trigger: ".animals",
    start: "top top",
    end: "+=100% top",
    // markers: true,
    pin: true,
    pinSpacing: false,
    scrub: true,
    // markers: true,
    onEnter: () => {
      navScrollSpy("about");
    },

    onLeaveBack: () => {
      navScrollSpy("home");
    },
  },
});

animalsReveal
  .fromTo(".tree", { opacity: 0 }, { opacity: 1 })
  .fromTo(".tree", { opacity: 1 }, { opacity: 1 })
  .fromTo(".tree", { opacity: 1 }, { opacity: 0 })
  .fromTo(".face", { opacity: 0 }, { opacity: 1 })
  .fromTo(".face", { opacity: 1 }, { opacity: 1 })
  .fromTo(".face", { opacity: 1 }, { opacity: 0 });

//Animated triangles background
const createAnimatedTriangles = () => {
  const parent = document.querySelector(".last");
  const randomTriangle = document.createElement("span");
  const positionBottom = Math.floor(Math.random() * 100);
  const positionLeft = Math.floor(Math.random() * 100);
  const hue = Math.floor(Math.random() * 255);
  const brightness = Math.floor(Math.random() * 255);
  const thirdOne = Math.floor(Math.random() * 255);
  const rotation = 45 - Math.floor(Math.random() * 90);
  const scale = 5 - 0.2 * Math.floor(Math.random() * 22);
  randomTriangle.style.border = `2px solid rgb(${hue},${brightness},${thirdOne} )`;

  randomTriangle.style.clipPath = "polygon(0 10%, 50% 100%, 100% 20%)";
  randomTriangle.style.transform = `scale(${scale})`;
  const tl = gsap.timeline();

  tl.to(randomTriangle, { opacity: 1, duration: 1 })
    .to(
      randomTriangle,
      {
        duration: 5,
        y: "-10vh",
        rotate: rotation,
        ease: "linear",
      },
      "-=1"
    )
    .to(randomTriangle, { opacity: 0, duration: 1 }, "-=1");

  randomTriangle.classList.add("triangle");

  randomTriangle.style.left = positionLeft + "%";
  randomTriangle.style.bottom = positionBottom + "%";

  parent.appendChild(randomTriangle);

  setTimeout(() => {
    randomTriangle.remove();
  }, 5000);
};

//Rotated squares carousel
const rotateCarousel = (rotationsNumber, clickedSquare) => {
  const seasonalChildren = document.querySelector(".text-content").children;
  if (window.innerWidth > 900) {
    gsap.to(".squares-carousel", {
      rotate: `+=${rotationsNumber * 90}deg`,
      duration: 1,
      delay: 0.3,
    });
  }
  const tl = gsap.timeline({
    onStart: () => {
      squares.forEach((square) => square.classList.remove("active"));
      gsap.to(seasonalChildren, {
        opacity: 0,
        // y: -20,
        stagger: 0.1,
        duration: 0.5,
        scale: 0.9,
      });
    },
    onComplete: () => {
      clickedSquare.classList.add("active");
      const seasonHeader = document.querySelector(".season-title");
      const listItems = document.querySelectorAll(".season-list .list-item");
      let seasonHeaderColor;
      switch (clickedSquare.classList[1]) {
        case "summer":
          seasonHeaderColor = "rgb(255, 243, 188)";
          break;
        case "autumn":
          seasonHeaderColor = "rgb(255, 171, 157)";

          break;
        case "winter":
          seasonHeaderColor = "rgb(153, 216, 255)";

          break;
        case "spring":
          seasonHeaderColor = "rgb(122, 255, 164)";

          break;
        default:
          seasonHeaderColor = "white";

          break;
      }
      seasonHeader.innerText = clickedSquare.classList[1];
      console.log(clickedSquare.classList[1]);
      seasonHeader.style.setProperty("color", seasonHeaderColor);
      listItems.forEach((item) => {
        item.style.setProperty(
          "--background-image",
          `url(../pics/checkmark-${clickedSquare.classList[1]}.svg)`
        );
      });
      gsap.to(seasonalChildren, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.5,
        scale: 1,
      });

      isTransitioning = false;
    },
  });
  if (window.innerWidth > 900) {
    tl.to(squares, { scale: 0.8, duration: 0.3 })
      .to(squares, {
        rotate: `-=${rotationsNumber * 90}deg`,
        duration: 1,
      })
      .to(squares, {
        scale: 1,
        duration: 0.5,
        ease: "ease",
      });
  } else {
    tl.to(squares, { scale: 0.8, duration: 0.3, stagger: 0.1 })
      .to(squares, { rotate: "+=360deg", duration: 1, stagger: 0.1 }, "-=0.2")
      .to(squares, { scale: 1, duration: 0.5, stagger: 0.1 }, "-=0.5");
  }
};

squares.forEach((square) => {
  square.addEventListener("click", (e) => {
    if (!isTransitioning) {
      isTransitioning = true;

      const number = parseInt(e.target.id);
      const clickedSquare = e.target;
      let transitionsNumber = ((-number + 4) % 4) - posNumber;

      posNumber = (posNumber + transitionsNumber) % 4;

      if (transitionsNumber !== 0) {
        rotateCarousel(transitionsNumber, clickedSquare);
      }
    }
  });
});

mainAppear
  .from(".spaceship", {
    opacity: 0,
    bottom: "-100px",
    left: -10,
    duration: 1.5,
  })
  .from(".title", { y: "-100px", opacity: 0, duration: 1 }, "-=1")
  .from(".subtitle", { x: "-100px", opacity: 0, duration: 1 }, "-=0.5")
  .from(".button-start", { opacity: 0, duration: 1 });

const panelsReveal = gsap.timeline();

panelsReveal.fromTo(
  ".container2",
  {
    opacity: 0,
    yPercent: -2,
  },
  { opacity: 1, yPercent: 2 }
);

ScrollTrigger.create({
  animation: panelsReveal,
  trigger: ".container2",
  start: "top top",
  end: "+=1200",
  pin: true,
  scrub: true,
});

const finish = () => {
  clearInterval(timer);
  timer = null;
};

const animateLayer = (e) => {
  const layer1 = document.querySelector("#stars");
  const layer2 = document.querySelector("#horizon");
  const layer1transformX = (window.innerWidth - e.clientX) / 150;
  const layer2transformX = (window.innerWidth - e.clientX) / 150;
  const layer1transformY = (window.innerHeight - e.clientY) / 150;
  const layer2transformY = (window.innerHeight - e.clientY) / 150;
  layer1.style.transform = `translate(-${layer1transformX}px, -${layer1transformY}px)`;
  layer2.style.transform = `translate(${layer2transformX}px, ${layer2transformY}px)`;
  setTimeout(() => (isThrottled = false), 200);
};
window.addEventListener("mousemove", (e) => {
  if (!isThrottled) {
    animateLayer(e);
    isThrottled = true;
  }
});

//hide nav button and full screen menu if screen gets resized over 760px
window.addEventListener("resize", (e) => {
  if (window.innerWidth > 760 && shouldDropdown === -1) {
    shouldDropdown = 1;
    gsap.to(".nav-menu", {
      yPercent: 0,
    });
    gsap.to(".hamburger-line.second", {
      rotate: 0,
      yPercent: 0,
      ease: "back",
    });
    gsap.to(
      ".hamburger-line.first",
      { rotate: 0, yPercent: 0, ease: "back" },
      "-=0.5"
    );
  }
});

pageEnterAnimations();
