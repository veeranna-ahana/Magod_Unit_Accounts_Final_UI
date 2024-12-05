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
    marginTop: 10,
    marginBottom: 10,
  },
  line1: {
    height: 1,
    backgroundColor: "black",
    marginBottom: 20,
  },
  line2: {
    height: 1,
    backgroundColor: "black",
    marginTop: 10,
  },
  boxContainer: {
    border: "2px solid black",
    padding: 10,
    marginBottom: 20,
  },
  container: {
    fontSize: 11,   
    flexDirection: "column",
    padding: 10,
    marginTop: 20,
    marginBottom: 50,
    paddingBottom: 50,
    paddingTop: 10,
    marginLeft: 0,
    marginRight: 0,
  },
  logoContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  logo: {
    width: "50%",
    marginLeft: "20%",
    marginBottom: "1%",
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: "20%",
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    marginLeft: 10,
    marginBottom: 1,
  },
  column: {
    flexDirection: "column",
    marginBottom: 5,
  },
  exciseClNocolumn: {
    width: "20%",
    flexDirection: "column",
    marginBottom: 5,
  },
  labelColumn: {
    width: "20%",
  },
  valueColumn: {
    width: "60%",
  },
  separatorColumn: {
    width: "10%",
  },
  columnRightAlign: {
    width: "20%",
    textAlign: "right",
  },
  smallColumnRightAlign: {
    width: "20%",
    textAlign: "right",
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 12,
  },
});

// Format amount function for React-PDF
const formatAmount = (amount) =>
  amount
    ? parseFloat(amount)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "0.00";

const ProductionReportPdfModal = ({ getValuesPrdSum, date }) => {
  const proData = getValuesPrdSum;

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const WithTax = [];
  const WithOutTax = [];

  for (let i = 0; i < proData.length; i++) {
    if (proData[i].WithTax === 1) {
      WithTax.push(proData[i]);
    } else {
      WithOutTax.push(proData[i]);
    }
  }

  const totalQtySum = WithOutTax.reduce(
    (acc, item) => acc + parseInt(item.TotalQty || 0, 10),
    0
  );

  const totalWeightSum = WithOutTax.reduce(
    (acc, item) => acc + parseFloat(item.TotalWeight || 0),
    0
  )
    .toFixed(3)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalValueSum = WithOutTax.reduce(
    (acc, item) => acc + parseFloat(item.TotalValue || 0),
    0
  )
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalQtySumm = WithTax.reduce(
    (acc, item) => acc + parseInt(item.TotalQty || 0, 10),
    0
  );

  const totalWeightSumm = WithTax.reduce(
    (acc, item) => acc + parseFloat(item.TotalWeight || 0),
    0
  )
    .toFixed(3)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalValueSumm = WithTax.reduce(
    (acc, item) => acc + parseFloat(item.TotalValue || 0),
    0
  )
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalQTySum = totalQtySum + totalQtySumm;
  const totalWgtSum = (
    parseFloat(totalWeightSumm.replace(/,/g, "")) +
    parseFloat(totalWeightSum.replace(/,/g, ""))
  )
    .toFixed(3)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const totalVluSum = (
    parseFloat(totalValueSum.replace(/,/g, "")) +
    parseFloat(totalValueSumm.replace(/,/g, ""))
  )
    .toFixed(3)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  function organizeDataByInvoiceType(dataArray) {
    const organizedData = [];

    dataArray.forEach((item) => {
      const invoiceType = item.InvoiceType;
      let foundType = organizedData.find(
        (entry) => entry.InvType === invoiceType
      );

      if (!foundType) {
        foundType = { InvType: invoiceType, data: [] };
        organizedData.push(foundType);
      }

      foundType.data.push({
        Ex_Not_no: item.Ex_Not_no,
        Excise_CL_no: item.Excise_CL_no,
        InvoiceType: item.InvoiceType,
        Material: item.Material,
        TotalQty: item.TotalQty,
        TotalValue: item.TotalValue,
        TotalWeight: item.TotalWeight,
        WithTax: item.WithTax,
      });
    });

    return organizedData;
  }

  const resultWithTax = organizeDataByInvoiceType(WithTax);
  const resultWithOutTax = organizeDataByInvoiceType(WithOutTax);

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={{ width: "10%" }}>
            <Image src={MagodLogo} style={styles.logo} />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.title}>
              <Text style={styles.heading}>Magod Laser Machining Pvt Ltd</Text>
            </View>
            <View style={styles.title}>
              <Text style={styles.heading}>
                Production and Clearance Summary
              </Text>
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
                <Text style={styles.boldText}>Unit</Text>
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
                <Text style={styles.boldText}>Prepared By</Text>
                <Text style={styles.boldText}>Approved By</Text>
              </View>
              <View style={styles.valueColumn}>
                <Text style={styles.boldText}>:</Text>
                <Text style={styles.boldText}>:</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Line Divider */}
        <View style={styles.line} />

        <View style={styles.row}>
          <View style={styles.exciseClNocolumn}>
            <Text style={{ fontSize: 12 }}>Excise_Cl_No</Text>
          </View>
          <View style={styles.column}>
            <Text style={{ fontSize: 12 }}>Material</Text>
          </View>
          <View style={styles.columnRightAlign}>
            <Text style={{ fontSize: 12 }}>Total Qty</Text>
          </View>
          <View style={styles.columnRightAlign}>
            <Text style={{ fontSize: 12 }}>Total Weight</Text>
          </View>
          <View style={styles.smallColumnRightAlign}>
            <Text style={{ fontSize: 12 }}>Total Value</Text>
          </View>
        </View>

        <View style={styles.line} />

        <View style={{ width: "20%", marginLeft: "2%" }}>
          <Text style={{ fontSize: 12 }}>Cleared Without Tax</Text>
        </View>
        <View style={styles.line}></View>

        {resultWithOutTax.map((group, index) => (
          <View key={index}>
            {/* Group Header */}
            <View style={{ width: "20%", marginLeft: "8%" }}>
              <Text style={{ fontSize: 12 }}>ExciseRegd - 214/86</Text>
            </View>

            <View style={styles.line}></View>

            <View style={{ width: "20%", marginLeft: "18%" }}>
              <Text style={{ fontSize: 12 }}>{group.InvType}</Text>
            </View>

            <View style={styles.line}></View>

            {/* Group Items */}
            {group.data.map((item, itemIndex) => (
              <View
                key={itemIndex}
                style={{
                  flexDirection: "row",
                  marginBottom: 5, // Add spacing between rows
                }}
              >
                <View style={{ width: "20%" }}>
                  <Text style={{ fontSize: 12 }}>{item.Excise_CL_no}</Text>
                </View>
                <View style={{ width: "20%" }}>
                  <Text style={{ fontSize: 12 }}>{item.Material}</Text>
                </View>
                <View style={{ width: "5%", textAlign: "right" }}>
                  <Text style={{ fontSize: 12 }}>{item.TotalQty}</Text>
                </View>
                <View style={{ width: "20%", textAlign: "right" }}>
                  <Text style={{ fontSize: 12 }}>
                    {formatAmount(item.TotalWeight)}
                  </Text>
                </View>
                <View style={{ width: "20%", textAlign: "right" }}>
                  <Text style={{ fontSize: 12 }}>
                    {formatAmount(item.TotalValue)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
        <View style={styles.line}></View>

        <View style={{ flexDirection: "row", marginBottom: 5 }}>
          <View style={{ width: "5%" }}>
            <Text style={{ fontSize: 12 }}></Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={{ fontSize: 12 }}></Text>
          </View>
          <View style={{ width: "20%", textAlign: "right" }}>
            <Text style={{ fontSize: 12 }}>{totalQtySum}</Text>
          </View>
          <View style={{ width: "20%", textAlign: "right" }}>
            <Text style={{ fontSize: 12 }}>{totalWeightSum}</Text>
          </View>
          <View style={{ width: "20%", textAlign: "right" }}>
            <Text style={{ fontSize: 12 }}>{totalValueSum}</Text>
          </View>
        </View>
        <View style={styles.line}></View>

        <View style={{ width: "20%", marginLeft: "2%" }}>
          <Text style={{ fontSize: 12 }}>Cleared With Tax</Text>
        </View>
        <View style={styles.line}></View>

        {resultWithTax.map((group, index) => (
          <View key={index}>
            <View style={{ width: "20%", marginLeft: "8%", marginBottom: 5 }}>
              <Text style={{ fontSize: 12 }}>Excise JobWork</Text>
            </View>
            <View style={styles.line}></View>
            <View style={{ width: "20%", marginLeft: "18%", marginBottom: 5 }}>
              <Text style={{ fontSize: 12 }}>{group.InvType}</Text>
            </View>
            <View style={styles.line}></View>
            {group.data.map((item, itemIndex) => (
              <View
                key={itemIndex}
                style={{
                  flexDirection: "row",
                  marginBottom: 5,
                }}
              >
                <View style={{ width: "20%" }}>
                  <Text style={{ fontSize: 12 }}>{item.Excise_CL_no}</Text>
                </View>
                <View style={{ width: "20%" }}>
                  <Text style={{ fontSize: 12 }}>{item.Material}</Text>
                </View>
                <View style={{ width: "5%", textAlign: "right" }}>
                  <Text style={{ fontSize: 12 }}>{item.TotalQty}</Text>
                </View>
                <View style={{ width: "20%", textAlign: "right" }}>
                  <Text style={{ fontSize: 12 }}>
                    {formatAmount(item.TotalWeight)}
                  </Text>
                </View>
                <View style={{ width: "20%", textAlign: "right" }}>
                  <Text style={{ fontSize: 12 }}>
                    {formatAmount(item.TotalValue)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.line}></View>

        <View
          style={{
            flexDirection: "row",
            marginBottom: 5,
          }}
        >
          <View style={{ width: "20%" }}>
            <Text style={{ fontSize: 12 }}></Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={{ fontSize: 12 }}></Text>
          </View>
          <View style={{ width: "5%", textAlign: "right" }}>
            <Text style={{ fontSize: 12 }}>{totalQtySumm}</Text>
          </View>
          <View style={{ width: "20%", textAlign: "right" }}>
            <Text style={{ fontSize: 12 }}>{totalWeightSumm}</Text>
          </View>
          <View style={{ width: "20%", textAlign: "right" }}>
            <Text style={{ fontSize: 12 }}>{totalValueSumm}</Text>
          </View>
        </View>

        <View style={styles.line}></View>

        <View
          style={{
            flexDirection: "row",
            marginBottom: 5,
          }}
        >
          <View style={{ width: "20%" }}>
            <Text style={{ fontSize: 12 }}></Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={{ fontSize: 12 }}></Text>
          </View>
          <View style={{ width: "5%", textAlign: "right" }}>
            <Text style={{ fontSize: 12 }}>{totalQTySum}</Text>
          </View>
          <View style={{ width: "20%", textAlign: "right" }}>
            <Text style={{ fontSize: 12 }}>{totalWgtSum}</Text>
          </View>
          <View style={{ width: "20%", textAlign: "right" }}>
            <Text style={{ fontSize: 12 }}>{totalVluSum}</Text>
          </View>
        </View>

        <View style={styles.line}></View>
      </Page>
    </Document>
  );
};

export default ProductionReportPdfModal;
