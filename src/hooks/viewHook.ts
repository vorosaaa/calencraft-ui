import { atom, useRecoilState } from "recoil";

const bookingViewState = atom({
  key: "bookingViewState",
  default: "calendar",
});

export const useBookingView = () => {
  const [view, setView] = useRecoilState(bookingViewState);

  const setBookingView = (value: "calendar" | "dataGrid") => {
    setView(value);
  };

  return {
    bookingView: view,
    setBookingView,
  };
};

const sessionViewState = atom({
  key: "sessionViewState",
  default: "calendar",
});

export const useSessionView = () => {
  const [view, setView] = useRecoilState(sessionViewState);

  const setSessionView = (value: "calendar" | "dataGrid") => {
    setView(value);
  };

  return {
    sessionView: view,
    setSessionView,
  };
};
