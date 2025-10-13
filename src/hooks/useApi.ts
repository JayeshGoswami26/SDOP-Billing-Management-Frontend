/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";

// Helper to build query string from params (optional)
function buildQuery(params?: Record<string, any>) {
  if (!params) return "";
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null) query.append(key, value.toString());
  });
  return query.toString() ? `?${query}` : "";
}

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export interface UseApiConfig {
  params?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
  manual?: boolean; // If true, only fetch on .run()
}

export function useApi<T = any>(
  url: string,
  method: ApiMethod = "GET",
  config: UseApiConfig = {}
) {
  const baseURL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const token = localStorage.getItem('token');

  const finalUrl = `${baseURL}${url}${buildQuery(config.params)}`;

  const fetchData = async (
    overrideBody?: any,
    overrideParams?: Record<string, any>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.request<T>({
        url: `${baseURL}${url}${buildQuery(overrideParams ?? config.params)}`,
        method,
        headers: {... config.headers, 'Authorization': `Bearer ${token}`},
        data: overrideBody ?? config.body,
      });
      setData(res.data);
      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Request failed");
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch immediately unless config.manual is set
  useEffect(() => {
    if (!config.manual) fetchData();
    // eslint-disable-next-line
  }, [finalUrl, method]);

  return {
    data,
    error,
    loading,
    run: fetchData, // manual trigger if needed
    refetch: fetchData,
  };
}
