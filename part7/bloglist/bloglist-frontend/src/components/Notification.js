import { useNotificationValue } from "../contexts/NotificationContext.js";

const Notification = () => {
  const notification = useNotificationValue();

  if (!notification) {
    return null;
  }

  const message = notification.message;
  const colour = notification.colour;

  let bgColor;
  switch (colour) {
    case "success":
      bgColor = "bg-green-400";
      break;
    case "error":
      bgColor = "bg-red-400";
      break;
    case "info":
    default:
      bgColor = "bg-blue-400";
  }

  const style = `${bgColor} text-white text-lg rounded p-3 mb-4`;

  return <div className={message ? style : "hidden"}>{message}</div>;
};

export default Notification;
