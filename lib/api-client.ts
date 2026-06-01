export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export const apiClient = {
  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("crm_token");
  },

  setToken: (token: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("crm_token", token);
  },

  removeToken: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("crm_token");
  },

  async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, headers, ...customConfig } = options;

    const token = this.getToken();

    const config: RequestInit = {
      ...customConfig,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    };

    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }

    try {
      const response = await fetch(url, config);

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new ApiError(
          data?.error || data?.message || "An API error occurred",
          response.status,
          data,
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : "Network error",
        500,
      );
    }
  },

  get<T>(endpoint: string, options?: Omit<FetchOptions, "method">) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(
    endpoint: string,
    body: any,
    options?: Omit<FetchOptions, "method" | "body">,
  ) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put<T>(
    endpoint: string,
    body: any,
    options?: Omit<FetchOptions, "method" | "body">,
  ) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete<T>(endpoint: string, options?: Omit<FetchOptions, "method">) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  },
};
