import { useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";

const Toggleable = forwardRef(({ buttonLabel, children }, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return { toggleVisibility };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <button
          onClick={toggleVisibility}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          {buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button
          onClick={toggleVisibility}
          className="mt-2 rounded bg-gray-500 px-2 py-1 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300"
        >
          cancel
        </button>
      </div>
    </div>
  );
});

Toggleable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

Toggleable.displayName = "Togglable";

export default Toggleable;
