# Privacy UI Documentation

## Overview

This document outlines the design and implementation of privacy user interface components, data types, and transparency features for the sleep tracking application.

---

## Privacy UI Components

### UI Types

There are two main types of privacy UI implementations, both utilizing privacy icons as core visual elements:

**1. Tooltip UI**

- Each data type collected on a page has its own privacy icon
- Clicking an icon opens a tooltip with privacy information specific to that data type
- Provides granular, contextual privacy details

**2. Privacy Page UI**

- Single privacy icon per page
- Clicking the icon transforms the entire page into a comprehensive "privacy page"
- Displays privacy information for all data types collected on that page

### Visual Design System

#### Icon Behavior

Privacy icons dynamically change color and design based on privacy risk severity levels. For sensor data, icons adapt based on both the specific sensor data type and storage location, providing immediate visual feedback about privacy violations without disrupting the overall user experience.

#### Severity Levels

**Major Risk**

- Clear violation of regulations, privacy policy, or user consent
- Unauthorized data collection
- Insecure storage or transmission

**Medium Risk (Some Concerns)**

- Technically compliant but suboptimal practices
- Vague purposes for data collection
- Excessive data collection
- Third-party sharing concerns

**Low Risk**

- Fully compliant with minimal privacy concerns
- Clear purpose for data collection
- Proper consent obtained
- Secure handling practices

---

## Privacy Explanations

### Design Requirements

Privacy explanations for both UI types must be:

- **Concise and easy to understand**
- **Fully visible without scrolling**
- **Contextually relevant**

### Content Structure

All privacy explanations include the following components:

**1. Privacy Violation Label**

- Always displayed at the top
- Clear indication: "No privacy violations detected" or "Major privacy violations detected"

**2. Risk-Based Information**

- **Medium/High Severity:** Explanation of violation and purpose of data collection
- **Low Severity:** Purpose of data collection, storage location, and access information

**3. Regulatory Information**

- Links to specific privacy policy sections
- Links to specific PIPEDA regulation sections

**4. User Controls**

- Opt-out links for sensor data types

**5. Special Cases**

- Sleep mode page: Storage and access information omitted to reduce explanation length

### User Experience Flow

1. **Initial Load:** Users see transparency state from React Native async storage
2. **Data Collection:** When data collection occurs, LLM is called and UI updates
3. **Loading State:** During LLM processing, users see default low privacy risk (no loading indicator to avoid confusion)

---

## Data Types

### General Application Data

**User Data**

- Name, email, and password

**General Sleep Data**

- Sleep quality, duration, and other information collected during onboarding

**Sensor Data**

- Data from three sensors: microphone, light sensor, and accelerometer
- All stored in a single table/document

**Journal Data**

- User input regarding daily mood, habits, sleep times, and diary entries

### Privacy UI Data Types

The following transparency events correspond to specific data collection activities:

- **`generalSleepTransparency`** - General sleep data (not currently implemented)
- **`journalTransparency`** - Journal data collection
- **`microphoneTransparency`** - Microphone data collection
- **`accelerometerTransparency`** - Accelerometer data collection
- **`lightSensorTransparency`** - Light sensor data collection
- **`statisticsTransparency`** - Derived data on statistics page

**Note:** User data transparency is not implemented in the current prototype iteration. Statistics page explanations and icons are hardcoded due to the absence of actual data collection or fetching.

---

## Transparency Module Architecture

### Core Pages

Four key pages require transparency UI features:

- Journal page
- Sleep/index page
- Sleep mode page
- Statistics page

### State Management

The transparency module utilizes **Zustand** for state management, maintaining transparency events for each data collection type. The UI responds dynamically to state changes, ensuring real-time privacy feedback.

### Implementation Strategy

**LLM Integration**

- LLM calls occur at the highest level of abstraction within "saveData" hooks
- Transparency events are initialized for each data type
- Transparency service is called after successful `dataRepository.save()` operations

**Timing Considerations**
To address the timing gap between screen load and data entry, default transparency events are established for each data type. These update automatically as data collection and processing occur.

**Benefits of Global State**

- UI changes reflect privacy risks for each data type
- Facilitates global features like privacy-related notifications
- Ensures consistency across the application

---

## AI Integration

### LLM Implementation

The system currently uses the **Gemini LLM API** for generating AI-based privacy explanations.

### Prompt Engineering

The LLM prompt includes:

- Complete privacy policy
- Summarized PIPEDA regulations
- TransparencyEvent data
- UserConsentPreferences

**Constraints:**

- 30-word limit per explanation
- Returns most relevant privacy policy section links
- Returns most relevant regulation section links

**Regulatory Scope:**
The current prompt is PIPEDA-specific and requires modification for other regulatory frameworks.

---

## Data Management

### Privacy Policy Storage

Privacy policy data is stored in JSON format (`frontend/privacyPolicyData.json`), enabling:

- Easy in-app rendering
- Seamless integration with LLM processing

### PIPEDA Regulations

PIPEDA regulations are stored in JSON format (`frontend/privacyRegulations.json`), containing:

- Summaries of all 10 main PIPEDA principles
- Structured data for LLM consumption
