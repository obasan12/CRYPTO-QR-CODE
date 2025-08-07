# 🚀 CryptoQR - Multi-Chain Payment QR Code Generator

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/obasan12/CRYPTO-QR-CODE.git)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

A modern, beautiful web application that generates QR codes for cryptocurrency payments across multiple blockchain networks. Features a stunning animated UI with real-time processing and comprehensive multi-chain support.

![CryptoQR Demo](https://img.shields.io/badge/Demo-Available-brightgreen?style=for-the-badge)

## ✨ Features

### 🎨 **Modern UI/UX**
- **Animated Interface**: Beautiful gradient backgrounds with floating particles
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects, loading animations, and smooth transitions
- **Glass Morphism**: Modern semi-transparent cards with blur effects
- **Real-time Feedback**: Loading spinners and progress indicators

### 🔗 **Multi-Chain Support**
- **Ethereum**: ETH, USDT, USDC
- **Polygon**: MATIC, USDT, USDC  
- **Solana**: SOL, USDT, USDC
- **Bitcoin**: BTC
- **Cardano**: ADA

### 🛠 **Technical Features**
- **Natural Language Processing**: Generate QR codes using plain English
- **Chain-Specific URI Formats**: 
  - EVM chains (Ethereum, Polygon): EIP-681 format
  - Solana: Solana Pay format
  - Bitcoin: BIP21 format
  - Cardano: Cardano URI format
- **Address Validation**: Chain-specific validation for all supported networks
- **Asynchronous Processing**: Job-based system with real-time status updates
- **Error Handling**: Comprehensive validation and user-friendly error messages

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/obasan12/CRYPTO-QR-CODE.git
   cd CRYPTO-QR-CODE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env file
   cp .env.example .env
   ```
   
   Edit `.env` with your settings:
   ```env
   PORT=3010
   MAX_CONCURRENT_JOBS=10
   JOB_TIMEOUT_MS=30000
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the web interface**
   ```
   http://localhost:3010/view.html
   ```

## 📖 Usage

### Web Interface

The application provides an intuitive web interface with two main sections:

#### 🔧 **Generate New QR Code**
1. Select the blockchain network (Ethereum, Polygon, Solana, Bitcoin, Cardano)
2. Choose the token (ETH, USDT, USDC, MATIC, SOL, BTC, ADA)
3. Enter the payment amount
4. Input the recipient wallet address
5. Add an optional payment label
6. Click "Generate QR Code"

#### 🔍 **View Existing QR Code**
1. Enter a job ID from a previous generation
2. Click "View QR Code" to retrieve and display the result

### API Usage

The service provides a RESTful API for programmatic access:

#### **Start a Job**
```bash
curl -X POST http://localhost:3010/start_job \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Generate a QR code for 100 USDT payment on Ethereum to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e with label \"Consulting\""
  }'
```

**Response:**
```json
{
  "job_id": "a9b96606-1220-41b0-b696-db78694fafcd",
  "status": "processing"
}
```

#### **Get Job Result**
```bash
curl http://localhost:3010/result/a9b96606-1220-41b0-b696-db78694fafcd
```

```

#### **Check Service Availability**
```bash
curl http://localhost:3010/availability
```

#### **Get Job Status**
```bash
curl http://localhost:3010/status/a9b96606-1220-41b0-b696-db78694fafcd
```

## 🏗️ Architecture

### **Frontend**
- **Modern HTML5/CSS3**: Responsive design with animations
- **Vanilla JavaScript**: No framework dependencies
- **Font Awesome Icons**: Beautiful iconography

### **Backend**
- **Node.js**: Server-side runtime
- **Express.js**: Web framework
- **Web3.js**: Blockchain interaction
- **QRCode**: QR code generation
- **CORS**: Cross-origin resource sharing

### **Features**
- **Asynchronous Processing**: Job-based system for scalability
- **Address Validation**: Chain-specific validation
- **Error Handling**: Comprehensive error management
- **Configuration**: Environment-based settings

## 🔧 Development

### **Project Structure**
```
cryptoqrcode/
├── src/
│   ├── server.js          # Main server file
│   ├── service.js         # Business logic
│   ├── config.js          # Configuration
│   ├── chains.json        # Chain configurations
│   ├── view.html          # Main web interface
│   ├── test.html          # API testing interface
│   └── debug.html         # Debug interface
├── package.json           # Dependencies
├── README.md             # This file
└── .env                  # Environment variables
```

### **Available Scripts**
```bash
npm start          # Start the server
npm test           # Run tests (placeholder)
```

### **Environment Variables**
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3010` | Server port |
| `MAX_CONCURRENT_JOBS` | `10` | Maximum concurrent jobs |
| `JOB_TIMEOUT_MS` | `30000` | Job timeout in milliseconds |
| `NODE_ENV` | `development` | Environment mode |

## 🚨 Error Handling

The application includes comprehensive error handling for:

- **Invalid Addresses**: Chain-specific validation
- **Unsupported Tokens**: Token availability per chain
- **Malformed Input**: Natural language parsing errors
- **Invalid Amounts**: Numeric validation
- **Job Failures**: Processing error recovery
- **Network Issues**: Connection error handling

## 📱 Mobile Support

The application is fully responsive and optimized for:
- **Desktop**: Full feature access
- **Tablet**: Touch-friendly interface
- **Mobile**: Optimized layout and interactions

## 🔒 Security Features

- **Input Validation**: Comprehensive sanitization
- **Address Verification**: Chain-specific validation
- **Error Sanitization**: Safe error messages
- **CORS Protection**: Controlled cross-origin access

## 🐛 Troubleshooting

### **Common Issues**

1. **Port Already in Use**
   ```bash
   # The server will automatically try the next available port
   # Check the console output for the actual port
   ```

2. **CORS Errors**
   ```bash
   # Ensure you're accessing the correct port
   # The server includes CORS headers for local development
   ```

3. **Job Processing Failures**
   ```bash
   # Check the browser console for detailed error messages
   # Verify the input format matches the expected pattern
   ```

### **Debug Mode**
Access the debug interface at `http://localhost:3010/debug.html` for detailed API testing and troubleshooting.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Font Awesome** for the beautiful icons
- **Web3.js** for blockchain integration
- **QRCode** library for QR code generation
- **Express.js** for the web framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review the [API documentation](#api-usage)
3. Open an issue on [GitHub](https://github.com/obasan12/CRYPTO-QR-CODE.git)

---

**Made with ❤️ by EMERICKCIPHER**

*This project is actively maintained and updated regularly.*
