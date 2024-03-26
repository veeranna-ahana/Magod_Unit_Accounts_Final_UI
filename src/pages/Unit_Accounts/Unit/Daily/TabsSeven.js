import React, { useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import ReportSummaryTab from "./ReportsummaryTab/ReportSummaryTab";
import SalesInvoice from "./SalesInvoiceTab/SalesInvoice";
import Dailyreport from "./DailyReportTab/Dailyreport";
import ProdSumaryTable from "./ProductionSumaryTab/ProdSumaryTable";
import TaxSummaryTable from "./TaxSummaryTab/TaxSummaryTable";
import HoRvListTable from "./HoRvListTab/HoRvListTable";
import PaymentReceipntTables from "./PaymentReceipntDetails/PaymentReceipntTables";

export default function TabsSeven({
  getValues,
  getValuesHo,
  getValuesTax,
  date,
  getValuesPrdSum,
  getValuesSales,
  getValuesHoDe,
  getValuesReport,
  getValuesReceiptReport,
  getValuesTaxDetails,
  getValuesSummaryDetails,
  getPdfTaxValuess,
  getCustTax,
}) {
  //Invoice report calculation
  const groupedData = getValuesSales.reduce((groups, item) => {
    const key = `${item.DC_InvType}`;

    if (!groups[key]) {
      groups[key] = {
        invType: item.DC_InvType,
        total: 0.0,
        netTotal: 0.0,
        tax: 0.0,
        valueAdded: 0.0,
        materialCost: 0.0,
        count: 0.0,
        discount: 0.0,
        tptcharges: 0.0,
        items: [],
      };
    }
    groups[key].items.push(item);
    groups[key].total = (
      parseFloat(groups[key].total) + parseFloat(item.GrandTotal)
    ).toFixed(2);
    groups[key].netTotal = (
      parseFloat(groups[key].netTotal) + parseFloat(item.Net_Total)
    ).toFixed(2);
    groups[key].tax = (
      parseFloat(groups[key].tax) + parseFloat(item.TaxAmount)
    ).toFixed(2);
    groups[key].valueAdded = (
      parseFloat(groups[key].valueAdded) + parseFloat(item.JwValue)
    ).toFixed(2);
    groups[key].materialCost = (
      parseFloat(groups[key].materialCost) + parseFloat(item.MaterialValue)
    ).toFixed(2);
    groups[key].discount = (
      parseFloat(groups[key].discount) + parseFloat(item.Discount)
    ).toFixed(2);
    groups[key].tptcharges = (
      parseFloat(groups[key].tptcharges) + parseFloat(item.TptCharges)
    ).toFixed(2);
    groups[key].count += 1;

    return groups;
  }, {});

  // Convert the groupedData map into an array
  const groupedArray = Object.values(groupedData);

  //Tax summary calculation
  const groupedTaxData = getValuesTaxDetails.reduce((groups, item) => {
    const key = `${item.TxnType}`;

    if (!groups[key]) {
      groups[key] = {
        invType: item.TxnType,
        total: 0.0,
        count: 0,
        items: [],
      };
    }
    groups[key].items.push(item);
    groups[key].total = (
      parseFloat(groups[key].total) + parseFloat(item.Amount)
    ).toFixed(2);
    groups[key].count += 1;
    return groups;
  }, {});

  const groupedTaxArray = Object.values(groupedTaxData);

  //Cust taxes
  const groupedCustTaxData = getCustTax.reduce((groups, item) => {
    const key = item.CustName;

    if (!groups[key]) {
      groups[key] = {
        custName: item.CustName,
        onAccount: item.On_account,
        total: 0.0,
        onAccountTotal: 0.0,
        count: 0,
        items: [],
      };
    }

    groups[key].items.push(item);
    groups[key].total = (
      parseFloat(groups[key].total) + parseFloat(item.Amount)
    ).toFixed(2);

    // Assuming On_account is a currency value
    groups[key].onAccountTotal = (
      parseFloat(groups[key].onAccountTotal) + parseFloat(item.On_account)
    ).toFixed(2);

    groups[key].count += 1;

    return groups;
  }, {});

  // Calculate overall total sums
  const overallTotal = Object.values(groupedCustTaxData)
    .reduce((sum, group) => sum + parseFloat(group.total), 0)
    .toFixed(2);

  const overallOnAccountTotal = Object.values(groupedCustTaxData)
    .reduce((sum, group) => sum + parseFloat(group.onAccountTotal), 0)
    .toFixed(2);

  const groupedCustTaxArray = Object.values(groupedCustTaxData);

  const [key, setKey] = useState("RS");

  return (
    <>
      <div className="row">
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-2 mt-3 tab_font "
        >
          <Tab eventKey="RS" title="Report Summary">
            <ReportSummaryTab
              getValuesReport={getValuesReport}
              getValuesReceiptReport={getValuesReceiptReport}
              getValuesSummaryDetails={getValuesSummaryDetails}
              date={date}
              groupedArray={groupedArray}
              groupedTaxArray={groupedTaxArray}
            />
          </Tab>

          <Tab eventKey="SI" title="Sales Invoices">
            <SalesInvoice getValuesSales={getValuesSales} date={date} />
          </Tab>

          <Tab eventKey="PRD" title="Payment Receipt Details">
            <PaymentReceipntTables getValues={getValues} date={date} />
          </Tab>

          <Tab eventKey="DR" title="Daily Report">
            <Dailyreport
              groupedArray={groupedArray}
              getValuesTax={getValuesTax}
              date={date}
              getValuesPrdSum={getValuesPrdSum}
              groupedTaxArray={groupedTaxArray}
              getPdfTaxValuess={getPdfTaxValuess}
              groupedCustTaxArray={groupedCustTaxArray}
              getCustTax={getCustTax}
              overallOnAccountTotal={overallOnAccountTotal}
              overallTotal={overallTotal}
            />
          </Tab>

          <Tab eventKey="PS" title="Production Summary">
            <ProdSumaryTable getValuesPrdSum={getValuesPrdSum} />
          </Tab>

          <Tab eventKey="TS" title="Tax Summary">
            <TaxSummaryTable getValuesTax={getValuesTax} />
          </Tab>

          <Tab eventKey="HRLt" title="HO RV List">
            <HoRvListTable
              getValuesHo={getValuesHo}
              getValuesHoDe={getValuesHoDe}
            />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
