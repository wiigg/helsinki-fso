import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.payload;
    case "CLEAR_NOTIFICATION":
      return null;
    case "SET_ERROR":
      return action.payload;
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const useNotificationValue = () => {
  const [notification] = useContext(NotificationContext);
  return notification;
};

export const useNotificationDispatch = () => {
  const [, notificationDispatch] = useContext(NotificationContext);
  return notificationDispatch;
};

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  );

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
