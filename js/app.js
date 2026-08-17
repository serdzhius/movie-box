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
                    for (let index = 0; index < lock_padding.length; index++) lock_padding[index].style.paddingRight = "0px";
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
                for (let index = 0; index < lock_padding.length; index++) lock_padding[index].style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
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
                    if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) checkboxes[index].checked = false;
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
                window.addEventListener("scroll", (function() {
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
        const SEARCH_API_PAGES = 5;
        const SEARCH_PAGE_SIZE = 20;
        const menuLink = document.querySelectorAll(".menu__link");
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
        const historyGenre = document.querySelector("._history");
        const documentaries = document.querySelector("._documentaries");
        const shortfilms = document.querySelector("._shortfilms");
        const genreLinks = [ action, comedy, drama, horror, scifi, thriller, fantasy, adventure, detective, melodrama, animatedmovies, anime, historyGenre, documentaries, shortfilms ];
        window.currentApiUrl = API_URL_POPULAR;
        window.currentMode = "popular";
        window.currentPage = 1;
        window.currentSearchQuery = "";
        window.searchResults = [];
        function updatePagination(totalPages, activePage = 1) {
            const list = document.querySelector(".pagination__list");
            if (!list) return;
            const pages = Math.max(1, Math.min(Number(totalPages) || 1, 20));
            list.innerHTML = "";
            for (let i = 1; i <= pages; i++) {
                const li = document.createElement("li");
                li.className = "pagination__item" + (i === Number(activePage) ? " _active" : "");
                li.textContent = String(i);
                list.appendChild(li);
            }
        }
        function loadByMode(page) {
            window.currentPage = Number(page) || 1;
            if (window.currentMode === "search") {
                renderSearchPage(window.currentPage);
                return;
            }
            const url = (window.currentApiUrl || API_URL_POPULAR) + window.currentPage;
            switch (window.currentMode) {
              case "films":
                getMovies_films(url);
                break;

              case "serials":
                getMovies_serials(url);
                break;

              case "mini":
                getMovies_miniSerials(url);
                break;

              case "tv":
                getMovies_tvShow(url);
                break;

              case "top250":
                getMovies_250(url);
                break;

              case "genres":
                getMovies_genres(url);
                break;

              default:
                getMovies(url);
            }
        }
        const paginationList = document.querySelector(".pagination__list");
        if (paginationList) paginationList.addEventListener("click", (e => {
            const item = e.target.closest(".pagination__item");
            if (!item) return;
            paginationList.querySelectorAll(".pagination__item").forEach((el => el.classList.remove("_active")));
            item.classList.add("_active");
            loadByMode(item.textContent.trim());
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }));
        menuLink.forEach((item => {
            item.addEventListener("click", (() => {
                menuLink.forEach((el => el.classList.remove("_active")));
                genreLinks.forEach((g => g && g.classList.remove("_active")));
                item.classList.add("_active");
                document.querySelector("html")?.classList.remove("lock", "menu-open");
            }));
        }));
        if (films) films.addEventListener("click", (() => {
            window.currentSearchQuery = "";
            window.searchResults = [];
            window.currentApiUrl = API_URL_FILMS;
            window.currentMode = "films";
            window.currentPage = 1;
            getMovies_films(API_URL_FILMS + "1");
        }));
        if (serials) serials.addEventListener("click", (() => {
            window.currentSearchQuery = "";
            window.searchResults = [];
            window.currentApiUrl = API_URL_SERIALS;
            window.currentMode = "serials";
            window.currentPage = 1;
            getMovies_serials(API_URL_SERIALS + "1");
        }));
        if (miniSerials) miniSerials.addEventListener("click", (() => {
            window.currentSearchQuery = "";
            window.searchResults = [];
            window.currentApiUrl = API_URL_MINI_SERIALS;
            window.currentMode = "mini";
            window.currentPage = 1;
            getMovies_miniSerials(API_URL_MINI_SERIALS + "1");
        }));
        if (tvShow) tvShow.addEventListener("click", (() => {
            window.currentSearchQuery = "";
            window.searchResults = [];
            window.currentApiUrl = API_URL_TV_SHOW;
            window.currentMode = "tv";
            window.currentPage = 1;
            getMovies_tvShow(API_URL_TV_SHOW + "1");
        }));
        if (top250) top250.addEventListener("click", (() => {
            window.currentSearchQuery = "";
            window.searchResults = [];
            window.currentApiUrl = API_URL_POPULAR_250;
            window.currentMode = "top250";
            window.currentPage = 1;
            getMovies_250(API_URL_POPULAR_250 + "1");
        }));
        if (headerLogo) headerLogo.addEventListener("click", (e => {
            e.preventDefault();
            window.currentSearchQuery = "";
            window.searchResults = [];
            window.currentApiUrl = API_URL_POPULAR;
            window.currentMode = "popular";
            window.currentPage = 1;
            menuLink.forEach((el => el.classList.remove("_active")));
            genreLinks.forEach((g => g && g.classList.remove("_active")));
            getMovies(API_URL_POPULAR + "1");
        }));
        genreLinks.forEach((genre => {
            if (!genre) return;
            genre.addEventListener("click", (() => {
                menuLink.forEach((item => item.classList.remove("_active")));
                genreLinks.forEach((item => item && item.classList.remove("_active")));
                genre.classList.add("_active");
                const yearValue = document.getElementById("year-select")?.value || "";
                let baseUrl = "";
                if (genre === action) baseUrl = API_URL_ACTION; else if (genre === comedy) baseUrl = API_URL_COMEDY; else if (genre === drama) baseUrl = API_URL_DRAMA; else if (genre === horror) baseUrl = API_URL_HORROR; else if (genre === scifi) baseUrl = API_URL_SCIFI; else if (genre === thriller) baseUrl = API_URL_THRILLER; else if (genre === fantasy) baseUrl = API_URL_FANTASY; else if (genre === adventure) baseUrl = API_URL_ADVENTURE; else if (genre === detective) baseUrl = API_URL_DETECTIVE; else if (genre === melodrama) baseUrl = API_URL_MELODRAMA; else if (genre === animatedmovies) baseUrl = API_URL_ANIMATEDMOVIES; else if (genre === anime) baseUrl = API_URL_ANIME; else if (genre === historyGenre) baseUrl = API_URL_HISTORY; else if (genre === documentaries) baseUrl = API_URL_DOCUMENTARIES; else if (genre === shortfilms) baseUrl = API_URL_SHORTFILMS;
                if (!baseUrl) return;
                baseUrl = baseUrl.replace(/&page=$/, "");
                if (yearValue) if (yearValue.includes("-")) {
                    const [from, to] = yearValue.split("-");
                    baseUrl += `&yearFrom=${from}&yearTo=${to}`;
                } else baseUrl += `&yearFrom=${yearValue}&yearTo=${yearValue}`;
                baseUrl += "&page=";
                window.currentSearchQuery = "";
                window.searchResults = [];
                window.currentApiUrl = baseUrl;
                window.currentMode = "genres";
                window.currentPage = 1;
                getMovies_genres(baseUrl + "1");
                if (typeof closeSidebar === "function") closeSidebar();
            }));
        }));
        async function fetchJson(url) {
            const resp = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": API_KEY
                }
            });
            if (!resp.ok) throw new Error("Ошибка запроса: " + resp.status);
            return resp.json();
        }
        async function getMovies(url) {
            try {
                showMovies(await fetchJson(url));
            } catch (err) {
                console.error(err);
            }
        }
        async function getMovies_films(url) {
            try {
                showFilter(await fetchJson(url));
            } catch (err) {
                console.error(err);
            }
        }
        async function getMovies_serials(url) {
            try {
                showFilter(await fetchJson(url));
            } catch (err) {
                console.error(err);
            }
        }
        async function getMovies_miniSerials(url) {
            try {
                showFilter(await fetchJson(url));
            } catch (err) {
                console.error(err);
            }
        }
        async function getMovies_tvShow(url) {
            try {
                showFilter(await fetchJson(url));
            } catch (err) {
                console.error(err);
            }
        }
        async function getMovies_250(url) {
            try {
                showMovies(await fetchJson(url));
            } catch (err) {
                console.error(err);
            }
        }
        async function getMovies_genres(url) {
            try {
                showFilter(await fetchJson(url));
            } catch (err) {
                console.error(err);
            }
        }
        function escapeRegExp(str) {
            return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
        function normalizeText(str) {
            return String(str).toLowerCase().replace(/ё/g, "е").replace(/[-–—_]/g, " ").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
        }
        function titleHasWord(titleNorm, word) {
            if (!word || word.length < 2) return false;
            if (titleNorm.includes(word)) return true;
            const titleWords = titleNorm.split(" ").filter(Boolean);
            const prefixes = [];
            const max = Math.min(word.length, 7);
            for (let len = Math.min(4, word.length); len <= max; len++) prefixes.push(word.slice(0, len));
            return titleWords.some((tw => {
                if (tw === word) return true;
                if (tw.startsWith(word) || word.startsWith(tw)) return true;
                return prefixes.some((p => p.length >= 4 && (tw.startsWith(p) || p.startsWith(tw.slice(0, Math.min(4, tw.length))))));
            }));
        }
        function scoreTitle(name, query) {
            if (!name) return 0;
            const n = normalizeText(name);
            const q = normalizeText(query);
            if (!n || !q) return 0;
            if (n === q) return 100;
            if (n.includes(q)) return 95;
            const qWords = q.split(" ").filter((w => w.length >= 2));
            if (!qWords.length) return 0;
            if (qWords.length === 1) {
                const w = qWords[0];
                if (n === w) return 100;
                const wordRe = new RegExp(`(?:^|\\s)${escapeRegExp(w)}(?:$|\\s)`, "i");
                if (wordRe.test(n)) return 85;
                if (titleHasWord(n, w)) return 75;
                if (n.includes(w)) return 30;
                return 0;
            }
            const matched = qWords.filter((w => titleHasWord(n, w)));
            if (matched.length === qWords.length) return 88;
            if (matched.length >= Math.ceil(qWords.length * .7)) return 55;
            return 0;
        }
        function scoreMovie(movie, query) {
            const scores = [ movie.nameRu, movie.nameEn, movie.nameOriginal ].filter(Boolean).map((name => scoreTitle(name, query)));
            return scores.length ? Math.max(...scores) : 0;
        }
        async function runSearch(query) {
            window.currentSearchQuery = query;
            window.currentMode = "search";
            window.currentPage = 1;
            window.searchResults = [];
            const moviesEl = document.querySelector(".movies");
            showPreloader();
            try {
                const requests = [];
                for (let p = 1; p <= SEARCH_API_PAGES; p++) requests.push(fetchJson(`${API_URL_SEARCH}${encodeURIComponent(query)}&page=${p}`).catch((() => null)));
                const pagesData = await Promise.all(requests);
                const byId = new Map;
                pagesData.forEach((data => {
                    (data && data.films ? data.films : []).forEach((film => {
                        const id = film.filmId;
                        if (id != null && !byId.has(id)) byId.set(id, film);
                    }));
                }));
                const qWords = normalizeText(query).split(" ").filter((w => w.length >= 2));
                const minScore = qWords.length <= 1 && query.trim().length <= 3 ? 75 : 50;
                window.searchResults = Array.from(byId.values()).map((movie => ({
                    movie,
                    score: scoreMovie(movie, query)
                }))).filter((item => item.score >= minScore)).sort(((a, b) => b.score - a.score)).map((item => item.movie));
                renderSearchPage(1);
                hidePreloader();
            } catch (err) {
                console.error(err);
                if (moviesEl) moviesEl.innerHTML = '<p style="padding:1rem">Ошибка поиска</p>';
                updatePagination(1, 1);
                hidePreloader();
            }
        }
        function showPreloader() {
            const preloader = document.querySelector(".preloader");
            document.body.classList.remove("loaded", "loaded_hiding");
            if (preloader) {
                preloader.style.opacity = "1";
                preloader.style.visibility = "visible";
                preloader.style.pointerEvents = "auto";
            }
        }
        function hidePreloader() {
            const preloader = document.querySelector(".preloader");
            document.body.classList.add("loaded_hiding");
            window.setTimeout((() => {
                document.body.classList.add("loaded");
                document.body.classList.remove("loaded_hiding");
                if (preloader) {
                    preloader.style.opacity = "";
                    preloader.style.visibility = "";
                    preloader.style.pointerEvents = "";
                }
            }), 400);
        }
        function renderSearchPage(page) {
            const moviesEl = document.querySelector(".movies");
            if (!moviesEl) return;
            const total = window.searchResults.length;
            const totalPages = Math.max(1, Math.ceil(total / SEARCH_PAGE_SIZE) || 1);
            const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
            window.currentPage = safePage;
            const start = (safePage - 1) * SEARCH_PAGE_SIZE;
            const slice = window.searchResults.slice(start, start + SEARCH_PAGE_SIZE);
            moviesEl.innerHTML = "";
            if (!slice.length) moviesEl.innerHTML = '<p style="padding:1rem;opacity:.7">Ничего не найдено</p>'; else slice.forEach((movie => {
                const movieEl = document.createElement("div");
                movieEl.classList.add("movie");
                movieEl.innerHTML = `\n\t\t\t\t<div class="movie__cover">\n\t\t\t\t\t<div class="movie__cover-img -ibg">\n\t\t\t\t\t\t<img src="${movie.posterUrlPreview || ""}" alt="${movie.nameRu || ""}">\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="movie__info">\n\t\t\t\t\t<div class="movie__title">${movie.nameRu || movie.nameEn || ""}</div>\n\t\t\t\t\t<div class="movie__category">${(movie.genres || []).map((g => ` ${g.genre}`)).join("")}</div>\n\t\t\t\t\t${movie.rating ? `<div class="movie__average movie__average_${getClassByRate(movie.rating)}">${movie.rating}</div>` : ""}\n\t\t\t\t</div>`;
                movieEl.addEventListener("click", (() => openModal(movie.filmId)));
                moviesEl.appendChild(movieEl);
            }));
            updatePagination(totalPages, safePage);
        }
        function getClassByRate(vote) {
            if (vote >= 7) return "green";
            if (vote > 5) return "orange";
            return "red";
        }
        function showMovies(data) {
            const moviesEl = document.querySelector(".movies");
            if (!moviesEl) return;
            moviesEl.innerHTML = "";
            const list = data.films || [];
            list.forEach((movie => {
                const movieEl = document.createElement("div");
                movieEl.classList.add("movie");
                movieEl.innerHTML = `\n\t\t\t<div class="movie__cover">\n\t\t\t\t<div class="movie__cover-img -ibg">\n\t\t\t\t\t<img src="${movie.posterUrlPreview || ""}" alt="${movie.nameRu || ""}">\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class="movie__info">\n\t\t\t\t<div class="movie__title">${movie.nameRu || movie.nameEn || ""}</div>\n\t\t\t\t<div class="movie__category">${(movie.genres || []).map((g => ` ${g.genre}`)).join("")}</div>\n\t\t\t\t${movie.rating ? `<div class="movie__average movie__average_${getClassByRate(movie.rating)}">${movie.rating}</div>` : ""}\n\t\t\t</div>`;
                movieEl.addEventListener("click", (() => openModal(movie.filmId)));
                moviesEl.appendChild(movieEl);
            }));
            updatePagination(data.pagesCount || 1, window.currentPage || 1);
        }
        function showFilter(data) {
            const moviesEl = document.querySelector(".movies");
            if (!moviesEl) return;
            moviesEl.innerHTML = "";
            const list = data.items || [];
            list.forEach((movie => {
                const movieEl = document.createElement("div");
                movieEl.classList.add("movie");
                movieEl.innerHTML = `\n\t\t\t<div class="movie__cover">\n\t\t\t\t<div class="movie__cover-img -ibg">\n\t\t\t\t\t<img src="${movie.posterUrlPreview || ""}" alt="${movie.nameRu || ""}">\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class="movie__info">\n\t\t\t\t<div class="movie__title">${movie.nameRu || movie.nameEn || ""}</div>\n\t\t\t\t<div class="movie__category">${(movie.genres || []).map((g => ` ${g.genre}`)).join("")}</div>\n\t\t\t\t${movie.ratingKinopoisk ? `<div class="movie__average movie__average_${getClassByRate(movie.ratingKinopoisk)}">${movie.ratingKinopoisk}</div>` : ""}\n\t\t\t</div>`;
                movieEl.addEventListener("click", (() => openModal(movie.kinopoiskId)));
                moviesEl.appendChild(movieEl);
            }));
            updatePagination(data.totalPages || 1, window.currentPage || 1);
        }
        const scriptForm = document.querySelector(".header__form") || document.querySelector("form");
        const search = document.querySelector(".header__search");
        if (search) {
            search.addEventListener("focus", (() => search.classList.add("_expanded")));
            search.addEventListener("blur", (() => search.classList.remove("_expanded")));
        }
        if (scriptForm && search) scriptForm.addEventListener("submit", (e => {
            e.preventDefault();
            const query = search.value.trim();
            if (!query) return;
            menuLink.forEach((item => item.classList.remove("_active")));
            genreLinks.forEach((genre => genre && genre.classList.remove("_active")));
            runSearch(query);
            search.value = "";
            search.blur();
        }));
        const genreSelect = document.getElementById("genre-select");
        const yearSelect = document.getElementById("year-select");
        const findBtn = document.getElementById("find-btn");
        if (findBtn) findBtn.addEventListener("click", (() => {
            const genre = genreSelect ? genreSelect.value : "";
            const yearValue = yearSelect ? yearSelect.value : "";
            let url = "https://kinopoiskapiunofficial.tech/api/v2.2/films?order=RATING&type=ALL&ratingFrom=5&ratingTo=10";
            if (genre) url += `&genres=${genre}`;
            if (yearValue) if (yearValue.includes("-")) {
                const [from, to] = yearValue.split("-");
                url += `&yearFrom=${from}&yearTo=${to}`;
            } else url += `&yearFrom=${yearValue}&yearTo=${yearValue}`;
            url += "&page=";
            menuLink.forEach((el => el.classList.remove("_active")));
            genreLinks.forEach((g => g && g.classList.remove("_active")));
            window.currentSearchQuery = "";
            window.searchResults = [];
            window.currentApiUrl = url;
            window.currentMode = "genres";
            window.currentPage = 1;
            getMovies_genres(url + "1");
        }));
        const modalEl = document.querySelector(".modal");
        async function openModal(id) {
            if (!id || !modalEl) return;
            modalEl.classList.add("modal--show");
            document.body.classList.add("stop-scrolling");
            try {
                const respData = await fetchJson(API_URL_MOVIE_DETAILS + id);
                const webUrl = respData.webUrl || "#";
                const modifiedUrl = String(webUrl).replace("https://www.kinopoisk.ru/film/", "https://kinogo.biz/");
                modalEl.innerHTML = `\n\t\t\t<div class="modal__card">\n\t\t\t\t<img class="modal__movie-backdrop" src="${respData.posterUrlPreview || ""}" alt="">\n\t\t\t\t<h2>\n\t\t\t\t\t<span class="modal__movie-title">${respData.nameRu || ""}</span>\n\t\t\t\t\t<span class="modal__movie-release-year"> - ${respData.year || ""}</span>\n\t\t\t\t</h2>\n\t\t\t\t<ul class="modal__movie-info">\n\t\t\t\t\t<li class="modal__movie-genre">Жанр - ${(respData.genres || []).map((el => ` <span>${el.genre}</span>`)).join("")}</li>\n\t\t\t\t\t${respData.filmLength ? `<li class="modal__movie-runtime">Время - ${respData.filmLength} минут</li>` : ""}\n\t\t\t\t\t<li>Сайт: <a class="modal__movie-site" href="${webUrl}" target="_blank" rel="noopener">${webUrl}</a></li>\n\t\t\t\t\t<li><a class="modal__movie-play" href="${modifiedUrl}" target="_blank" rel="noopener"><p>Play</p></a></li>\n\t\t\t\t\t<li class="modal__movie-overview">Описание - ${respData.description || ""}</li>\n\t\t\t\t</ul>\n\t\t\t\t<button type="button" class="modal__button-close">Закрыть</button>\n\t\t\t</div>`;
                modalEl.querySelector(".modal__button-close")?.addEventListener("click", closeModal);
            } catch (err) {
                console.error(err);
                closeModal();
            }
        }
        function closeModal() {
            if (!modalEl) return;
            modalEl.classList.remove("modal--show");
            document.body.classList.remove("stop-scrolling");
        }
        window.addEventListener("click", (e => {
            if (e.target === modalEl) closeModal();
        }));
        window.addEventListener("keydown", (e => {
            if (e.key === "Escape") closeModal();
        }));
        const sidebar = document.getElementById("genres-sidebar");
        const overlay = document.getElementById("overlay");
        const openBtn = document.querySelector(".genres-button");
        const closeBtn = document.querySelector(".sidebar__close");
        function openSidebar() {
            sidebar?.classList.add("sidebar--open");
            overlay?.classList.add("overlay--active");
            document.body.style.overflow = "hidden";
        }
        function closeSidebar() {
            sidebar?.classList.remove("sidebar--open");
            overlay?.classList.remove("overlay--active");
            document.body.style.overflow = "";
        }
        openBtn?.addEventListener("click", openSidebar);
        closeBtn?.addEventListener("click", closeSidebar);
        overlay?.addEventListener("click", closeSidebar);
        document.addEventListener("keydown", (e => {
            if (e.key === "Escape") closeSidebar();
        }));
        getMovies(API_URL_POPULAR + "1");
        window["FLS"] = true;
        isWebp();
        menuInit();
        formFieldsInit({
            viewPass: false
        });
    })();
    window["FLS"] = true;
    isWebp();
    menuInit();
    formFieldsInit({
        viewPass: false
    });
})();