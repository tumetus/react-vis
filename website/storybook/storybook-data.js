const data = {};
const DEC23 = 1513987200000;
const DAY_IN_MS = 86400000;
export function generateLinearData({
  nbPoints = 20,
  startValue = 10,
  changeRatio = 0.1,
  extraParams = [],
  flipXY,
  key
}) {
  if (data[key]) {
    return flipXY ? xyFlip(data[key]) : data[key];
  }
  const result = new Array(nbPoints).fill(0).reduce(
    (prev, curr, i) => [
      ...prev,
      enrich({
        extraParams,
        datapoint: {
          x: i + 1,
          y: prev[i].y * (1 + (Math.random() - 0.5) * changeRatio)
        },
        nbPoints,
        i
      })
    ],
    [enrich({extraParams, datapoint: {x: 0, y: startValue}, nbPoints, i: 0})]
  );
  if (key !== undefined) {
    data[key] = result;
  }
  return flipXY ? xyFlip(result) : result;
}

export function generateScatterplotData(args) {
  const extraParams = [['x', random({max: 20})], ['y', random({max: 20})]].concat(args.extraParams || []);
  return generateLinearData({...args, extraParams});
}

export function xyFlip(arr) {
  return arr.map(d => ({
    ...d,
    x: d.y,
    y: d.x
  }));
}

export function enrich({datapoint, extraParams, nbPoints, i}) {
  return extraParams.reduce((result, param) => {
    result[param[0]] = param[1]({...datapoint, nbPoints, i});
    return result;
  }, datapoint);
}

export function random({max = 1, min = 0}) {
  return () => min + Math.random() * (max - min);
}

export function intRandom({max = 10, min = 0}) {
  return () => Math.floor(min + Math.random() * (max - min));
}

export function getTime({startTime = DEC23}) {
  return ({i}) => startTime + i * DAY_IN_MS;
}

export function getWord() {
  return ({i}) => [
    'deck.gl',
    'math.gl',
    'probe.gl',
    'vis.gl',
    'react-map-gl',
    'vis-academy',
    'luma.gl',
    'kepler.gl'
  ][i];
}
