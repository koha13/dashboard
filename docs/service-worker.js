/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "9f3047a170af89b1cb0108b8d3eb24e8"
  },
  {
    "url": "assets/css/0.styles.ba75a2e0.css",
    "revision": "27b6e796b69e48ba48bb08f2b08ff27b"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.aa51b061.js",
    "revision": "5fc5d4280f5e21daeaf74dffc281b2c0"
  },
  {
    "url": "assets/js/11.2c2284b6.js",
    "revision": "4ae6480cf8326e2319a78ee9326ca65b"
  },
  {
    "url": "assets/js/12.d104d09f.js",
    "revision": "3d2c5f7b66879b44000f3b66807391c0"
  },
  {
    "url": "assets/js/13.e450a272.js",
    "revision": "76d48e0adc034be24d386a5d56a246c3"
  },
  {
    "url": "assets/js/14.b00da5ea.js",
    "revision": "99961161e20049ff1481cd46e953348e"
  },
  {
    "url": "assets/js/15.89c37b90.js",
    "revision": "0b9d8d3ceec50f76410f0ad45fe35523"
  },
  {
    "url": "assets/js/2.17bbabd6.js",
    "revision": "2d9c86435994aa2005d0e866baa83221"
  },
  {
    "url": "assets/js/3.01fa150f.js",
    "revision": "29c4cd33934a3ae62e3bdb7cc27f9a32"
  },
  {
    "url": "assets/js/4.7d066ce5.js",
    "revision": "09699a23c4003f07351a66e553ec7cc4"
  },
  {
    "url": "assets/js/5.6efe8f96.js",
    "revision": "6fc923635b63ac41d96cc576b790461a"
  },
  {
    "url": "assets/js/6.92bc9365.js",
    "revision": "500d64ab0141debb5effc3951b01879d"
  },
  {
    "url": "assets/js/7.efd96136.js",
    "revision": "d909dd69c78fb97061ae562b83c43949"
  },
  {
    "url": "assets/js/8.d0215569.js",
    "revision": "edc3228130c77bbb851328141380446f"
  },
  {
    "url": "assets/js/9.a176f9f9.js",
    "revision": "a5117212b5e7d3bf1884a79fbe4f1614"
  },
  {
    "url": "assets/js/app.0b46a327.js",
    "revision": "133cb97e879586da7f4a23e9c3ae308b"
  },
  {
    "url": "guide/advanced-feature.html",
    "revision": "bd517e9ba5cb78515e64a7d988af69af"
  },
  {
    "url": "guide/how-it-works.html",
    "revision": "6467207f38be8db0d064d41d088702b3"
  },
  {
    "url": "guide/import-export.html",
    "revision": "031b9f9946ccdd6b3b41028491593633"
  },
  {
    "url": "guide/index.html",
    "revision": "0e6e20faf8c89a5771e9f45bc1f26782"
  },
  {
    "url": "guide/introduction.html",
    "revision": "21620362abd126a8aa7c177952cf5e83"
  },
  {
    "url": "guide/jmx-controller.html",
    "revision": "7ebd7d322e5b417a4f424c7de2570e6a"
  },
  {
    "url": "index.html",
    "revision": "36d5bb4175ea7a5e7e723410edfdc756"
  },
  {
    "url": "pictures/controllers.png",
    "revision": "ef2f1a20693bb51ae5a81d4d78294938"
  },
  {
    "url": "pictures/dshiw.png",
    "revision": "0c8905fefcf64247b22363469e6ebc6a"
  },
  {
    "url": "pictures/howitworks.png",
    "revision": "372322e1865927785bc9663e0bab640d"
  },
  {
    "url": "pictures/image.png",
    "revision": "dfe0373cc437a375c977fc25b6351eda"
  },
  {
    "url": "pictures/start.png",
    "revision": "f4472623c54a312d3ee543446f135436"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
