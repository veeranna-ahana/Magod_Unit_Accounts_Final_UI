import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import MagodLogo from "../../../../../../../Logo/MagodLogo.png";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 10,
  },
  header: {
    flexDirection: "row",
  },
  logo: {
    width: 50,
    height: 50,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: "20%",
    marginTop: "10px",
  },
  line: {
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: "row",
    fontWeight: "bold",
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  cell: {
    width: "12%",
    textAlign: "right",
  },
  bold: {
    fontWeight: "bold",
  },
  magodheading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center", // Centers the text inside its container
  },
  dateformate: {
    flexDirection: "row", // Aligns items horizontally
    justifyContent: "space-between", // Ensures space between left and right sections
    alignItems: "flex-start", // Aligns items at the top of their container
    marginVertical: 10, // Adds some spacing above and below the container
    paddingHorizontal: 10, // Adds some padding on the sides
  },
  childLeft: {
    width: "50%", // Occupies 50% of the container
  },
  childRight: {
    width: "40%", // Occupies the other 50% of the container
    // alignItems: "flex-end", // Align content to the right (optional)
  },

  ///my pdf styles


  headerTextContainer: {
    flex: 1, // Allow this view to take the remaining space
    textAlign: "center", // Center text horizontally
  },
  
  addressText: {
    fontSize: 10,
    marginTop: 5,
  },
  gstNo:{
    fontWeight:'bold',
    fontFamily: "Helvetica-Bold",
  },
  cinNo:{
    fontWeight:'bold',
    fontFamily: "Helvetica-Bold",
  }
  , pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "10px",
    marginRight: "10px",
    marginBottom: "5px",
   
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    // marginTop: "30px",
    // marginLeft: "20px",
  },
  ///my pdf styles
});

const SalesReportPdfModal = ({ groupedArray, date, getValuesTax, unitData }) => {

  console.log("unitdetails in pdf ", unitData);
  
  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const netTotal = groupedArray
    .reduce((acc, item) => acc + parseFloat(item.netTotal || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalTax = groupedArray
    .reduce((acc, item) => acc + parseFloat(item.tax || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalAmt = groupedArray
    .reduce((acc, item) => acc + parseFloat(item.total || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalDiscount = groupedArray
    .reduce((acc, item) => acc + parseFloat(item.discount || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalTpt = groupedArray
    .reduce((acc, item) => acc + parseFloat(item.tptcharges || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalValue = groupedArray
    .reduce((acc, item) => acc + parseFloat(item.valueAdded || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalMaterial = groupedArray
    .reduce((acc, item) => acc + parseFloat(item.materialCost || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalTaxAmt = getValuesTax
    .reduce((acc, item) => acc + parseFloat(item.TaxAmount || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Function to calculate the sum of columns for all items in values
  const calculateTotalSum = (values) => {
    const totalSumColumns = {
      Net: 0,
      MtrlChg: 0,
      Discount: 0,
      AssessableValue: 0,
      TotalTaxes: 0,
      Transport: 0,
      InvTotal: 0,
      RoundOff: 0,
      GrandTotal: 0,
    };

    const itemSums = [];

    values.forEach((group) => {
      const groupSumColumns = {
        Net: 0,
        MtrlChg: 0,
        Discount: 0,
        AssessableValue: 0,
        TotalTaxes: 0,
        Transport: 0,
        InvTotal: 0,
        RoundOff: 0,
        GrandTotal: 0,
      };

      group.items.forEach((item) => {
        groupSumColumns.Net += parseFloat(item.Net_Total);
        groupSumColumns.MtrlChg += parseFloat(item.MtrlChg);
        groupSumColumns.Discount += parseFloat(item.Discount);
        groupSumColumns.AssessableValue += parseFloat(item.AssessableValue);
        groupSumColumns.TotalTaxes += parseFloat(item.TaxAmount);
        groupSumColumns.Transport += parseFloat(item.TptCharges);
        groupSumColumns.InvTotal += parseFloat(item.InvTotal);
        groupSumColumns.RoundOff += parseFloat(item.Round_Off);
        groupSumColumns.GrandTotal += parseFloat(item.GrandTotal);

        // Update totalSumColumns as well
        totalSumColumns.Net += parseFloat(item.Net_Total);
        totalSumColumns.MtrlChg += parseFloat(item.MtrlChg);
        totalSumColumns.Discount += parseFloat(item.Discount);
        totalSumColumns.AssessableValue += parseFloat(item.AssessableValue);
        totalSumColumns.TotalTaxes += parseFloat(item.TaxAmount);
        totalSumColumns.Transport += parseFloat(item.TptCharges);
        totalSumColumns.InvTotal += parseFloat(item.InvTotal);
        totalSumColumns.RoundOff += parseFloat(item.Round_Off);
        totalSumColumns.GrandTotal += parseFloat(item.GrandTotal);
      });

      // Push the sum for the group to itemSums array
      itemSums.push(groupSumColumns);
    });

    return { totalSumColumns, itemSums };
  };

  // Outside JSX
  const { totalSumColumns, itemSums } = calculateTotalSum(groupedArray);

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        {/* <View style={styles.header}>
          <Image style={styles.logo} src={MagodLogo} />
          <Text style={styles.heading}>Magod Laser Machining Pvt Ltd</Text>
        </View> */}



       {/* -------- /////////// */}



       <View style={styles.pageHeader}>
     
        <Image style={styles.logo} src={MagodLogo} />

       
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerText, {marginBottom:'3px'}]}>Magod Laser Private Limited</Text>
          <View style={{ display: 'flex', flexDirection: 'row',  alignItems: 'center', justifyContent:'center' , gap:'10px'}}>
             <Text style={styles.gstNo}>GST: {unitData[0]?.GST_No}</Text>
                   <Text style={styles.cinNo}>CIN_No: {unitData[0]?.CIN_No}</Text>
          </View>
        
          <Text style={[styles.addressText, {marginBottom:'3px'}]}>
         
            {unitData[0]?.Unit_Address}
            
          </Text>

          <View style={{ display: 'flex', flexDirection: 'row',  alignItems: 'center', justifyContent:'center' , gap:'5px'}}>
          <Text > {unitData[0]?.PhonePrimary || "+91-80-42291005"}</Text>
          <Text > {unitData[0]?.PhoneSecondary || "+91-8110-414313"}</Text>
          <Text > {unitData[0]?.URL || 'info@magodlaser.in'}</Text>
          <Text > {unitData[0]?.Email ||  'http://www.magodlaser.in'}</Text>
          </View>
        </View>
      </View>


       {/* ------- ////// */}

        <View style={styles.line}></View>

        {/* Date and Prepared By Section */}
        <View style={styles.dateformate}>
          {/* Left Section */}
          <View style={styles.childLeft}>
            <Text>Unit: Jigani</Text>
            <Text>Date: {formatDate(date)}</Text>
          </View>

          {/* Right Section */}
          <View style={styles.childRight}>
            {groupedArray[0] && (
              <>
                <Text>Prepared By: {groupedArray[0].preparedby || ""}</Text>
                <Text>Approved By: {groupedArray[0].approvedby || ""}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.line}></View>

        {/* Invoice Summary */}
        <Text style={styles.bold}>Invoice Summary</Text>
        <View style={styles.line}></View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={{ width: "12%" }}>Type</Text>
          <Text style={{ width: "12%", textAlign: "right" }}>Net Billing</Text>
          <Text style={{ width: "12%", textAlign: "right" }}>Total Taxes</Text>
          <Text style={{ width: "12%", textAlign: "right" }}>Grand Total</Text>
          <Text style={{ width: "12%", textAlign: "right" }}>Discount</Text>
          <Text style={{ width: "12%", textAlign: "right" }}>Transport</Text>
          <Text style={{ width: "16%", textAlign: "right" }}>Value Added</Text>
          <Text style={{ width: "16%", textAlign: "right" }}>
            Material Cost
          </Text>
        </View>

        {/* Table Rows */}
        {groupedArray.map((item, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={{ width: "12%" }}>{item.invType}</Text>
            <Text style={{ width: "12%", textAlign: "right" }}>
              {formatAmount(item.netTotal)}
            </Text>
            <Text style={{ width: "12%", textAlign: "right" }}>
              {formatAmount(item.tax)}
            </Text>
            <Text style={{ width: "12%", textAlign: "right" }}>
              {formatAmount(item.total)}
            </Text>
            <Text style={{ width: "12%", textAlign: "right" }}>
              {formatAmount(item.discount)}
            </Text>
            <Text style={{ width: "12%", textAlign: "right" }}>
              {formatAmount(item.tptcharges)}
            </Text>
            <Text style={{ width: "16%", textAlign: "right" }}>
              {formatAmount(item.valueAdded)}
            </Text>
            <Text style={{ width: "16%", textAlign: "right" }}>
              {formatAmount(item.materialCost)}
            </Text>
          </View>
        ))}

        {/* Totals Row */}
        <View style={styles.line}></View>
        <View style={styles.tableRow}>
          <Text style={{ width: "12%" }}></Text>
          <Text style={{ width: "12%", textAlign: "right" }}>{netTotal}</Text>
          <Text style={{ width: "12%", textAlign: "right" }}>{totalTax}</Text>
          <Text style={{ width: "12%", textAlign: "right" }}>{totalAmt}</Text>
          <Text style={{ width: "12%", textAlign: "right" }}>
            {totalDiscount}
          </Text>
          <Text style={{ width: "12%", textAlign: "right" }}>{totalTpt}</Text>
          <Text style={{ width: "16%", textAlign: "right" }}>{totalValue}</Text>
          <Text style={{ width: "16%", textAlign: "right" }}>
            {totalMaterial}
          </Text>
        </View>
        <View style={styles.line}></View>

        {/* Tax Summary */}
        <Text style={styles.bold}>Tax Summary</Text>
        <View style={styles.line}></View>

        <View style={styles.tableHeader}>
          <Text style={{ width: "20%" }}>Type</Text>
          <Text style={{ width: "20%", textAlign: "right" }}>
            Invoice Value
          </Text>
          <Text style={{ width: "20%", textAlign: "right" }}>Tax Name</Text>
          <Text style={{ width: "20%", textAlign: "right" }}>
            Taxable Amount
          </Text>
          <Text style={{ width: "10%", textAlign: "right" }}>Percent</Text>
          <Text style={{ width: "10%", textAlign: "right" }}>Total Tax</Text>
        </View>

        {getValuesTax.map((item, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={{ width: "20%" }}>{item.InvoiceType}</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>
              {formatAmount(item.InvoiceValue)}
            </Text>
            <Text style={{ width: "20%", textAlign: "right" }}>
              {item.TaxName}
            </Text>
            <Text style={{ width: "20%", textAlign: "right" }}>
              {formatAmount(item.TaxableAmount)}
            </Text>
            <Text style={{ width: "10%", textAlign: "right" }}>
              {item.TaxPercent}
            </Text>
            <Text style={{ width: "10%", textAlign: "right" }}>
              {formatAmount(item.TaxAmount)}
            </Text>
          </View>
        ))}

        <View style={styles.line}></View>
        <View style={styles.tableRow}>
          <Text style={{ width: "12%", textAlign: "right" }}></Text>
          <Text style={{ width: "12%", textAlign: "right" }}></Text>
          <Text style={{ width: "12%", textAlign: "right" }}></Text>
          <Text style={{ width: "12%", textAlign: "right" }}></Text>
          <Text style={{ width: "16%", textAlign: "right" }}></Text>
          <Text style={{ width: "16%", textAlign: "right" }}>
            {totalTaxAmt}
          </Text>
        </View>
        <View style={styles.line}></View>

        {/* Tables Section */}
        {groupedArray.map((group, idx) => (
          <View key={idx} style={styles.section}>
            {/* Group Title */}
            <Text style={[styles.textBold, { marginBottom: 5 }]}>
              {group.invType}
            </Text>
            <View style={styles.line}></View>

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={{ width: "8%" }}>Inv No</Text>
              <Text style={{ width: "10%", textAlign: "right" }}>Net</Text>
              <Text style={{ width: "10%", textAlign: "right" }}>Material</Text>
              <Text style={{ width: "10%", textAlign: "right" }}>Discount</Text>
              <Text style={{ width: "15%", textAlign: "right" }}>
                Assessable Value
              </Text>
              <Text style={{ width: "10%", textAlign: "right" }}>Taxes</Text>
              <Text style={{ width: "10%", textAlign: "right" }}>
                Transport
              </Text>
              <Text style={{ width: "10%", textAlign: "right" }}>
                Inv Total
              </Text>
              <Text style={{ width: "7%", textAlign: "right" }}>Round Off</Text>
              <Text style={{ width: "10%", textAlign: "right" }}>
                Grand Total
              </Text>
            </View>

            {/* Table Rows */}
            {group.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={{ width: "8%" }}>{item.Inv_No}</Text>
                <Text style={{ width: "10%", textAlign: "right" }}>
                  {formatAmount(item.Net_Total)}
                </Text>
                <Text style={{ width: "10%", textAlign: "right" }}>
                  {formatAmount(item.MtrlChg)}
                </Text>
                <Text style={{ width: "10%", textAlign: "right" }}>
                  {formatAmount(item.Discount)}
                </Text>
                <Text style={{ width: "15%", textAlign: "right" }}>
                  {formatAmount(item.AssessableValue)}
                </Text>
                <Text style={{ width: "10%", textAlign: "right" }}>
                  {formatAmount(item.TaxAmount)}
                </Text>
                <Text style={{ width: "10%", textAlign: "right" }}>
                  {formatAmount(item.TptCharges)}
                </Text>
                <Text style={{ width: "10%", textAlign: "right" }}>
                  {formatAmount(item.InvTotal)}
                </Text>
                <Text style={{ width: "7%", textAlign: "right" }}>
                  {item.Round_Off}
                </Text>
                <Text style={{ width: "10%", textAlign: "right" }}>
                  {formatAmount(item.GrandTotal)}
                </Text>
              </View>
            ))}

            <View style={styles.line}></View>

            {/* Row containing sums */}
            <View style={styles.tableRow}>
              {itemSums[idx] && (
                <>
                  <Text style={{ width: "8%" }}></Text>
                  <Text style={{ width: "10%", textAlign: "right" }}>
                    {formatAmount(itemSums[idx].Net)}
                  </Text>
                  <Text style={{ width: "10%", textAlign: "right" }}>
                    {formatAmount(itemSums[idx].MtrlChg)}
                  </Text>
                  <Text style={{ width: "10%", textAlign: "right" }}>
                    {formatAmount(itemSums[idx].Discount)}
                  </Text>
                  <Text style={{ width: "15%", textAlign: "right" }}>
                    {formatAmount(itemSums[idx].AssessableValue)}
                  </Text>
                  <Text style={{ width: "10%", textAlign: "right" }}>
                    {formatAmount(itemSums[idx].TotalTaxes)}
                  </Text>
                  <Text style={{ width: "10%", textAlign: "right" }}>
                    {formatAmount(itemSums[idx].Transport)}
                  </Text>
                  <Text style={{ width: "10%", textAlign: "right" }}>
                    {formatAmount(itemSums[idx].InvTotal)}
                  </Text>
                  <Text style={{ width: "7%", textAlign: "right" }}>
                    {formatAmount(itemSums[idx].RoundOff)}
                  </Text>
                  <Text style={{ width: "10%", textAlign: "right" }}>
                    {formatAmount(itemSums[idx].GrandTotal)}
                  </Text>
                </>
              )}
            </View>
            <View style={styles.line}></View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default SalesReportPdfModal;
