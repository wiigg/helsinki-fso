import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.payload;
    case "HIDE_NOTIFICATION":
      return { message: null, colour: null };
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const useNotificationValue = () => {
  return useContext(NotificationContext)[0];
};

export const useNotificationDispatch = () => {
  return useContext(NotificationContext)[1];
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
