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

/* gnb상단 고정 이건 (아직 모르겠다;) */
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
function fetchEvents() {
  fetch("https://69772b3a5b9c0aed1e859570.mockapi.io/performances")
    .then(res => res.json())
    .then(data => {
      allData = data;
      renderData(data);
      //console.log(data);
    });
}

//원본 보관용
let allData = [];

/* =====================================
   1. 날짜 변환 함수
=====================================*/
function toDate(dateStr) {
  // .을 -로 바꿔줘야 "yyyy-mm-dd" 형식이 돼!
  const cleanDate = dateStr.replaceAll(".", "-").trim();
  return new Date(cleanDate + "T00:00:00");
}

/* =====================================
   2. 화면 출력 함수
=====================================*/
function renderData(data) {
  const listContainer = document.querySelector(".event-list");
  const countSpan = document.querySelector(".result span");

  // 1. 개수 업데이트
  countSpan.textContent = data.length;

  const today = new Date();

  const html = data
    .map(item => {
      // --- [날짜 로직: 배운 방식 응용] ---
      const dates = item.period.split(" ~ ");
      const targetDateStr = dates.length === 2 ? dates[1] : dates[0];
      const endDate = toDate(targetDateStr);
      endDate.setHours(23, 59, 59);

      let statusText = "";
      let statusClass = "";

      if (today > endDate) {
        statusText = item.category === "performance" ? "지난 공연" : "지난 행사";
        statusClass = "expired";
      } else {
        statusText = item.category === "performance" ? "공연 중" : "행사 중";
        statusClass = "on";
      }

      // --- HTML 출력 ---
      return `
    <li class="event-card">
        <div class="card-image">
          <a href=""><img src="${item.image}" alt="${item.title}"></a>
        </div>
        <div class="card-content">
          <span class="status-tag ${statusClass}">
            ${statusText}
          </span>
          <a href=""><h3 class="card-title">${item.title}</h3></a> 
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

// 버튼 필터링 이벤트
const filterButtons = document.querySelectorAll(".btn-area button");

filterButtons.forEach(btn => {
  btn.addEventListener("click", e => {
    // 버튼 디자인 변경
    filterButtons.forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");

    const category = e.target.getAttribute("data-filter");

    // 전체면 allData 다 보여주고, 아니면 필터링해서 보여주기
    const filtered = category === "all" ? allData : allData.filter(item => item.category === category);

    renderData(filtered);
  });
});
fetchEvents();

// 검색 기능 (event-search-form 전용)
const eventForm = document.querySelector(".event-search-form");
const eventInput = document.querySelector(".event-search-input");

if (eventForm) {
  eventForm.addEventListener("submit", e => {
    e.preventDefault(); // 새로고침 방지

    // 1. 지금 어떤 탭이 눌려있지?
    const activeBtn = document.querySelector(".btn-area button.active");
    const category = activeBtn.getAttribute("data-filter");

    // 2. 검색창엔 뭐라고 썼지?
    const keyword = eventInput.value.toLowerCase().trim();

    // 3. 빈 바구니 준비!
    const result = [];

    // 4. 30개 데이터를 하나씩 꺼내서 검사
    allData.forEach(item => {
      // 카테고리가 '전체'거나, 선택한 탭이랑 똑같을 때
      const categoryOk = category === "all" || item.category === category;
      // 제목에 검색어가 들어있을 때
      const keywordOk = item.title.toLowerCase().includes(keyword);

      // 둘 다 맞으면 바구니에 담기!
      if (categoryOk && keywordOk) {
        result.push(item);
      }
    });

    // 5. 바구니에 담긴 것만 화면에 그려줘!
    renderData(result);
  });
}

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
