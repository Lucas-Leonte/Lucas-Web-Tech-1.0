EVENT_CLICK = "click";
EVENT_INPUT = "input";

let cartProducts;
let selectedProductId;

function ReportAndCheckFormValidity(form) {
    form.reportValidity();
    return form.checkValidity();
}

async function LoadSvg(name) {
    const response = await fetch(`./resources/${name}.svg`);
    return await response.text();
}

function FindClosestParentOfEventArgs(eventArgs, tagName) {
    let element = eventArgs.target || eventArgs.srcElement;
    if (element.tagName.toLowerCase() === tagName) {
        return element;
    }
    return element.closest(tagName);
}

function ElementIdToDbId(elementId) {
    let strings = elementId.split('-');
    return strings[strings.length - 1];
}

async function ExecutePostRequest(url, formData, onSuccess, onError) {    
    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        onSuccess(await response.json());
    } catch (error) {
        onError(error);
    }
}