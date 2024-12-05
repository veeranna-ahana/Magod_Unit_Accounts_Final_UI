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

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  textBold: {
    fontWeight: "bold",
  },
  line: {
    height: 1,
    backgroundColor: "black",
    margin: "10px 0",
  },
  line1: {
    height: 1,
    backgroundColor: "black",
    marginBottom: "20px",
  },
  line2: {
    height: 1,
    backgroundColor: "black",
    marginTop: "10px",
  },
  boxContainer: {
    border: "2px solid black",
    padding: "10px",
    marginBottom: "20px",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  column: {
    width: "30%",
    textAlign: "right",
  },
  logoContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: "10%",
  },
  logo: {
    width: "50%",
    marginLeft: "20%",
    marginBottom: "1%",
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
  },
});

const ReceiptReportPdfModal = (props) => {
  const {
    getPdfTaxValuess: taxValues,
    groupedCustTaxArray: taxCustValues,
    getCustTax: CustomersTaxValues,
    overallTotal: totalTax,
    overallOnAccountTotal: totalOnAccountValue,
    date,
  } = props;

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  const totalAmtRecd = taxValues
    .reduce((acc, item) => acc + parseFloat(item.Total || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalOnAccount = taxValues
    .reduce((acc, item) => acc + parseFloat(item.On_account || 0), 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalTaxAmt = CustomersTaxValues.reduce(
    (acc, item) => acc + parseFloat(item.Amount || 0),
    0
  )
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalOnAccAmt = CustomersTaxValues.reduce(
    (acc, item) => acc + parseFloat(item.On_account || 0),
    0
  )
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.logoContainer}>
          <View>
            <Image src={MagodLogo} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.title}>
              <Text style={styles.heading}>Magod Laser Machining Pvt Ltd</Text>
            </View>
          </View>
        </View>

        {/* Line Divider */}
        <View style={styles.line} />

        {/* Details Section */}
        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.row}>
              <View style={styles.labelColumn}>
                <Text style={[styles.boldText, { fontSize: 12 }]}>Unit</Text>
                <Text style={styles.boldText}>Date</Text>
              </View>
              <View style={styles.valueColumn}>
                <Text style={styles.boldText}>: Jigani</Text>
                <Text style={styles.boldText}>: {formatDate(date)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.row}>
              <View style={styles.labelColumn}>
                <Text style={styles.boldText}>Prepared By:</Text>
                <Text style={styles.boldText}>Approved By:</Text>
              </View>
              <View style={styles.valueColumn}>
                <Text style={styles.boldText}></Text>
                <Text style={styles.boldText}></Text>
              </View>
            </View>
          </View>
        </View>

        {/* Date and Unit
        <View style={{ marginLeft: 10 }}>
          <View style={styles.row}>
            <Text style={styles.textBold}>Unit</Text>
            <Text>: Jigani</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.textBold}>Date</Text>
            <Text>: {formatDate(date)}</Text>
          </View>
        </View> */}

        {/* Prepared and Approved By */}
        {/* <View style={{ marginLeft: 10 }}>
          <View style={styles.row}>
            <Text style={styles.textBold}>Prepared By</Text>
            <Text>: </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.textBold}>Approved By</Text>
            <Text>: </Text>
          </View>
        </View> */}

        {/* Line Divider */}
        <View style={styles.line} />

        {/* Transaction Details */}
        <View style={styles.row}>
          <Text style={{ width: "30%" }}>Txn Type</Text>
          <Text style={{ width: "40%", textAlign: "right" }}>
            Amount Received
          </Text>
          <Text style={{ width: "20%", textAlign: "right" }}>On Account</Text>
        </View>

        {/* Line Divider */}
        <View style={styles.line} />

        {/* Loop Through Tax Values */}
        {taxValues.map((item, idx) => (
          <View key={idx} style={styles.row}>
            <Text style={{ width: "30%" }}>{item.TxnType}</Text>
            <Text style={{ width: "40%", textAlign: "right" }}>
              {formatAmount(item.Total)}
            </Text>
            <Text style={{ width: "20%", textAlign: "right" }}>
              {formatAmount(item.On_account)}
            </Text>
          </View>
        ))}

        {/* Line Divider */}
        <View style={styles.line} />

        {/* Total for Tax Values */}
        <View style={styles.row}>
          <Text style={{ width: "30%" }}></Text>
          <Text style={{ width: "40%", textAlign: "right" }}>
            {totalAmtRecd}
          </Text>
          <Text style={{ width: "20%", textAlign: "right" }}>
            {totalOnAccount}
          </Text>
        </View>

        {/* Line Divider */}
        <View style={styles.line1} />

        {/* Customer Group Section */}
        <View style={styles.row}>
          <Text style={{ width: "30%" }}>Txn Type</Text>
          <Text style={{ width: "40%", textAlign: "right" }}>
            Amount Received
          </Text>
          <Text style={{ width: "20%", textAlign: "right" }}>On Account</Text>
        </View>

        <View style={styles.line} />

        {/* Loop Through Customer Groups */}
        {taxCustValues.map((group, idx) => (
          <View key={idx}>
            <Text style={styles.textBold}>{group.custName}</Text>
            {group.items.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={{ width: "30%" }}>{item.TxnType}</Text>
                <Text style={{ width: "40%", textAlign: "right" }}>
                  {formatAmount(item.Amount)}
                </Text>
                <Text style={{ width: "20%", textAlign: "right" }}>
                  {formatAmount(item.On_account)}
                </Text>
              </View>
            ))}

            {/* Line Divider */}
            <View style={styles.line} />

            <View style={styles.row}>
              <Text style={{ width: "30%" }}></Text>
              <Text style={{ width: "40%", textAlign: "right" }}>
                {group.total}
              </Text>
              <Text style={{ width: "20%", textAlign: "right" }}>
                {group.onAccountTotal}
              </Text>
            </View>
            {/* Line Divider */}
            <View style={styles.line} />
          </View>
        ))}

        {/* Final Totals Section */}
        <View style={styles.row}>
          <Text style={{ width: "30%" }}></Text>
          <Text style={{ width: "40%", textAlign: "right" }}>{totalTax}</Text>
          <Text style={{ width: "20%", textAlign: "right" }}>
            {totalOnAccountValue}
          </Text>
        </View>

        {/* Line Divider */}
        <View style={styles.line} />

        {/* Final Table for Customer Transaction Details */}
        <View style={{ marginTop: 20 }}>
          <View style={styles.row}>
            <Text style={{ width: "20%" }}>RVr No</Text>
            <Text style={{ width: "20%" }}>Customer</Text>
            <Text style={{ width: "20%" }}>Txn Type</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>Amount</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>On Account</Text>
          </View>

          {/* Loop Through Customer Tax Details */}
          {CustomersTaxValues.map((item, idx) => (
            <View key={idx} style={styles.row}>
              <Text style={{ width: "20%" }}>{item.Recd_PVNO}</Text>
              <Text style={{ width: "20%" }}>{item.CustName}</Text>
              <Text style={{ width: "20%" }}>{item.TxnType}</Text>
              <Text style={{ width: "20%", textAlign: "right" }}>
                {formatAmount(item.Amount)}
              </Text>
              <Text style={{ width: "20%", textAlign: "right" }}>
                {formatAmount(item.On_account)}
              </Text>
            </View>
          ))}

          {/* Line Divider */}
          <View style={styles.line} />

          {/* Final Totals for Customer Details */}
          <View style={styles.row}>
            <Text style={{ width: "10%" }}></Text>
            <Text style={{ width: "30%" }}></Text>
            <Text style={{ width: "20%" }}></Text>
            <Text style={{ width: "20%", textAlign: "right" }}>
              {totalTaxAmt}
            </Text>
            <Text style={{ width: "20%", textAlign: "right" }}>
              {totalOnAccAmt}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ReceiptReportPdfModal;
