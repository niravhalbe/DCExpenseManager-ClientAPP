import moment from "moment";

export function handleNullOrUndefined(val) {
    let result = false;
    if (val === null || val === undefined) {
        result = true;
    }
    return result ? "" : val;
}

export function getToastMessage(type) {
    var message = "";
    switch (type) {
        case "insert":
            message = "Record saved successfully !";
            break;
        case "update":
            message = "Record updated successfully !";
            break;
        case "delete":
            message = "Record deleted successfully !";
            break;
        default:
            break;
    }
    return message;
}


export function delay(ms) {
    const DEF_DELAY = 1000;
    return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}

export function formatDateAsMMDDYYYY(inputDate) {
    return moment(inputDate).format("MM/DD/YYYY");
}


export function isValidDate(date) {
    var timeStamp = Date.parse(date);
    return isNaN(timeStamp);
}