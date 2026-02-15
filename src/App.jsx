import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePageOne from "./pages/sample/HomePageOne";
import HomePageTwo from "./pages/sample/HomePageTwo";
import HomePageThree from "./pages/sample/HomePageThree";
import HomePageFour from "./pages/sample/HomePageFour";
import HomePageFive from "./pages/sample/HomePageFive";
import HomePageSix from "./pages/sample/HomePageSix";
import HomePageSeven from "./pages/sample/HomePageSeven";
import EmailPage from "./pages/sample/EmailPage";
import AddUserPage from "./pages/sample/AddUserPage";
import AlertPage from "./pages/sample/AlertPage";
import AssignRolePage from "./pages/sample/AssignRolePage";
import AvatarPage from "./pages/sample/AvatarPage";
import BadgesPage from "./pages/sample/BadgesPage";
import ButtonPage from "./pages/sample/ButtonPage";
import CalendarMainPage from "./pages/sample/CalendarMainPage";
import CardPage from "./pages/sample/CardPage";
import CarouselPage from "./pages/sample/CarouselPage";
import ChatMessagePage from "./pages/sample/ChatMessagePage";
import ChatProfilePage from "./pages/sample/ChatProfilePage";
import CodeGeneratorNewPage from "./pages/sample/CodeGeneratorNewPage";
import CodeGeneratorPage from "./pages/sample/CodeGeneratorPage";
import ColorsPage from "./pages/sample/ColorsPage";
import ColumnChartPage from "./pages/sample/ColumnChartPage";
import CompanyPage from "./pages/sample/CompanyPage";
import CurrenciesPage from "./pages/sample/CurrenciesPage";
import DropdownPage from "./pages/sample/DropdownPage";
import ErrorPage from "./pages/sample/ErrorPage";
import FaqPage from "./pages/sample/FaqPage";
import ForgotPasswordPage from "./pages/sample/ForgotPasswordPage";
import FormLayoutPage from "./pages/sample/FormLayoutPage";
import FormValidationPage from "./pages/sample/FormValidationPage";
import FormPage from "./pages/sample/FormPage";
import GalleryPage from "./pages/sample/GalleryPage";
import ImageGeneratorPage from "./pages/sample/ImageGeneratorPage";
import ImageUploadPage from "./pages/sample/ImageUploadPage";
import InvoiceAddPage from "./pages/sample/InvoiceAddPage";
import InvoiceEditPage from "./pages/sample/InvoiceEditPage";
import InvoiceListPage from "./pages/sample/InvoiceListPage";
import InvoicePreviewPage from "./pages/sample/InvoicePreviewPage";
import KanbanPage from "./pages/sample/KanbanPage";
import LanguagePage from "./pages/sample/LanguagePage";
import LineChartPage from "./pages/sample/LineChartPage";
import ListPage from "./pages/sample/ListPage";
import MarketplaceDetailsPage from "./pages/sample/MarketplaceDetailsPage";
import MarketplacePage from "./pages/sample/MarketplacePage";
import NotificationAlertPage from "./pages/sample/NotificationAlertPage";
import NotificationPage from "./pages/sample/NotificationPage";
import PaginationPage from "./pages/sample/PaginationPage";
import PaymentGatewayPage from "./pages/sample/PaymentGatewayPage";
import PieChartPage from "./pages/sample/PieChartPage";
import PortfolioPage from "./pages/sample/PortfolioPage";
import PricingPage from "./pages/sample/PricingPage";
import ProgressPage from "./pages/sample/ProgressPage";
import RadioPage from "./pages/sample/RadioPage";
import RoleAccessPage from "./pages/sample/RoleAccessPage";
import SignInPage from "./pages/sample/SignInPage";
import SignUpPage from "./pages/sample/SignUpPage";
import StarRatingPage from "./pages/sample/StarRatingPage";
import StarredPage from "./pages/sample/StarredPage";
import SwitchPage from "./pages/sample/SwitchPage";
import TableBasicPage from "./pages/sample/TableBasicPage";
import TableDataPage from "./pages/sample/TableDataPage";
import TabsPage from "./pages/sample/TabsPage";
import TagsPage from "./pages/sample/TagsPage";
import TermsConditionPage from "./pages/sample/TermsConditionPage";
import TextGeneratorPage from "./pages/sample/TextGeneratorPage";
import ThemePage from "./pages/sample/ThemePage";
import TooltipPage from "./pages/sample/TooltipPage";
import TypographyPage from "./pages/sample/TypographyPage";
import UsersGridPage from "./pages/sample/UsersGridPage";
import UsersListPage from "./pages/sample/UsersListPage";
import ViewDetailsPage from "./pages/sample/ViewDetailsPage";
import VideoGeneratorPage from "./pages/sample/VideoGeneratorPage";
import VideosPage from "./pages/sample/VideosPage";
import ViewProfilePage from "./pages/sample/ViewProfilePage";
import VoiceGeneratorPage from "./pages/sample/VoiceGeneratorPage";
import WalletPage from "./pages/sample/WalletPage";
import WidgetsPage from "./pages/sample/WidgetsPage";
import WizardPage from "./pages/sample/WizardPage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import TextGeneratorNewPage from "./pages/sample/TextGeneratorNewPage";
import HomePageEight from "./pages/sample/HomePageEight";
import HomePageNine from "./pages/sample/HomePageNine";
import HomePageTen from "./pages/sample/HomePageTen";
import HomePageEleven from "./pages/sample/HomePageEleven";
import GalleryGridPage from "./pages/sample/GalleryGridPage";
import GalleryMasonryPage from "./pages/sample/GalleryMasonryPage";
import GalleryHoverPage from "./pages/sample/GalleryHoverPage";
import BlogPage from "./pages/sample/BlogPage";
import BlogDetailsPage from "./pages/sample/BlogDetailsPage";
import AddBlogPage from "./pages/sample/AddBlogPage";
import TestimonialsPage from "./pages/sample/TestimonialsPage";
import ComingSoonPage from "./pages/sample/ComingSoonPage";
import AccessDeniedPage from "./pages/sample/AccessDeniedPage";
import MaintenancePage from "./pages/sample/MaintenancePage";
import BlankPagePage from "./pages/sample/BlankPagePage";
import Santee from "./pages/Santee";
import DailyDietPage from "./pages/DailyDietPage";
import DailySportSleepPage from "./pages/DailySportSleepPage";
import WeeklyBilansPage from "./pages/WeeklyBilansPage";
import BodyMeasurementsPage from "./pages/BodyMeasurementsPage";

function App() {
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>
        <Route exact path='/' element={<Santee />} />
        <Route exact path='/daily-diet' element={<DailyDietPage />} />
        <Route exact path='/daily-sport-sleep' element={<DailySportSleepPage />} />
        <Route exact path='/weekly-bilans' element={<WeeklyBilansPage />} />
        <Route exact path='/body-measurements-page' element={<BodyMeasurementsPage />} />
        <Route exact path='/index-1' element={<HomePageOne />} />
        <Route exact path='/index-2' element={<HomePageTwo />} />
        <Route exact path='/index-3' element={<HomePageThree />} />
        <Route exact path='/index-4' element={<HomePageFour />} />
        <Route exact path='/index-5' element={<HomePageFive />} />
        <Route exact path='/index-6' element={<HomePageSix />} />
        <Route exact path='/index-7' element={<HomePageSeven />} />
        <Route exact path='/index-8' element={<HomePageEight />} />
        <Route exact path='/index-9' element={<HomePageNine />} />
        <Route exact path='/index-10' element={<HomePageTen />} />
        <Route exact path='/index-11' element={<HomePageEleven />} />

        {/* SL */}
        <Route exact path='/add-user' element={<AddUserPage />} />
        <Route exact path='/alert' element={<AlertPage />} />
        <Route exact path='/assign-role' element={<AssignRolePage />} />
        <Route exact path='/avatar' element={<AvatarPage />} />
        <Route exact path='/badges' element={<BadgesPage />} />
        <Route exact path='/button' element={<ButtonPage />} />
        <Route exact path='/calendar-main' element={<CalendarMainPage />} />
        <Route exact path='/calendar' element={<CalendarMainPage />} />
        <Route exact path='/card' element={<CardPage />} />
        <Route exact path='/carousel' element={<CarouselPage />} />

        <Route exact path='/chat-message' element={<ChatMessagePage />} />
        <Route exact path='/chat-profile' element={<ChatProfilePage />} />
        <Route exact path='/code-generator' element={<CodeGeneratorPage />} />
        <Route
          exact
          path='/code-generator-new'
          element={<CodeGeneratorNewPage />}
        />
        <Route exact path='/colors' element={<ColorsPage />} />
        <Route exact path='/column-chart' element={<ColumnChartPage />} />
        <Route exact path='/company' element={<CompanyPage />} />
        <Route exact path='/currencies' element={<CurrenciesPage />} />
        <Route exact path='/dropdown' element={<DropdownPage />} />
        <Route exact path='/email' element={<EmailPage />} />
        <Route exact path='/faq' element={<FaqPage />} />
        <Route exact path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route exact path='/form-layout' element={<FormLayoutPage />} />
        <Route exact path='/form-validation' element={<FormValidationPage />} />
        <Route exact path='/form' element={<FormPage />} />

        <Route exact path='/gallery' element={<GalleryPage />} />
        <Route exact path='/gallery-grid' element={<GalleryGridPage />} />
        <Route exact path='/gallery-masonry' element={<GalleryMasonryPage />} />
        <Route exact path='/gallery-hover' element={<GalleryHoverPage />} />

        <Route exact path='/blog' element={<BlogPage />} />
        <Route exact path='/blog-details' element={<BlogDetailsPage />} />
        <Route exact path='/add-blog' element={<AddBlogPage />} />

        <Route exact path='/testimonials' element={<TestimonialsPage />} />
        <Route exact path='/coming-soon' element={<ComingSoonPage />} />
        <Route exact path='/access-denied' element={<AccessDeniedPage />} />
        <Route exact path='/maintenance' element={<MaintenancePage />} />
        <Route exact path='/blank-page' element={<BlankPagePage />} />

        <Route exact path='/image-generator' element={<ImageGeneratorPage />} />
        <Route exact path='/image-upload' element={<ImageUploadPage />} />
        <Route exact path='/invoice-add' element={<InvoiceAddPage />} />
        <Route exact path='/invoice-edit' element={<InvoiceEditPage />} />
        <Route exact path='/invoice-list' element={<InvoiceListPage />} />
        <Route exact path='/invoice-preview' element={<InvoicePreviewPage />} />
        <Route exact path='/kanban' element={<KanbanPage />} />
        <Route exact path='/language' element={<LanguagePage />} />
        <Route exact path='/line-chart' element={<LineChartPage />} />
        <Route exact path='/list' element={<ListPage />} />
        <Route
          exact
          path='/marketplace-details'
          element={<MarketplaceDetailsPage />}
        />
        <Route exact path='/marketplace' element={<MarketplacePage />} />
        <Route
          exact
          path='/notification-alert'
          element={<NotificationAlertPage />}
        />
        <Route exact path='/notification' element={<NotificationPage />} />
        <Route exact path='/pagination' element={<PaginationPage />} />
        <Route exact path='/payment-gateway' element={<PaymentGatewayPage />} />
        <Route exact path='/pie-chart' element={<PieChartPage />} />
        <Route exact path='/portfolio' element={<PortfolioPage />} />
        <Route exact path='/pricing' element={<PricingPage />} />
        <Route exact path='/progress' element={<ProgressPage />} />
        <Route exact path='/radio' element={<RadioPage />} />
        <Route exact path='/role-access' element={<RoleAccessPage />} />
        <Route exact path='/sign-in' element={<SignInPage />} />
        <Route exact path='/sign-up' element={<SignUpPage />} />
        <Route exact path='/star-rating' element={<StarRatingPage />} />
        <Route exact path='/starred' element={<StarredPage />} />
        <Route exact path='/switch' element={<SwitchPage />} />
        <Route exact path='/table-basic' element={<TableBasicPage />} />
        <Route exact path='/table-data' element={<TableDataPage />} />
        <Route exact path='/tabs' element={<TabsPage />} />
        <Route exact path='/tags' element={<TagsPage />} />
        <Route exact path='/terms-condition' element={<TermsConditionPage />} />
        <Route
          exact
          path='/text-generator-new'
          element={<TextGeneratorNewPage />}
        />
        <Route exact path='/text-generator' element={<TextGeneratorPage />} />
        <Route exact path='/theme' element={<ThemePage />} />
        <Route exact path='/tooltip' element={<TooltipPage />} />
        <Route exact path='/typography' element={<TypographyPage />} />
        <Route exact path='/users-grid' element={<UsersGridPage />} />
        <Route exact path='/users-list' element={<UsersListPage />} />
        <Route exact path='/view-details' element={<ViewDetailsPage />} />
        <Route exact path='/video-generator' element={<VideoGeneratorPage />} />
        <Route exact path='/videos' element={<VideosPage />} />
        <Route exact path='/view-profile' element={<ViewProfilePage />} />
        <Route exact path='/voice-generator' element={<VoiceGeneratorPage />} />
        <Route exact path='/wallet' element={<WalletPage />} />
        <Route exact path='/widgets' element={<WidgetsPage />} />
        <Route exact path='/wizard' element={<WizardPage />} />

        <Route exact path='*' element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
