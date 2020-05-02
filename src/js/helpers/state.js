/* istanbul ignore file */
import { useState } from 'haunted';

export function setStateItem(key, defaultValue, context) {
  const [value, setFunction] = useState(defaultValue);
  context[key] = value;
  const functionName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
  context[functionName] = setFunction;
}
