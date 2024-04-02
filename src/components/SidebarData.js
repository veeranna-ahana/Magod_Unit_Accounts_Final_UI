import React from "react";
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import * as FaIcon from "react-icons/fa";
import * as MdIcon from "react-icons/md";
import { VscTypeHierarchySub } from "react-icons/vsc";
import { BiFoodMenu } from "react-icons/bi";
import { HiUsers } from "react-icons/hi";
import { BsPersonFill, BsFillGearFill, BsScrewdriver } from "react-icons/bs";
import { AiFillCreditCard } from "react-icons/ai";
import { DiOpenshift } from "react-icons/di";
import { MdReport } from "react-icons/md";
import { MdHomeRepairService } from "react-icons/md";
import { BsListCheck } from "react-icons/bs";
import { BiGitMerge } from "react-icons/bi";
import { SiGoogletagmanager, SiRedhatopenshift } from "react-icons/si";
import { BsServer } from "react-icons/bs";
import { FiCpu } from "react-icons/fi";
import { VscServerProcess } from "react-icons/vsc";
import { FiGitPullRequest } from "react-icons/fi";
import { AiOutlineOrderedList } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { FaDropbox } from "react-icons/fa";
import { GoReport } from "react-icons/go";
import { AiOutlineSchedule } from "react-icons/ai";
import { GiLaserPrecision } from "react-icons/gi";
import { HiCubeTransparent } from "react-icons/hi";
import { AiFillSchedule } from "react-icons/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoltLightning,
  faCloud,
  faCloudBolt,
  faCloudMeatball,
  faFile,
  faReply,
  faSmog,
  faStarOfLife,
  faWallet,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import { faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { faStar, faUser } from "@fortawesome/free-regular-svg-icons";
import { faCreditCard } from "@fortawesome/free-regular-svg-icons";
import { faBuildingUn } from "@fortawesome/free-solid-svg-icons";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { faSignal } from "@fortawesome/free-solid-svg-icons";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import { faPenRuler } from "@fortawesome/free-solid-svg-icons";
import { faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import { faEnvelopeOpen } from "@fortawesome/free-regular-svg-icons";

export const customerSidebar = [
  {
    title: "Setup",
    icon: <FontAwesomeIcon icon={faWrench} />,
    // path:"/Sales/MaterialSetUp",
    subNav: [
      {
        title: "Unit List",
        icon: <FontAwesomeIcon icon={faList} />,
        path: "/UnitAccounts/Setup/Unitlist",
      },
      {
        title: "Taxes",
        icon: <FontAwesomeIcon icon={faFileInvoiceDollar} />,
        path: "/UnitAccounts/Setup/TaxMaster",
      },
    ],
  },
  {
    title: "Unit",
    icon: <FontAwesomeIcon icon={faBuildingUn} />,
    // path:"/Sales/MaterialSetUp",
    subNav: [
      {
        title: "Daily",
        icon: <FontAwesomeIcon icon={faFile} />,
        // icon: <MdManageAccounts />,
        path: "/UnitAccounts/Unit/Daily",
      },
      {
        title: "Customer OutStanding",
        icon: <FontAwesomeIcon icon={faRightFromBracket} />,
        path: "/UnitAccounts/Unit/Customer",
      },
      {
        title: "Payment Receipt",
        icon: <FontAwesomeIcon icon={faFileInvoice} />,
        subNav: [
          // {
          //   title: "CreateNew",
          //   icon: <FontAwesomeIcon icon={faStore} />,
          //   path: "/UnitAccounts/Unit/CreateNew",
          // },

          {
            title: "Create New",
            icon: <FontAwesomeIcon icon={faStore} />,
            path: "/UnitAccounts/Unit/PaymentReceiptVoucher",
          },

          {
            title: "Draft RV List",
            icon: <FontAwesomeIcon icon={faPenRuler} />,
            path: "/UnitAccounts/Unit/DraftRv",
          },
          {
            title: "Customer RV List",
            icon: <FontAwesomeIcon icon={faUser} />,
            path: "/UnitAccounts/Unit/CustomerRv",
          },
          {
            title: "OnAccount List",
            icon: <FontAwesomeIcon icon={faBarsStaggered} />,
            path: "/UnitAccounts/Unit/OnAccountList",
          },
          {
            title: "RVOpen",
            icon: <FontAwesomeIcon icon={faEnvelopeOpen} />,

            subNav: [
              {
                title: "Open",
                icon: <FontAwesomeIcon icon={faReply} />,
                path: "/UnitAccounts/Unit/Open",
              },
              {
                title: "Closed",
                icon: <FontAwesomeIcon icon={faStarOfLife} />,
                path: "/UnitAccounts/Unit/Closed",
              },
              {
                title: "All",
                icon: <FontAwesomeIcon icon={faStar} />,
                path: "/UnitAccounts/Unit/All",
              },
            ],
          },
        ],
      },
      {
        title: "Monthly Report",
        icon: <FontAwesomeIcon icon={faPenToSquare} />,
        path: "/UnitAccounts/Unit/MonthlyReport",
      },
    ],
  },

  {
    title: "Invoice",
    icon: <FontAwesomeIcon icon={faFileInvoice} />,
    subNav: [
      {
        title: "Daily",
        icon: <FontAwesomeIcon icon={faShieldHalved} />,
        subNav: [
          {
            title: "Billing_Details",
            icon: <FontAwesomeIcon icon={faWallet} />,
            path: "/UnitAccounts/Invoice/BillingDetails",
          },
        ],
      },

      {
        title: "Monthly Report",
        icon: <FontAwesomeIcon icon={faUser} />,
        path: "/UnitAccounts/Invoice/MonthlyReport",
      },
      {
        title: "Cancelled Vr List",
        icon: <FontAwesomeIcon icon={faPenToSquare} />,
        subNav: [
          {
            title: "Invoices",
            icon: <FontAwesomeIcon icon={faWallet} />,
            path: "/UnitAccounts/Invoice/InvoicesList",
          },
        ],
      },
    ],
  },
  {
    title: "Sync",
    icon: <FontAwesomeIcon icon={faRotate} />,
    subNav: [
      {
        title: "Sync",
        icon: <FontAwesomeIcon icon={faCloud} />,
        subNav: [
          {
            title: "Accounts Sync",
            icon: <FontAwesomeIcon icon={faSmog} />,
            path: "/UnitAccounts/Sync/AccountSyncFile",
          },
          {
            title: "From HO Sync",
            icon: <FontAwesomeIcon icon={faCloudBolt} />,
            path: "/UnitAccounts/Sync/FromHOSYNC",
          },
          {
            title: "From HO Update",
            icon: <FontAwesomeIcon icon={faCloudBolt} />,
            path: "/UnitAccounts/Sync/HOupdateSync",
          },
        ],
      },
      {
        title: "Sync Export",
        icon: <FontAwesomeIcon icon={faWind} />,
        path: "/UnitAccounts/Sync/SyncExport",
      },
      {
        title: "Show Sync Status",
        icon: <FontAwesomeIcon icon={faBoltLightning} />,
        path: "/UnitAccounts/Sync/ShowSyncStatus",
      },
      {
        title: "Send mail",
        icon: <FontAwesomeIcon icon={faBoltLightning} />,
        path: "/UnitAccounts/Sync/send",
      },
    ],
  },

  {
    title: "Send mail",
    icon: <FontAwesomeIcon icon={faBoltLightning} />,
    path: "/UnitAccounts/Sync/send",
  },
];

export const adminSidebar = [
  {
    title: "Access",
    icon: <MdIcon.MdOutlineSecurity />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Menu Roles",
        path: "/admin/menuRoles",
        icon: <AiIcons.AiOutlineMenuFold />,
      },
    ],
  },
  {
    title: "Users",
    icon: <FaIcon.FaUsers />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "Roles",
        path: "/admin/roles",
        icon: <VscTypeHierarchySub />,
      },
      {
        title: "Menus",
        path: "/admin/menus",
        icon: <BiFoodMenu />,
      },
      {
        title: "Users",
        path: "/admin/users",
        icon: <HiUsers />,
      },
    ],
  },
];
