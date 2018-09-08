// ==UserScript==
// @name         RubyGems README
// @namespace    https://github.com/greatghoul/userscript-gem-readme/
// @version      0.1
// @description  Pull github readme to rubygems details page
// @author       greatghoul
// @include      https://rubygems.org/gems/*
// @include      https://github.com/*/*
// @resource     yue.css https://lab.lepture.com/yue.css/yue.css
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

(function() {
  'use strict';

  GM_addStyle(GM_getResourceText('yue.css'));

  function getHomePageUrl() {
    const home = document.querySelector('#home')
    return home && home.href;
  }

  function isGithub(url) {
    return url.match(/github.com\/([^\/]+)\/([^\/]+)\/?$/);
  }

  function extractReadme(html) {
    const readme = html.replace(/<body([^>]+?)>/img, '').replace(/<\/body>/img, '');
    const doc = document.implementation.createHTMLDocument('virtual');
    doc.body.innerHTML = readme;
    return doc.body.querySelector('article.entry-content').innerHTML;
  }

  function renderReadme(readme) {
    const gemMembers = document.querySelector('.gem__members');

    const content = document.createElement('div');
    content.className = 'gem__description yue';
    content.innerHTML = readme;
    gemMembers.insertBefore(content, gemMembers.firstChild);

    const heading = document.createElement('h3');
    heading.className = 't-list__heading';
    heading.innerHTML = 'Description';
    gemMembers.insertBefore(heading, gemMembers.firstChild);
  }

  function fetchReadme(url) {
    GM_xmlhttpRequest({
      url: url,
      method: 'GET',
      headers: {
        'Content-Type': 'text/html',
      },
      onload: function(details) {
        if (details.status === 200) {
          const readme = extractReadme(details.responseText);
          renderReadme(readme);
        }
      }
    });
  }

  const url = getHomePageUrl();
  if (url && isGithub(url)) {
    fetchReadme(url);
  }
})();
