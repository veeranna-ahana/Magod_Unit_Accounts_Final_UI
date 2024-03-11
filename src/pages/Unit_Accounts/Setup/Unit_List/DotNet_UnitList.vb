Public Class CorphqUnitAcctSetup
    
    Dim DAUnit As MySql.Data.MySqlClient.MySqlDataAdapter
   
    Private Sub setData()
        Dim SQL As String

        DAUnit = getDBLink.getMySqlDataAdopter
        Try
            With DAUnit
                '*** SELECT COMMAND

                With .SelectCommand
                    SQL = "SELECT * FROM magod_setup.magodlaser_units m;"
                    .CommandText = SQL
                End With
                '*** DELETE COMMAND

                With .DeleteCommand
                    SQL = "DELETE FROM magod_setup.magodlaser_units WHERE UnitId=@UnitId;"
                    .CommandText = SQL
                    With .Parameters
                        .Add("@UnitId", MySql.Data.MySqlClient.MySqlDbType.VarChar, 50, "UnitId")
                    End With
                End With
                '*** INSERT COMMAND

                'UnitID, UnitName, Address, Place, State, Country, 
                'VAT_no, Excise_No, ServiceTax_no, PAN_no, Tally_account_Name
                With .InsertCommand
                    SQL = "INSERT INTO magod_setup.magodlaser_units" _
                    & "(UnitID, UnitName, Unit_Address, Place, State, Country," _
                    & "Unit_TinNo, Unit_ECC, Unit_SRNo, UnitPAN, Tally_account_Name," _
                    & "Unit_Range, Unit_Division, Unit_Collectorate, Current," _
                    & "UnitCST, Unit_contactDetails,  PIN) " _
                    & "VALUES  (@UnitID, @UnitName, @Unit_Address, @Place, @State, @Country," _
                    & "@Unit_TinNo, @Unit_ECC, @Unit_SRNo, @UnitPAN, @Tally_account_Name," _
                    & "@Unit_Range, @Unit_Division, @Unit_Collectorate, @Current," _
                    & "@UnitCST, @Unit_contactDetails,  @PIN)"
                    .CommandText = SQL
                    With .Parameters
                        .Add("@UnitID", MySql.Data.MySqlClient.MySqlDbType.VarChar, 50, "UnitID")
                        .Add("@UnitName", MySql.Data.MySqlClient.MySqlDbType.VarChar, 50, "UnitName")
                        .Add("@Unit_Address", MySql.Data.MySqlClient.MySqlDbType.VarChar, 150, "Unit_Address")
                        .Add("@Place", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "Place")
                        .Add("@State", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "State")
                        .Add("@Country", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "Country")
                        .Add("@Unit_TinNo", MySql.Data.MySqlClient.MySqlDbType.VarChar, 200, "Unit_TinNo")
                        .Add("@Unit_ECC", MySql.Data.MySqlClient.MySqlDbType.VarChar, 200, "Unit_ECC")
                        .Add("@Unit_SRNo", MySql.Data.MySqlClient.MySqlDbType.VarChar, 200, "Unit_SRNo")
                        .Add("@UnitPAN", MySql.Data.MySqlClient.MySqlDbType.VarChar, 200, "UnitPAN")
                        .Add("@Tally_account_Name", MySql.Data.MySqlClient.MySqlDbType.VarChar, 100, "Tally_account_Name")
                        .Add("@Unit_Range", MySql.Data.MySqlClient.MySqlDbType.VarChar, 100, "Unit_Range")
                        .Add("@Unit_Division", MySql.Data.MySqlClient.MySqlDbType.VarChar, 100, "Unit_Division")
                        .Add("@Unit_Collectorate", MySql.Data.MySqlClient.MySqlDbType.VarChar, 100, "Unit_Collectorate")
                        .Add("@Current", MySql.Data.MySqlClient.MySqlDbType.Int16, 5, "Current")
                        .Add("@UnitCST", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "UnitCST")
                        .Add("@Unit_contactDetails", MySql.Data.MySqlClient.MySqlDbType.VarChar, 200, "Unit_contactDetails")
                        .Add("@PIN", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "PIN")

                    End With
                End With
                '*** UPDATE COMMAND

                'UnitID, UnitName, Address, Place, State, Country, 
                'VAT_no, Excise_No, ServiceTax_no, PAN_no, Tally_account_Name
                With .UpdateCommand
                    SQL = "UPDATE magod_setup.magodlaser_units " _
                    & "SET UnitName=@UnitName, Unit_Address=@Unit_Address, Place=@Place, State=@State, Country=@Country," _
                    & "Unit_TinNo=@Unit_TinNo, Unit_ECC=@Unit_ECC, Unit_SRNo=@Unit_SRNo, UnitPAN=@UnitPAN, Tally_account_Name=@Tally_account_Name," _
                    & "Unit_Range=@Unit_Range, Unit_Division=@Unit_Division, Unit_Collectorate=@Unit_Collectorate, Current=@Current," _
                    & "UnitCST=@UnitCST, Unit_contactDetails=@Unit_contactDetails,  PIN =@PIN " _
                    & "WHERE UnitID=@UnitID;"
                    .CommandText = SQL
                    With .Parameters
                        .Add("@UnitName", MySql.Data.MySqlClient.MySqlDbType.VarChar, 50, "UnitName")
                        .Add("@Unit_Address", MySql.Data.MySqlClient.MySqlDbType.VarChar, 150, "Unit_Address")
                        .Add("@Place", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "Place")
                        .Add("@State", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "State")
                        .Add("@Country", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "Country")
                        .Add("@Unit_TinNo", MySql.Data.MySqlClient.MySqlDbType.VarChar, 200, "Unit_TinNo")
                        .Add("@Unit_ECC", MySql.Data.MySqlClient.MySqlDbType.VarChar, 200, "Unit_ECC")
                        .Add("@Unit_SRNo", MySql.Data.MySqlClient.MySqlDbType.VarChar, 200, "Unit_SRNo")
                        .Add("@UnitPAN", MySql.Data.MySqlClient.MySqlDbType.VarChar, 200, "UnitPAN")
                        .Add("@Tally_account_Name", MySql.Data.MySqlClient.MySqlDbType.VarChar, 100, "Tally_account_Name")
                        .Add("@Unit_Range", MySql.Data.MySqlClient.MySqlDbType.VarChar, 100, "Unit_Range")
                        .Add("@Unit_Division", MySql.Data.MySqlClient.MySqlDbType.VarChar, 100, "Unit_Division")
                        .Add("@Unit_Collectorate", MySql.Data.MySqlClient.MySqlDbType.VarChar, 100, "Unit_Collectorate")
                        .Add("@Current", MySql.Data.MySqlClient.MySqlDbType.Int16, 5, "Current")
                        .Add("@UnitCST", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "UnitCST")
                        .Add("@Unit_contactDetails", MySql.Data.MySqlClient.MySqlDbType.VarChar, 200, "Unit_contactDetails")
                        .Add("@PIN", MySql.Data.MySqlClient.MySqlDbType.VarChar, 45, "PIN")

                        .Add("@UnitID", MySql.Data.MySqlClient.MySqlDbType.VarChar, 50, "UnitID")
                    End With
                End With

            End With

        Catch ex As Exception
            MsgBox(ex.Message)

        End Try
    End Sub

    Private Sub btnSave_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnSave.Click
        If MsgBox("Do you wish to save the setting?", MsgBoxStyle.YesNo) = MsgBoxResult.Yes Then
            Try
                BSServer.EndEdit()
                DAUnit.Update(Unit_Accounts1.MagodUnits)
                ' setUpDs.WriteXml(appRoot & "\setup.xml")

            Catch ex As Exception
                MsgBox("Data SetUp Not changed")
                MsgBox(ex.Message)


            End Try

        End If
    End Sub

    Public Sub New()

        ' This call is required by the Windows Form Designer.
        InitializeComponent()

        ' Add any initialization after the InitializeComponent() call.

        setData()
        DAUnit.Fill(Unit_Accounts1.MagodUnits)
    End Sub

    Private Sub btnDelete_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnDelete.Click
        If MsgBox("Do you wish to Delete " & BSServer.Current.item("UnitId"), MsgBoxStyle.YesNo) = MsgBoxResult.No Then
            Exit Sub
        End If
        Try
            BSServer.RemoveCurrent()
            BSServer.EndEdit()
            DAUnit.Update(Unit_Accounts1.MagodUnits)
            ' LoadData()

        Catch ex As Exception
            MsgBox("Data SetUp Not changed")
            MsgBox(ex.Message)


        End Try

    End Sub
    Private Sub btnAddUnit_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles btnAddUnit.Click
        Dim newUnit As magod.AccountsDS.MagodUnitsRow = Unit_Accounts1.MagodUnits.NewMagodUnitsRow
        With newUnit
            .UnitID = "UnitId"
            .UnitName = "Unit Name"
            .Current = True
        End With
        Unit_Accounts1.MagodUnits.AddMagodUnitsRow(newUnit)

    End Sub
End Class

