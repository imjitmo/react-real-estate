const Button = (props) => {
  return (
    <div>
      <button className=" bg-slate-700 text-white py-3 px-5 rounded-lg mt-4 hover:bg-gray-500 transition-all">
        {props.title}
      </button>
    </div>
  );
};

export default Button;
