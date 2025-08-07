const QRCode = require('qrcode');
const Web3 = require('web3');
const chains = require('./chains.json');

class MultiChainQRService {
    constructor() {
        this.web3 = new Web3();
        this.jobs = new Map();
        this.chains = chains;
    }

    validateAddress(address, chain) {
        switch (chain) {
            case 'ethereum':
            case 'polygon':
                return this.web3.utils.isAddress(address);
            case 'bitcoin':
                return /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,39}$/.test(address);
            case 'cardano':
                return /^addr1[a-zA-Z0-9]{98}$/.test(address);
            case 'solana':
                return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
            default:
                throw new Error(`Unsupported chain: ${chain}`);
        }
    }

    parseInput(input) {
        const chainMatch = input.match(/on\s+(ethereum|polygon|solana|bitcoin|cardano)/i);
        const tokenMatch = input.match(/(\d*\.?\d+)\s*(ETH|MATIC|SOL|BTC|ADA|USDT|USDC|USDM)/i);
        const addressMatch = input.match(/(addr1[a-zA-Z0-9]{98}|[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[ac-hj-np-z02-9]{39}|0x[a-fA-F0-9]{40}|[1-9A-HJ-NP-Za-km-z]{32,44})/);
        const labelMatch = input.match(/['"]([^'"]+)['"]/);

        if (!chainMatch || !tokenMatch || !addressMatch) {
            throw new Error('Invalid input format. Please specify chain, amount, token, and address.');
        }

        const chain = chainMatch[1].toLowerCase();
        const amount = tokenMatch[1];
        const token = tokenMatch[2].toUpperCase();

        if (!this.chains[chain].tokens[token]) {
            throw new Error(`${token} is not supported on ${chain}`);
        }

        return {
            chain,
            token,
            amount,
            address: addressMatch[1],
            label: labelMatch ? labelMatch[1] : ''
        };
    }

    async generateQRCode(params) {
        if (!this.validateAddress(params.address, params.chain)) {
            throw new Error(`Invalid ${params.chain} address`);
        }

        const chainConfig = this.chains[params.chain];
        const tokenConfig = chainConfig.tokens[params.token];

        const amount = (parseFloat(params.amount) * Math.pow(10, tokenConfig.decimals)).toString();

        let uri;
        if (params.chain === 'bitcoin') {
            uri = `bitcoin:${params.address}?amount=${params.amount}`;
        } else if (params.chain === 'cardano') {
            if (tokenConfig.isNative) {
                const amountAda = parseInt(params.amount, 10);
                uri = `cardano:${params.address}?amount=${amountAda}`;
            } else {
                uri = `cardano:${params.address}?amount=${amount}&policy_id=${tokenConfig.policyId}`;
            }
        } else if (params.chain === 'solana') {
            if (tokenConfig.isNative) {
                uri = `solana:${params.address}?amount=${amount}`;
            } else {
                uri = `solana:${params.address}?spl-token=${tokenConfig.address}&amount=${amount}`;
            }
        } else {
            if (tokenConfig.isNative) {
                uri = `${params.chain}:${params.address}?value=${amount}`;
            } else {
                uri = `${params.chain}:${tokenConfig.contractAddress}/transfer?address=${params.address}&uint256=${amount}`;
            }
        }

        if (params.label) {
            uri += `&label=${encodeURIComponent(params.label)}`;
        }

        const qrCode = await QRCode.toDataURL(uri, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 300
        });

        return {
            qrCode,
            uri,
            params: {
                ...params,
                tokenInfo: tokenConfig
            }
        };
    }

    async processJob(input) {
        try {
            const params = this.parseInput(input);
            return await this.generateQRCode(params);
        } catch (error) {
            throw new Error(`Processing failed: ${error.message}`);
        }
    }
}

module.exports = MultiChainQRService; 