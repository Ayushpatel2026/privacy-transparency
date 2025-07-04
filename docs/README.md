## Documentation - TODO (organize this in a better way)

### Technology Stack

**Backend Architecture**

- **Express.js**: Selected for the backend API framework due to its simplicity, extensive middleware ecosystem, and excellent compatibility with JavaScript-based development workflows
- **Firestore**: Chosen as the primary cloud database solution for its real-time capabilities, automatic scaling, and seamless integration with mobile applications
- **JWT Authentication**: Implemented for secure user authentication and session management

**Frontend Development**

- **React Native**: Selected for cross-platform mobile development to ensure consistent user experience across iOS and Android devices
- **Zustand**: Chosen for state management due to its lightweight nature and simplified API compared to Redux

**Development Prioritization**

- Focus on core privacy transparency features over comprehensive sensor implementations
- Simplified UI elements for non-essential features to accelerate prototype development
- Abstraction layers implemented for future scalability despite current scope limitations

**Sensor Data Management**

- **Expo Sensors**: Primary library for accessing device sensors (accelerometer, microphone, light sensor)
  - _Note_: Light sensor functionality is not available on iOS and requires a native module implementation
- **Unified Data Structure**: All sensor data is merged into a single data type and stored in one document/table to simplify data management and querying. This was done to prioritize focus on the privacy UI/UX rather than storing complex sensor data.
- **Sensor Service Abstractions**: Implemented abstraction layers to enable easy switching between real sensor data and simulated data for testing purposes

**Local Storage Solutions**

- **Expo SQLite**: Used for local storage of sensor data, providing efficient querying capabilities and offline access
- **Expo SecureStore**: Implemented for secure storage of sensitive user data, authentication tokens, and privacy preferences
- **React Native AsyncStorage**: Utilized for storing user consent preferences and application settings

**Security Implementation**

- **Encryption Layer**: Dedicated encryption/decryption module implemented to secure sensitive data both at rest and in transit
- **JWT Token Authentication**: Secure token-based authentication system for user sessions and API access

**Code Architecture**

- **Storage Abstractions**: Implemented abstraction layers for both frontend and backend storage operations using a repository pattern.
- **Modular Design**: Sensor services, storage operations, and privacy monitoring components are designed as separate, reusable modules

**User Interface Design**

- **Color Management**: Centralized color scheme management through `constants/Colors.ts` file for consistent theming
- **Asset Management**: Hard-coded images used for non-core UI elements to prioritize development focus on prototype functionality
- **Figma Design System**: The linked Figma contains the initial wireframes for the core app, as well as different UI/UX ideas for privacy transparency. [Figma Link](https://www.figma.com/design/49HUNoDLrUx78XTzayYGG9/Sleep-Tracker-UI?node-id=80-5303&t=y4efP4qqNS29Ij3E-0)

## Limitations of the Prototype

- **Device-Level Consent**: Consent preferences are stored at the device level rather than account level, ensuring privacy settings persist across user sessions but are device-specific
- **Data Migration Policy**: When users switch consent preferences between cloud and local storage, the application fetches data from the user's chosen location. However, existing data is not automatically migrated between storage locations to prevent unintended data exposure
- **Persistent Consent Storage**: Consent preferences are stored in AsyncStorage to persist across app sessions but will be reset if the user deletes the application

**Platform-Specific Considerations**

- iOS light sensor functionality requires native module development, currently not implemented in the prototype
- Background task limitations on iOS may affect continuous sensor monitoring capabilities. Background task management is still a work in progress and the details have to worked out.
