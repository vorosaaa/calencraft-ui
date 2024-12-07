import { Route, Routes } from "react-router-dom";
import ScrollToTop from "../components/scrollToTop/ScrollToTop";
import { Home } from "../pages/home/Home";
import { ProfileEditor } from "../pages/editor/ProfileEditor";
import { BookingDetails } from "../pages/bookingdetails/BookingDetails";
import { ProfilePage } from "../pages/profile/ProfilePage";
import { SearchPage } from "../pages/search/SearchPage";
import { MyPlansPage } from "../pages/myplan/MyPlansPage";
import { TermsOfServicePage } from "../pages/termsofservice/TermsOfServicePage";
import { PrivacyPolicyPage } from "../pages/privacypolicy/PrivacyPolicyPage";
import { AboutUsPage } from "../pages/aboutus/AboutPage";
import { Calendar } from "../pages/calendar/Calendar";
import { ContactPage } from "../pages/contact/ContactPage";
import { NewBookingPage } from "../pages/admin/booking/NewBookingPage";
import { Login } from "../pages/login/Login";
import { RegistrationForm } from "../pages/registration/Registration";
import { Verification } from "../pages/verification/Verification";

export const BookyRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        {/*<Route path="/search" element={<SearchPage />} />*/}
        <Route path="/admin/booking" element={<NewBookingPage />} />
        <Route path="/profile/:identifier" element={<ProfilePage />} />
        <Route path="/myprofile" element={<ProfileEditor />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/myplan" element={<MyPlansPage />} />
        <Route path="/termsofservice" element={<TermsOfServicePage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/booking/:id" element={<BookingDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/verification" element={<Verification />} />
      </Routes>
    </>
  );
};
