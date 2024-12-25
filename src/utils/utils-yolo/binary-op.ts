import ndarray from 'ndarray';
import { Tensor } from 'onnxruntime-web';

import { NumberDataType, NumberOrBoolType } from './yoloPostprocess';
import { BroadcastUtil } from './yoloPostprocessUtils';

export function binaryOp(
    x: Tensor, y: Tensor, opLambda: (e1: number, e2: number) => number, resultType?: NumberOrBoolType): Tensor {

  const result = BroadcastUtil.calc(
      ndarray(x.data as NumberDataType, x.dims ? x.dims.slice(0) : [x.data.length]),
      ndarray(y.data as NumberDataType, y.dims ? y.dims.slice(0) : [y.data.length]), opLambda);

  if (!result) {
    throw new Error('not broadcastable');
  }

  const rType = resultType ? resultType : x.type;
  
  // Convert result.data to a plain number array if necessary
  let resultData: number[];

  // If result.data is not already a plain array, convert it to one
  if (Array.isArray(result.data)) {
    resultData = result.data;
  } else {
    // Convert to a plain array using Array.from() or similar method
    resultData = Array.from(result.data as ArrayLike<number>);
  }

  // Ensure the type matches NumberDataType (use type assertion if necessary)
  const outputData = rType === 'bool' ? Uint8Array.from(resultData) : resultData as unknown as NumberDataType;

  const output = new Tensor(rType, outputData, result.shape);
  return output;
}

