type Result = {
    code: number;
    message: string;
};

type ErrorHandler = (result: Result) => string;

const errorCodeMap: { [code: number]: ErrorHandler } = {
    1: (result) => `${result.message}`,
    2: (result) => `${result.message}`,
    3: (result) => `${result.message}`,
    4: (result) => `${result.message}`,
    5: (result) => `${result.message}`,
    6: (result) => `${result.message}`,
    7: (result) => `${result.message}`,
    8: (result) => `${result.message}`,
    9: (result) => `${result.message}`,
    10: (result) => `${result.message}`,
    11: (result) => `${result.message}`,
    13: (result) => `${result.message}`,
    14: (result) => `${result.message}`,
    15: (result) => `${result.message}`,
    16: (result) => `${result.message}`,
    17: (result) => `${result.message}`,
    18: (result) => `${result.message}`,
    19: (result) => `${result.message}`,
};

export function handleResult(result: Result) {
    const errorHandler: ErrorHandler =
        errorCodeMap[result.code] || ((result) => {
            alert(`${result.code}`);
        });
    const errorMessage = errorHandler(result);
    alert(errorMessage);
}