// Borrowed from https://stackoverflow.com/a/62142995

export function register(functionsObject, thisClass) {
  for (let [functionKey, functionValue] of Object.entries(functionsObject)) {
    thisClass[functionKey] = functionValue.bind(thisClass);
  }
}
