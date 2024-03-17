const Weight = ({ start, end, value }) => {
  const temp = 1;

  let transparency = value;
  let colour;
  if (value > 0) {
    transparency = Math.min(value, 0.9) + 0.1; // positive value ranges from 0.1, 1
    colour = `rgba(46, 204, 113, ${transparency})`;
  } else {
    transparency = -1 * (Math.max(value, -0.9) - 0.1); // negative value ranges from -0.1, 1
    colour = `rgba(192, 57, 43, ${transparency})`;
  }

  return (
    <line
      x1={`${start[0]}%`}
      y1={`${start[1]}%`}
      x2={`${end[0]}%`}
      y2={`${end[1]}%`}
      stroke={colour}
      strokeWidth="2"
    />
  );
};
export default Weight;
