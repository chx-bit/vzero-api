# 🌍 Countries API

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A simple, fast, and lightweight REST API built with Node.js and Express.js to query comprehensive country data. You can easily search for countries by name, region, language, currency, and capital.

> **Note**: This is my first backend project! 🚀

---

## ⚙️ Installation and Setup

To get this project up and running on your local machine, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/chx-bit/countries-api.git
   cd countries-api
   ```

2. **Install dependencies**
   Make sure you have [Node.js](https://nodejs.org/) installed, then run:

   ```bash
   npm install 
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   _The server will start and listen on `http://localhost:3000` (or the port defined in your environment)._

---

## 📡 API Endpoints

| Method | Endpoint | Description | Government Data |
| :----- | :------- | :---------- | :-------------- |
| `GET` | `/countries` | Fetch all countries | ❌ No |
| `GET` | `/countries?government=true` | Fetch all countries with government data | ✅ Yes |
| `GET` | `/countries?name=X` | Filter by country name | ✅ Yes |
| `GET` | `/countries?capital=X` | Filter by capital city | ❌ No |
| `GET` | `/countries?region=X` | Filter by region | ❌ No |
| `GET` | `/countries?language=X` | Filter by language | ❌ No |
| `GET` | `/countries?currency=X` | Filter by currency | ❌ No |
| `GET` | `/countries?govType=X` | Filter by government type | ✅ Yes |
| `GET` | `/countries/:code` | Fetch single country by ISO2 code | ✅ Yes |

---

## 🔍 Query Parameters

You can filter the `/countries` endpoint using the following query parameters:

| Parameter    | Type      | Description                                                          | Government Data Included? |
| :----------- | :-------- | :------------------------------------------------------------------- | :------------------------ |
| `name`       | `string`  | Search by country name (e.g., "Indonesia", "Canada").                | ✅ **Yes**                |
| `capital`    | `string`  | Search by the capital city (e.g., "Jakarta", "Tokyo").               | ❌ **No**                 |
| `region`     | `string`  | Filter countries by geographical region (e.g., "Asia", "Europe").    | ❌ **No**                 |
| `language`   | `string`  | Filter countries by spoken language (e.g., "Spanish", "English").    | ❌ **No**                 |
| `currency`   | `string`  | Filter countries by currency (e.g., "IDR", "USD").                   | ❌ **No**                 |
| `govType`    | `string`  | Filter by government type (e.g., "monarchy", "republic").            | ✅ **Yes**                |
| `government` | `boolean` | Set to `true` to include government data for all countries.          | ✅ **Yes**                |

---

## 💻 Example cURL Commands

Here are some examples of how to interact with the API using `curl`.

### 1. Search by Name (Includes Government Data)

```bash
curl -X GET "http://localhost:3000/countries?name=Indonesia"
```

**Example Response:**

```json
[
  {
    "name": "Indonesia",
    "capital": "Jakarta",
    "region": "Asia",
    "language": "Indonesian",
    "currency": "IDR",
    "government": {
      "type": "Presidential republic",
      "headOfState": "President"
    }
  }
]
```

### 2. Search by Region (Excludes Government Data)

```bash
curl -X GET "http://localhost:3000/countries?region=Europe"
```

**Example Response:**

```json
[
  {
    "name": "France",
    "capital": "Paris",
    "region": "Europe",
    "language": "French",
    "currency": "EUR"
  },
  {
    "name": "Germany",
    "capital": "Berlin",
    "region": "Europe",
    "language": "German",
    "currency": "EUR"
  }
]
```

### 3. Search by Currency

```bash
curl -X GET "http://localhost:3000/countries?currency=USD"
```

### 4. Fetch All Countries with Government Data

```bash
curl -X GET "http://localhost:3000/countries?government=true"
```

### 5. Filter by Government Type

```bash
curl -X GET "http://localhost:3000/countries?govType=monarchy"
```

### 6. Fetch Single Country by ISO2 Code

```bash
curl -X GET "http://localhost:3000/countries/ID"
```

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
