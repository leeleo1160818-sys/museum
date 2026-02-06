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

// 1. 초기 세팅 (변수명은 그대로 유지할게!)
let boardAllData = [],
  boardFilteredData = [],
  boardCurrentPage = 1;
const itemsPerPage = 10;

// 2. 데이터 가져오기
function fetchposts() {
  $.getJSON("https://69772b3a5b9c0aed1e859570.mockapi.io/board", function (data) {
    boardAllData = data;
    boardFilteredData = data;
    renderBoard();
  });
}

// 3. 중앙 렌더 함수
function renderBoard() {
  renderList();
  renderPagination();
}

// 4. 리스트 그리기
function renderList() {
  $(".board-result span").text(boardFilteredData.length);

  const totalPages = Math.ceil(boardFilteredData.length / itemsPerPage) || 1;
  $(".board-page-info span:first-child").text(boardCurrentPage);
  $(".board-total-pages").text(totalPages);

  const start = (boardCurrentPage - 1) * itemsPerPage;
  const sliced = boardFilteredData.slice(start, start + itemsPerPage);

  const html = sliced
    .map((item, index) => {
      const boardNum = boardFilteredData.length - start - index;
      const date = item.date ? item.date.replaceAll("-", ".") : "2026.02.04";

      return `
      <tr>
        <td style="width: 8%">${boardNum}</td>
        <td style="width: 10%">${item.category_name}</td>
        <td style="width: 12%">${item.museum.trim() || "중앙박물관"}</td>
        <td class="title" style="width: 40%">
          <a href="#">${item.title}</a>
        </td>
        <td style="width: 8%">${item.author}</td>
        <td style="width: 10%">${date}</td>
        <td style="width: 7%">${item.count}</td>
      </tr>`;
    })
    .join("");

  $(".board-body").html(html || '<tr><td colspan="7">검색 결과가 없습니다.</td></tr>');
}

// 5. 페이지네이션 그리기
function renderPagination() {
  const totalPages = Math.ceil(boardFilteredData.length / itemsPerPage) || 1;
  let first = boardCurrentPage <= 5 ? 1 : 6;
  let last = boardCurrentPage <= 5 ? Math.min(totalPages, 5) : totalPages;

  let html = "";
  // 이전/처음 버튼
  html += `<button onclick="movePage(1)"><i class="ri-arrow-left-double-line"></i></button>`;
  html += `<button onclick="movePage(${boardCurrentPage - 1 || 1})"><i class="ri-arrow-left-s-line"></i></button>`;

  for (let i = first; i <= last; i++) {
    html += `<button class="${i === boardCurrentPage ? "active" : ""}" onclick="movePage(${i})">${i}</button>`;
  }

  // 다음/끝 버튼
  html += `<button onclick="movePage(${boardCurrentPage + 1 > totalPages ? totalPages : boardCurrentPage + 1})"><i class="ri-arrow-right-s-line"></i></button>`;
  html += `<button onclick="movePage(${totalPages})"><i class="ri-arrow-right-double-line"></i></button>`;

  $(".board-pagination").html(html);
}

// 6. 페이지 이동
window.movePage = page => {
  boardCurrentPage = page;
  renderBoard();
};

// 7. 검색 기능 (제이쿼리 이벤트 바인딩)
$(".board-search-form").on("submit", function (e) {
  const keyword = $(".board-search-input").val().toLowerCase();

  boardFilteredData = boardAllData.filter(
    item => item.title.toLowerCase().includes(keyword) || item.author.toLowerCase().includes(keyword)
  );

  boardCurrentPage = 1;
  renderBoard();
});

fetchposts();
