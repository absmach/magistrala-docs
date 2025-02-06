import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  userSidebar: [
    {
      type: "doc",
      id: "index",
      label: "Overview",
    },
    {
      type: "doc",
      id: "architecture",
      label: "Architecture",
    },
    {
      type: "doc",
      id: "users-quick-start",
      label: "Getting Started",
    },
    {
      type: "category",
      label: "Domain Management",
      collapsible: true,
      items: [
        { type: "doc", id: "domains", label: "Domains" },
        { type: "doc", id: "billing", label: "Billing" },
        { type: "doc", id: "invitations", label: "Invitations" },
      ],
    },
    {
      type: "category",
      label: "Client Management",
      collapsible: true,
      link: {
        type: "doc",
        id: "clients/introduction",
      },
      items: [
        { type: "doc", id: "clients/groups", label: "Groups" },
        { type: "doc", id: "clients/clients", label: "Clients" },
        { type: "doc", id: "clients/channels", label: "Channels" },
        { type: "doc", id: "clients/bootstraps", label: "Bootstraps" },
      ],
    },
    {
      type: "category",
      label: "Dashboards",
      link: {
        type: "doc",
        id: "dashboards/introduction",
      },
      collapsible: true,
      items: [
        {type: "doc", id: "dashboards/dashboards", label: "Dashboard"},
        {type: "doc", id: "dashboards/widgets", label: "Widgets"},
        {type: "doc", id: "dashboards/linechart", label: "Line Chart"},
        {type: "doc", id: "dashboards/areachart", label: "Area Chart"},
        {type: "doc", id: "dashboards/barchart", label: "Bar Chart"},
        {type: "doc", id: "dashboards/gauges", label: "Gauges"},
        {type: "doc", id: "dashboards/piechart", label: "Pie Chart"},
        {type: "doc", id: "dashboards/countcard", label: "Count Card"},
        {type: "doc", id: "dashboards/tablecard", label: "Table Card"},
        {type: "doc", id: "dashboards/valuecard", label: "Value Card"},
        {type: "doc", id: "dashboards/maps", label: "Maps"},
        {type: "doc", id: "dashboards/controls", label: "Controls"},
      ],
    },
    {
      type: "doc",
      id: "rules-engine",
      label: "Rules Engine",
    },
    {
      type: "doc",
      id: "profile-management/users",
      label: "Profile Management",
    },
  ],
  devSidebar: [
    {
      type: "category",
      label: "Concepts",
      items: [
        { type: "doc", id: "entities", label: "Entities" },
        { type: "doc", id: "authentication", label: "Authentication" },
        { type: "doc", id: "authorization", label: "Authorization" },
        { type: "doc", id: "security", label: "Security" },
        { type: "doc", id: "messaging", label: "Messaging" },
      ],
    },
    {
      type: "category",
      label: "Quick Start",
      items: [
        { type: "doc", id: "getting-started", label: "Getting Started" },
        { type: "doc", id: "api", label: "API" },
        { type: "doc", id: "cli", label: "CLI" },
      ],
    },
    {
      type: "category",
      label: "Development Tools",
      items: [
        { type: "doc", id: "dev-guide", label: "Developers Guide" },
        { type: "doc", id: "events", label: "Events" },
        { type: "doc", id: "tracing", label: "Tracing" },
      ],
    },
    {
      type: "doc",
      id: "storage",
      label: "Storage",
    },
    {
      type: "doc",
      id: "edge",
      label: "Edge",
    },
    {
      type: "doc",
      id: "certs",
      label: "Certs",
    },
    {
      type: "doc",
      id: "kubernetes",
      label: "Kubernetes",
    },
    {
      type: "category",
      label: "Extensions",
      items: [
        { type: "doc", id: "lora", label: "LoRa" },
        { type: "doc", id: "opcua", label: "OPC-UA" },
        { type: "doc", id: "provision", label: "Provisioning" },
        { type: "doc", id: "twins", label: "Twins Service" },
        { type: "doc", id: "bootstrap", label: "Bootstrap" },
      ],
    },
    {
      type: "doc",
      id: "benchmark",
      label: "Test Spec",
    },
  ],
};

export default sidebars;
