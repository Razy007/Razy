import axios, { AxiosInstance } from 'axios';

export class PiNetworkConfig {
  private static instance: PiNetworkConfig;
  private axiosClient: AxiosInstance;
  
  public readonly apiKey: string;
  public readonly walletPrivateSeed: string;
  public readonly environment: 'sandbox' | 'testnet' | 'mainnet';
  public readonly baseURL: string;
  public readonly blockchainURL: string;
  public readonly networkPassphrase: string;

  private constructor() {
    this.apiKey = process.env.PI_API_KEY || '';
    this.walletPrivateSeed = process.env.PI_WALLET_PRIVATE_SEED || '';
    this.environment = (process.env.PI_ENVIRONMENT as any) || 'sandbox';
    
    this.baseURL = this.getBaseURL();
    this.blockchainURL = this.getBlockchainURL();
    this.networkPassphrase = this.getNetworkPassphrase();
    
    this.axiosClient = axios.create({
      baseURL: this.baseURL,
      timeout: 20000,
      headers: {
        'Authorization': `Key ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    this.setupInterceptors();
  }

  private getBaseURL(): string {
    const urls = {
      sandbox: 'https://api.minepi.com',
      testnet: 'https://api.minepi.com',
      mainnet: 'https://api.minepi.com'
    };
    return urls[this.environment];
  }

  private getBlockchainURL(): string {
    const urls = {
      sandbox: 'https://api.testnet.minepi.com',
      testnet: 'https://api.testnet.minepi.com',
      mainnet: 'https://api.mainnet.minepi.com'
    };
    return urls[this.environment];
  }

  private getNetworkPassphrase(): string {
    return this.environment === 'mainnet' ? 'Pi Network' : 'Pi Testnet';
  }

  private setupInterceptors(): void {
    this.axiosClient.interceptors.request.use(
      (config) => {
        console.log(`[Pi API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        if (error.response?.status >= 500 && !config._retry) {
          config._retry = (config._retry || 0) + 1;
          
          if (config._retry <= 3) {
            await new Promise(resolve => setTimeout(resolve, 1000 * config._retry));
            return this.axiosClient(config);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): PiNetworkConfig {
    if (!PiNetworkConfig.instance) {
      PiNetworkConfig.instance = new PiNetworkConfig();
    }
    return PiNetworkConfig.instance;
  }

  public getAxiosClient(): AxiosInstance {
    return this.axiosClient;
  }
}
