import { useState } from "react";

const Header = ({ text }) => <h1>{text}</h1>;

const Button = ({ text, handleClick }) => (
  <button onClick={handleClick}>{text}</button>
);

const Display = ({ text, value }) => (
  <div>
    {text} {value}
  </div>
);

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <Header text={"give feedback"} />
      <Button text={"good"} handleClick={() => setGood(good + 1)} />
      <Button text={"neutral"} handleClick={() => setNeutral(neutral + 1)} />
      <Button text={"bad"} handleClick={() => setBad(bad + 1)} />
      <Header text={"statistics"} />
      <Display text={"good"} value={good} />
      <Display text={"neutral"} value={neutral} />
      <Display text={"bad"} value={bad} />
    </div>
  );
};

export default App;
