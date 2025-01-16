import React, { useEffect, useState } from "react";
import {
  Page,
  Document,
  StyleSheet,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";
import MagodLOGO from "../../../../../../../Logo/MagodLogo.png";

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    flexDirection: "column",
  },
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 10,
    // border: "1px solid black",
    paddingTop: "10px",
    paddingBottom: "50px",
  },
  tableHeader: {
    flexDirection: "row",
    // borderBottom: "1px solid black",
    paddingBottom: "5px",
  },
  tableRow: {
    flexDirection: "row",
    marginTop: "5px",
  },
  columnHeader: {
    width: "30%",
    marginLeft: "25px",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  columnValue: {
    width: "20%",
    marginLeft: "20px",
    fontSize: 10,
  },

  header: {
    marginBottom: 10,

    paddingBottom: "5px",
    height: "80px",
    paddingTop: "10px",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    // marginTop: "30px",
    // marginLeft: "20px",
  },

  headerText1: {
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },

  poNo: {
    width: "100%",
    marginTop: "5px",
    marginLeft: "5px",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  line: {
    marginTop: "10px",
    fontWeight: "bold",
    width: "100%",
    borderBottom: "1px solid black",
  },
  line1: {
    marginTop: "10px",
    fontWeight: "bold",
    width: "100%",
  },
  header123: {
    marginBottom: 10,
    height: "100px",
    flexDirection: "row",
  },
  head1234: {
    marginLeft: "200px",
    width: "100px",
  },
  head4: {
    flexDirection: "row",
    marginBottom: "5px",
  },

  srl: {
    width: "40px",
    textAlign: "center",

    padding: "1px",
    // borderBottom: 1,
  },
  drawingname: {
    width: "100px",

    padding: "1px",
    textAlign: "center",
    // borderBottom: 1,
  },
  Material: {
    width: "100px",
    textAlign: "center",
    padding: "1px",
    // borderBottom: 1,
  },
  hsn: {
    width: "90px",
    textAlign: "center",

    // borderBottom: 1,
    padding: "1px",
  },
  qty: {
    width: "60px",

    textAlign: "center",
    padding: "1px",
    // borderBottom: 1,
  },
  uom: {
    width: "70px",
    textAlign: "center",
    padding: "1px",
    // borderBottom: 1,
  },
  unitprice: {
    width: "80px",
    textAlign: "center",
    padding: "1px",
    // borderBottom: 1,
  },
  total: {
    width: "90px",
    textAlign: "center",
    padding: "1px",
  },
  tableDataView: {
    width: "570px",
    // borderBottom: 1,
    // borderRight: 1,
    // borderLeft: 1,
    marginLeft: "5px",
  },

  tableDisplay: {
    // width: "570px",
    // borderBottom: 1,
    marginTop: "25px",
    marginLeft: "10px",
    borderTop: 1,
  },
  row: {
    flexDirection: "row",
    borderBottom: 1,
  },
  column: {
    flexDirection: "column",
  },
  grnno: {
    width: "100px",
    textAlign: "center",
    padding: "1px",
    // borderBottom: 1,
  },

  globalfontwithbold: {
    fontSize: "10px",
    fontFamily: "Helvetica-Bold",
  },
  globalfontwithoutbold: {
    fontSize: "10px",
  },
  logo: {
    marginTop: "20px",
    width: "50px",
    height: "50px",
  },
  row11: {
    flexDirection: "row",
    borderBottom: 1,
    height: "80px",
    paddingTop: "20px",
  },

  mrgnbttm: {
    flexDirection: "row",
    marginBottom: "5px",
  },
  unitprice11: {
    width: "80px",
    textAlign: "center",
    padding: "1px",
    marginLeft: "20px",
    // borderBottom: 1,
  },

  // header part css
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "10px",
    marginRight: "10px",
    marginBottom: "10px",
    borderBottom: 1,
  },
  headerTextContainer: {
    flex: 1, // Allow this view to take the remaining space
    textAlign: "center", // Center text horizontally
     marginTop:'20px'
  },
  addressText: {
    fontSize: 10,
    marginTop: 5,
  },

  paymentReceiptVoucher:{
    textDecoration:'underline',
    fontWeight:'1000',
    marginBottom:'2px',
    fontFamily: "Helvetica-Bold",
  },
  gstNo:{
    fontWeight:'bold',
    fontFamily: "Helvetica-Bold",
  },
  cinNo:{
    fontWeight:'bold',
    fontFamily: "Helvetica-Bold",
  }
});


export default function PdfReceipts({ data, unitData }) {
  console.log("pdf voucher", unitData);
  

  const [currentDate, setCurrentDate] = useState("");
  // const [totalReceiveNow, setTotalReceiveNow] = useState(0);
  const totalReceiveNow = data.receipt_details.reduce(
    (accumulator, item) => accumulator + parseFloat(item.Receive_Now),
    0
  );

  useEffect(() => {
    // Function to get and format the current date
    const getCurrentDate = () => {
      const now = new Date();
      const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
      const formattedDate = now.toLocaleDateString("en-US", options);
      const parts = formattedDate.split("/");
      const formattedDateInDDMMYY = `${parts[1]}-${parts[0]}-${parts[2]}`;
      setCurrentDate(formattedDateInDDMMYY);
    };

    // Call the functions when the component mounts
    getCurrentDate();
  }, [data.receipt_details]);

  console.log("total counttt", totalReceiveNow, data.receipt_data.Recd_PV_Date);

  function formatAmount(amount) {
    // Assuming amount is a number
    const formattedAmount = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formattedAmount;
  }

  console.log("recept datetttttttttte, ", data.receipt_data.Recd_PV_Date);

  const Header = () => (
    <View style={styles.pageHeader}>
        {/* Logo */}
        <Image src={MagodLOGO} style={styles.logo} />

        {/* Header details */}
        <View style={styles.headerTextContainer}>
          <Text style={styles.paymentReceiptVoucher}> PAYMENT RECEIPT VOUCHER</Text>
          <Text style={[styles.headerText, {marginBottom:'3px'}]}>Magod Laser Private Limited</Text>
          <View style={{ display: 'flex', flexDirection: 'row',  alignItems: 'center', justifyContent:'center' , gap:'10px'}}>
          <Text style={styles.gstNo}>GST: {unitData[0]?.GST_No}</Text>
          <Text style={styles.cinNo}>CIN_No: {unitData[0]?.CIN_No}</Text>
          </View>
        
          <Text style={[styles.addressText, {marginBottom:'3px'}]}>
            {/* Plot NO 72, Phase || KIADB Industrial Area Jigani, Anekal Taluk
            Bangalore Pin: Karnataka */}
            {unitData[0]?.Unit_Address}
            
          </Text>

          <View style={{ display: 'flex', flexDirection: 'row',  alignItems: 'center', justifyContent:'center' , gap:'5px'}}>
          <Text > {unitData[0]?.PhonePrimary}</Text>
          <Text > {unitData[0]?.PhoneSecondary}</Text>
          <Text > {unitData[0]?.URL}</Text>
          <Text > {unitData[0]?.Email}</Text>
          </View>
        </View>
      </View>
  );

  const Header22 = () => (
    <Document>
      <Page size="A4" style={styles.page}>
      <View style={styles.pageHeader}>
        {/* Logo */}
        <Image src={MagodLOGO} style={styles.logo} />

        {/* Header details */}
        <View style={styles.headerTextContainer}>
        <Text style={styles.paymentReceiptVoucher}> PAYMENT RECEIPT VOUCHER</Text>
          <Text style={[styles.headerText, {marginBottom:'3px'}]}>Magod Laser Private Limited</Text>
          <View style={{ display: 'flex', flexDirection: 'row',  alignItems: 'center', justifyContent:'center' , gap:'10px'}}>
          <Text style={styles.gstNo}>GST: {unitData[0]?.GST_No}</Text>
          <Text style={styles.cinNo}>CIN_No: {unitData[0]?.CIN_No}</Text>
          </View>
        
          <Text style={[styles.addressText, {marginBottom:'3px'}]}>
            {/* Plot NO 72, Phase || KIADB Industrial Area Jigani, Anekal Taluk
            Bangalore Pin: Karnataka */}
            {unitData[0]?.Unit_Address}
            
          </Text>

          <View style={{ display: 'flex', flexDirection: 'row',  alignItems: 'center', justifyContent:'center' , gap:'5px'}}>
          <Text > {unitData[0]?.PhonePrimary}</Text>
          <Text > {unitData[0]?.PhoneSecondary}</Text>
          <Text > {unitData[0]?.URL}</Text>
          <Text > {unitData[0]?.Email}</Text>
          </View>
        </View>
      </View>

        <View style={styles.mrgnbttm}>
          <View>
            <Text style={{ marginLeft: "70px" }}>Unit :</Text>
            <Text style={{ marginLeft: "28px", marginTop: "5px" }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                Voucher No :{" "}
              </Text>
              {data.receipt_data.Recd_PVNo}
            </Text>

            <Text style={{ marginLeft: "65px", marginTop: "5px" }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Date : </Text>
              {/* {currentDate} */}

              {new Date(data.receipt_data.Recd_PV_Date).toLocaleDateString(
                "en-GB"
              )}
            </Text>

            <Text style={{ marginLeft: "30px", marginTop: "5px" }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                Transaction Type:{" "}
              </Text>{" "}
              {data.receipt_data.TxnType}
            </Text>
          </View>

          <View>
            <Text style={{ marginLeft: "110px", width: "320px" }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                Received From:
              </Text>
              {data.receipt_data.CustName} ({data.receipt_data.Cust_code})
            </Text>

            <Text
              style={{ marginLeft: "120px", width: "310px", marginTop: "10px" }}
            >
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Vibe : </Text>{" "}
              {data.receipt_data.Description}
            </Text>
          </View>
        </View>

        <View style={styles.head4}>
          <Text style={{ marginLeft: "400px" }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Amount: </Text>{" "}
            {formatAmount(data.receipt_data.Amount)}
          </Text>
        </View>

        <View style={styles.head4}>
          <Text style={{ marginLeft: "395px" }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Adjusted: </Text>{" "}
            {formatAmount(totalReceiveNow)}
          </Text>
        </View>

        <View style={styles.head4}>
          <Text style={{ marginLeft: "377px" }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}> On Account: </Text>
            {formatAmount(data.receipt_data.On_account)}
          </Text>
        </View>

        <View style={styles.tableDisplay}>
          <View style={styles.row}>
            <View style={styles.srl}>
              <Text style={styles.globalfontwithbold}>Srl </Text>
            </View>

            <View style={styles.Material}>
              <Text style={styles.globalfontwithbold}>Invoice No</Text>
            </View>

            <View style={styles.hsn}>
              <Text style={styles.globalfontwithbold}>Type </Text>
            </View>

            <View style={styles.qty}>
              <Text style={styles.globalfontwithbold}>Invoiced</Text>
            </View>
            <View style={styles.uom}>
              <Text style={styles.globalfontwithbold}>Received</Text>
            </View>
            <View style={styles.unitprice}>
              <Text style={styles.globalfontwithbold}>Receive Now</Text>
            </View>
            <View style={styles.unitprice}>
              <Text style={styles.globalfontwithbold}>Reference No</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  const Header222 = () => (
    <>
      <View style={styles.mrgnbttm}>
        <View>
          <Text style={{ marginLeft: "70px" }}>Unit :</Text>
          <Text style={{ marginLeft: "28px", marginTop: "5px" }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Voucher No : </Text>
            {data.receipt_data.Recd_PVNo}
          </Text>

          <Text style={{ marginLeft: "65px", marginTop: "5px" }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Date : </Text>
            {/* {currentDate} */}

            {new Date(data.receipt_data.Recd_PV_Date).toLocaleDateString(
              "en-GB"
            )}
          </Text>

          <Text style={{ marginLeft: "30px", marginTop: "5px" }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              Transaction Type:{" "}
            </Text>{" "}
            {data.receipt_data.TxnType}
          </Text>
        </View>

        <View>
          <Text style={{ marginLeft: "60px", width: "300px" }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Received From:</Text>
            {data.receipt_data.CustName} ({data.receipt_data.Cust_code})
          </Text>

          <Text
            style={{ marginLeft: "60px", width: "300px", marginTop: "10px" }}
          >
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Vibe : </Text>{" "}
            {data.receipt_data.Description}
          </Text>
        </View>
      </View>

      <View style={styles.head4}>
        <Text style={{ marginLeft: "400px" }}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>Amount: </Text>{" "}
          {formatAmount(data.receipt_data.Amount)}
        </Text>
      </View>

      <View style={styles.head4}>
        <Text style={{ marginLeft: "395px" }}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>Adjusted: </Text>{" "}
          {formatAmount(totalReceiveNow)}
        </Text>
      </View>

      <View style={styles.head4}>
        <Text style={{ marginLeft: "377px" }}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}> On Account: </Text>
          {formatAmount(data.receipt_data.On_account)}
        </Text>
      </View>
    </>
  );

  if (!data.receipt_details || data.receipt_details.length === 0) {
    return <Header22 />;
  }

  console.log("details,,,,,", data.receipt_data);
  const itemsPerPageForOtherPages = 15;
  return (
    <>
      <Document>
        {data.receipt_details.map((pageData, pageIndex) => {
          const startItem = pageIndex * itemsPerPageForOtherPages;
          const endItem = startItem + itemsPerPageForOtherPages;

          const currentPageData = Object.keys(pageData)
            .slice(startItem, endItem)
            .reduce((acc, key) => {
              acc[key] = pageData[key];
              return acc;
            }, {});

          if (Object.keys(currentPageData).length === 0) {
            return null;
            // Skip rendering empty pages
          }

          return (
            <Page key={pageIndex} size="A4" style={styles.page}>
              {pageIndex === 0 && (
                <>
                  <Header />

                  <Header222 />
                </>
              )}

              {pageIndex === 0 && (
                <View style={styles.tableDisplay}>
                  <View style={styles.row}>
                    <View style={styles.srl}>
                      <Text style={styles.globalfontwithbold}>Srl </Text>
                    </View>

                    <View style={styles.Material}>
                      <Text style={styles.globalfontwithbold}>Invoice No</Text>
                    </View>

                    <View style={styles.hsn}>
                      <Text style={styles.globalfontwithbold}>Type </Text>
                    </View>

                    <View style={styles.qty}>
                      <Text style={styles.globalfontwithbold}>Invoiced</Text>
                    </View>
                    <View style={styles.uom}>
                      <Text
                        style={[
                          styles.globalfontwithbold,
                          { textAlign: "right" },
                        ]}
                      >
                        Received
                      </Text>
                    </View>
                    <View style={styles.unitprice}>
                      <Text
                        style={[
                          styles.globalfontwithbold,
                          { textAlign: "right" },
                        ]}
                      >
                        Receive Now
                      </Text>
                    </View>
                    <View style={styles.unitprice11}>
                      <Text style={styles.globalfontwithbold}>
                        Reference No
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {pageIndex === 0 && (
                <View style={styles.tableDataView}>
                  {data.receipt_details.map((item, index) => (
                    <>
                      <View style={styles.row} key={index}>
                        <View style={styles.srl}>
                          <Text
                            style={[
                              styles.globalfontwithoutbold,
                              { paddingBottom: "15px" },
                            ]}
                          >
                            {index + 1}
                          </Text>
                        </View>

                        <View style={styles.drawingname}>
                          <Text style={styles.globalfontwithoutbold}>
                            {item.Inv_No}{" "}
                            {new Date(item.Inv_date).toLocaleDateString(
                              "en-GB"
                            )}
                          </Text>
                        </View>

                        <View style={styles.hsn}>
                          <Text style={styles.globalfontwithoutbold}>
                            {item.Inv_Type}{" "}
                          </Text>
                        </View>

                        <View style={styles.qty}>
                          <Text
                            style={[
                              styles.globalfontwithoutbold,
                              { textAlign: "right" },
                            ]}
                          >
                            {formatAmount(item.Inv_Amount)}
                          </Text>
                        </View>
                        <View style={styles.uom}>
                          <Text
                            style={[
                              styles.globalfontwithoutbold,
                              { textAlign: "right" },
                            ]}
                          >
                            {formatAmount(item.Amt_received)}
                          </Text>
                        </View>

                        <View style={styles.unitprice}>
                          <Text
                            style={[
                              styles.globalfontwithoutbold,
                              { textAlign: "right" },
                            ]}
                          >
                            {formatAmount(item.Receive_Now)}
                          </Text>
                        </View>
                        <View style={styles.unitprice11}>
                          <Text style={styles.globalfontwithoutbold}>
                            {item.RefNo}
                          </Text>
                        </View>
                      </View>
                    </>
                  ))}
                </View>
              )}

              {pageIndex === 0 && (
                <View>
                  <Text style={{ marginLeft: "410px", fontSize: "10px" }}>
                    {formatAmount(totalReceiveNow)}
                  </Text>
                </View>
              )}
            </Page>
          );
        })}
      </Document>
    </>
  );
}
