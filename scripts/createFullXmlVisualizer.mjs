export default function createFullXmlVisualizer(mpdIr) {
  return constructDetailForElement(mpdIr);
}

function constructDetailForElement(ir) {
  const detailForAttributes =
    ir.attributes.length > 0 ? constructDetailForAttributes(ir) : "";
  const values = ir.text.filter((v) => v !== undefined && v.length > 0);
  const valuesList = values.length > 0 ? constructDetailForValues(values) : "";
  const elementsDetails = ir.elements
    .map((elt) => constructDetailForElement(elt))
    .join("\n");
  return `<details open>
    <summary>${ir.nodeName}</summary>
    ${valuesList}
    ${detailForAttributes}
    ${elementsDetails}
  </details>`;
}

function constructDetailForAttributes(ir) {
  return `<details open>
    <summary>Attributes</summary>
    ${constructAttributeList(ir)}
  </details>`;
}

function constructAttributeList(ir) {
  return (
    '<div class="attr-list">' +
    ir.attributes
      .map(
        (attr) =>
          `<div class="attr">
        <span class="attr-name">
          ${attr.name}
        </span>
        <span class="attr-val">
          ${attr.value}
        </span>
    </div>`
      )
      .join("\n") +
    "</div>"
  );
}

function constructDetailForValues(values) {
  return `<details open>
    <summary>Values</summary>
    <div class="values-list">
    ${constructValueList(values)}
    </div>
  </details>`;
}

function constructValueList(values) {
  return values
    .map(
      (text) =>
        `<div class="text">
      <span class="text-val">
        ${text}
      </span>
    </div>`
    )
    .join("\n");
}
