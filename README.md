<div align="center">
  
# 🌤️ WeatherML

**Real-time atmospheric predictions powered by Machine Learning.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_App-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://weather-prediction-1qfk.vercel.app/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)]()
[![FastAPI](https://img.shields.io/badge/fastapi-109989?style=for-the-badge&logo=FASTAPI&logoColor=white)]()
[![scikit-learn](https://img.shields.io/badge/scikit_learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)]()

</div>

---

## 📖 About The Project

**WeatherML** is a full-stack weather prediction application designed to bridge the gap between user-friendly web interfaces and robust machine learning models. 

By capturing real-time atmospheric inputs through a fast and responsive frontend, the application communicates seamlessly with a Python-based REST API. Under the hood, trained Gradient Boosting Machine (GBM) models process the data to output highly accurate weather predictions instantly.

### ✨ Key Features

* **Interactive Frontend:** Lightning-fast UI built with React and Vite.
* **Granular Inputs:** Takes precise atmospheric data including:
  * 💧 Humidity
  * ⏲️ Pressure
  * 💨 Wind Speed
  * ☁️ Cloud Cover
  * 🌡️ Dew Point
* **Advanced ML Backend:** Powered by `scikit-learn` Gradient Boosting Machine (GBM) models.
* **Real-Time Outputs:** Instantly calculates and returns:
  * Actual Temperature
  * "Feels-Like" Temperature
  * Rain Probability (%)
  * Overall Weather Condition

## 🛠️ Built With

### Frontend
* **[React.js](https://reactjs.org/)** - UI Library
* **[Vite](https://vitejs.dev/)** - Next Generation Frontend Tooling
* *(Add any UI libraries you used here, e.g., TailwindCSS, Material-UI)*

### Backend & Machine Learning
* **[FastAPI](https://fastapi.tiangolo.com/)** - High-performance web framework for APIs
* **[Python 3.x](https://www.python.org/)** - Backend Language
* **[scikit-learn](https://scikit-learn.org/)** - Machine Learning library (GBM Models)
* **[Pandas / NumPy](https://pandas.pydata.org/)** - Data manipulation

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites
Make sure you have the following installed on your machine:
* Node.js (v16 or higher)
* Python (3.8 or higher)
* `npm` or `yarn`

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/WeatherML.git](https://github.com/yourusername/WeatherML.git)
cd WeatherML
