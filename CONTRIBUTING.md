# Contributing to MargSetu

Thank you for your interest in contributing to **MargSetu**! We welcome contributions from developers, GIS specialists, designers, and domain experts to enhance accessibility and road safety across the North Eastern Region.

---

## 📋 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please maintain a welcoming, respectful, and inclusive environment.

---

## 🛠️ How to Contribute

### 1. Reporting Bugs
- Search existing issues before filing a new one.
- Use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md).
- Provide a clear description, reproduction steps, screenshots, and browser/environment details.

### 2. Suggesting Enhancements
- Use our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md).
- Clearly explain the problem the feature solves and potential use cases.

### 3. Submitting Code Changes

1. **Fork the repository** on GitHub.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/<your-username>/MARGSETU.git
   cd MARGSETU
   ```
3. **Create a descriptive feature branch**:
   ```bash
   git checkout -b feature/dynamic-hazard-filtering
   # or
   git checkout -b fix/leaflet-popup-overflow
   ```
4. **Install dependencies and test changes**:
   ```bash
   npm install
   npm run dev
   ```
5. **Commit your changes** following conventional commit messages:
   - `feat: add real-time landslide risk badge`
   - `fix: correct coordinate projection in GeoJSON parser`
   - `docs: update API documentation in README`
   - `style: enhance glassmorphism header UI`
6. **Push to your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request (PR)** against the `main` branch. Fill out the PR template completely.

---

## 📏 Code Style & Standards

- **React & JSX**: Use functional components, custom hooks, and modular UI structure.
- **Styling**: Use Tailwind CSS classes consistently. Avoid inline styles where Tailwind utilities exist.
- **Geospatial Data**: Follow the `[Longitude, Latitude]` GeoJSON standard coordinate order for all spatial features.
- **Linting & Formatting**: Ensure code builds without errors (`npm run build`).

---

Thank you for helping make transportation safer across the North Eastern Region! 🚀
