APP.applicationController = (function () {
    'use strict';

    function offlineWarning() {
        alert("This feature is only available online.");
    }

    function pageNotFound() {
        alert("That page you were looking for cannot be found.");
    }

    function showHome() {

        $("#body").html(APP.templates.home());

        // Load up the last cached copy of the news
        APP.articlesController.showArticleList();

        $('#refreshButton').click(function () {
            // If the user is offline, don't bother trying to synchronize
            if (navigator && navigator.onLine === false) {
                offlineWarning();
            } else {
                APP.articlesController.synchronizeWithServer(offlineWarning);
            }
        });

    }

    function showArticle(id) {
        $("#body").html(APP.templates.articleLoading());
        APP.articlesController.showArticle(id);
    }

    function route() {
        var page = window.location.hash;
        if (page) {
            page = page.substring(1);  //截取掉#符号
            /**
             * how: 2016-9-25 12:37 @Lee v1
             * what: 如果是数字那么调用某个函数，如果不是数字就显示错误信息
             * why: 由于这个项目是单纯的新闻网页，所以直接做了这种低端弱智的条件判断
             */
            if (parseInt(page, 10) > 0) {
                showArticle(page);
            } else {
                pageNotFound();
            }
        } else {
            showHome();
        }
    }


    // This is to our webapp what main() is to C, $(document).ready is to jQuery, etc
    //项目入口
    function start(resources, storeResources) {
        //打开或新建数据库
        APP.database.open(function () {
            // Listen to the hash tag changing
            $(window).bind("hashchange", route);

            // Create app elements
            $("body").html(APP.templates.application());

            // Remove our loading splash screen
            $("#loading").remove();

            route();
        });

        if (storeResources) {
            localStorage.resources = JSON.stringify(resources);
        }
    }

    return {
        start: start
    };
}());