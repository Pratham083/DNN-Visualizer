const Neuron = ({ activation, cx, cy }) => {
  const colour = `rgb(${activation * 255},${activation * 255},${
    activation * 255
  })`;
  return (
    <>
      <circle
        cx={`${cx}%`}
        cy={`${cy}%`}
        r="15"
        fill={colour}
        stroke="black"
        strokeWidth="3"
      />
    </>
  );
};
export default Neuron;
