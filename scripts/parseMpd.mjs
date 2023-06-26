/**
 * To simplify parsing, we first construct an intermediate representation, which
 * is basically the xml as a JS object.
 *
 * This is done for simplicity reasons and ease of use, faster alternatives
 * exist but we don't care much about speed here.
 * @param {string} xml
 * @returns {Object}
 */
function constructXmlIr(xml) {
  const xmlDom = new DOMParser().parseFromString(xml, "application/xml");
  return parseElementIntoIr(xmlDom.documentElement);
}

/**
 * Construct a single XML Element's intermediate representation.
 * @param {Element} node
 * @returns {Object}
 */
function parseElementIntoIr(node) {
  const xmlIr = {
    nodeName: node.nodeName,
    attributes: [],
    elements: [],
    text: [],
  };
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];
    if (child.nodeType === Node.ELEMENT_NODE) {
      xmlIr.elements.push(parseElementIntoIr(child));
    } else if (child.nodeType === Node.TEXT_NODE) {
      if (child.textContent !== undefined && child.textContent !== null) {
        xmlIr.text.push(child.textContent.trim());
      }
    }
  }
  if (node.attributes !== undefined) {
    for (let i = 0; i < node.attributes.length; i++) {
      const attribute = node.attributes[i];
      xmlIr.attributes.push({
        name: attribute.name,
        value: attribute.value,
      });
    }
  }
  return xmlIr;
}

/**
 * @param {string} mpd
 */
export default function parseMpd(mpd) {
  return constructXmlIr(mpd);
}
