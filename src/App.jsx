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

function App() {
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>
        <Route exact path='/santee' element={<Santee />} />
        <Route exact path='/sample/index-1' element={<HomePageOne />} />
        <Route exact path='/sample/index-2' element={<HomePageTwo />} />
        <Route exact path='/sample/index-3' element={<HomePageThree />} />
        <Route exact path='/sample/index-4' element={<HomePageFour />} />
        <Route exact path='/sample/index-5' element={<HomePageFive />} />
        <Route exact path='/sample/index-6' element={<HomePageSix />} />
        <Route exact path='/sample/index-7' element={<HomePageSeven />} />
        <Route exact path='/sample/index-8' element={<HomePageEight />} />
        <Route exact path='/sample/index-9' element={<HomePageNine />} />
        <Route exact path='/sample/index-10' element={<HomePageTen />} />
        <Route exact path='/sample/index-11' element={<HomePageEleven />} />

        {/* SL */}
        <Route exact path='/sample/add-user' element={<AddUserPage />} />
        <Route exact path='/sample/alert' element={<AlertPage />} />
        <Route exact path='/sample/assign-role' element={<AssignRolePage />} />
        <Route exact path='/sample/avatar' element={<AvatarPage />} />
        <Route exact path='/sample/badges' element={<BadgesPage />} />
        <Route exact path='/sample/button' element={<ButtonPage />} />
        <Route exact path='/sample/calendar-main' element={<CalendarMainPage />} />
        <Route exact path='/sample/calendar' element={<CalendarMainPage />} />
        <Route exact path='/sample/card' element={<CardPage />} />
        <Route exact path='/sample/carousel' element={<CarouselPage />} />

        <Route exact path='/sample/chat-message' element={<ChatMessagePage />} />
        <Route exact path='/sample/chat-profile' element={<ChatProfilePage />} />
        <Route exact path='/sample/code-generator' element={<CodeGeneratorPage />} />
        <Route
          exact
          path='/sample/code-generator-new'
          element={<CodeGeneratorNewPage />}
        />
        <Route exact path='/sample/colors' element={<ColorsPage />} />
        <Route exact path='/sample/column-chart' element={<ColumnChartPage />} />
        <Route exact path='/sample/company' element={<CompanyPage />} />
        <Route exact path='/sample/currencies' element={<CurrenciesPage />} />
        <Route exact path='/sample/dropdown' element={<DropdownPage />} />
        <Route exact path='/sample/email' element={<EmailPage />} />
        <Route exact path='/sample/faq' element={<FaqPage />} />
        <Route exact path='/sample/forgot-password' element={<ForgotPasswordPage />} />
        <Route exact path='/sample/form-layout' element={<FormLayoutPage />} />
        <Route exact path='/sample/form-validation' element={<FormValidationPage />} />
        <Route exact path='/sample/form' element={<FormPage />} />

        <Route exact path='/sample/gallery' element={<GalleryPage />} />
        <Route exact path='/sample/gallery-grid' element={<GalleryGridPage />} />
        <Route exact path='/sample/gallery-masonry' element={<GalleryMasonryPage />} />
        <Route exact path='/sample/gallery-hover' element={<GalleryHoverPage />} />

        <Route exact path='/sample/blog' element={<BlogPage />} />
        <Route exact path='/sample/blog-details' element={<BlogDetailsPage />} />
        <Route exact path='/sample/add-blog' element={<AddBlogPage />} />

        <Route exact path='/sample/testimonials' element={<TestimonialsPage />} />
        <Route exact path='/sample/coming-soon' element={<ComingSoonPage />} />
        <Route exact path='/sample/access-denied' element={<AccessDeniedPage />} />
        <Route exact path='/sample/maintenance' element={<MaintenancePage />} />
        <Route exact path='/sample/blank-page' element={<BlankPagePage />} />

        <Route exact path='/sample/image-generator' element={<ImageGeneratorPage />} />
        <Route exact path='/sample/image-upload' element={<ImageUploadPage />} />
        <Route exact path='/sample/invoice-add' element={<InvoiceAddPage />} />
        <Route exact path='/sample/invoice-edit' element={<InvoiceEditPage />} />
        <Route exact path='/sample/invoice-list' element={<InvoiceListPage />} />
        <Route exact path='/sample/invoice-preview' element={<InvoicePreviewPage />} />
        <Route exact path='/sample/kanban' element={<KanbanPage />} />
        <Route exact path='/sample/language' element={<LanguagePage />} />
        <Route exact path='/sample/line-chart' element={<LineChartPage />} />
        <Route exact path='/sample/list' element={<ListPage />} />
        <Route
          exact
          path='/sample/marketplace-details'
          element={<MarketplaceDetailsPage />}
        />
        <Route exact path='/sample/marketplace' element={<MarketplacePage />} />
        <Route
          exact
          path='/sample/notification-alert'
          element={<NotificationAlertPage />}
        />
        <Route exact path='/sample/notification' element={<NotificationPage />} />
        <Route exact path='/sample/pagination' element={<PaginationPage />} />
        <Route exact path='/sample/payment-gateway' element={<PaymentGatewayPage />} />
        <Route exact path='/sample/pie-chart' element={<PieChartPage />} />
        <Route exact path='/sample/portfolio' element={<PortfolioPage />} />
        <Route exact path='/sample/pricing' element={<PricingPage />} />
        <Route exact path='/sample/progress' element={<ProgressPage />} />
        <Route exact path='/sample/radio' element={<RadioPage />} />
        <Route exact path='/sample/role-access' element={<RoleAccessPage />} />
        <Route exact path='/sample/sign-in' element={<SignInPage />} />
        <Route exact path='/sample/sign-up' element={<SignUpPage />} />
        <Route exact path='/sample/star-rating' element={<StarRatingPage />} />
        <Route exact path='/sample/starred' element={<StarredPage />} />
        <Route exact path='/sample/switch' element={<SwitchPage />} />
        <Route exact path='/sample/table-basic' element={<TableBasicPage />} />
        <Route exact path='/sample/table-data' element={<TableDataPage />} />
        <Route exact path='/sample/tabs' element={<TabsPage />} />
        <Route exact path='/sample/tags' element={<TagsPage />} />
        <Route exact path='/sample/terms-condition' element={<TermsConditionPage />} />
        <Route
          exact
          path='/sample/text-generator-new'
          element={<TextGeneratorNewPage />}
        />
        <Route exact path='/sample/text-generator' element={<TextGeneratorPage />} />
        <Route exact path='/sample/theme' element={<ThemePage />} />
        <Route exact path='/sample/tooltip' element={<TooltipPage />} />
        <Route exact path='/sample/typography' element={<TypographyPage />} />
        <Route exact path='/sample/users-grid' element={<UsersGridPage />} />
        <Route exact path='/sample/users-list' element={<UsersListPage />} />
        <Route exact path='/sample/view-details' element={<ViewDetailsPage />} />
        <Route exact path='/sample/video-generator' element={<VideoGeneratorPage />} />
        <Route exact path='/sample/videos' element={<VideosPage />} />
        <Route exact path='/sample/view-profile' element={<ViewProfilePage />} />
        <Route exact path='/sample/voice-generator' element={<VoiceGeneratorPage />} />
        <Route exact path='/sample/wallet' element={<WalletPage />} />
        <Route exact path='/sample/widgets' element={<WidgetsPage />} />
        <Route exact path='/sample/wizard' element={<WizardPage />} />

        <Route exact path='*' element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
