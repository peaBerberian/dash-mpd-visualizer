import createFullXmlVisualizer from "./createFullXmlVisualizer.mjs";
import parseMpd from "./parseMpd.mjs";

const mpdDescElt = document.getElementsByClassName("mpd-description")[0];

// -- Feature switching based on the various API support --

if (window.File && window.FileReader && window.Uint8Array) {

  /**
   * @param {Event} evt
   * @returns {Boolean}
   */
  function onFileSelection(evt) {
    const files = evt.target.files; // FileList object

    if (!files.length) {
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const arr = evt.target.result;
      render(arr);
    };

    reader.readAsText(file);
    return false;
  }

  document.getElementById("file-input")
    .addEventListener("change", onFileSelection, false);

} else {
  const localSegmentInput = document.getElementById("choices-local-segment");
  localSegmentInput.style.display = "none";

  const choiceSeparator = document.getElementById("choices-separator");
  choiceSeparator.style.display = "none";
}

if (window.fetch && window.Uint8Array) {

  /**
   * @param {Event} evt
   */
  function onUrlValidation(url) {
    fetch(url)
      .then(response => response.text())
      .then((text) => {
        render(text);
      });
  }

  /**
   * @returns {Boolean}
   */
  function onButtonClicking() {
    const url = document.getElementById("url-input").value;
    if (url) {
      onUrlValidation(url);
      return false;
    }
  }

  /**
   * @param {Event} evt
   * @returns {Boolean}
   */
  function onInputKeyPress(evt) {
    const keyCode = evt.keyCode || evt.which;
    if (keyCode === 13) {
      const url = evt.target.value;
      if (url) {
        onUrlValidation(url);
      }
      return false;
    }
  }

  document.getElementById("url-input")
    .addEventListener("keypress", onInputKeyPress, false);

  document.getElementById("url-button")
    .addEventListener("click", onButtonClicking, false);
} else {
  const choiceSeparator = document.getElementById("choices-separator");
  choiceSeparator.style.display = "none";

  const urlSegmentInput = document.getElementById("choices-url-segment");
  urlSegmentInput.style.display = "none";
}

/**
 * @param {string} mpd
 */
function render(mpd) {
  try {
    const xmlIr = parseMpd(mpd);
    if (xmlIr.nodeName !== "MPD") {
      throw new Error(
        "No MPD element at the top. Are you sure this is an MPD?"
      );
    }
    if (mpdDescElt === undefined) {
      throw new Error("Missing DOM Node");
    }
    mpdDescElt.innerHTML = createFullXmlVisualizer(xmlIr);
    if (xmlIr.elements.length === 0) {
      throw new Error("The MPD element at the top has no inner elements.");
    }
  } catch (e) {
    // TODO
  }
}
