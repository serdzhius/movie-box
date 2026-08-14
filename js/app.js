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
    const API_URL_FILMS = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=FILM&ratingFrom=5&ratingTo=10&page=";
    const API_URL_SERIALS = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=TV_SERIES&ratingFrom=5&ratingTo=10&page=";
    const API_URL_MINI_SERIALS = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=MINI_SERIES&ratingFrom=6&ratingTo=10&page=";
    const API_URL_TV_SHOW = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=TV_SHOW&ratingFrom=5&ratingTo=10&page=";
    const API_URL_POPULAR_250 = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=";
    const API_URL_ACTION = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=ALL&ratingFrom=5&ratingTo=10&genres=11&page=";
    const API_URL_COMEDY = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=ALL&ratingFrom=5&ratingTo=10&genres=13&page=";
    const API_URL_DRAMA = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=ALL&ratingFrom=5&ratingTo=10&genres=2&page=";
    const API_URL_HORROR = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=ALL&ratingFrom=5&ratingTo=10&genres=17&page=";
    const API_URL_SCIFI = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=ALL&ratingFrom=5&ratingTo=10&genres=6&page=";
    const API_URL_THRILLER = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=ALL&ratingFrom=5&ratingTo=10&genres=1&page=";
    const API_URL_FANTASY = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=ALL&ratingFrom=5&ratingTo=10&genres=12&page=";
    const API_URL_ADVENTURE = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=ALL&ratingFrom=5&ratingTo=10&genres=7&page=";
    const API_URL_DETECTIVE = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=ALL&ratingFrom=5&ratingTo=10&genres=5&page=";
    const API_URL_MELODRAMA = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=ALL&ratingFrom=5&ratingTo=10&genres=4&page=";
    const API_URL_ANIMATEDMOVIES = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=ALL&ratingFrom=5&ratingTo=10&genres=18&page=";
    const API_URL_ANIME = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=ALL&ratingFrom=5&ratingTo=10&genres=24&page=";
    const API_URL_HISTORY = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=ALL&ratingFrom=5&ratingTo=10&genres=15&page=";
    const API_URL_DOCUMENTARIES = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=ALL&ratingFrom=5&ratingTo=10&genres=22&page=";
    const API_URL_SHORTFILMS = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=NUM_VOTE&type=ALL&ratingFrom=5&ratingTo=10&genres=23&page=";
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
    const action = document.querySelector("._action");
    const comedy = document.querySelector("._comedy");
    const drama = document.querySelector("._drama");
    const horror = document.querySelector("._horror");
    const scifi = document.querySelector("._scifi");
    const thriller = document.querySelector("._thriller");
    const fantasy = document.querySelector("._fantasy");
    const adventure = document.querySelector("._adventure");
    const detective = document.querySelector("._detective");
    const melodrama = document.querySelector("._melodrama");
    const animatedmovies = document.querySelector("._animatedmovies");
    const anime = document.querySelector("._anime");
    const files_script_history = document.querySelector("._history");
    const documentaries = document.querySelector("._documentaries");
    const shortfilms = document.querySelector("._shortfilms");
    const genreLinks = [ action, comedy, drama, horror, scifi, thriller, fantasy, adventure, detective, melodrama, animatedmovies, anime, files_script_history, documentaries, shortfilms ];
    paginationItems.forEach((item => {
        item.addEventListener("click", (() => {
            paginationItems.forEach((item => {
                item.classList.remove("_active");
            }));
            item.classList.add("_active");
            const activeContent = item.textContent;
            if (window.currentApiUrl) getMovies_genres(window.currentApiUrl + activeContent); else {
                function apiClass() {
                    if (films.classList.contains("_active")) getMovies_films(API_URL_FILMS + activeContent); else if (serials.classList.contains("_active")) getMovies_serials(API_URL_SERIALS + activeContent); else if (miniSerials.classList.contains("_active")) getMovies_miniSerials(API_URL_MINI_SERIALS + activeContent); else if (tvShow.classList.contains("_active")) getMovies_tvShow(API_URL_TV_SHOW + activeContent); else if (top250.classList.contains("_active")) getMovies_250(API_URL_POPULAR_250 + activeContent); else if (action && action.classList.contains("_active")) getMovies_genres(API_URL_ACTION + activeContent); else if (comedy && comedy.classList.contains("_active")) getMovies_genres(API_URL_COMEDY + activeContent); else if (drama && drama.classList.contains("_active")) getMovies_genres(API_URL_DRAMA + activeContent); else if (horror && horror.classList.contains("_active")) getMovies_genres(API_URL_HORROR + activeContent); else if (scifi && scifi.classList.contains("_active")) getMovies_genres(API_URL_SCIFI + activeContent); else if (thriller && thriller.classList.contains("_active")) getMovies_genres(API_URL_THRILLER + activeContent); else if (fantasy && fantasy.classList.contains("_active")) getMovies_genres(API_URL_FANTASY + activeContent); else if (adventure && adventure.classList.contains("_active")) getMovies_genres(API_URL_ADVENTURE + activeContent); else if (detective && detective.classList.contains("_active")) getMovies_genres(API_URL_DETECTIVE + activeContent); else if (melodrama && melodrama.classList.contains("_active")) getMovies_genres(API_URL_MELODRAMA + activeContent); else if (animatedmovies && animatedmovies.classList.contains("_active")) getMovies_genres(API_URL_ANIMATEDMOVIES + activeContent); else if (anime && anime.classList.contains("_active")) getMovies_genres(API_URL_ANIME + activeContent); else if (script_history && script_history.classList.contains("_active")) getMovies_genres(API_URL_HISTORY + activeContent); else if (documentaries && documentaries.classList.contains("_active")) getMovies_genres(API_URL_DOCUMENTARIES + activeContent); else if (shortfilms && shortfilms.classList.contains("_active")) getMovies_genres(API_URL_SHORTFILMS + activeContent); else getMovies(API_URL_POPULAR + activeContent);
                }
                apiClass();
            }
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
            genreLinks.forEach((genre => {
                if (genre) genre.classList.remove("_active");
            }));
            item.classList.add("_active");
        }));
    }));
    genreLinks.forEach((genre => {
        if (genre) genre.addEventListener("click", (() => {
            menuLink.forEach((item => item.classList.remove("_active")));
            genreLinks.forEach((item => {
                if (item) item.classList.remove("_active");
            }));
            genre.classList.add("_active");
            paginationItems.forEach((item => item.classList.remove("_active")));
            if (paginationItems.length > 0) paginationItems[0].classList.add("_active");
            for (let i = 5; i < paginationItems.length; i++) paginationItems[i].style.display = "none";
            const yearValue = document.getElementById("year-select")?.value || "";
            let baseUrl = "";
            if (genre === action) baseUrl = API_URL_ACTION; else if (genre === comedy) baseUrl = API_URL_COMEDY; else if (genre === drama) baseUrl = API_URL_DRAMA; else if (genre === horror) baseUrl = API_URL_HORROR; else if (genre === scifi) baseUrl = API_URL_SCIFI; else if (genre === thriller) baseUrl = API_URL_THRILLER; else if (genre === fantasy) baseUrl = API_URL_FANTASY; else if (genre === adventure) baseUrl = API_URL_ADVENTURE; else if (genre === detective) baseUrl = API_URL_DETECTIVE; else if (genre === melodrama) baseUrl = API_URL_MELODRAMA; else if (genre === animatedmovies) baseUrl = API_URL_ANIMATEDMOVIES; else if (genre === anime) baseUrl = API_URL_ANIME; else if (genre === files_script_history) baseUrl = API_URL_HISTORY; else if (genre === documentaries) baseUrl = API_URL_DOCUMENTARIES; else if (genre === shortfilms) baseUrl = API_URL_SHORTFILMS;
            if (yearValue && baseUrl) {
                baseUrl = baseUrl.replace("&page=", "");
                if (yearValue.includes("-")) {
                    const [from, to] = yearValue.split("-");
                    baseUrl += `&yearFrom=${from}&yearTo=${to}`;
                } else baseUrl += `&yearFrom=${yearValue}&yearTo=${yearValue}`;
                baseUrl += "&page=";
            }
            if (baseUrl) {
                getMovies_genres(baseUrl);
                window.currentApiUrl = baseUrl;
            }
            if (typeof closeSidebar === "function") closeSidebar();
        }));
    }));
    films.addEventListener("click", (() => {
        window.currentApiUrl = null;
        getMovies_films(API_URL_FILMS);
    }));
    serials.addEventListener("click", (() => {
        window.currentApiUrl = null;
        getMovies_serials(API_URL_SERIALS);
    }));
    miniSerials.addEventListener("click", (() => {
        window.currentApiUrl = null;
        getMovies_miniSerials(API_URL_MINI_SERIALS);
    }));
    tvShow.addEventListener("click", (() => {
        window.currentApiUrl = null;
        getMovies_tvShow(API_URL_TV_SHOW);
    }));
    top250.addEventListener("click", (() => {
        window.currentApiUrl = null;
        getMovies_250(API_URL_POPULAR_250);
    }));
    headerLogo.addEventListener("click", (() => {
        window.currentApiUrl = null;
        genreLinks.forEach((genre => {
            if (genre) genre.classList.remove("_active");
        }));
        getMovies(API_URL_POPULAR);
    }));
    headerLogo.addEventListener("click", (() => {
        genreLinks.forEach((genre => {
            if (genre) genre.classList.remove("_active");
        }));
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
    async function getMovies_genres(url) {
        const resp = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY
            }
        });
        const respData = await resp.json();
        showFilter(respData);
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
            menuLink.forEach((item => item.classList.remove("_active")));
            genreLinks.forEach((genre => {
                if (genre) genre.classList.remove("_active");
            }));
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
    const sidebar = document.getElementById("genres-sidebar");
    const overlay = document.getElementById("overlay");
    const openBtn = document.querySelector(".genres-button");
    const closeBtn = document.querySelector(".sidebar__close");
    function openSidebar() {
        sidebar.classList.add("sidebar--open");
        overlay.classList.add("overlay--active");
        document.body.style.overflow = "hidden";
    }
    function closeSidebar() {
        sidebar.classList.remove("sidebar--open");
        overlay.classList.remove("overlay--active");
        document.body.style.overflow = "";
    }
    openBtn.addEventListener("click", openSidebar);
    closeBtn.addEventListener("click", closeSidebar);
    overlay.addEventListener("click", closeSidebar);
    document.addEventListener("keydown", (e => {
        if (e.key === "Escape") closeSidebar();
    }));
    window.addEventListener("click", (e => {
        if (e.target === modalEl) closeModal();
    }));
    window.addEventListener("keydown", (e => {
        if (e.keyCode === 27) closeModal();
    }));
    const genreSelect = document.getElementById("genre-select");
    const yearSelect = document.getElementById("year-select");
    const findBtn = document.getElementById("find-btn");
    findBtn.addEventListener("click", (() => {
        const genre = genreSelect.value;
        const yearValue = yearSelect.value;
        let url = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=RATING&type=ALL&ratingFrom=5&ratingTo=10";
        if (genre) url += `&genres=${genre}`;
        if (yearValue) if (yearValue.includes("-")) {
            const [from, to] = yearValue.split("-");
            url += `&yearFrom=${from}&yearTo=${to}`;
        } else url += `&yearFrom=${yearValue}&yearTo=${yearValue}`;
        url += "&page=";
        document.querySelectorAll(".menu__link, .genres-list__item").forEach((el => {
            el.classList.remove("_active");
        }));
        document.querySelectorAll(".pagination__item").forEach((el => el.classList.remove("_active")));
        document.querySelector(".pagination__item")?.classList.add("_active");
        getMovies_genres(url + "1");
        window.currentApiUrl = url;
    }));
    window["FLS"] = true;
    isWebp();
    menuInit();
    formFieldsInit({
        viewPass: false
    });
})();