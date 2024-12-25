import _ from 'lodash';
import { imagenetClasses } from '../data/imagenet';

/**
 * Find top k imagenet classes
 */
export function imagenetClassesTopK(classProbabilities: any, k = 5) {
  const probs =
    _.isTypedArray(classProbabilities) ? Array.prototype.slice.call(classProbabilities) : classProbabilities;

  // Correctly type probIndex as [number, number] for each tuple in the array
  const sorted = _.reverse(
    _.sortBy(probs.map((prob: any, index: number): [number, number] => [prob, index]), (probIndex: [number, number]) => probIndex[0])
  );

  const topK = _.take(sorted, k).map((probIndex: [number, number]) => {
    const iClass = imagenetClasses[probIndex[1]];
    return {
      id: iClass[0],
      index: probIndex[1], // `index` is already a number, no need for parseInt
      name: iClass[1].replace(/_/g, ' '),
      probability: probIndex[0]
    };
  });
  return topK;
}

