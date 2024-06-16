// ==UserScript==
// @name         Force font everywhere
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Force font everywhere
// @author       Vrexu, with the help of ChatGPT (or the other way around...)
// @match        *://*/*
// @icon         https://avatars.githubusercontent.com/u/1530602
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define the forced cursive font
    var forcedCursiveFont = "Segoe Script";


    function hasPseudoElement(element, pseudo) {
        var computedStyle = window.getComputedStyle(element, pseudo);
        return computedStyle.content !== '' && computedStyle.content !== 'none';
    }

    // Apply the forced cursive font to specific elements
    function applyFontToElements(elements) {
        elements.forEach(function(element) {
            // Filter elements out
            if (!(
                /icon/.test(element.className) ||
                /symbol/.test(element.className) ||
                /arrow_drop/.test(element.textContent) ||
                /info_outline/.test(element.textContent) ||
                hasPseudoElement(element, "::before") ||
                hasPseudoElement(element, "::after") ||
                (element.textContent.trim().length == 1)
            )) {
                element.style.fontFamily = forcedCursiveFont;
            }
        });
    }

    /*
    // Remove text between brackets for subtitles
    function removeTextBetweenBrackets(subtitles) {
        subtitles.forEach(function(subtitle) {
            subtitle.textContent = subtitle.textContent.replace(/\[[^\]]*\]|\([^)]*\)/g, '');
        });
    }
    */

    // Apply the font and remove text between brackets
    function applyStylingIncrementally() {
        var allElements = document.querySelectorAll('*');
        var subtitles = document.querySelectorAll('.subtitles');
        var batchSize = 100;
        var index = 0;

        /*
        removeTextBetweenBrackets(subtitles);
        */

        function applyNextBatch() {
            var batch = Array.from(allElements).slice(index, index + batchSize);
            applyFontToElements(batch);
            index += batchSize;

            if (index < allElements.length) {
                requestAnimationFrame(applyNextBatch);
            }
        }

        applyNextBatch();
    }

    // Throttle function to limit the rate of execution
    function throttle(callback, delay) {
        var previousCall = new Date().getTime();
        return function() {
            var time = new Date().getTime();

            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    }

    // Apply the font and remove text between brackets when the page initially loads
    applyStylingIncrementally();

    // Throttle the mutation observer to reduce its impact
    var observer = new MutationObserver(throttle(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                applyStylingIncrementally();
                break;
            }
        }
    }, 100));

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
