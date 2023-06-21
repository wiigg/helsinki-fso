import { useNotificationValue } from "../NotificationContext";

const Notification = () => {
  const message = useNotificationValue();

  const showStyle = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  const hideStyle = {
    display: "none",
  };

  if (!message) {
    return <div style={hideStyle}></div>;
  }

  return <div style={showStyle}>{message}</div>;
};

export default Notification;
