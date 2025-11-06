# Frontend Design Specification

## Overview

- Platform: Responsive Web (Deskop-optimized)
- Target Users: Admins
  This document provides the design specification for a frontend application that uses **React**, **Vite**, and **Tailwind CSS**. The application will be built to interact with the backend schema as described in the provided database design.

---

## Technology Stack

1. **React.js**: A JavaScript library for building user interfaces.
2. **Vite**: A fast build tool for modern web development.
3. **Tailwind CSS**: A utility-first CSS framework for styling.

---

## Project Structure

The project will follow a modular and scalable folder structure to ensure maintainable and organized code. Below is the proposed structure:

```plaintext
src/
├── components/        # Reusable UI components
├── pages/             # Page components (mapped to routes)
├── layouts/           # Layout components (e.g., Navbar, Sidebar)
├── assets/            # Static assets (images, icons)
├── styles/            # Global and custom Tailwind styles
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── context/           # React Context for state management
├── services/          # API service files (backend integration)
├── App.jsx            # Main application entry
├── main.jsx           # Vite entry point
└── router.jsx         # React Router configuration
```

---

### Key Features

#### 1. **Responsive Design**

- **Objective**: Ensure the UI adapts seamlessly to different screen sizes.
- **Implementation**: Utilize Tailwind's responsive utilities (e.g., `sm`, `md`, `lg`, `xl`) to create mobile-first designs.

#### 2. **Reusable Components**

- **Objective**: Build a library of reusable and composable components.
- **Example Components**:
  - `Button`: Styled button component with variants (e.g., primary, secondary).
  - `Card`: For displaying property/site details.
  - `Modal`: For forms and detailed views.
  - `Table`: For listing sites, regions, etc.

#### 3. **Routing**

- **Objective**: Implement client-side routing for navigation.
- **Implementation**: Use React Router for routes.
- **Proposed Routes**:
  - `/`: Dashboard
  - `/sites`: List of sites
  - `/properties`: List of properties
  - `/regions`: List of regions
  - `/towns`: List of towns
  - `/status`: Site status details
  - `/network`: Network configuration details
  - `/power`: Power configuration details

#### 4. **State Management**

- **Objective**: Manage application-wide state effectively.
- **Implementation**: Use React Context API for global state management (e.g., user session, theme, etc.).

#### 5. **Backend Integration**

- **Objective**: Fetch and display data from the backend.
- **Implementation**:
  - Use `Axios` or `fetch` for API calls.
  - Centralize API logic in the `services/` folder.
  - Example services:
    - `siteService.js`: Fetch site data.
    - `propertyService.js`: Fetch property details.
    - `regionService.js`: Fetch region details.

#### 6. **Authentication**

- **Objective**: Secure the application.
- **Implementation**:
  - Integrate token-based authentication using JWT.
  - Use protected routes for secure pages (e.g., `/sites`, `/properties`).

#### 7. **Dark Mode Support**

- **Objective**: Provide a dark mode for better user experience.
- **Implementation**:
  - Leverage Tailwind's dark mode utilities (`dark:`).
  - Use a toggle button to switch themes.

---

## Component Design

### 1. **Dashboard**

- **Purpose**: Provide a high-level overview of sites, properties, and statuses.
- **Components**:
  - `StatsCard`: Displays key metrics (e.g., total sites, regions).
  - `Graph`: Visualizes data trends (e.g., encroachment status).

### 2. **Site List**

- **Purpose**: List all sites with filter and search options.
- **Components**:
  - `Table`: Displays site data.
  - `Pagination`: For navigating through site lists.
  - `FilterBar`: Provides filtering options (e.g., by region, town).

### 3. **Site Details**

- **Purpose**: Display detailed information about a site.
- **Components**:
  - `Card`: For displaying property, network, and power details.
  - `Tabs`: For switching between different sections (e.g., Status, Properties).

### 4. **Form Components**

- **Objective**: Allow users to create or update entities (e.g., sites, properties).
- **Components**:
  - `InputField`: Styled input component.
  - `SelectDropdown`: For selecting options.
  - `SubmitButton`: To submit forms.

---

# Design Specification for Database Schema

## Overview

This document outlines the design specification for a database schema based on the provided Entity-Relationship (ER) diagram. The schema is intended to manage information about sites, their associated properties, power configurations, network setups, and the regions and towns they are located in.

---

## Entities and Attributes

### 1. **Site**

- **Description**: Represents a location with associated properties, power supply, and network configurations.
- **Attributes**:
  - `id (PK)`: Unique identifier for the site.
  - `property_id`: Links to the `Properties` entity.
  - `description`: Description of the site.
  - `town_id`: Links to the `Town` entity.
  - `region_id`: Links to the `Region` entity.
  - `status_id`: Links to the `Status` entity.
  - `coordinates`: Geographical coordinates of the site.
  - `network_id`: Links to the `Network` entity.
  - `network_equip`: Equipment details for the network.
  - `main_power`: Links to the `Power` entity (main power).
  - `backup_power`: Links to the `Power` entity (backup power).

---

### 2. **Properties**

- **Description**: Stores property details for a site.
- **Attributes**:
  - `id (PK)`: Unique identifier for the property.
  - `ownership_docs`: Boolean indicating if ownership documents are available.
  - `strategic_to_tkl`: Boolean indicating if the property is strategic to TKL.
  - `site_id`: Links to the `Site` entity.
  - `asset_description`: Description of the asset.
  - `coordinates`: Geographical coordinates of the property.
  - `plot_size`: Size of the plot.
  - `bua`: Built-up area.
  - `fair_value`: Fair value of the property.
  - `land`: Land details.
  - `improvements`: Improvements made to the property.
  - `total_value`: Total value of the property.

---

### 3. **Power**

- **Description**: Represents power configurations for a site.
- **Attributes**:
  - `id (PK)`: Unique identifier for the power configuration.
  - `main_power`: Main power details.
  - `backup_power`: Backup power details.

---

### 4. **Network**

- **Description**: Represents network configurations for a site.
- **Attributes**:
  - `id (PK)`: Unique identifier for the network.
  - `network_id`: Identifier for the network.
  - `network_name`: Name of the network.
  - `network_equip`: Equipment details for the network.

---

### 5. **Town**

- **Description**: Represents the town where a site is located.
- **Attributes**:
  - `id (PK)`: Unique identifier for the town.
  - `town_id`: Identifier for the town.
  - `town_name`: Name of the town.

---

### 6. **Region**

- **Description**: Represents the region where a site is located.
- **Attributes**:
  - `id (PK)`: Unique identifier for the region.
  - `region_id`: Identifier for the region.
  - `region_name`: Name of the region.
  - `town_id`: Links to the `Town` entity.

---

### 7. **Status**

- **Description**: Represents the status of a site.
- **Attributes**:
  - `id (PK)`: Unique identifier for the status.
  - `encroachment_status`: Status of encroachment on the site.
  - `critical_to_enterprise`: Boolean indicating if the site is critical to the enterprise.
  - `status_description`: Description of the status.
  - `govt_equip`: Boolean indicating if the site has government equipment.
  - `strategic_to_tkl`: Boolean indicating if the site is strategic to TKL.
  - `tkl_shop`: Boolean indicating if the site has a TKL shop.
  - `atc_tower`: Boolean indicating if the site has an ATC tower.
  - `charged_to_bank`: Boolean indicating if the site is charged to a bank.
  - `on_sfc_deed`: Boolean indicating if the site is on an SFC deed.
  - `requested_by_sfc`: Boolean indicating if the site is requested by SFC.
  - `on_atc_court`: Boolean indicating if the site is on ATC court records.
  - `on_atc_deed`: Boolean indicating if the site is on ATC deed records.

---

## Relationships

### 1. **Site and Properties**

- **Relationship**: One-to-One
- **Description**: Each site is associated with one property.

### 2. **Site and Power**

- **Relationship**: One-to-One
- **Description**: Each site has one main power and one backup power configuration.

### 3. **Site and Network**

- **Relationship**: One-to-One
- **Description**: Each site has one network configuration.

### 4. **Site and Town**

- **Relationship**: Many-to-One
- **Description**: Multiple sites can belong to a single town.

### 5. **Site and Region**

- **Relationship**: Many-to-One
- **Description**: Multiple sites can belong to a single region.

### 6. **Town and Region**

- **Relationship**: Many-to-One
- **Description**: Multiple towns can belong to a single region.

### 7. **Site and Status**

- **Relationship**: One-to-One
- **Description**: Each site has one status.

---

## Use Cases

1. **Property Management**:
   - Track ownership, value, and improvements of properties.
2. **Power Configuration**:
   - Manage main and backup power details for sites.
3. **Network Configuration**:
   - Maintain network equipment and details for sites.
4. **Regional Analysis**:
   - Analyze sites based on their regions and towns.
5. **Status Monitoring**:
   - Monitor the status and encroachment details of sites.

## Future Enhancements

1. **Add Historical Data**:
   - Track changes in property values, power configurations, and statuses over time.
2. **Integrate with GIS**:
   - Use geographical coordinates to integrate with GIS systems for advanced mapping and analysis.
3. **Add User Roles and Permissions**:
   - Implement user roles for managing access to sensitive data.
