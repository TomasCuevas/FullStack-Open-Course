const Notification = ({ message, error = false }) => {
  if (message === null) return <></>;

  return <div className={error ? "error" : "success"}>{message}</div>;
};

export default Notification;
