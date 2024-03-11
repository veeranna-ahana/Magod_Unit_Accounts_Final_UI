import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WithNav from "./Layout/WithNav";
import Parentroute from "./Layout/Parentroute";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home";

// import MaterialSetUp from "./pages/MaterialSetUp/MaterialSetUp";
import UnitDetails from "./pages/Unit_Accounts/Setup/Unit_List/UnitDetails";
// import Sync from "./pages/Unit_Accounts/Sync/Sync/SyncImportExport/Sync";
import Sync from "./pages/Unit_Accounts/Sync/SyncImportExport/Sync";
import DailyReportCall from "./pages/Unit_Accounts/Unit/Daily/DailyReportCall";
// import Reports from "./pages/Unit_Accounts/Unit/Payment_Receipt/Create New/Reports/Reports";
import CustomerRVList from "./pages/Unit_Accounts/Unit/Payment_Receipt/CustomerRvList/CustomerRVList";
import DraftRVList from "./pages/Unit_Accounts/Unit/Payment_Receipt/DraftRvList/DraftRVList";
import OnAccountCall from "./pages/Unit_Accounts/Unit/Payment_Receipt/OnAccountList/OnAccountCall";
import MonthlyReport from "./pages/Unit_Accounts/Unit/MonthlyReport/MonthlyReport";
import VendorList from "./pages/Unit_Accounts/Unit/Purchase_Invoice/VenderList/VendorList";
import PurchaseInvoiceList from "./pages/Unit_Accounts/Unit/Purchase_Invoice/PurchaseInvoices/PurchaseInvoiceList";
import BillingAddressCall from "./pages/Unit_Accounts/Invoices/Daily/BillingAddressCall";
import SyncCall from "./pages/Unit_Accounts/Sync/SyncCall";
import TaxMasterCall from "./pages/Unit_Accounts/Setup/Taxes/TaxMasterCall";
import HoUnitInvoices from "./pages/Unit_Accounts/Unit/HoUnitInvoices/HoUnitInvoices";
import Open from "./pages/Unit_Accounts/Unit/Payment_Receipt/RVOpen/Open/Open";
import Closed from "./pages/Unit_Accounts/Unit/Payment_Receipt/RVOpen/Closed/Closed";
import All from "./pages/Unit_Accounts/Unit/Payment_Receipt/RVOpen/All/All";

import { ToastContainer } from "react-toastify";
import CustomerMonthlyReport from "./pages/Unit_Accounts/Invoices/MonthlyReport/CustomerMonthlyReport";
import AccountSyncXMLFile from "./pages/Unit_Accounts/Sync/SyncFile/AccountSyncXMLFile";
import FromHOUpdate from "./pages/Unit_Accounts/Sync/SyncFile/FromHOUpdate";
import FromHoSync from "./pages/Unit_Accounts/Sync/SyncFile/FromHoSync";

import Create_New from "./pages/Unit_Accounts/Unit/Payment_Receipt/Create New/Reports/components/Create_New";
import InvoicesListjs from "./pages/Unit_Accounts/Invoices/CancelledVrList/InvoicesList";
import InvoicesList from "./pages/Unit_Accounts/Invoices/CancelledVrList/InvoicesList";
import SendMail from "./pages/sendmail/sendmails";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-center" />
      <Routes>
        <Route element={<Login />} path="/" />
        <Route path="/home" element={<Home />} />

        <Route element={<WithNav />}>
          <Route path="/UnitAccounts" element={<Parentroute />}>
            <Route path="Setup">
              <Route path="Unitlist" element={<UnitDetails />} />
              <Route path="Taxmaster" element={<TaxMasterCall />} />
            </Route>

            <Route path="Unit">
              <Route path="Daily" element={<DailyReportCall />} />
              {/* <Route path="CreateNew" element={<Reports />} /> */}
              <Route path="PaymentReceiptVoucher" element={<Create_New />} />

              <Route path="DraftRv" element={<DraftRVList />} />
              <Route path="CustomerRv" element={<CustomerRVList />} />
              <Route path="OnAccountList" element={<OnAccountCall />} />
              <Route path="MonthlyReport" element={<MonthlyReport />} />
              <Route path="VendorList" element={<VendorList />} />
              <Route path="PurchaseList" element={<PurchaseInvoiceList />} />
              <Route path="Customer" element={<HoUnitInvoices />} />
              <Route path="Open" element={<Open />} />
              <Route path="Closed" element={<Closed />} />
              <Route path="All" element={<All />} />
            </Route>

            <Route path="Invoice">
              <Route path="BillingDetails" element={<BillingAddressCall />} />
              <Route path="MonthlyReport" element={<CustomerMonthlyReport />} />
              <Route path="InvoicesList" element={<InvoicesList />} />
            </Route>

            <Route path="Sync">
              <Route path="AccountSyncFile" element={<AccountSyncXMLFile />} />
              <Route path="fromHoSync" element={<FromHoSync />} />
              <Route path="HOupdateSync" element={<FromHOUpdate />} />
              <Route path="SyncExport" element={<Sync />} />
              {/* <Route path="ShowSyncStatus" element={<SyncCall />} /> */}
              <Route path="ShowSyncStatus" element={<SendMail />} />
              {/* <Route path="send" element={<SendMail/>} /> */}
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
