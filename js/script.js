/* 마우스커서 */
const balls = document.querySelectorAll(".ball");

window.addEventListener("mousemove", e => {
  balls.forEach((ball, index) => {
    const rx = gsap.utils.random(-50, 50);
    const ry = gsap.utils.random(-50, 50);
    const rs = gsap.utils.random(0.5, 2.5);

    gsap.to(ball, {
      x: e.clientX + rx,
      y: e.clientY + ry,
      scale: rs, // 크기가 계속 변함
      rotation: gsap.utils.random(0, 360), // 회전 추가
      duration: gsap.utils.random(0.5, 1.5), // 속도랜덤
      delay: index * 0.02,
      ease: "expo.out",
      opacity: 0.7,
      overwrite: "auto", // 애니메이션이 겹칠 때 정리
      backgroundColor: `hsl(${gsap.utils.random(180, 280)}, 80%, 60%)`,
    });
  });
});

/* 헤더탑 */
$(".d-link").on("click", function () {
  $(".link-list").slideToggle(250);
  $(this).toggleClass("active");
});

$(".lang").on("click", function () {
  $(".lang-list").slideToggle(250);
  $(this).toggleClass("active");
});

$(".d-link").on("mouseleave", function () {
  $(".link-list").slideUp(250);
  $(this).removeClass("active");
});

$(".lang").on("mouseleave", function () {
  $(".lang-list").slideUp(250);
  $(this).removeClass("active");
});

/* 헤더 */
const depth1Items = document.querySelectorAll(".depth1");
const allDepth2 = document.querySelectorAll(".depth2");
const allDepth3 = document.querySelectorAll(".depth3");
const gnbArea = document.querySelector(".gnb-area");

// depth2만 초기 숨김 처리
allDepth2.forEach(menu => {
  menu.style.display = "none";
});

// depth1 hover 제어
depth1Items.forEach(item => {
  item.addEventListener("mouseenter", () => {
    allDepth2.forEach(menu => {
      menu.style.display = "none";
    });

    allDepth3.forEach(menu => {
      menu.style.display = "none";
    });

    const depth2 = item.querySelector(".depth2");
    if (depth2) {
      depth2.style.display = "flex";
    }
  });
});

allDepth3.forEach(depth3 => {
  const parentLi = depth3.parentElement;

  parentLi.addEventListener("mouseenter", () => {
    allDepth3.forEach(menu => {
      menu.style.display = "none";
    });

    depth3.style.display = "block";
  });

  parentLi.addEventListener("mouseleave", () => {
    depth3.style.display = "none";
  });
});

// 영역 벗어나면 전부 닫기
gnbArea.addEventListener("mouseleave", () => {
  allDepth2.forEach(menu => {
    menu.style.display = "none";
  });

  allDepth3.forEach(menu => {
    menu.style.display = "none";
  });
});

/* 서치모달 */
$(function () {
  $(".search").on("click", function (e) {
    e.preventDefault();
    $(".search-layer").show();
  });

  $(".close-btn").on("click", function (e) {
    e.preventDefault();
    $(".search-layer").hide();
  });
});

/* gnb상단 고정 */
window.addEventListener("load", () => {
  // 1. 모든 리소스 로드 후 실행 (위치 계산 정확도 UP)
  const gnbArea = document.querySelector(".gnb-area");

  // 2. 안전장치: 이 페이지에 .gnb-area가 있을 때만 실행해!
  if (gnbArea) {
    let stickyStart = gnbArea.offsetTop;

    window.addEventListener("scroll", () => {
      const scTop = window.scrollY;

      if (scTop >= stickyStart) {
        gnbArea.classList.add("fixed");
        document.body.style.paddingTop = gnbArea.offsetHeight + "px";
      } else {
        gnbArea.classList.remove("fixed");
        document.body.style.paddingTop = "0";
      }
    });

    // 리사이즈할 때 위치 다시 잡기
    window.addEventListener("resize", () => {
      if (!gnbArea.classList.contains("fixed")) {
        stickyStart = gnbArea.offsetTop;
      }
    });
  }
});

/* 푸터 top*/
$(".ft-depth2-menu img").on("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  const $li = $(this).closest("li");
  const $sub = $li.children(".ft-depth3");

  if ($sub.length === 0) return;

  $li.toggleClass("open");
  $sub.stop().slideToggle(250);
});

/* 푸터메인 */
$(".ft-link").on("click", function (e) {
  e.preventDefault(); // a태그 기본 이동 방지

  var $parent = $(this).closest(".ft-menu-depth1-open");
  var $submenu = $parent.find(".ft-menu-depth2");

  // 다른 열려 있는 메뉴 닫기
  $(".ft-menu-depth2").not($submenu).slideUp();
  $(".ft-menu-depth1-open").not($parent).removeClass("active");

  // 현재 메뉴 토글
  $submenu.slideToggle();
  $parent.toggleClass("active");
});

// 모바일gnb 열기
$(".search-area span").on("click", function () {
  $(".m-gnb").addClass("is-open");
  $("body").css("overflow", "hidden");
});

// 닫기
$(".m-close-btn").on("click", function () {
  $(".m-gnb").removeClass("is-open");
  $("body").css("overflow", "");
});

/* m-list */
$(".m-list-open").on("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  const $this = $(this);
  const $sub = $this.next(".m-depth1");

  $this.toggleClass("active");
  $sub.stop().slideToggle(250);
});

/* 이벤트json */
let allData = [];
let filteredData = [];
let currentPage = 1;

const itemsPerPage = 6;
const pageCount = 5;

/* =========================1. 데이터 가져오기========================= */
function fetchEvents() {
  fetch("https://69772b3a5b9c0aed1e859570.mockapi.io/performances")
    .then(res => res.json())
    .then(data => {
      allData = data;
      updateData(data); // 상태 업데이트 전용 함수
    });
}

/* =========================2. 상태 변경 전용 함수========================= */
function updateData(data) {
  filteredData = data;
  currentPage = 1;
  render();
}

/* =========================3. 중앙 렌더 함수========================= */
function render() {
  renderList();
  renderPagination();
}

/* =========================4. 리스트만 그림========================= */
function renderList() {
  const listContainer = document.querySelector(".event-list");
  const countSpan = document.querySelector(".result span");

  countSpan.textContent = filteredData.length;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const sliced = filteredData.slice(start, end);

  const today = new Date();

  const html = sliced
    .map(item => {
      const dates = item.period.split(" ~ ");
      const targetDateStr = dates.length === 2 ? dates[1] : dates[0];

      const endDate = new Date(targetDateStr.replaceAll(".", "-") + "T23:59:59");
      const expired = today > endDate;

      const statusClass = expired ? "expired" : "on";
      const statusText = expired ? "지난 행사" : "진행 중";

      return `
    <li class="event-card">
      <div class="card-image">
        <a href="">
          <img src="${item.image}" alt="${item.title}">
        </a>
      </div>

      <div class="card-content">
        <span class="status-tag ${statusClass}">
          ${statusText}
        </span>

        <a href="">
          <h3 class="card-title">${item.title}</h3>
        </a>

        <dl class="card-info">
          <div class="info-row">
            <dt>장소</dt>
            <dd>${item.place}</dd>
          </div>

          <div class="info-row">
            <dt>기간</dt>
            <dd>${item.period}</dd>
          </div>

          <div class="info-row">
            <dt>입장료</dt>
            <dd>${item.price}</dd>
          </div>
        </dl>
      </div>
    </li>
  `;
    })
    .join("");

  listContainer.innerHTML = html;
}

/* =========================5. 페이지 버튼만 담당========================= */
function renderPagination() {
  const container = document.querySelector(".pagination");
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // ⭐⭐⭐ page-info 동기화 추가
  const currentSpan = document.querySelector(".page-info span:first-child");
  const totalSpan = document.querySelector(".total-pages");

  currentSpan.textContent = currentPage;
  totalSpan.textContent = totalPages;

  let html = "";

  html += `
    <button onclick="movePage(${currentPage - 1})"
      ${currentPage === 1 ? "disabled" : ""}>
      <i class="ri-arrow-left-s-line"></i>
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button 
        class="${i === currentPage ? "active" : ""}"
        onclick="movePage(${i})">
        ${i}
      </button>
    `;
  }

  html += `
    <button onclick="movePage(${currentPage + 1})"
      ${currentPage === totalPages ? "disabled" : ""}>
      <i class="ri-arrow-right-s-line"></i>
    </button>
  `;

  container.innerHTML = html;
}

/* =========================6. 페이지 이동========================= */
window.movePage = function (page) {
  currentPage = page;
  render();
};

/* =========================7. 필터========================= */
document.querySelectorAll(".btn-area button").forEach(btn => {
  btn.addEventListener("click", e => {
    document.querySelectorAll(".btn-area button").forEach(b => b.classList.remove("active"));

    e.target.classList.add("active");

    const category = e.target.dataset.filter;

    const result = category === "all" ? allData : allData.filter(item => item.category === category);

    updateData(result); // 상태만 변경
  });
});

/* =========================8. 검색========================= */
const eventForm = document.querySelector(".event-search-form");

if (eventForm) {
  eventForm.addEventListener("submit", e => {
    e.preventDefault();

    const keyword = document.querySelector(".event-search-input").value.toLowerCase();

    const active = document.querySelector(".btn-area .active").dataset.filter;

    const result = allData.filter(
      item => (active === "all" || item.category === active) && item.title.toLowerCase().includes(keyword)
    );

    updateData(result);
  });
}

fetchEvents();

/* 메인비주얼 슬라이드 */
document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".mainvisual", {
    slidesPerView: 1,
    loop: true,

    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
});

//=============================================================================================================================================================//

/* =========================1. 데이터 가져오기========================= */
function fetchposts() {
  fetch("https://69772b3a5b9c0aed1e859570.mockapi.io/board")
    .then(res => res.json())
    .then(data => {
      allData = data;
      console.log("데이터 도착 완료:", allData); // ⭐ 여기서 찍어야 나와!
      updateData(data);
    });
}

//=============================================================================================================================================================//
/* 전시 스와이퍼 */
var exhSwiper = new Swiper(".swiper.exh", {
  slidesPerView: 4,
  spaceBetween: 50,
  loop: true,

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },

  navigation: {
    nextEl: ".my-next",
    prevEl: ".my-prev",
  },

  /* 반응형 */
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 20,
    },

    769: {
      slidesPerView: 4,
      spaceBetween: 50,
    },
  },
});

/* autoplay 토글 */
var toggleBtn = document.querySelector(".swiper-toggle");
var toggleImg = toggleBtn.querySelector("img");

toggleBtn.addEventListener("click", function () {
  // Swiper의 실제 상태로 판단
  if (exhSwiper.autoplay.running) {
    exhSwiper.autoplay.stop();
    toggleImg.src = "img/play.png";
  } else {
    exhSwiper.autoplay.start();
    toggleImg.src = "img/stop.png";
  }
});

/* notice스와이퍼 */
const noticeSwiper = new Swiper(".notice-slide", {
  slidesPerView: 1,
  loop: true,

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

/* 이벤트 슬라이드 */
var eventSwiper = new Swiper(".eventpage", {
  slidesPerView: 1,
  spaceBetween: 50,
  loop: true,

  navigation: {
    nextEl: ".event-my-next",
    prevEl: ".event-my-prev",
  },

  on: {
    // 처음 로드될 때
    init: function () {
      // 진짜 슬라이드 개수 계산
      const totalSlides = this.slides.filter(slide => !slide.classList.contains("swiper-slide-duplicate")).length;

      const section = this.el.closest(".event");
      const pagination = section.querySelector(".event-pagination");

      pagination.querySelector(".total").textContent = totalSlides;
      pagination.querySelector(".current").textContent = 1;
    },

    // 슬라이드 바뀔 때마다
    slideChange: function () {
      const section = this.el.closest(".event");
      const pagination = section.querySelector(".event-pagination");

      pagination.querySelector(".current").textContent = this.realIndex + 1;
    },
  },
});

/* 슬라이드가 1장이라도 애니메이션주기 */
const wrapper = document.querySelector(".eventpage .swiper-wrapper");
const slides = wrapper.children;

if (slides.length === 1) {
  wrapper.appendChild(slides[0].cloneNode(true));
}

/* 온라인슬라이드 */
var onlineSwiper = new Swiper(".onlineslide", {
  slidesPerView: 1,
  spaceBetween: 50,
  loop: true,

  navigation: {
    nextEl: ".online-my-next",
    prevEl: ".online-my-prev",
  },

  on: {
    init: function () {
      // 진짜 슬라이드 개수만 계산
      const realSlides = this.slides.filter(slide => !slide.classList.contains("swiper-slide-duplicate")).length;

      // 이 Swiper에 해당하는 pagination만 찾기
      const onlineSection = this.el.closest(".online");
      const pagination = onlineSection.querySelector(".online-pagination");

      pagination.querySelector(".total").textContent = realSlides;
      pagination.querySelector(".current").textContent = 1;
    },

    slideChange: function () {
      const onlineSection = this.el.closest(".online");
      const pagination = onlineSection.querySelector(".online-pagination");

      pagination.querySelector(".current").textContent = this.realIndex + 1;
    },
  },
});
