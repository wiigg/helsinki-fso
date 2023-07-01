import { useNotificationValue } from "../contexts/NotificationContext.js";

const Notification = () => {
  const notification = useNotificationValue();

  if (!notification) {
    return null;
  }

  const message = notification.message;
  const colour = notification.colour;

  const showStyle = {
    color: "white",
    background: colour,
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const hideStyle = {
    display: "none",
  };

  const style = message ? showStyle : hideStyle;

  return <div style={style}>{message}</div>;
};

export default Notification;
