const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'An error occurred' };
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: 'Network error. Please try again.' };
    }
  }

  // Auth endpoints
  async register(email: string, username: string, password: string) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  // Project endpoints
  async getProjects() {
    return this.request('/api/projects');
  }

  async getProject(id: string) {
    return this.request(`/api/projects/${id}`);
  }

  async createProject(title: string, scriptContent?: string) {
    return this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ title, scriptContent }),
    });
  }

  async updateProject(id: string, title?: string, scriptContent?: string) {
    return this.request(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, scriptContent }),
    });
  }

  async deleteProject(id: string) {
    return this.request(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Augment endpoints
  async augmentImages(scriptContent: string, projectId?: string) {
    return this.request('/api/augment/images', {
      method: 'POST',
      body: JSON.stringify({ scriptContent, projectId }),
    });
  }

  async searchKeyword(keyword: string) {
    return this.request('/api/augment/search', {
      method: 'POST',
      body: JSON.stringify({ keyword }),
    });
  }
}

export const apiClient = new ApiClient();
