/**
 * This is the Key Cat.
 *
 * @author  L. D. Nordstrom <d@mrnordstrom.com>
 * @version 0.1.0
 * @license MPL 2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Global KeyCat constructor.
 *
 * @class
 */
function KeyCat() {
  'use strict'

  /* *********
   * Private *
   ********* */

  /** Self reference for closures */
  var self = this

  /** All loaded key items */
  var items = []

  /**
   * @method
   * @private
   */
  function initialize() {
    self.emit('initialize')

    self.request({ url: 'keys/default.keys' }, function (data) {
      items = getKeyItemsFromText(data.body)
      reloadList()
    })
  }

  function getKeyItemsFromText(text) {
    var lines = text.split('\n')
    var items = []
    var line

    while (lines.length) {
      line = lines.shift()

      if (line) items.push(getKeyItemFromLine(line))
    }

    return items
  }

  function getKeyItemFromLine(line) {
    var spaceIndex = line.indexOf(' ')
    var tagsIndex = line.indexOf('#')
    var keys = line.substring(0, spaceIndex)
    var text = line.substring(spaceIndex + 1, tagsIndex - 1)
    var tags = line.substring(tagsIndex)

    console.log('Keys: ' + keys)
    console.log('Text: ' + text)
    console.log('Tags: ' + tags)
    console.log('----------')

    return {
      keys: keys,
      text: text,
      tags: tags
    }
  }

  function reloadList() {
    var listItems = items.slice()
    var fragment = document.createDocumentFragment()
    var list = document.querySelector('.keys')
    var item
    var li
    var kbd
    var span

    if (list) {
      while (listItems.length) {
        item = listItems.shift()
        li = document.createElement('li')
        kbd = document.createElement('kbd')
        span = document.createElement('span')
        kbd.appendChild(document.createTextNode(item.keys))
        span.appendChild(document.createTextNode(item.text))
        li.appendChild(kbd)
        li.appendChild(span)
        fragment.appendChild(li)
      }

      list.appendChild(fragment)
    }
  }

  /* ************
   * Public API *
   ************ */

  /**
   * Subscribe method for events.
   *
   * @method
   * @public
   */
  this.on = function on(topic, func) {
    if (!this.topics) this.topics = {}
    if (!(topic instanceof Array)) topic = [topic]

    topic.forEach(function (t) {
      this[t] ? this[t].push(func) : this[t] = [func]
    }.bind(this.topics))
  }

  /**
   * Publish method for events.
   *
   * @method
   * @public
   */
  this.emit = function emit(topic, data) {
    if (!this.topics) return
    (this.topics[topic] || []).forEach(function (fn) { fn(data) })
  }

  /**
   * Unsubscribe method for events.
   *
   * @method
   * @public
   */
  this.off = function off(topic, func) {
    (this.topics[topic] || []).some(function (fn, index, array) {
      if (fn === func) return array.splice(index, 1)
    })
  }

  /**
   * Sends an XMLHTTPRequest to a given URL (specified in `options`
   * parameter along with request headers), and returns an object
   * representing the response to a callback function. This response
   * object contains only selected details we need; currently `body`
   * and `headers` (the only header we need is the `ETag`.
   *
   * @method
   * @public
   * @param {Object} options Object (`url` and `headers` properties)
   * @param {Function} callback Callback function to pass response
   */
  this.request = function request(options, callback) {
    var xhr = new XMLHttpRequest()

    xhr.open('GET', options.url, true)

    if (options.hasOwnProperty('headers')) {
      for (var header in options.headers) {
        xhr.setRequestHeader(header, options.headers[header])
      }
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        callback({
          body: xhr.responseText,
          headers: { 'ETag': xhr.getResponseHeader('ETag') },
          status: xhr.status
        })
      }
    }

    xhr.send(null)
  }

  /* ****************
   * Initialization *
   **************** */

  if (document.readyState === 'complete') {
    initialize()
  } else {
    document.addEventListener('DOMContentLoaded', initialize, false)
  }
}

var keycat = new KeyCat()
