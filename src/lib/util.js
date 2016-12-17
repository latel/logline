// 抛出Error错误，并在错误描述前统一添加'Logline: '
export function throwError(errMessage) {
    throw new Error('Logline: ' + errMessage);
}
