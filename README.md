# Asset Management System

A comprehensive and modern **Asset Management System** designed to track hardware and physical assets across their entire lifecycle. From procurement to retirement, this application provides a centralized source of truth for an organization's physical inventory, empowering teams to make data-driven decisions and reduce equipment loss.

---

## 📖 What is this project about?

This project is a full-stack web application tailored for IT administrators, facility managers, and operations teams. It simplifies the process of tracking company assets (laptops, monitors, machinery, etc.) across different departments, locations, and employees. 

It tracks essential metrics like warranty expirations, maintenance histories (CapEx vs OpEx), and asset statuses (`In Use`, `Available`, `Maintenance`, `Retired`). It also features a rich dashboard with analytics and PDF report generation.

## 🛠️ Technologies Used

- **Frontend Framework**: React 18 with TypeScript and Vite for lightning-fast development.
- **UI & Styling**: Material-UI (MUI) for a clean, accessible, and responsive component system.
- **State Management**: Redux Toolkit for predictable global state management, combined with `createAsyncThunk` for data fetching.
- **Routing**: React Router DOM for client-side navigation.
- **Backend & Database**: Supabase (PostgreSQL) for a scalable backend, real-time database views, and secure Authentication.
- **Data Visualization**: Recharts for dynamic and interactive dashboard charts.
- **Exporting**: `html2canvas` and `jsPDF` for exporting beautiful, paginated PDF reports directly from the browser.

## 💡 How this helps manage assets

- **Centralized Inventory**: Never lose track of who has what. Quickly view all assets assigned to specific employees or departments.
- **Lifecycle Tracking**: Keep a detailed audit trail (history) of when assets were assigned, returned, or sent for repairs.
- **Financial & Risk Management**: Track purchase costs and warranty expiry dates. The system highlights assets at risk of warranty expiration, allowing proactive maintenance.
- **Maintenance Work Orders**: Schedule preventative maintenance or corrective repairs and track the downtime and costs associated.
- **Actionable Insights**: The dashboard provides a high-level view of asset utilization, status distributions, and capital vs. operational expenditure over time.

## 🎓 What we learned from this project

Building this system was a massive learning experience. Some key takeaways include:
- **Complex State Management**: Mastering Redux Toolkit to handle complex async data flows across dozens of interconnected tables (Assets, Employees, Departments, Work Orders).
- **Backend-as-a-Service**: Leveraging Supabase to spin up a robust PostgreSQL database with triggers, views, and Role-Level Security (RLS) without writing complex backend boilerplate.
- **Advanced UI Patterns**: Implementing modern UI patterns like global `Cmd+K` quick searches, dynamic filtering/sorting on data tables, and interactive Recharts data visualization.
- **Client-Side Document Generation**: Learning how to capture DOM elements and stitch them into paginated PDF documents using `html2canvas` and `jsPDF`.
- **Database Design**: Designing a resilient SQL schema with a dedicated `asset_history` audit trail to preserve the integrity of past assignments and status changes.
