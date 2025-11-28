const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

console.log('Health API Base URL:', API_BASE_URL);

export interface HealthDataEntry {
  dataType: string;
  value: number | string | object;
  unit: string;
  timestamp: string;
  source?: string;
  metadata?: any;
}

class HealthApi {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Add bulk health data
  async addBulkHealthData(healthDataArray: HealthDataEntry[]) {
    return this.makeRequest('/health/bulk', {
      method: 'POST',
      body: JSON.stringify({ healthDataArray }),
    });
  }

  // Get all health data
  async getHealthData(filters?: {
    dataType?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/health/data?${queryString}` : '/health/data';
    
    return this.makeRequest(endpoint);
  }

  // Delete all health data
  async deleteAllHealthData() {
    return this.makeRequest('/health/data', {
      method: 'DELETE',
    });
  }

  // Get health summary
  async getHealthSummary(period: string = '7d') {
    return this.makeRequest(`/health/summary?period=${period}`);
  }
}

export default new HealthApi();