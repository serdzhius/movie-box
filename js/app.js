(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function formFieldsInit(options = {
        viewPass: false
    }) {
        const formFields = document.querySelectorAll("input[placeholder],textarea[placeholder]");
        if (formFields.length) formFields.forEach((formField => {
            if (!formField.hasAttribute("data-placeholder-nohide")) formField.dataset.placeholder = formField.placeholder;
        }));
        document.body.addEventListener("focusin", (function(e) {
            const targetElement = e.target;
            if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
                if (targetElement.dataset.placeholder) targetElement.placeholder = "";
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.add("_form-focus");
                    targetElement.parentElement.classList.add("_form-focus");
                }
                formValidate.removeError(targetElement);
            }
        }));
        document.body.addEventListener("focusout", (function(e) {
            const targetElement = e.target;
            if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
                if (targetElement.dataset.placeholder) targetElement.placeholder = targetElement.dataset.placeholder;
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.remove("_form-focus");
                    targetElement.parentElement.classList.remove("_form-focus");
                }
                if (targetElement.hasAttribute("data-validate")) formValidate.validateInput(targetElement);
            }
        }));
        if (options.viewPass) document.addEventListener("click", (function(e) {
            let targetElement = e.target;
            if (targetElement.closest('[class*="__viewpass"]')) {
                let inputType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
                targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
                targetElement.classList.toggle("_viewpass-active");
            }
        }));
    }
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if (formRequiredItem.dataset.required === "email") {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (modules_flsModules.select) {
                    let selects = form.querySelectorAll(".select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        modules_flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function getScrollbarWidth() {
        const outer = document.createElement("div");
        outer.style.visibility = "hidden";
        outer.style.overflow = "scroll";
        document.body.appendChild(outer);
        const inner = document.createElement("div");
        outer.appendChild(inner);
        const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
        outer.parentNode.removeChild(outer);
        document.documentElement.style.setProperty("--scrollbar-width", scrollbarWidth + "px");
    }
    document.addEventListener("DOMContentLoaded", getScrollbarWidth);
    window.onload = function() {
        document.body.classList.add("loaded_hiding");
        window.setTimeout((function() {
            document.body.classList.add("loaded");
            document.body.classList.remove("loaded_hiding");
        }), 500);
    };
    const API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";
    const API_URL_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=";
    const API_URL_FILMS = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=FILM&ratingFrom=5&ratingTo=10&yearFrom=1960&yearTo=2023&page=";
    const API_URL_SERIALS = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=TV_SERIES&ratingFrom=5&ratingTo=10&yearFrom=1960&yearTo=2023&page=";
    const API_URL_MINI_SERIALS = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=MINI_SERIES&ratingFrom=6&ratingTo=10&yearFrom=1960&yearTo=2023&page=";
    const API_URL_TV_SHOW = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=TV_SHOW&ratingFrom=5&ratingTo=10&yearFrom=1960&yearTo=2023&page=";
    const API_URL_POPULAR_250 = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=";
    const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
    const API_URL_MOVIE_DETAILS = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
    const paginationItems = document.querySelectorAll(".pagination__item");
    const menuLink = document.querySelectorAll(".menu__link");
    document.querySelector("._filter");
    const films = document.querySelector("._films");
    const serials = document.querySelector("._serials");
    const miniSerials = document.querySelector("._mini-serials");
    const tvShow = document.querySelector("._tv-show");
    const top250 = document.querySelector("._top-250");
    const headerLogo = document.querySelector(".header__logo");
    paginationItems.forEach((item => {
        item.addEventListener("click", (() => {
            paginationItems.forEach((item => {
                item.classList.remove("_active");
            }));
            item.classList.add("_active");
            const activeContent = item.textContent;
            function apiClass() {
                if (films.classList.contains("_active")) getMovies_films(API_URL_FILMS + activeContent); else if (serials.classList.contains("_active")) getMovies_serials(API_URL_SERIALS + activeContent); else if (miniSerials.classList.contains("_active")) getMovies_miniSerials(API_URL_MINI_SERIALS + activeContent); else if (tvShow.classList.contains("_active")) getMovies_tvShow(API_URL_TV_SHOW + activeContent); else if (top250.classList.contains("_active")) getMovies_250(API_URL_POPULAR_250 + activeContent); else getMovies(API_URL_POPULAR + activeContent);
            }
            apiClass();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }));
    }));
    menuLink.forEach((item => {
        item.addEventListener("click", (() => {
            menuLink.forEach((item => {
                item.classList.remove("_active");
            }));
            item.classList.add("_active");
        }));
    }));
    films.addEventListener("click", (() => {
        getMovies_films(API_URL_FILMS);
    }));
    serials.addEventListener("click", (() => {
        getMovies_serials(API_URL_SERIALS);
    }));
    miniSerials.addEventListener("click", (() => {
        getMovies_miniSerials(API_URL_MINI_SERIALS);
    }));
    tvShow.addEventListener("click", (() => {
        getMovies_tvShow(API_URL_TV_SHOW);
    }));
    top250.addEventListener("click", (() => {
        getMovies_250(API_URL_POPULAR_250);
    }));
    headerLogo.addEventListener("click", (() => {
        getMovies(API_URL_POPULAR);
    }));
    getMovies(API_URL_POPULAR);
    menuLink.forEach((item => {
        item.addEventListener("click", (() => {
            document.querySelector("html").classList.remove("lock", "menu-open");
            paginationItems.forEach((item => {
                item.classList.remove("_active");
            }));
            if (item === top250) for (let i = 5; i < paginationItems.length; i++) paginationItems[i].style.display = "block"; else for (let i = 5; i < paginationItems.length; i++) paginationItems[i].style.display = "none";
            paginationItems[0].classList.add("_active");
        }));
    }));
    async function getMovies(url) {
        const resp = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY
            }
        });
        const respData = await resp.json();
        showMovies(respData);
    }
    async function getMovies_films(url) {
        const resp = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY
            }
        });
        const respData = await resp.json();
        showFilter(respData);
    }
    async function getMovies_serials(url) {
        const resp = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY
            }
        });
        const respData = await resp.json();
        showFilter(respData);
    }
    async function getMovies_miniSerials(url) {
        const resp = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY
            }
        });
        const respData = await resp.json();
        showFilter(respData);
    }
    async function getMovies_tvShow(url) {
        const resp = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY
            }
        });
        const respData = await resp.json();
        showFilter(respData);
    }
    async function getMovies_250(url) {
        const resp = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY
            }
        });
        const respData = await resp.json();
        showMovies(respData);
    }
    function getClassByRate(vote) {
        if (vote >= 7) return "green"; else if (vote > 5) return "orange"; else return "red";
    }
    function showMovies(data) {
        const moviesEl = document.querySelector(".movies");
        document.querySelector(".movies").innerHTML = "";
        data.films.forEach((movie => {
            const movieEl = document.createElement("div");
            movieEl.classList.add("movie");
            movieEl.innerHTML = `\n\t\t<div class="movie__cover">\n\t\t\t<div class="movie__cover-img -ibg">\n\t\t\t\t<img src="${movie.posterUrlPreview}" alt="${movie.nameRu}">\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="movie__info">\n\t\t\t<div class="movie__title">${movie.nameRu}</div>\n\t\t\t<div class="movie__category">${movie.genres.map((genre => ` ${genre.genre}`))}</div>\n\t\t\t${movie.rating && `\n\t\t\t<div class="movie__average movie__average_${getClassByRate(movie.rating)}">${movie.rating}</div>`}\n\t\t</div>\n\t\t\t\t`;
            movieEl.addEventListener("click", (() => openModal(movie.filmId)));
            moviesEl.appendChild(movieEl);
        }));
    }
    function showFilter(data) {
        const moviesEl = document.querySelector(".movies");
        document.querySelector(".pagination__list");
        document.querySelector(".movies").innerHTML = "";
        data.items.forEach((movie => {
            const movieEl = document.createElement("div");
            movieEl.classList.add("movie");
            movieEl.innerHTML = `\n\t\t<div class="movie__cover">\n\t\t\t<div class="movie__cover-img -ibg">\n\t\t\t\t<img src="${movie.posterUrlPreview}" alt="${movie.nameRu}">\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="movie__info">\n\t\t\t<div class="movie__title">${movie.nameRu}</div>\n\t\t\t<div class="movie__category">${movie.genres.map((genre => ` ${genre.genre}`))}</div>\n\t\t\t${movie.ratingKinopoisk && `\n\t\t\t<div class="movie__average movie__average_${getClassByRate(movie.ratingKinopoisk)}">${movie.ratingKinopoisk}</div>`}\n\t\t</div>\n\t\t\t\t`;
            movieEl.addEventListener("click", (() => openModal(movie.kinopoiskId)));
            moviesEl.appendChild(movieEl);
        }));
    }
    const script_form = document.querySelector("form");
    const search = document.querySelector(".header__search");
    script_form.addEventListener("submit", (e => {
        e.preventDefault();
        const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
        if (search.value) {
            getMovies(apiSearchUrl);
            search.value = "";
        }
    }));
    const modalEl = document.querySelector(".modal");
    async function openModal(id) {
        const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY
            }
        });
        const respData = await resp.json();
        modalEl.classList.add("modal--show");
        document.body.classList.add("stop-scrolling");
        const originalUrl = respData.webUrl;
        const modifiedUrl = originalUrl.replace("kino", "ss");
        modalEl.innerHTML = `\n    <div class="modal__card">\n      <img class="modal__movie-backdrop" src="${respData.posterUrlPreview}" alt="">\n      <h2>\n        <span class="modal__movie-title">${respData.nameRu}</span>\n        <span class="modal__movie-release-year"> - ${respData.year}</span>\n      </h2>\n      <ul class="modal__movie-info">\n        <div class="loader"></div>\n        <li class="modal__movie-genre">Жанр - ${respData.genres.map((el => ` <span>${el.genre}</span>`))}</li>\n        ${respData.filmLength ? `<li class="modal__movie-runtime">Время - ${respData.filmLength} минут</li>` : ""}\n        <li >Сайт: <a class="modal__movie-site" href="${respData.webUrl}">${respData.webUrl}</a></li>\n        <li ><a class="modal__movie-play" href="${modifiedUrl}"><p>Play</p></a></li>\n        <li class="modal__movie-overview">Описание - ${respData.description}</li>\n      </ul>\n      <button type="button" class="modal__button-close">Закрыть</button>\n    </div>\n  `;
        const btnClose = document.querySelector(".modal__button-close");
        btnClose.addEventListener("click", (() => closeModal()));
    }
    function closeModal() {
        modalEl.classList.remove("modal--show");
        document.body.classList.remove("stop-scrolling");
    }
    window.addEventListener("click", (e => {
        if (e.target === modalEl) closeModal();
    }));
    window.addEventListener("keydown", (e => {
        if (e.keyCode === 27) closeModal();
    }));
    window["FLS"] = true;
    isWebp();
    menuInit();
    formFieldsInit({
        viewPass: false
    });
})();