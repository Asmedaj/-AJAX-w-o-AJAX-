const CallbackRegistry = {};
(function() {
  //--------------------------------------------------------
  const btnLoad = document.getElementById('btn-load');
  btnLoad.addEventListener('click', loadDataFromServer);
  
  function loadDataFromServer() {
    let dataId = parseInt(document.getElementById('data-id').value);      
    if (isNaN(dataId)) {
      alert('Input number, please!')
    } else {
      getByFetch(dataId, drowData, onError);
    }
  }
  function drowData(data) {
    const el = document.createElement('span');
    el.innerHTML = data;
    const container = document.querySelector('div.data-container');
    container.appendChild(el);  
  } 
  function onError(method, id) {
    switch (method) {
      case 'fetch': 
        getByJSONP(id)
        break;
      case 'JSONP': 
        getBySSEvents(id)
        break;
      case 'SSE': 
        getByIframe(id)
        break;
      case 'IFRAME': 
      default:
      drowData('No data');
    }  
  }
//------------------------------------------------------------------------------
function getByFetch(id, onSuccess, onError) {
  fetch('load.php?meth=fetch&id=' + id, {
    method: 'get',
  }).then(function(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    }
    onError('fetch', id);
    throw new Error(response.statusText);
  })
  .then(function(response) {
    onSuccess(response);
  })
}
//-----------------------------------------------------------------------------
function getByJSONP(id) {

  function scriptRequest(url, onSuccess, onError) {
    let scriptOk = false; 
    let callbackName = 'cb' + String(Math.random()).slice(-6);
    url += ~url.indexOf('?') ? '&' : '?';
    url += 'callback=CallbackRegistry.' + callbackName;

    CallbackRegistry[callbackName] = function(data) {
      scriptOk = true; 
      delete CallbackRegistry[callbackName]; 
      onSuccess(data);; 
    };

    function checkCallback() {
      if (scriptOk) return; 
      delete CallbackRegistry[callbackName];
      onError('JSONP', id); 
    }

    let script = document.createElement('script');

    script.onreadystatechange = function() {
      if (this.readyState == 'complete' || this.readyState == 'loaded') {
        this.onreadystatechange = null;
        setTimeout(checkCallback, 0);
      }
    }

    script.onload = script.onerror = checkCallback;
    script.src = url;
    document.body.appendChild(script);
  }

  scriptRequest("load.php?meth=JSONP&id=" + id, drowData, onError); 
}
//---------------------------------------------------------
function getByIframe(id) {

  function createIframe(name, src, debug) {
    src = src || 'javascript:false'; 
    let tmpElem = document.createElement('div');
    tmpElem.innerHTML = '<iframe name="' + name + '" id="' + name + '" src="' + src + '">';
    var iframe = tmpElem.firstChild;
    if (!debug) {
      iframe.style.display = 'none';
    }
    document.body.appendChild(iframe);
    return iframe;
  }

  function iframeGet(url, onSuccess, onError) {
    let iframeOk = false; 
    const iframeName = Math.random(); 
    const iframe = createIframe(iframeName, url);
    CallbackRegistry[iframeName] = function(data) {
      iframeOk = true; 
      onSuccess(data);
    }
    iframe.onload = function() {
      iframe.parentNode.removeChild(iframe); 
      delete CallbackRegistry[iframeName];
      if (!iframeOk) onError('iframe', id); 
    }
  }

  iframeGet("load.php?meth=IFRAME&id=" + id, drowData, onError);
}

//-------------------------------------------------------------

function getBySSEvents(id) {

  function sSEventsGet(url, onSuccess, onError) {
    let sse = new EventSource(url); 
    sse.addEventListener("message", function(e) { 
      onSuccess(e.data);
      sse.close();
    }, false);
    sse.addEventListener("error", function(e) { 
      onError('SSE',id);
    }, false);
  }
  sSEventsGet("load.php?meth=SSE&id=" + id, drowData, onError);
}

//-------------------------------------------------------------
})();

