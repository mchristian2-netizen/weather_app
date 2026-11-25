# Weather Dashboard

A data driven web application that fetches real time weather data and a 5-day forecast using the Open-Meteo API. 

## Live Demo
Access the live load-balanced application here: [http://35.177.9.43](http://35.177.9.43)

## Features
- **Real-time Weather:** Search for any city globally.
- **5-Day Forecast:** View upcoming weather trends.
- **User Interaction:** Toggle between Celsius and Fahrenheit.
- **Error Handling:** Gracefully handles invalid cities and API downtime.

## Local Setup
1. Clone this repository.
2. Open `index.html` in your browser, or use a local server:
   ```bash
   python3 -m http.server 8080
## Deployment Architecture
The application is deployed across a multi-tier architecture:
- **Web01 & Web02:** Nginx servers hosting the static frontend files (`index.html`, `style.css`, `script.js`).
- **Lb01:** HAProxy load balancer configured with a round-robin algorithm to distribute traffic evenly between Web01 and Web02.

### Deployment Steps
1. **Web Servers:** Cloned the repo and moved files to the Nginx web root (`/var/www/html/`).
2. **Load Balancer:** Configured `/etc/haproxy/haproxy.cfg` to listen on port 80 and balance traffic between the two web server IPs.

## API Attribution
This project utilizes the **Open-Meteo API**, a free, open-source weather API that requires no API keys.
- [Open-Meteo Documentation](https://open-meteo.com/en/docs)

## Challenges & Solutions
- **Challenge:** Handling spaces in city names (e.g., "Cape Town").
  - **Solution:** URL-encoded the input before passing it to the Geocoding API.
- **Challenge:** Preventing cross-origin (CORS) issues.
  - **Solution:** Open-Meteo supports CORS by default, but I ensured fallback error handling if the fetch failed.

## Demo Video
https://www.youtube.com/watch?v=rVszKiCsHwE
